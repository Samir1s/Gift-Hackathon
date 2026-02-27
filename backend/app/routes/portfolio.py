from fastapi import APIRouter
from app.services import gemini_service, market_data_service

router = APIRouter(prefix="/api/portfolio", tags=["portfolio"])

# In-memory portfolio data — avgPrice and qty are the user's simulated positions.
# currentPrice and dayChange will be overwritten with live data when available.
HOLDINGS = [
    {"name": "NVIDIA", "ticker": "NVDA", "qty": 25, "avgPrice": 890, "currentPrice": 945, "dayChange": 2.3, "type": "Stock", "sector": "Technology"},
    {"name": "Bitcoin", "ticker": "BTC", "qty": 0.5, "avgPrice": 42000, "currentPrice": 60500, "dayChange": 4.1, "type": "Crypto", "sector": "Cryptocurrency"},
    {"name": "Apple", "ticker": "AAPL", "qty": 50, "avgPrice": 178, "currentPrice": 195, "dayChange": -0.8, "type": "Stock", "sector": "Technology"},
    {"name": "S&P 500 ETF", "ticker": "SPY", "qty": 30, "avgPrice": 450, "currentPrice": 512, "dayChange": 0.5, "type": "ETF", "sector": "Index"},
    {"name": "Gold", "ticker": "GLD", "qty": 15, "avgPrice": 185, "currentPrice": 210, "dayChange": 1.2, "type": "Commodity", "sector": "Safe Haven"},
    {"name": "Tesla", "ticker": "TSLA", "qty": 20, "avgPrice": 240, "currentPrice": 255, "dayChange": -1.5, "type": "Stock", "sector": "EV / Automotive"},
    {"name": "Ethereum", "ticker": "ETH", "qty": 12, "avgPrice": 2200, "currentPrice": 3450, "dayChange": 2.8, "type": "Crypto", "sector": "Cryptocurrency"},
    {"name": "Exxon Mobil", "ticker": "XOM", "qty": 40, "avgPrice": 95, "currentPrice": 108.75, "dayChange": 1.5, "type": "Stock", "sector": "Energy"},
]

ALLOCATION = [
    {"name": "Stocks", "value": 42, "color": "#7B3FE4"},
    {"name": "Crypto", "value": 24, "color": "#6C7CFF"},
    {"name": "ETFs", "value": 20, "color": "#00E0A4"},
    {"name": "Commodities", "value": 14, "color": "#FFC857"},
]

PERFORMANCE = [
    {"month": "Sep", "value": 1000000},
    {"month": "Oct", "value": 1034000},
    {"month": "Nov", "value": 1065000},
    {"month": "Dec", "value": 1120000},
    {"month": "Jan", "value": 1180000},
    {"month": "Feb", "value": 1247830},
]

# Crypto ticker mapping
CRYPTO_TICKERS = {"BTC", "ETH"}
STOCK_TICKERS = {"NVDA", "AAPL", "SPY", "TSLA", "GLD", "XOM"}


async def _enrich_with_live_prices(holdings: list) -> list:
    """Overwrite currentPrice and dayChange with live data where available."""
    enriched = [h.copy() for h in holdings]

    # Fetch crypto prices
    crypto_tickers = [h["ticker"] for h in enriched if h["ticker"] in CRYPTO_TICKERS]
    crypto_prices = {}
    if crypto_tickers:
        crypto_prices = await market_data_service.get_crypto_prices(crypto_tickers)

    # Fetch stock prices
    stock_tickers = [h["ticker"] for h in enriched if h["ticker"] in STOCK_TICKERS]
    stock_prices = {}
    if stock_tickers:
        stock_prices = await market_data_service.get_stock_quotes_batch(stock_tickers)

    for h in enriched:
        ticker = h["ticker"]
        if ticker in crypto_prices:
            cp = crypto_prices[ticker]
            h["currentPrice"] = round(cp["usd"], 2)
            h["dayChange"] = round(cp["usd_24h_change"], 2)
            h["source"] = "live"
        elif ticker in stock_prices:
            sp = stock_prices[ticker]
            h["currentPrice"] = round(sp["price"], 2)
            h["dayChange"] = round(sp["change_percent"], 2)
            h["source"] = "live"
        else:
            h["source"] = "cached"

    return enriched


def _calculate_portfolio_value(holdings):
    return sum(h["currentPrice"] * h["qty"] for h in holdings)


def _calculate_daily_pnl(holdings):
    total = 0
    for h in holdings:
        prev_price = h["currentPrice"] / (1 + h["dayChange"] / 100) if h["dayChange"] != -100 else h["currentPrice"]
        total += (h["currentPrice"] - prev_price) * h["qty"]
    return round(total, 2)


def _calculate_total_pnl(holdings):
    return sum((h["currentPrice"] - h["avgPrice"]) * h["qty"] for h in holdings)


def _calculate_allocation(holdings):
    """Calculate real allocation percentages from live holdings."""
    total = _calculate_portfolio_value(holdings)
    if total == 0:
        return ALLOCATION

    type_totals = {}
    for h in holdings:
        t = h.get("type", "Other")
        type_totals[t] = type_totals.get(t, 0) + h["currentPrice"] * h["qty"]

    colors = {"Stock": "#7B3FE4", "Crypto": "#6C7CFF", "ETF": "#00E0A4", "Commodity": "#FFC857"}
    allocation = []
    for name, val in sorted(type_totals.items(), key=lambda x: -x[1]):
        allocation.append({
            "name": name + "s" if not name.endswith("s") else name,
            "value": round(val / total * 100),
            "color": colors.get(name, "#999"),
        })
    return allocation


@router.get("/")
async def get_portfolio():
    enriched = await _enrich_with_live_prices(HOLDINGS)
    total_value = _calculate_portfolio_value(enriched)
    return {
        "total_value": round(total_value, 2),
        "daily_pnl": _calculate_daily_pnl(enriched),
        "total_pnl": round(_calculate_total_pnl(enriched), 2),
        "win_rate": 68.4,
        "holdings": enriched,
        "allocation": _calculate_allocation(enriched),
        "performance": PERFORMANCE,
    }


@router.get("/holdings")
async def get_holdings():
    return await _enrich_with_live_prices(HOLDINGS)


@router.get("/performance")
async def get_performance():
    return PERFORMANCE


@router.get("/allocation")
async def get_allocation():
    enriched = await _enrich_with_live_prices(HOLDINGS)
    return _calculate_allocation(enriched)


@router.post("/ai-review")
async def get_ai_review():
    enriched = await _enrich_with_live_prices(HOLDINGS)
    analysis = await gemini_service.analyze_portfolio(enriched)
    return analysis
