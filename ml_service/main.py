# ml_service/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from news_pipeline import NewsPipeline # Assuming your class is in this file

app = FastAPI()
# You don't need the API key here anymore as scraping is direct
news_pipeline = NewsPipeline()

# Pydantic models for request body validation
class ScrapeRequest(BaseModel):
    url: str

class SummarizeRequest(BaseModel):
    text: str

@app.post("/scrape/")
async def scrape_article(request: ScrapeRequest):
    """Receives a URL, scrapes the content, and returns the full text."""
    try:
        full_text = news_pipeline.scrape_article_content(request.url)
        if not full_text:
            raise HTTPException(status_code=404, detail="Could not scrape content from URL.")
        return {"scraped_text": full_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/summarize/")
async def summarize_text(request: SummarizeRequest):
    """Receives text and returns a summary."""
    try:
        summary = news_pipeline.summarize_text(request.text)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))