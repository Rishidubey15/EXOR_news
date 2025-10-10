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
   const articleData = {
        title: "Who was Matt Beard, former Liverpool and Chelsea women’s football manager found dead at his home",
        source: "timesofindia.indiatimes.com",
        url: "https://timesofindia.indiatimes.com/etimes/trending/who-was-matt-beard-former-liverpool-and-chelsea-womens-football-manager-found-dead-at-his-home/articleshow/124219665.cms",
        imageUrl: "https://static.toiimg.com/thumb/msid-124219746,width-1070,height-580,imgsize-21756,resizemode-75,overlay-toi_sw,pt-32,y_pad-40/photo.jpg",
        summary: "Trending News: Former Liverpool and Chelsea Women's manager Matt Beard has died at 47 after taking his own life on September 20, 2025. His death deeply shocked the football community.",
        description: "Former Liverpool and Chelsea Women's manager Matt Beard has died at 47 after taking his own life on September 20, 2025. His death deeply shocked the football community, leading to match postponements and tributes. Beard was a highly influential figure, celebrated for guiding Liverpool to two WSL titles and significantly contributing to women's football growth.\n\nFormer Liverpool Women and Chelsea Women's manager Matt Beard has died at the age of 47. A coroner’s court in Ruthin, North Wales, heard that Beard took his own life after being found hanged at his home in Deeside, Flintshire, on 20 September 2025. He later passed away in hospital in Chester the same day. His death shocked the football community, with Liverpool’s match against Aston Villa postponed and a minute’s silence held at every Women’s Super League (WSL) game the following weekend.\n\nCareer in women’s football\nMatthew Beard (9 January 1978 – 20 September 2025) was a professional football coach who dedicated most of his career to women’s football. He began his managerial journey at Millwall Lionesses in 2008, guiding them to the FA Women’s Premier League Southern Division title and promotion in his very first season. In 2009, Beard was appointed manager of Chelsea Ladies, where he remained until 2012. Under his leadership, Chelsea reached the 2012 FA Women’s Cup Final, the FA Premier League Cup semi-finals in 2009, and finished third in the Women’s Premier League National Division in 2009–10. His most successful chapter came with Liverpool Women, managing two spells from 2012 to 2015 and 2021 to 2025. He coached the club to back-to-back WSL titles in 2013 and 2014 and later guided them back into the top flight after relegation. In the 2023–24 season, he was named WSL Manager of the Season for the second time in his career. Beard also managed the Boston Breakers in the United States, West Ham United Women, Bristol City Women, and most recently had a short spell at Burnley Women.\n\nPersonal life\nBeard was born in London on 9 January 1978. He was married to Debbie, with whom he had two children, and also had a stepson from his wife’s first marriage who worked as a youth coach at Chelsea for over a decade. His brother, Mark Beard, played professionally for clubs including Millwall, Sheffield United, and Southend United.\n\nDeath and legacy\nOn 20 September 2025, Beard was discovered at his home in Deeside and later died in hospital. At the coroner’s court hearing on 29 September, it was confirmed that he had taken his own life. The full inquest has been adjourned to a later date. Matt Beard leaves behind not only a family grieving his loss but also a football community that remembers him as one of the most influential figures in the growth of women’s football in England. His coaching achievements, leadership, and contribution to the game ensured his place as a respected and admired figure in the sport.",
        category: "sports",
        publishedAt: new Date("2025-09-30T06:00:00.000Z")
    };
  // for (const category of categories) {
  //   try {
  //     const res = await axios.get(
  //       `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=5&apiKey=${process.env.NEWS_API_KEY}` // Reduced page size to avoid overwhelming scraper
  //     );

  //     // for (const art of res.data.articles) {
  //     //   if (!art.url || !art.title) continue; // Skip articles without a URL or title

  //     //   let fullContent = art.description || 'No content available.';
  //     //   try {
  //     //     // 1. Ask the Python service to scrape the full article content
  //     //     console.log(`Scraping: ${art.url}`);
  //     //     const scrapeResponse = await axios.post(SCRAPE_SERVICE_URL, { url: art.url });
  //     //     if (scrapeResponse.data && scrapeResponse.data.scraped_text) {
  //     //       fullContent = scrapeResponse.data.scraped_text;
  //     //     }
  //     //   } catch (scrapeErr) {
  //     //     console.error(`Could not scrape ${art.url}. Storing summary instead. Error: ${scrapeErr.message}`);
  //     //   }

  //     //   await Article.updateOne(
  //     //     { url: art.url },
  //     //     {
  //     //       title: art.title,
  //     //       source: art.source.name,
  //     //       url: art.url,
  //     //       imageUrl: art.urlToImage || '',
  //     //       summary: art.description || 'No summary available.', // Keep original summary for card view
  //     //       description: fullContent, // The full scraped text goes here
  //     //       category,
  //     //       publishedAt: art.publishedAt || new Date(),
  //     //     },
  //     //     { upsert: true }
  //     //   );
  //     // }

      
  //   } catch (err) {
  //     console.error(`Error fetching ${category}:`, err.message);
  //   }
  // }

  await Article.updateOne(
          { url: articleData.url },
          {
            title: articleData.title,
            source: articleData.source.name || articleData.source,
            url: articleData.url,
            imageUrl: articleData.imageUrl || '',
            summary: articleData.summary || 'No summary available.',
            description: articleData.description,
            category: articleData.category,
            publishedAt: articleData.publishedAt || new Date(),
          },
          { upsert: true }
    );
      // console.log(`Seeded ${category} articles.`);
  mongoose.disconnect();
};

fetchAndSeed();