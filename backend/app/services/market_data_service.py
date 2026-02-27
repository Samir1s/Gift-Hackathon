"""
Centralized Market Data Service
Fetches live prices from CoinGecko (crypto) and Alpha Vantage (stocks).
All calls are cached with TTL to respect rate limits.
"""

import time
import requests
from typing import Optional
from app.config import settings

# ── In-memory TTL cache ──────────────────────────────────────────────
_cache: dict = {}


def _get_cached(key: str, ttl_seconds: int) -> Optional[dict]:
    entry = _cache.get(key)
    if entry and (time.time() - entry["ts"]) < ttl_seconds:
        return entry["data"]
    return None


def _set_cache(key: str, data):
    _cache[key] = {"data": data, "ts": time.time()}


# ── CoinGecko (Crypto) ───────────────────────────────────────────────
COINGECKO_BASE = "https://api.coingecko.com/api/v3"

# Map common tickers to CoinGecko IDs
TICKER_TO_COINGECKO = {
    "BTC": "bitcoin",
    "ETH": "ethereum",
    "SOL": "solana",
    "DOGE": "dogecoin",
    "ADA": "cardano",
    "XRP": "ripple",
    "DOT": "polkadot",
    "AVAX": "avalanche-2",
    "MATIC": "matic-network",
    "LINK": "chainlink",
}

STOCK_TICKERS = ["AAPL", "NVDA", "TSLA", "JPM", "XOM", "SPY", "MSFT", "AMZN", "GOOG", "META"]


async def get_crypto_prices(tickers: list[str]) -> dict:
    """
    Fetch current prices for multiple crypto tickers.
    Returns: { "BTC": { "usd": 67500, "usd_24h_change": 4.2 }, ... }
    """
    cache_key = "crypto_prices_" + "_".join(sorted(tickers))
    cached = _get_cached(cache_key, ttl_seconds=120)  # 2 min cache
    if cached:
        return cached

    coin_ids = []
    ticker_map = {}
    for t in tickers:
        cg_id = TICKER_TO_COINGECKO.get(t.upper())
        if cg_id:
            coin_ids.append(cg_id)
            ticker_map[cg_id] = t.upper()

    if not coin_ids:
        return {}

    try:
        resp = requests.get(
            f"{COINGECKO_BASE}/simple/price",
            params={
                "ids": ",".join(coin_ids),
                "vs_currencies": "usd",
                "include_24hr_change": "true",
                "include_market_cap": "true",
            },
            timeout=8,
        )
        resp.raise_for_status()
        raw = resp.json()

        result = {}
        for cg_id, ticker in ticker_map.items():
            if cg_id in raw:
                result[ticker] = {
                    "usd": raw[cg_id].get("usd", 0),
                    "usd_24h_change": round(raw[cg_id].get("usd_24h_change", 0), 2),
                    "usd_market_cap": raw[cg_id].get("usd_market_cap", 0),
                }

        _set_cache(cache_key, result)
        return result
    except Exception as e:
        print(f"CoinGecko API error: {e}")
        return {}


async def get_crypto_market_data() -> list:
    """
    Fetch top crypto market data for sentiment/overview.
    Returns list of top coins with price, change, market cap.
    """
    cache_key = "crypto_market_top"
    cached = _get_cached(cache_key, ttl_seconds=180)  # 3 min cache
    if cached:
        return cached

    try:
        resp = requests.get(
            f"{COINGECKO_BASE}/coins/markets",
            params={
                "vs_currency": "usd",
                "order": "market_cap_desc",
                "per_page": 20,
                "page": 1,
                "sparkline": "false",
                "price_change_percentage": "24h,7d",
            },
            timeout=8,
        )
        resp.raise_for_status()
        data = resp.json()
        _set_cache(cache_key, data)
        return data
    except Exception as e:
        print(f"CoinGecko market data error: {e}")
        return []


