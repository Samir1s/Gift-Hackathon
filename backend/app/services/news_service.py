"""
News service — fetches real news from NewsAPI and enriches with Gemini AI.
Falls back to static data when API is unavailable.
"""

import requests
from datetime import datetime
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

# Keyword-based classification for fast enrichment without Gemini
CATEGORY_KEYWORDS = {
    "Crypto": ["bitcoin", "btc", "ethereum", "eth", "crypto", "blockchain", "token", "defi", "nft", "solana", "dogecoin", "stablecoin", "binance", "coinbase"],
    "Commodities": ["oil", "gold", "silver", "commodity", "crude", "opec", "natural gas", "copper", "wheat", "lithium"],
    "Forex": ["forex", "currency", "eur/usd", "dollar", "yen", "gbp", "exchange rate", "central bank"],
    "Stocks": ["stock", "shares", "earnings", "ipo", "nasdaq", "nyse", "market cap", "dividend", "nvidia", "apple", "tesla", "microsoft", "amazon", "google", "meta"],
    "Macro": ["fed", "inflation", "gdp", "interest rate", "unemployment", "fiscal", "monetary", "recession", "treasury", "yield", "pmi", "cpi"],
}

SENTIMENT_KEYWORDS = {
    "Bullish": ["surge", "rally", "record", "beat", "growth", "soar", "gain", "rise", "up", "bullish", "breakthrough", "strong", "exceeded", "positive", "boom", "upgrade"],
    "Bearish": ["fall", "crash", "decline", "drop", "loss", "weak", "bearish", "concern", "risk", "fear", "sell-off", "downgrade", "recession", "plunge", "slump", "cut"],
}

IMPACT_KEYWORDS = {
    "Critical": ["crash", "crisis", "emergency", "record", "historic", "unprecedented", "breaking"],
    "High": ["surge", "plunge", "major", "significant", "earnings", "fed", "interest rate", "war"],
    "Medium": ["report", "announce", "update", "rise", "fall", "growth"],
}


def _classify_category(title: str, description: str) -> str:
    """Classify news category using keyword matching."""
    text = (title + " " + (description or "")).lower()
    scores = {}
    for category, keywords in CATEGORY_KEYWORDS.items():
        scores[category] = sum(1 for kw in keywords if kw in text)
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "Macro"


def _classify_sentiment(title: str, description: str) -> str:
    """Classify sentiment using a robust weighted approach."""
    text = (title + " " + (description or "")).lower()
    
    # Give higher weight to title words
    title_lower = title.lower()
    
    bullish_score = sum(2 if kw in title_lower else 1 for kw in SENTIMENT_KEYWORDS["Bullish"] if kw in text)
    bearish_score = sum(2 if kw in title_lower else 1 for kw in SENTIMENT_KEYWORDS["Bearish"] if kw in text)
    
    # Check for negations directly preceding keywords (simple ML-lite approach)
    negations = ["not", "no", "never", "less", "lower"]
    words = text.split()
    for i, word in enumerate(words):
        if word in negations and i + 1 < len(words):
            next_word = words[i+1]
            if next_word in SENTIMENT_KEYWORDS["Bullish"]:
                bullish_score -= 1
                bearish_score += 1
            elif next_word in SENTIMENT_KEYWORDS["Bearish"]:
                bearish_score -= 1
                bullish_score += 1
                
    if bullish_score > bearish_score * 1.5:
        return "Bullish"
    elif bearish_score > bullish_score * 1.5:
        return "Bearish"
    return "Neutral"


def _classify_impact(title: str, description: str) -> str:
    """Classify impact level using keyword matching."""
    text = (title + " " + (description or "")).lower()
    for level in ["Critical", "High", "Medium"]:
        if any(kw in text for kw in IMPACT_KEYWORDS[level]):
            return level
    return "Low"


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

            title = art.get("title", "")
            description = art.get("description", "")[:200] if art.get("description") else ""

            articles.append({
                "id": i + 1,
                "title": title,
                "source": art.get("source", {}).get("name", "Unknown"),
                "time": _time_ago(art.get("publishedAt", "")),
                "category": _classify_category(title, description),
                "impact": _classify_impact(title, description),
                "sentiment": _classify_sentiment(title, description),
                "description": description,
                "url": art.get("url", ""),
            })
        if not articles:
            return _filter_news(FALLBACK_NEWS, category)
        return _filter_news(articles, category)
    except Exception as e:
        print(f"News API error: {e}")
        return _filter_news(FALLBACK_NEWS, category)


async def fetch_alerts() -> list:
    """
    Generate alerts from real market data where possible.
    Falls back to static alerts.
    """
    try:
        from app.services import market_data_service
        fear_greed = await market_data_service.get_fear_greed_index()
        crypto_prices = await market_data_service.get_crypto_prices(["BTC", "ETH"])

        live_alerts = []
        alert_id = 1

        if fear_greed:
            fg_val = fear_greed["value"]
            fg_class = fear_greed["classification"]
            severity = "Critical" if fg_val > 80 or fg_val < 20 else "High" if fg_val > 70 or fg_val < 30 else "Medium"
            live_alerts.append({
                "id": alert_id,
                "message": f"Crypto Fear & Greed Index: {fg_val} ({fg_class})",
                "severity": severity,
                "time": "Live",
            })
            alert_id += 1

        if "BTC" in crypto_prices:
            btc = crypto_prices["BTC"]
            btc_price = btc["usd"]
            btc_change = btc["usd_24h_change"]
            severity = "Critical" if abs(btc_change) > 5 else "High" if abs(btc_change) > 3 else "Medium"
            direction = "▲" if btc_change > 0 else "▼"
            live_alerts.append({
                "id": alert_id,
                "message": f"BTC ${btc_price:,.0f} {direction} {abs(btc_change):.1f}% (24h)",
                "severity": severity,
                "time": "Live",
            })
            alert_id += 1

        if "ETH" in crypto_prices:
            eth = crypto_prices["ETH"]
            eth_price = eth["usd"]
            eth_change = eth["usd_24h_change"]
            severity = "High" if abs(eth_change) > 5 else "Medium"
            direction = "▲" if eth_change > 0 else "▼"
            live_alerts.append({
                "id": alert_id,
                "message": f"ETH ${eth_price:,.0f} {direction} {abs(eth_change):.1f}% (24h)",
                "severity": severity,
                "time": "Live",
            })
            alert_id += 1

        if live_alerts:
            return live_alerts
    except Exception as e:
        print(f"Live alerts error: {e}")

    return FALLBACK_ALERTS


def _filter_news(news: list, category: str) -> list:
    if category == "All" or not category:
        return news
    return [n for n in news if n["category"] == category]
