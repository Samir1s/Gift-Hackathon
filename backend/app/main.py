from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import auth, learn, playground, daily_updates, portfolio, chatbot, prediction

app = FastAPI(
    title="TradeQuest API",
    description="AI-Powered Finance Education & Investment Intelligence Platform",
    version="1.0.0",
)

# CORS — allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "https://gift-hackathon-murex.vercel.app", "http://localhost:5173", "http://localhost:3000"],
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
app.include_router(prediction.router)


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "gemini_configured": bool(settings.gemini_api_key),
        "news_api_configured": bool(settings.news_api_key),
    }


@app.get("/")
async def root():
    return {
        "name": "TradeQuest API",
        "version": "1.0.0",
        "docs": "/docs",
    }
