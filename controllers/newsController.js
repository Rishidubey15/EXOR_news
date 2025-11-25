const Article = require('../models/Article');
const User = require('../models/User');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const SUMMARY_SERVICE_URL = 'http://127.0.0.1:8000/summarize/';

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
        uploadedByUser: true,
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
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Call the Python service with the article's full text
    const summaryResponse = await axios.post(SUMMARY_SERVICE_URL, {
      text: article.description, // 'description' now holds the full text
    });

    res.json({ summary: summaryResponse.data.summary });
  } catch (error) {
    console.error("Error calling summary service:", error.message);
    res.status(500).json({ message: 'Failed to generate summary' });
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

    // Try to fetch the page to extract basic metadata
    let title = 'User submitted article';
    let description = 'No description available.';
    let imageUrl = '';
    try {
      const resp = await axios.get(url, { timeout: 8000, headers: { 'User-Agent': 'EXOR-News-Agent/1.0' } });
      const html = resp.data;
      const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
      if (titleMatch && titleMatch[1]) title = titleMatch[1].trim();

      const descMatch = html.match(/<meta\s+(?:name|property)=["'](?:description|og:description)["']\s+content=["']([^"']*)["']/i);
      if (descMatch && descMatch[1]) description = descMatch[1].trim();

      const imgMatch = html.match(/<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']*)["']/i);
      if (imgMatch && imgMatch[1]) imageUrl = imgMatch[1].trim();
    } catch (err) {
      // If fetching fails, continue with defaults but report issue in response if needed
      console.warn('Failed to fetch remote URL for metadata:', err.message);
    }

    let source = '';
    try {
      source = new URL(url).hostname;
    } catch (err) {
      source = 'unknown';
    }

    // Create a user-scoped uploaded article and push it into the user's document so it's visible only to them
    const uploadedObj = {
      title,
      source,
      url,
      summary: description || 'User submitted article',
      imageUrl,
      description,
      category: 'User Submitted',
      publishedAt: new Date(),
    };

    user.uploadedArticles = user.uploadedArticles || [];
    user.uploadedArticles.push(uploadedObj);
    await user.save();

    // Return the newly added uploaded article (take last element)
    const added = user.uploadedArticles[user.uploadedArticles.length - 1];
    return res.status(201).json(added);
  } catch (error) {
    console.error('Error uploading article:', error.message);
    return res.status(500).json({ message: 'Failed to upload article', error: error.message });
  }
};