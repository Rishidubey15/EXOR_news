# ml_service/news_pipeline.py
import requests
from bs4 import BeautifulSoup
from transformers import pipeline

class NewsPipeline:
    def __init__(self):
        # Initialize the summarizer model once
        self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

    def scrape_article_content(self, url: str) -> str:
        """Scrapes the full text content from a given article URL."""
        try:
            response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find all paragraph tags and join their text
            paragraphs = soup.find_all('p')
            full_text = ' '.join([p.get_text() for p in paragraphs])
            return full_text
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            return None

    def summarize_text(self, text: str) -> str:
        """Summarizes a given block of text."""
        # Truncate text to avoid model errors (max 1024 tokens for BART)
        summary_result = self.summarizer(text, max_length=150, min_length=40, do_sample=False)
        return summary_result[0]['summary_text']