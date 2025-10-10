const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    unique: true,
  },
  summary: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: 'No description available.',
  },
  category: {
    type: String,
    required: true,
  },
  isFakeNews: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Article', ArticleSchema);
