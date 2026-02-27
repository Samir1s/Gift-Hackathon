"""
Sentiment route — provides real market sentiment data from external APIs.
"""

from fastapi import APIRouter
from app.services import market_data_service

router = APIRouter(prefix="/api/sentiment", tags=["sentiment"])


@router.get("/")
async def get_sentiment():
    """
    Returns real sentiment data: Fear & Greed index, trending coins,
    and per-asset sentiment derived from market data.
    """
    # Fetch data concurrently-ish (Python async doesn't truly parallelize here,
    # but each call is cached after first fetch)
    fear_greed = await market_data_service.get_fear_greed_index()
    trending = await market_data_service.get_trending_coins()
    market_data = await market_data_service.get_crypto_market_data()

    # Build per-asset sentiment from real market data
    sentiment_data = []
    target_symbols = ["BTC", "ETH", "SOL", "DOGE", "ADA", "XRP", "AVAX", "DOT"]

    for coin in market_data:
        symbol = coin.get("symbol", "").upper()
        if symbol in target_symbols:
            price_change_24h = coin.get("price_change_percentage_24h", 0) or 0
            price_change_7d = coin.get("price_change_percentage_7d_in_currency", 0) or 0

            # Derive crowd sentiment from 24h volume vs market cap ratio + price action
            market_cap = coin.get("market_cap", 1)
            total_volume = coin.get("total_volume", 0)
            volume_ratio = (total_volume / market_cap * 100) if market_cap else 0

            # Crowd bullish: heavily influenced by recent price action
            crowd_bullish = min(95, max(5, 50 + price_change_24h * 3))

            # AI bullish: now uses the LightGBM ML prediction model
            from app.services.prediction_service import predictor
            
            try:
                pred = await predictor.predict_direction(symbol)
                ai_bullish = pred.get("confidence_bullish", 50)
            except Exception as e:
                # Fallback to formula if ML fails or isn't ready
                ai_bullish = min(95, max(5, 50 + price_change_7d * 1.5 + (volume_ratio - 5) * 2))

            divergence = abs(round(crowd_bullish - ai_bullish))

            sentiment_data.append({
                "ticker": symbol,
                "name": coin.get("name", symbol),
                "crowdBullish": round(crowd_bullish),
                "aiBullish": round(ai_bullish),
                "divergence": divergence,
                "alert": divergence > 20,
                "alertType": "HERD_BULLISH" if crowd_bullish > ai_bullish + 20 else (
                    "HERD_BEARISH" if ai_bullish > crowd_bullish + 20 else None
                ),
                "volume": round(total_volume / 1_000_000),  # In millions
                "priceChange24h": round(price_change_24h, 2),
                "currentPrice": coin.get("current_price", 0),
                "image": coin.get("image", ""),
            })

    return {
        "fearGreed": fear_greed or {"value": 50, "classification": "Neutral"},
        "trending": trending[:6],
        "sentimentData": sorted(sentiment_data, key=lambda x: x["volume"], reverse=True),
    }


@router.get("/fear-greed")
async def get_fear_greed():
    """Returns just the Fear & Greed index."""
    result = await market_data_service.get_fear_greed_index()
    return result or {"value": 50, "classification": "Neutral"}


@router.get("/trending")
async def get_trending():
    """Returns trending coins from CoinGecko."""
    return await market_data_service.get_trending_coins()
