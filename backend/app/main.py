from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import auth, learn, playground, daily_updates, portfolio, chatbot, sentiment, predictions, community

app = FastAPI(
    title="TradeQuest API",
    description="AI-Powered Finance Education & Investment Intelligence Platform",
    version="1.0.0",
)

# CORS — allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth.router)
app.include_router(learn.router)
app.include_router(playground.router)
app.include_router(daily_updates.router)
app.include_router(portfolio.router)
app.include_router(chatbot.router)
app.include_router(sentiment.router)
app.include_router(predictions.router)
app.include_router(community.router)


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "gemini_configured": bool(settings.gemini_api_key),
        "news_api_configured": bool(settings.news_api_key),
        "alpha_vantage_configured": bool(settings.alpha_vantage_api_key),
    }


@app.get("/")
async def root():
    return {
        "name": "TradeQuest API",
        "version": "1.0.0",
        "docs": "/docs",
    }
