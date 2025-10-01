// This script fetches news from NewsAPI.org and seeds the Article collection.
require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const Article = require('../models/Article');
const connectDB = require('../config/db');

const categories = ['technology', 'business', 'sports'];

const fetchAndSeed = async () => {
  await connectDB();
  for (const category of categories) {
    try {
      const res = await axios.get(
        `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=10&apiKey=${process.env.NEWS_API_KEY}`
      );
      const articles = res.data.articles;
      for (const art of articles) {
        try {
          await Article.updateOne(
            { url: art.url },
            {
              title: art.title,
              source: art.source.name,
              url: art.url,
              summary: art.description || art.content || 'No summary available.',
              category,
              publishedAt: art.publishedAt || new Date(),
            },
            { upsert: true }
          );
        } catch (err) {
          console.error('Error saving article:', err.message);
        }
      }
      console.log(`Seeded ${category} articles.`);
    } catch (err) {
      console.error(`Error fetching ${category}:`, err.message);
    }
  }
  mongoose.disconnect();
};

fetchAndSeed();
