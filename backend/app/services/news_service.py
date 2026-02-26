import requests
from datetime import datetime, timedelta
import random
from app.config import settings

FALLBACK_NEWS = [
    {"id": 1, "title": "Fed Signals Potential Rate Cut in Q2 2026", "source": "Reuters", "time": "2 min ago", "category": "Macro", "impact": "Critical", "sentiment": "Bullish", "description": "Federal Reserve hints at possible rate reduction citing easing inflation numbers.", "url": ""},
    {"id": 2, "title": "Bitcoin Breaks $60K Resistance Level", "source": "CoinDesk", "time": "15 min ago", "category": "Crypto", "impact": "High", "sentiment": "Bullish", "description": "BTC surges past key resistance with record institutional inflows.", "url": ""},
    {"id": 3, "title": "NVIDIA Reports Record Quarterly Revenue", "source": "Bloomberg", "time": "1 hour ago", "category": "Stocks", "impact": "High", "sentiment": "Bullish", "description": "Chip giant posts $30B quarterly revenue, beating all analyst estimates.", "url": ""},
    {"id": 4, "title": "Oil Prices Surge on OPEC+ Supply Cut Extension", "source": "CNBC", "time": "2 hours ago", "category": "Commodities", "impact": "Medium", "sentiment": "Bullish", "description": "OPEC+ agrees to extend production cuts through Q3 2026.", "url": ""},
    {"id": 5, "title": "EUR/USD Falls Below 1.05 on ECB Dovish Signal", "source": "Forex Factory", "time": "3 hours ago", "category": "Forex", "impact": "Medium", "sentiment": "Bearish", "description": "Euro weakens as ECB members signal continued accommodative stance.", "url": ""},
    {"id": 6, "title": "Major Cybersecurity Breach at Cloud Provider", "source": "TechCrunch", "time": "4 hours ago", "category": "Stocks", "impact": "High", "sentiment": "Bearish", "description": "Leading cloud company faces data breach affecting millions of users.", "url": ""},
    {"id": 7, "title": "Emerging Markets Rally on Dollar Weakness", "source": "Financial Times", "time": "5 hours ago", "category": "Macro", "impact": "Low", "sentiment": "Neutral", "description": "EM currencies gain as dollar index hits monthly low.", "url": ""},
    {"id": 8, "title": "Tesla Unveils Next-Gen Battery Technology", "source": "Reuters", "time": "6 hours ago", "category": "Stocks", "impact": "Medium", "sentiment": "Bullish", "description": "New solid-state battery promises 50% more range and faster charging.", "url": ""},
    {"id": 9, "title": "Gold Hits All-Time High Amid Geopolitical Tensions", "source": "Bloomberg", "time": "7 hours ago", "category": "Commodities", "impact": "High", "sentiment": "Bullish", "description": "Safe-haven demand pushes gold above $2,200 per ounce for the first time.", "url": ""},
    {"id": 10, "title": "India's GDP Growth Exceeds Expectations at 7.2%", "source": "Economic Times", "time": "8 hours ago", "category": "Macro", "impact": "Medium", "sentiment": "Bullish", "description": "Strong domestic consumption and services sector drive robust growth numbers.", "url": ""},
]

FALLBACK_ALERTS = [
    {"id": 1, "message": "BTC reached $60,000 — 5-month high", "severity": "Critical", "time": "Just now"},
    {"id": 2, "message": "Fed rate decision announcement in 30 min", "severity": "High", "time": "30 min ago"},
    {"id": 3, "message": "NVDA earnings beat consensus by 12%", "severity": "Medium", "time": "1 hour ago"},
    {"id": 4, "message": "Oil crossed $85/barrel resistance", "severity": "Low", "time": "2 hours ago"},
]

CATEGORY_MAP = {
    "business": "Stocks",
    "technology": "Stocks",
    "science": "Macro",
    "general": "Macro",
}

IMPACT_LEVELS = ["Low", "Medium", "High", "Critical"]
SENTIMENTS = ["Bullish", "Bearish", "Neutral"]


def _time_ago(published_at: str) -> str:
    try:
        dt = datetime.fromisoformat(published_at.replace("Z", "+00:00"))
        diff = datetime.now(dt.tzinfo) - dt
        minutes = int(diff.total_seconds() / 60)
        if minutes < 1:
            return "Just now"
        elif minutes < 60:
            return f"{minutes} min ago"
        elif minutes < 1440:
            return f"{minutes // 60} hours ago"
        else:
            return f"{minutes // 1440} days ago"
    except Exception:
        return "Recently"


async def fetch_news(category: str = "All") -> list:
    if not settings.news_api_key:
        return _filter_news(FALLBACK_NEWS, category)

    try:
        params = {
            "apiKey": settings.news_api_key,
            "category": "business",
            "language": "en",
            "pageSize": 15,
            "country": "us",
        }
        resp = requests.get(
            "https://newsapi.org/v2/top-headlines",
            params=params,
            timeout=5,
        )
        resp.raise_for_status()
        data = resp.json()
        articles = []
        for i, art in enumerate(data.get("articles", [])[:15]):
            if not art.get("title") or art["title"] == "[Removed]":
                continue
            articles.append({
                "id": i + 1,
                "title": art.get("title", ""),
                "source": art.get("source", {}).get("name", "Unknown"),
                "time": _time_ago(art.get("publishedAt", "")),
                "category": random.choice(["Stocks", "Crypto", "Forex", "Commodities", "Macro"]),
                "impact": random.choice(IMPACT_LEVELS),
                "sentiment": random.choice(SENTIMENTS),
                "description": art.get("description", "")[:200] if art.get("description") else "",
                "url": art.get("url", ""),
            })
        if not articles:
            return _filter_news(FALLBACK_NEWS, category)
        return _filter_news(articles, category)
    except Exception as e:
        print(f"News API error: {e}")
        return _filter_news(FALLBACK_NEWS, category)


async def fetch_alerts() -> list:
    return FALLBACK_ALERTS


def _filter_news(news: list, category: str) -> list:
    if category == "All" or not category:
        return news
    return [n for n in news if n["category"] == category]
