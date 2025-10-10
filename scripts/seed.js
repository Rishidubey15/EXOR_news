require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const Article = require('../models/Article');
const connectDB = require('../config/db');

// URL for your Python scraping service
const SCRAPE_SERVICE_URL = 'http://127.0.0.1:8000/scrape/';

const categories = ['technology', 'business', 'sports', 'health', 'science', 'entertainment'];

const fetchAndSeed = async () => {
  await connectDB();
  for (const category of categories) {
    try {
      const res = await axios.get(
        `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=5&apiKey=${process.env.NEWS_API_KEY}` // Reduced page size to avoid overwhelming scraper
      );

      for (const art of res.data.articles) {
        if (!art.url || !art.title) continue; // Skip articles without a URL or title

        let fullContent = art.description || 'No content available.';
        try {
          // 1. Ask the Python service to scrape the full article content
          console.log(`Scraping: ${art.url}`);
          const scrapeResponse = await axios.post(SCRAPE_SERVICE_URL, { url: art.url });
          if (scrapeResponse.data && scrapeResponse.data.scraped_text) {
            fullContent = scrapeResponse.data.scraped_text;
          }
        } catch (scrapeErr) {
          console.error(`Could not scrape ${art.url}. Storing summary instead. Error: ${scrapeErr.message}`);
        }

        // 2. Save the full scraped content to MongoDB
        await Article.updateOne(
          { url: art.url },
          {
            title: art.title,
            source: art.source.name,
            url: art.url,
            imageUrl: art.urlToImage || '',
            summary: art.description || 'No summary available.', // Keep original summary for card view
            description: fullContent, // The full scraped text goes here
            category,
            publishedAt: art.publishedAt || new Date(),
          },
          { upsert: true }
        );
      }
      console.log(`Seeded ${category} articles.`);
    } catch (err) {
      console.error(`Error fetching ${category}:`, err.message);
    }
  }
  mongoose.disconnect();
};

fetchAndSeed();