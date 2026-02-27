from fastapi import APIRouter
from app.services import gemini_service

router = APIRouter(prefix="/api/portfolio", tags=["portfolio"])

# In-memory portfolio data
HOLDINGS = [
    {"name": "NVIDIA", "ticker": "NVDA", "qty": 25, "avgPrice": 890, "currentPrice": 945, "dayChange": 2.3},
    {"name": "Bitcoin", "ticker": "BTC", "qty": 0.5, "avgPrice": 42000, "currentPrice": 60500, "dayChange": 4.1},
    {"name": "Apple", "ticker": "AAPL", "qty": 50, "avgPrice": 178, "currentPrice": 195, "dayChange": -0.8},
    {"name": "S&P 500 ETF", "ticker": "SPY", "qty": 30, "avgPrice": 450, "currentPrice": 512, "dayChange": 0.5},
    {"name": "Gold", "ticker": "GLD", "qty": 15, "avgPrice": 185, "currentPrice": 210, "dayChange": 1.2},
    {"name": "Tesla", "ticker": "TSLA", "qty": 20, "avgPrice": 240, "currentPrice": 255, "dayChange": -1.5},
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


def _calculate_portfolio_value():
    return sum(h["currentPrice"] * h["qty"] for h in HOLDINGS)


def _calculate_daily_pnl():
    total = 0
    for h in HOLDINGS:
        prev_price = h["currentPrice"] / (1 + h["dayChange"] / 100)
        total += (h["currentPrice"] - prev_price) * h["qty"]
    return round(total, 2)


def _calculate_total_pnl():
    return sum((h["currentPrice"] - h["avgPrice"]) * h["qty"] for h in HOLDINGS)


@router.get("/")
async def get_portfolio():
    total_value = _calculate_portfolio_value()
    return {
        "total_value": round(total_value, 2),
        "daily_pnl": _calculate_daily_pnl(),
        "total_pnl": round(_calculate_total_pnl(), 2),
        "win_rate": 68.4,
        "holdings": HOLDINGS,
        "allocation": ALLOCATION,
        "performance": PERFORMANCE,
    }


@router.get("/holdings")
async def get_holdings():
    return HOLDINGS


@router.get("/performance")
async def get_performance():
    return PERFORMANCE


@router.get("/allocation")
async def get_allocation():
    return ALLOCATION


@router.post("/ai-review")
async def get_ai_review():
    analysis = await gemini_service.analyze_portfolio(HOLDINGS)
    return analysis
