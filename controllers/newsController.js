const Article = require('../models/Article');
const User = require('../models/User');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const ml_url = process.env.ml_url;
const SUMMARY_SERVICE_URL = `${ml_url}/sumzee`;
const FAKE_NEWS_URL = `${ml_url}/proctor/`;
const scrape_url = `${ml_url}/fetch-article/`;

exports.getAllNews = async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const articles = await Article.find(filter).sort({ publishedAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getPersonalizedNews = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    // User's uploaded articles (visible only to them) - sort newest first
    const uploaded = (user.uploadedArticles || [])
      .map(doc => ({
        _id: doc._id,
        title: doc.title,
        source: doc.source,
        url: doc.url,
        summary: doc.summary,
        imageUrl: doc.imageUrl,
        description: doc.description,
        category: doc.category,
        publishedAt: doc.publishedAt,
        userUploaded: doc.isUserSubmitted || false,
      }))
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    // Fetch main collection articles. If user has preferences, filter by them; otherwise return all global articles.
    const mainFilter = user.preferences && user.preferences.length ? { category: { $in: user.preferences } } : {};

    const mainArticles = await Article.find(mainFilter).sort({ publishedAt: -1 });

    // Return uploaded articles first (private), then the common articles
    const combined = [...uploaded, ...mainArticles];
    res.json(combined);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find in the main Article collection first
    let article = await Article.findById(id);
    if (article) return res.json(article);

    // If not found in main collection, try to find in the authenticated user's uploadedArticles
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(404).json({ msg: 'Article not found' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(404).json({ msg: 'Article not found' });
    }

    const user = await User.findById(decoded.user.id);
    if (!user) return res.status(404).json({ msg: 'Article not found' });

    // uploadedArticles are subdocuments; use id() helper or fallback
    let sub = null;
    if (typeof user.uploadedArticles.id === 'function') {
      sub = user.uploadedArticles.id(id);
    } else {
      sub = (user.uploadedArticles || []).find(a => String(a._id) === String(id));
    }

    if (!sub) return res.status(404).json({ msg: 'Article not found' });

    // Return subdocument shaped like an article
    const result = {
      _id: sub._id,
      title: sub.title,
      source: sub.source,
      url: sub.url,
      summary: sub.summary,
      imageUrl: sub.imageUrl,
      description: sub.description,
      category: sub.category,
      publishedAt: sub.publishedAt,
      uploadedByUser: true,
    };

    return res.json(result);
  } catch (err) {
    res.status(500).send('Server error');
  }
};


exports.generateSummary = async (req, res) => {
  try {
    const { id } = req.params;
    let article = await Article.findById(id);
    let isUserUploaded = false;
    let user = null;

    if (!article) {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) return res.status(404).json({ message: 'Article not found' });

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return res.status(404).json({ message: 'Article not found' });
      }

      user = await User.findById(decoded.user.id);
      if (!user) return res.status(404).json({ message: 'Article not found' });

      let sub = null;
      if (typeof user.uploadedArticles.id === 'function') {
        sub = user.uploadedArticles.id(id);
      } else {
        sub = (user.uploadedArticles || []).find(a => String(a._id) === String(id));
      }

      if (!sub) return res.status(404).json({ message: 'Article not found' });
      article = sub;
      isUserUploaded = true;
    } else {
      isUserUploaded = article.isUserSubmitted || false;
    }

    let summaryResponse;
    if (isUserUploaded) {
      if (!user) {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (token) {
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            user = await User.findById(decoded.user.id);
          } catch (err) {
           
          }
        }
      }
      if (!user) return res.status(400).json({ message: 'User info required for user-uploaded article' });
      summaryResponse = await axios.post(SUMMARY_SERVICE_URL, { article_id: id, user_id: user._id 
      });
    } else {
      summaryResponse = await axios.get(SUMMARY_SERVICE_URL, {
        params: { article_id: id }
      });
    }

    res.json({ summary: summaryResponse.data.summary });
  } catch (error) {
    console.error("Error calling summary service:", error.message);
    res.status(500).json({ message: 'Failed to generate summary', error: error.message });
  }
};

// Detect fake news from user input
exports.detectFakeNews = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ message: 'Question is required' });

    // Call ML service
    const mlResponse = await axios.post(FAKE_NEWS_URL, {claim: question });
    const { model_response, sources } = mlResponse.data;

    // Fetch article titles for sources
    let articles = [];
    if (Array.isArray(sources) && sources.length > 0) {
      articles = await Article.find({ _id: { $in: sources } }, 'title');
    }
    // Map source IDs to titles
    const sourceTitles = articles.map((a, idx) => ({ id: a._id, title: a.title, label: `article${idx+1}` }));

    res.json({
      reason: model_response.reason,
      verdict: model_response.verdict,
      confidence: model_response.confidence,
      sources: sourceTitles
    });
  } catch (error) {
    console.error('Error detecting fake news:', error.message);
    res.status(500).json({ message: 'Failed to detect fake news', error: error.message });
  }
};

// Upload a new article by URL (user-submitted)
exports.uploadArticle = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Authentication required' });

    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: 'User not found' });

    const { url } = req.body;
    if (!url) return res.status(400).json({ message: 'URL is required' });

    // Prevent duplicates in the user's uploaded articles
    if ((user.uploadedArticles || []).some(a => a.url === url)) {
      return res.status(400).json({ message: 'You have already uploaded this article' });
    }

    // If the article already exists in the main collection, reject to avoid duplication
    const existing = await Article.findOne({ url });
    if (existing) {
      return res.status(400).json({ message: 'Article already exists in main collection' });
    }

    let scraped = await axios.post(scrape_url, {
      url: url
    });

    user.uploadedArticles = user.uploadedArticles || [];
    user.uploadedArticles.push(scraped.data);
    await user.save();

    // Return the newly added uploaded article (take last element)
    const added = user.uploadedArticles[user.uploadedArticles.length - 1];
    console.log('Uploaded article added:', added);
    return res.status(201).json(added);
  } catch (error) {
    console.error('Error uploading article:', error.message);
    return res.status(500).json({ message: 'Failed to upload article', error: error.message });
  }
};