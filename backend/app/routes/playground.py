from fastapi import APIRouter
from app.data.scenarios_data import SCENARIOS
from app.services import trading_engine, gemini_service, market_data_service

router = APIRouter(prefix="/api/playground", tags=["playground"])


@router.get("/scenarios")
async def get_scenarios():
    return [
        {
            "id": s["id"],
            "title": s["title"],
            "asset": s["asset"],
            "difficulty": s["difficulty"],
            "xp": s["xp"],
            "description": s["description"],
        }
        for s in SCENARIOS
    ]


@router.get("/historical-events")
async def get_historical_events():
    """
    Fetch real historical OHLC data for key market events using yfinance.
    Returns data split into 'before' and 'after' segments for the reveal animation.
    """
    events = []

    # Event 1: COVID Crash (SPY)
    before_data = market_data_service.get_historical_stock_ohlc("SPY", "2019-10-01", "2020-02-19")
    after_data = market_data_service.get_historical_stock_ohlc("SPY", "2020-02-20", "2020-04-15")

    if before_data and after_data:
        events.append({
            "id": "covid-crash-2020",
            "title": "The 2020 COVID Flash Crash",
            "asset": "S&P 500 (SPY)",
            "description": "After a decade-long bull run, news of a novel global virus begins to dominate headlines. Supply chains are halting. The market has been pushing all-time highs for months.",
            "dataBefore": before_data,
            "dataAfter": after_data,
            "aiPrediction": {
                "direction": "BEARISH",
                "confidence": 92,
                "reasoning": "Macro-economic indicators suggest unprecedented global manufacturing shutdowns. High probability of a liquidity crisis."
            },
            "outcome": "BEARISH",
            "learnings": "Black swan events cause panic selling. In these scenarios, technical support levels often fail completely as participants rush to cash.",
        })

    # Event 2: 2021 Crypto Bull Run (BTC-USD)
    before_data_btc = market_data_service.get_historical_stock_ohlc("BTC-USD", "2020-09-01", "2021-01-01")
    after_data_btc = market_data_service.get_historical_stock_ohlc("BTC-USD", "2021-01-02", "2021-04-15")

    if before_data_btc and after_data_btc:
        events.append({
            "id": "crypto-bull-2021",
            "title": "The 2021 Institutional Adoption Run",
            "asset": "Bitcoin (BTC-USD)",
            "description": "Major corporations are announcing they are adding this digital asset to their balance sheets. Retail interest is surging, but the asset has already climbed 300% in a year.",
            "dataBefore": before_data_btc,
            "dataAfter": after_data_btc,
            "aiPrediction": {
                "direction": "BULLISH",
                "confidence": 78,
                "reasoning": "Institutional inflows are creating a supply shock. Historical resistance levels breaking on high volume."
            },
            "outcome": "BULLISH",
            "learnings": "When massive new capital enters a relatively small market cap asset, standard overbought indicators can remain 'overbought' for extended periods.",
        })

    # Event 3: 2022 Tech Selloff (NASDAQ via QQQ)
    before_data_qqq = market_data_service.get_historical_stock_ohlc("QQQ", "2021-09-01", "2022-01-03")
    after_data_qqq = market_data_service.get_historical_stock_ohlc("QQQ", "2022-01-04", "2022-06-30")

    if before_data_qqq and after_data_qqq:
        events.append({
            "id": "tech-selloff-2022",
            "title": "The 2022 Tech & Crypto Winter",
            "asset": "NASDAQ 100 (QQQ)",
            "description": "After two years of pandemic-fueled tech growth, inflation hits a 40-year high. The Fed begins aggressive rate hikes. Crypto exchanges are collapsing.",
            "dataBefore": before_data_qqq,
            "dataAfter": after_data_qqq,
            "aiPrediction": {
                "direction": "BEARISH",
                "confidence": 85,
                "reasoning": "Rising interest rates historically crush growth stock valuations. P/E ratios at unsustainable levels."
            },
            "outcome": "BEARISH",
            "learnings": "When the Fed pivots to tightening, the first assets to fall are the most speculative. Cash flow positive companies hold up better than growth stories.",
        })

    # Fallback: if yfinance fails, return mock-ish data
    if not events:
        events = _get_fallback_events()

    return events


