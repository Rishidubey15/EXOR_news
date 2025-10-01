const User = require('../models/User');
const Article = require('../models/Article');

exports.getSavedArticles = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedArticles');
    res.json(user.savedArticles);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.saveArticle = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.savedArticles.includes(req.params.articleId)) {
      user.savedArticles.push(req.params.articleId);
      await user.save();
    }
    res.json({ msg: 'Article saved' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.removeArticle = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.savedArticles = user.savedArticles.filter(
      (id) => id.toString() !== req.params.articleId
    );
    await user.save();
    res.json({ msg: 'Article removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.preferences = req.body.preferences || [];
    await user.save();
    res.json({ msg: 'Preferences updated', preferences: user.preferences });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
