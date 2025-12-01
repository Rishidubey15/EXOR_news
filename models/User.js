const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
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
    savedArticles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
        default: [],
      },
    ],

    // Articles uploaded/seeded by this user that should be visible only to them
    uploadedArticles: [
      {
        authors: {
          type: [String],
          default: [],
        },

        date_download: {
          type: Date,
          required: false,
        },

        updatedAt: {
          type: Date,
          default: null,
        },

        publishedAt: {
          type: Date,
          required: false,
        },

        summary: {
          type: String,
          required: false,
          trim: true,
        },

        filename: {
          type: String,
          required: false,
        },

        imageUrl: {
          type: String,
          required: false,
        },

        language: {
          type: String,
          default: "en",
        },

        description: {
          type: String,
          required: false,
        },

        source: {
          type: String,
          required: true,
          index: true,
        },

        title: {
          type: String,
          required: true,
          trim: true,
          index: "text", // for text search
        },

        url: {
          type: String,
          required: true,
          unique: true, // prevents duplicate articles
        },

        isFakeNews: {
          type: Boolean,
          default: false,
        },

        category: {
          type: String,
          required: false,
          index: true,
        },

        isUserSubmitted: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
