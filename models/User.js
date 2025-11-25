const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  preferences: {
    type: [String],
    default: [],
  },
  savedArticles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    default: [],
  }],

  // Articles uploaded/seeded by this user that should be visible only to them
  uploadedArticles: [
    {
      title: { type: String, required: true },
      source: { type: String, default: 'user-submitted' },
      url: { type: String, required: true },
      summary: { type: String, default: '' },
      imageUrl: { type: String, default: '' },
      description: { type: String, default: '' },
      category: { type: String, default: 'User Submitted' },
      publishedAt: { type: Date, default: Date.now },
    }
  ],
  
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