def _get_fallback_events():
    """Return fallback events if yfinance is unavailable."""
    import random
    import time

    def gen(start_price, days, bias=0):
        data = []
        price = start_price
        now = int(time.time()) - days * 86400
        for i in range(days):
            o = price
            c = price + (random.random() - 0.5 + bias) * price * 0.03
            h = max(o, c) + random.random() * price * 0.01
            l = min(o, c) - random.random() * price * 0.01
            data.append({"time": time.strftime("%Y-%m-%d", time.gmtime(now + i * 86400)),
                         "open": round(o, 2), "high": round(h, 2), "low": round(l, 2), "close": round(c, 2)})
            price = c
        return data

    return [
        {
            "id": "covid-crash-2020",
            "title": "The 2020 COVID Flash Crash",
            "asset": "GLOBAL-IDX",
            "description": "A global pandemic triggers the fastest bear market in history.",
            "dataBefore": gen(300, 80, 0.01),
            "dataAfter": gen(230, 30, -0.03),
            "aiPrediction": {"direction": "BEARISH", "confidence": 92, "reasoning": "Unprecedented global shutdowns."},
            "outcome": "BEARISH",
            "learnings": "Black swan events cause panic selling.",
        },
        {
            "id": "crypto-bull-2021",
            "title": "The 2021 Institutional Adoption Run",
            "asset": "KRYPTO-BTC",
            "description": "Institutional buy-in creates a supply shock in a small market.",
            "dataBefore": gen(10000, 80, 0.02),
            "dataAfter": gen(28000, 50, 0.04),
            "aiPrediction": {"direction": "BULLISH", "confidence": 78, "reasoning": "Institutional inflows creating supply shock."},
            "outcome": "BULLISH",
            "learnings": "Standard overbought indicators can stay elevated during structural inflows.",
        },
    ]


@router.post("/session/start")
async def start_session(scenario_id: str = "zero-day-vulnerability"):
    session = trading_engine.create_session(scenario_id)
    return session


@router.post("/session/{session_id}/trade")
async def execute_trade(session_id: str, req: "TradeRequest"):
    from app.models.schemas import TradeRequest as TR
    session = trading_engine.execute_trade(
        session_id, req.order_type, req.quantity, req.scenario_id
    )
    return session


@router.get("/session/{session_id}/status")
async def get_session_status(session_id: str):
    session = trading_engine.get_session(session_id)
    if not session:
        return {"error": "Session not found"}
    return session


@router.post("/session/{session_id}/end")
async def end_session(session_id: str):
    session = trading_engine.end_session(session_id)
    if not session:
        return {"error": "Session not found"}
    analysis = await gemini_service.analyze_trade(session)
    return {"session": session, "analysis": analysis}


@router.get("/chart-data")
async def get_chart_data(base_price: float = 45000):
    data = trading_engine.generate_candlestick_data(base_price)
    return data


@router.get("/live-price/{coin}")
async def get_live_price(coin: str = "bitcoin"):
    """Get live price for a coin (used by learn playground)."""
    prices = await market_data_service.get_crypto_prices([coin.upper()])
    if coin.upper() in prices:
        return {"price": prices[coin.upper()]["usd"], "source": "live"}

    # Try CoinGecko ID directly
    try:
        import requests
        resp = requests.get(
            f"https://api.coingecko.com/api/v3/simple/price",
            params={"ids": coin, "vs_currencies": "usd"},
            timeout=5,
        )
        data = resp.json()
        if coin in data:
            return {"price": data[coin]["usd"], "source": "live"}
    except Exception:
        pass

    return {"price": 45000, "source": "fallback"}
