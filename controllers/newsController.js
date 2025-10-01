const Article = require('../models/Article');
const User = require('../models/User');

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
