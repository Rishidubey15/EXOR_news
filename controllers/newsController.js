const Article = require('../models/Article');
const User = require('../models/User');
const axios = require('axios');
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
    if (!user || !user.preferences.length) {
      return res.json([]);
    }
    const articles = await Article.find({ category: { $in: user.preferences } }).sort({ publishedAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }
    res.json(article);
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