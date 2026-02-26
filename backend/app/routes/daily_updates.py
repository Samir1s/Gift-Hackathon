from fastapi import APIRouter
from app.services import news_service, gemini_service
from pydantic import BaseModel

router = APIRouter(prefix="/api/daily-updates", tags=["daily-updates"])


class NewsAnalysisRequest(BaseModel):
    title: str
    description: str


@router.get("/news")
async def get_news(category: str = "All"):
    news = await news_service.fetch_news(category)
    return news


@router.get("/alerts")
async def get_alerts():
    alerts = await news_service.fetch_alerts()
    return alerts


@router.post("/ai-analysis")
async def analyze_news(req: NewsAnalysisRequest):
    analysis = await gemini_service.analyze_news(req.title, req.description)
    return {"analysis": analysis}