async def get_crypto_historical_ohlc(coin_id: str, days: int = 30) -> list:
    """
    Fetch historical OHLC data from CoinGecko.
    Returns list of [timestamp, open, high, low, close].
    """
    cache_key = f"crypto_ohlc_{coin_id}_{days}"
    cached = _get_cached(cache_key, ttl_seconds=3600)  # 1 hour cache
    if cached:
        return cached

    try:
        resp = requests.get(
            f"{COINGECKO_BASE}/coins/{coin_id}/ohlc",
            params={"vs_currency": "usd", "days": days},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()

        ohlc = []
        for item in data:
            ohlc.append({
                "time": int(item[0] / 1000),  # Convert ms to seconds
                "open": round(item[1], 2),
                "high": round(item[2], 2),
                "low": round(item[3], 2),
                "close": round(item[4], 2),
            })

        _set_cache(cache_key, ohlc)
        return ohlc
    except Exception as e:
        print(f"CoinGecko OHLC error: {e}")
        return []


# ── Alpha Vantage (Stocks) ────────────────────────────────────────────
ALPHA_VANTAGE_BASE = "https://www.alphavantage.co/query"


async def get_stock_quote(ticker: str) -> Optional[dict]:
    """
    Fetch real-time stock quote from Alpha Vantage.
    Returns: { "price": 192.50, "change": 1.8, "change_percent": 0.94 }
    """
    cache_key = f"stock_quote_{ticker}"
    cached = _get_cached(cache_key, ttl_seconds=300)  # 5 min cache
    if cached:
        return cached

    api_key = settings.alpha_vantage_api_key
    if not api_key:
        return None

    try:
        resp = requests.get(
            ALPHA_VANTAGE_BASE,
            params={
                "function": "GLOBAL_QUOTE",
                "symbol": ticker,
                "apikey": api_key,
            },
            timeout=8,
        )
        resp.raise_for_status()
        data = resp.json()

        quote = data.get("Global Quote", {})
        if not quote:
            return None

        result = {
            "price": float(quote.get("05. price", 0)),
            "change": float(quote.get("09. change", 0)),
            "change_percent": float(quote.get("10. change percent", "0").replace("%", "")),
            "volume": int(quote.get("06. volume", 0)),
            "previous_close": float(quote.get("08. previous close", 0)),
        }

        _set_cache(cache_key, result)
        return result
    except Exception as e:
        print(f"Alpha Vantage error for {ticker}: {e}")
        return None


async def get_stock_quotes_batch(tickers: list[str]) -> dict:
    """
    Fetch quotes for multiple stocks. Returns dict keyed by ticker.
    Uses cache aggressively to avoid hitting rate limits.
    """
    results = {}
    for ticker in tickers:
        quote = await get_stock_quote(ticker)
        if quote:
            results[ticker] = quote
    return results


# ── Fear & Greed Index ────────────────────────────────────────────────

async def get_fear_greed_index() -> Optional[dict]:
    """
    Fetch crypto Fear & Greed Index from alternative.me.
    Returns: { "value": 72, "classification": "Greed", "timestamp": ... }
    """
    cache_key = "fear_greed"
    cached = _get_cached(cache_key, ttl_seconds=1800)  # 30 min cache
    if cached:
        return cached

    try:
        resp = requests.get(
            "https://api.alternative.me/fng/",
            params={"limit": 1},
            timeout=5,
        )
        resp.raise_for_status()
        data = resp.json()

        if data.get("data"):
            entry = data["data"][0]
            result = {
                "value": int(entry["value"]),
                "classification": entry["value_classification"],
                "timestamp": entry["timestamp"],
            }
            _set_cache(cache_key, result)
            return result
    except Exception as e:
        print(f"Fear & Greed API error: {e}")
    return None


# ── Trending Coins ────────────────────────────────────────────────────

async def get_trending_coins() -> list:
    """
    Fetch trending coins from CoinGecko.
    """
    cache_key = "trending_coins"
    cached = _get_cached(cache_key, ttl_seconds=900)  # 15 min cache
    if cached:
        return cached

    try:
        resp = requests.get(f"{COINGECKO_BASE}/search/trending", timeout=8)
        resp.raise_for_status()
        data = resp.json()

        coins = []
        for item in data.get("coins", [])[:10]:
            coin = item.get("item", {})
            coins.append({
                "id": coin.get("id"),
                "name": coin.get("name"),
                "symbol": coin.get("symbol", "").upper(),
                "market_cap_rank": coin.get("market_cap_rank"),
                "thumb": coin.get("thumb"),
                "price_btc": coin.get("price_btc", 0),
            })

        _set_cache(cache_key, coins)
        return coins
    except Exception as e:
        print(f"CoinGecko trending error: {e}")
        return []


# ── Historical OHLC via yfinance ──────────────────────────────────────

def get_historical_stock_ohlc(ticker: str, start: str, end: str) -> list:
    """
    Fetch historical daily OHLC data for a stock or index using yfinance.
    start/end format: 'YYYY-MM-DD'
    Returns list of { time, open, high, low, close }.
    Falls back to empty list on failure.
    """
    cache_key = f"hist_ohlc_{ticker}_{start}_{end}"
    cached = _get_cached(cache_key, ttl_seconds=86400)  # 24h cache (historical data doesn't change)
    if cached:
        return cached

    try:
        import yfinance as yf
        df = yf.download(ticker, start=start, end=end, progress=False)
        if df.empty:
            return []

        ohlc = []
        for idx, row in df.iterrows():
            ohlc.append({
                "time": idx.strftime("%Y-%m-%d"),
                "open": round(float(row["Open"].iloc[0]) if hasattr(row["Open"], 'iloc') else float(row["Open"]), 2),
                "high": round(float(row["High"].iloc[0]) if hasattr(row["High"], 'iloc') else float(row["High"]), 2),
                "low": round(float(row["Low"].iloc[0]) if hasattr(row["Low"], 'iloc') else float(row["Low"]), 2),
                "close": round(float(row["Close"].iloc[0]) if hasattr(row["Close"], 'iloc') else float(row["Close"]), 2),
            })

        _set_cache(cache_key, ohlc)
        return ohlc
    except Exception as e:
        print(f"yfinance error for {ticker}: {e}")
        return []
