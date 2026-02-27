"""
Gemini AI Service — with response caching, API key pooling,
exponential backoff circuit breaker, and token-bucket rate limiting.
"""

import google.generativeai as genai
import asyncio
import time
import hashlib
from typing import Optional
from app.config import settings

# ── API Key Pool ─────────────────────────────────────────────────────
_models: list = []
_current_key_index = 0


def _init_models():
    """Initialize Gemini models from comma-separated API keys."""
    global _models
    if _models:
        return

    raw_keys = settings.gemini_api_key
    if not raw_keys:
        print("⚠️  [Gemini] WARNING: GEMINI_API_KEY is empty — all AI features will use fallback responses.")
        return

    keys = [k.strip() for k in raw_keys.split(",") if k.strip()]
    if not keys:
        print("⚠️  [Gemini] WARNING: No valid API keys found after parsing GEMINI_API_KEY.")
        return

    for key in keys:
        genai.configure(api_key=key)
        model = genai.GenerativeModel("gemini-2.0-flash")
        _models.append(model)

    print(f"✅ [Gemini] Initialized {len(_models)} API key(s) for round-robin pooling.")


def _get_model():
    """Get the next model in the round-robin pool."""
    global _current_key_index
    _init_models()
    if not _models:
        return None
    model = _models[_current_key_index % len(_models)]
    _current_key_index += 1
    return model


# ── Exponential Backoff Circuit Breaker ──────────────────────────────
_circuit_last_failure = 0.0
_circuit_consecutive_failures = 0
_CIRCUIT_BASE_COOLDOWN = 60       # seconds
_CIRCUIT_MAX_COOLDOWN = 900       # 15 minutes max


def _is_gemini_available():
    """Check if Gemini is available (not in exponential backoff cooldown)."""
    if _circuit_consecutive_failures == 0:
        return True
    cooldown = min(
        _CIRCUIT_BASE_COOLDOWN * (2 ** (_circuit_consecutive_failures - 1)),
        _CIRCUIT_MAX_COOLDOWN,
    )
    elapsed = time.time() - _circuit_last_failure
    if elapsed < cooldown:
        return False
    return True


def _record_failure():
    """Record a Gemini call failure for the circuit breaker."""
    global _circuit_last_failure, _circuit_consecutive_failures
    _circuit_last_failure = time.time()
    _circuit_consecutive_failures += 1
    cooldown = min(
        _CIRCUIT_BASE_COOLDOWN * (2 ** (_circuit_consecutive_failures - 1)),
        _CIRCUIT_MAX_COOLDOWN,
    )
    print(f"🔴 [Gemini] Failure #{_circuit_consecutive_failures} — circuit breaker cooldown: {cooldown}s")


def _record_success():
    """Reset the circuit breaker on success."""
    global _circuit_consecutive_failures
    if _circuit_consecutive_failures > 0:
        print(f"🟢 [Gemini] Recovered after {_circuit_consecutive_failures} failure(s) — circuit breaker reset.")
        _circuit_consecutive_failures = 0


# ── Token Bucket Rate Limiter ────────────────────────────────────────
_rate_tokens = 12.0       # max tokens (requests allowed in burst)
_rate_max_tokens = 12.0   # ceiling
_rate_refill_rate = 0.2   # tokens per second (~12/min)
_rate_last_refill = time.time()


def _rate_limit_allow() -> bool:
    """Token bucket rate limiter. Returns True if the request is allowed."""
    global _rate_tokens, _rate_last_refill
    now = time.time()
    elapsed = now - _rate_last_refill
    _rate_last_refill = now
    _rate_tokens = min(_rate_max_tokens, _rate_tokens + elapsed * _rate_refill_rate)
    if _rate_tokens >= 1.0:
        _rate_tokens -= 1.0
        return True
    return False


# ── Response Cache ───────────────────────────────────────────────────
_response_cache: dict = {}
_CACHE_MAX_SIZE = 200


def _cache_key(prefix: str, content: str) -> str:
    """Generate a short hash key for the cache."""
    h = hashlib.md5(content.encode("utf-8")).hexdigest()[:16]
    return f"{prefix}:{h}"


def _get_cached(key: str, ttl_seconds: int) -> Optional[str]:
    """Retrieve a cached response if it exists and hasn't expired."""
    entry = _response_cache.get(key)
    if entry and (time.time() - entry["ts"]) < ttl_seconds:
        return entry["data"]
    return None


def _set_cache(key: str, data):
    """Store a response in the cache, evicting oldest entries if full."""
    global _response_cache
    if len(_response_cache) >= _CACHE_MAX_SIZE:
        # Evict the oldest 20% of entries
        sorted_keys = sorted(_response_cache, key=lambda k: _response_cache[k]["ts"])
        for k in sorted_keys[:_CACHE_MAX_SIZE // 5]:
            del _response_cache[k]
    _response_cache[key] = {"data": data, "ts": time.time()}


# ── Core Gemini Call ─────────────────────────────────────────────────

async def _call_gemini_with_timeout(prompt: str, timeout: float = 10.0) -> Optional[str]:
    """
    Call Gemini with rate limiting, circuit breaker, and async timeout.
    Returns the response text or None on failure.
    """
    # Check circuit breaker
    if not _is_gemini_available():
        return None

    # Check rate limit
    if not _rate_limit_allow():
        print("⏳ [Gemini] Rate limit hit — returning fallback")
        return None

    model = _get_model()
    if not model:
        return None

    try:
        response = await asyncio.wait_for(
            asyncio.to_thread(model.generate_content, prompt),
            timeout=timeout,
        )
        _record_success()
        return response.text
    except asyncio.TimeoutError:
        print(f"⏱️  [Gemini] Timed out after {timeout}s")
        _record_failure()
        return None
    except Exception as e:
        print(f"❌ [Gemini] Error: {e}")
        _record_failure()
        return None


# ── Public API Functions ─────────────────────────────────────────────

async def chat_response(message: str, context: str = "general") -> str:
    # Check cache (5 min TTL)
    ck = _cache_key("chat", f"{message}|{context}")
    cached = _get_cached(ck, ttl_seconds=300)
    if cached:
        return cached

    model = _get_model()
    if not model or not _is_gemini_available():
        return _fallback_chat(message)

    system = (
        "You are TradeQuest AI, a friendly and knowledgeable finance education assistant. "
        "You help users learn about trading, investing, market analysis, and portfolio management. "
        "Keep responses concise (2-4 sentences), practical, and educational. "
        f"Current context: user is on the '{context}' page."
    )

    result = await _call_gemini_with_timeout(f"{system}\n\nUser: {message}")
    if result:
        _set_cache(ck, result)
        return result
    return _fallback_chat(message)


async def analyze_learning(modules: list) -> list:
    completed = sum(m.get("completed", 0) for m in modules)
    total = sum(m.get("lessons", 0) for m in modules)

    # Check cache (10 min TTL)
    ck = _cache_key("learn", f"{completed}/{total}")
    cached = _get_cached(ck, ttl_seconds=600)
    if cached:
        return cached

    if not _is_gemini_available():
        return _fallback_learning_analysis()

    try:
        prompt = (
            f"A student has completed {completed}/{total} lessons across these modules: "
            f"{', '.join(m['title'] for m in modules)}. "
            "Give exactly 3 short insights as JSON array: "
            '[{"type":"strength","title":"...","description":"..."},{"type":"focus","title":"...","description":"..."},{"type":"recommendation","title":"...","description":"..."}]'
        )
        result = await _call_gemini_with_timeout(prompt)
        if result:
            import json
            text = result.strip()
            if text.startswith("```"):
                text = text.split("\n", 1)[1].rsplit("```", 1)[0]
            parsed = json.loads(text)
            _set_cache(ck, parsed)
            return parsed
    except Exception:
        pass
    return _fallback_learning_analysis()


async def analyze_trade(session: dict) -> str:
    # Check cache (10 min TTL)
    session_key = f"{session.get('scenario_id', '')}|{session.get('balance', '')}|{len(session.get('trades', []))}"
    ck = _cache_key("trade", session_key)
    cached = _get_cached(ck, ttl_seconds=600)
    if cached:
        return cached

    fallback = "Your trading session shows interesting patterns. Consider using stop-losses to manage risk, and always analyze the news context before entering a position. Practice makes perfect!"
    if not _is_gemini_available():
        return fallback

    prompt = (
        f"Analyze this trading session briefly (3-4 sentences):\n"
        f"Starting balance: ₹{session.get('start_balance', 1000000):,}\n"
        f"Current balance: ₹{session.get('balance', 1000000):,}\n"
        f"Trades made: {len(session.get('trades', []))}\n"
        f"Scenario: {session.get('scenario_id', 'unknown')}\n"
        "Give practical feedback on their trading decisions."
    )
    result = await _call_gemini_with_timeout(prompt)
    if result:
        _set_cache(ck, result)
        return result
    return fallback


async def analyze_portfolio(holdings: list) -> list:
    # Check cache (5 min TTL)
    holdings_sig = "|".join(f"{h.get('ticker', '')}:{h.get('currentPrice', '')}" for h in holdings)
    ck = _cache_key("portfolio", holdings_sig)
    cached = _get_cached(ck, ttl_seconds=300)
    if cached:
        return cached

    if not _is_gemini_available():
        return _fallback_portfolio_analysis()

    try:
        holdings_str = ", ".join(
            f"{h['name']} ({h['ticker']}): {h['qty']} units @ ₹{h['currentPrice']}"
            for h in holdings
        )
        prompt = (
            f"Analyze this portfolio briefly: {holdings_str}. "
            "Give exactly 3 insights as JSON array: "
            '[{"title":"Diversification: ...","description":"...","color":"green"},{"title":"Risk: ...","description":"...","color":"yellow"},{"title":"Suggestion","description":"...","color":"purple"}]'
        )
        result = await _call_gemini_with_timeout(prompt)
        if result:
            import json
            text = result.strip()
            if text.startswith("```"):
                text = text.split("\n", 1)[1].rsplit("```", 1)[0]
            parsed = json.loads(text)
            _set_cache(ck, parsed)
            return parsed
    except Exception:
        pass
    return _fallback_portfolio_analysis()


async def analyze_news(title: str, description: str) -> str:
    # Check cache (15 min TTL)
    ck = _cache_key("news", f"{title}|{description}")
    cached = _get_cached(ck, ttl_seconds=900)
    if cached:
        return cached

    fallback = f"This news about '{title}' could impact related sectors. Monitor price action and consider hedging positions in affected assets."
    if not _is_gemini_available():
        return fallback

    prompt = (
        f"Briefly analyze the market impact of this news (2-3 sentences):\n"
        f"Title: {title}\nDescription: {description}\n"
        "Cover: likely impact on assets, potential trade opportunities, and risk factors."
    )
    result = await _call_gemini_with_timeout(prompt)
    if result:
        _set_cache(ck, result)
        return result
    return f"This news could have significant market implications. Watch for price movements in related sectors and consider adjusting positions accordingly."


# ── Fallback Responses ───────────────────────────────────────────────

def _fallback_chat(message: str) -> str:
    msg = message.lower().strip()

    # Comprehensive keyword-to-response mapping for finance education
    responses = [
        # Greetings & identity
        (["hello", "hi ", "hey", "greet", "howdy", "sup"],
         "Hello! 👋 I'm TradeQuest AI, your finance education assistant. I can help you learn about trading strategies, market analysis, portfolio management, and more. What would you like to explore today?"),
        (["who are you", "what are you", "your name", "about you", "introduce"],
         "I'm TradeQuest AI — your personal finance education assistant! I'm here to help you learn about trading, understand market dynamics, analyze your portfolio, and build your investment skills. Ask me anything about finance!"),
        (["thank", "thanks", "thx"],
         "You're welcome! Happy to help. Feel free to ask me anything else about trading, investing, or market analysis. 📈"),
        (["help", "what can you do", "features", "capabilities"],
         "I can help you with: 📊 Chart pattern analysis, 📈 Trading strategies, 💰 Portfolio management, 📰 Market news interpretation, 🛡️ Risk management, and 🧠 Behavioral finance concepts. Just ask me about any topic!"),

        # Candlestick patterns
        (["candlestick", "candle pattern"],
         "A candlestick shows price movement over a time period. The 'body' shows open/close prices, while 'wicks' show high/low. Green = price went up, Red = price went down. Key patterns to learn: Doji (indecision), Hammer (reversal), Engulfing (strong reversal), and Morning/Evening Star (trend change)."),
        (["doji"],
         "A Doji candlestick has nearly identical open and close prices, creating a cross-like shape. It signals market indecision and often appears before reversals. A Doji at the top of an uptrend = potential bearish reversal; at the bottom of a downtrend = potential bullish reversal."),
        (["hammer", "hanging man"],
         "A Hammer has a small body at the top and a long lower wick (2x+ the body). At the bottom of a downtrend, it signals bullish reversal — buyers pushed the price back up after sellers drove it down. The inverse 'Hanging Man' at the top of an uptrend signals bearish reversal."),
        (["engulfing"],
         "An Engulfing pattern is a two-candle reversal pattern. A Bullish Engulfing has a large green candle completely 'engulfing' the previous red candle — signaling a potential uptrend. A Bearish Engulfing is the opposite. These are strongest at support/resistance levels."),

        # Technical analysis
        (["support", "resistance"],
         "Support is a price level where buyers consistently step in, preventing further decline. Resistance is where sellers emerge, capping upside. When support breaks, it often becomes resistance and vice versa. These levels are key for setting entry/exit points and stop-losses."),
        (["moving average", "sma", "ema"],
         "Moving averages smooth price data to identify trends. SMA (Simple) treats all periods equally; EMA (Exponential) weights recent prices more. Common setups: 50-day MA for medium-term trend, 200-day MA for long-term. A 'Golden Cross' (50 MA crossing above 200 MA) is a strong bullish signal."),
        (["rsi", "relative strength"],
         "RSI (Relative Strength Index) measures momentum on a 0-100 scale. Above 70 = overbought (potential pullback), below 30 = oversold (potential bounce). It's most effective when combined with price action and support/resistance levels. Divergence between RSI and price can signal trend reversals."),
        (["macd"],
         "MACD (Moving Average Convergence Divergence) tracks trend momentum using two lines — the MACD line and signal line. When MACD crosses above the signal = bullish signal; below = bearish. The histogram shows the gap between them. It's great for confirming trends and spotting reversals."),
        (["volume"],
         "Volume confirms price movements. Rising price + high volume = strong trend. Rising price + low volume = weak trend, possible reversal. Volume spikes at support/resistance often precede breakouts. Always check volume before entering a trade!"),
        (["bollinger"],
         "Bollinger Bands consist of a moving average with upper and lower bands at 2 standard deviations. Price touching the upper band suggests overbought conditions; the lower band suggests oversold. A 'squeeze' (bands narrowing) often precedes a big price move."),
        (["fibonacci", "fib"],
         "Fibonacci retracement levels (23.6%, 38.2%, 50%, 61.8%) help identify potential support and resistance during pullbacks. After a big move, price often retraces to one of these levels before continuing. The 61.8% level ('golden ratio') is the most watched."),
        (["chart pattern", "technical analysis", "pattern"],
         "Key chart patterns to know: Head & Shoulders (reversal), Double Top/Bottom (reversal), Triangle (continuation or breakout), Wedge (reversal), and Flag/Pennant (continuation). Each gives estimated price targets based on the pattern's height. Always confirm with volume!"),

        # Portfolio & investing
        (["portfolio"],
         "Your TradeQuest portfolio is looking strong! It spans 4 asset classes — Stocks (42%), Crypto (24%), ETFs (20%), and Commodities (14%). Key tip: Regularly rebalance to maintain your target allocation, especially after big moves in volatile assets like crypto."),
        (["diversif"],
         "Diversification means spreading investments across different asset classes, sectors, and geographies to reduce risk. A well-diversified portfolio might include: stocks (growth), bonds (stability), REITs (income), commodities (inflation hedge), and crypto (high-risk/high-reward). Don't put all eggs in one basket!"),
        (["asset allocation"],
         "Asset allocation determines what percentage of your portfolio goes to each asset class. A common framework: Age-based (100 minus your age in stocks, rest in bonds), Risk-based (aggressive: 80% stocks/20% bonds, conservative: 40/60). Your allocation should match your risk tolerance and time horizon."),
        (["rebalancing", "rebalance"],
         "Rebalancing means adjusting your portfolio back to target allocations when assets drift. For example, if crypto surges and becomes 40% of your portfolio (target: 24%), sell some crypto and buy underweight assets. Rebalance quarterly or when any asset drifts 5%+ from target."),

        # Risk management
        (["risk", "risk management"],
         "Core risk management rules: 1) Never risk more than 1-2% of capital per trade, 2) Always use stop-losses, 3) Maintain a risk:reward ratio of at least 1:2, 4) Diversify across assets, 5) Size positions based on conviction level. Remember: preserving capital is more important than making profits!"),
        (["stop loss", "stop-loss", "stoploss"],
         "A stop-loss is an order to sell when price hits a certain level, limiting your loss. Types: Fixed stop (e.g., 5% below entry), Trailing stop (follows price up, locks in profits), ATR-based (based on volatility). Always set a stop-loss BEFORE entering any trade!"),
        (["position sizing", "position size"],
         "Position sizing determines how much capital to allocate per trade. The 1% rule: if your account is ₹10,00,000, risk max ₹10,000 per trade. Calculate: Position size = (Account × Risk%) / (Entry - Stop Loss). This ensures no single loss can seriously damage your portfolio."),
        (["sharpe ratio", "sharpe"],
         "The Sharpe Ratio measures risk-adjusted returns. It's calculated as (Portfolio Return - Risk-Free Rate) / Standard Deviation. A Sharpe above 1.0 is good, above 2.0 is excellent. It helps compare strategies — a lower return with less risk can be better than a higher return with extreme volatility."),
        (["drawdown", "max drawdown"],
         "Max Drawdown is the largest peak-to-trough decline in your portfolio, measuring the worst loss you could have experienced. Professional traders aim for max drawdown under 20%. If your strategy has a 50% drawdown, you need a 100% gain just to break even!"),

        # Market concepts
        (["bull", "bullish"],
         "A bull market is characterized by rising prices, optimism, and strong economic indicators. Bull markets typically see 20%+ gains from recent lows. Key strategies: ride the trend with trailing stops, add to winners, and stay invested. 'The trend is your friend until it bends!'"),
        (["bear", "bearish"],
         "A bear market is a decline of 20%+ from recent highs, driven by pessimism and economic weakness. Strategies: reduce positions, hedge with options/inverse ETFs, look for short opportunities, and build a watchlist for when sentiment turns. Cash is a position too!"),
        (["sentiment", "market mood"],
         "Market sentiment reflects the overall mood of investors. Tools: Fear & Greed Index, Put/Call ratio, VIX (volatility index). Currently, sentiment appears mixed — strong tech earnings vs. rate uncertainty. 'Be fearful when others are greedy, and greedy when others are fearful' — Warren Buffett."),
        (["volatility", "vix", "volatile"],
         "Volatility measures how much prices fluctuate. The VIX ('Fear Index') tracks expected S&P 500 volatility — above 25 = high fear, below 15 = complacency. High volatility = bigger opportunities AND risks. Adjust position sizes down when volatility spikes!"),
        (["inflation", "cpi"],
         "Inflation erodes purchasing power over time. Hedge with: real assets (real estate, commodities), TIPS (inflation-protected bonds), stocks with pricing power, and gold. CPI (Consumer Price Index) is the key inflation metric — rising CPI often means higher interest rates."),
        (["interest rate", "fed", "rate cut", "rate hike"],
         "Interest rates set by central banks affect all assets. Rate hikes strengthen the currency, hurt bonds/stocks (higher borrowing costs). Rate cuts do the opposite — they stimulate the economy and boost asset prices. Watch the Fed closely — their decisions move markets!"),

        # Trading strategies
        (["day trad", "intraday"],
         "Day trading involves buying and selling within the same day. Key rules: 1) Trade liquid instruments, 2) Set strict stop-losses, 3) Don't risk more than 1% per trade, 4) Focus on 2-3 setups max, 5) Keep a trading journal. Most day traders lose money — master paper trading first!"),
        (["swing trad"],
         "Swing trading captures moves over days to weeks. Look for stocks breaking out of consolidation patterns with strong volume. Use daily and 4-hour charts, set stops below support levels, and target 2-3x your risk. It's great for people who can't watch screens all day."),
        (["scalping"],
         "Scalping means making many small trades for tiny profits throughout the day. It requires fast execution, tight spreads, and strong discipline. Scalpers typically use 1-minute and 5-minute charts. It's the most stressful trading style — not recommended for beginners!"),
        (["paper trad", "simul", "virtual"],
         "Paper trading (like our Playground!) simulates real trading without risking actual money. Benefits: test strategies risk-free, learn order types, practice emotional control, and build confidence. Use it extensively before going live — treat virtual money as if it were real!"),

        # Crypto
        (["bitcoin", "btc", "crypto"],
         "Bitcoin is the largest cryptocurrency by market cap. Key facts: limited supply (21M coins), halving events reduce new supply every ~4 years, it's increasingly viewed as 'digital gold.' BTC tends to lead the crypto market — when BTC moves, altcoins follow. Never invest more than you can afford to lose in crypto."),
        (["ethereum", "eth"],
         "Ethereum is the leading smart contract platform. Unlike Bitcoin, ETH powers decentralized apps (dApps), DeFi, and NFTs. The move to Proof-of-Stake reduced energy use by 99%. Ethereum is often called 'the world computer' — it's the backbone of the decentralized internet."),

        # Behavioral finance
        (["fomo"],
         "FOMO (Fear Of Missing Out) drives impulsive buying at peaks. It's one of the most costly emotional biases in trading. Combat it by: having a pre-defined trading plan, setting entry criteria BEFORE a move, and remembering — there's ALWAYS another opportunity. Missing a trade beats losing money!"),
        (["emotion", "psychology", "bias"],
         "Trading psychology is crucial. Common biases: Overconfidence (overleveraging), Loss Aversion (holding losers too long), Confirmation Bias (ignoring contrary evidence), Anchoring (fixating on entry price), Recency Bias (extrapolating recent results). The best traders are emotionally disciplined."),

        # Specific terms
        (["p/e", "pe ratio", "price to earn"],
         "P/E (Price-to-Earnings) ratio tells you how much investors pay per dollar of earnings. A P/E of 20 means the stock trades at 20x earnings. Lower P/E = potentially undervalued; higher P/E = growth expectations priced in. Compare P/E within the same sector, not across industries."),
        (["dividend"],
         "Dividends are cash payments companies make to shareholders from profits. Dividend yield = annual dividend / share price. A good dividend stock has: consistent payout history, yield of 2-5%, low payout ratio (under 75%), and growing earnings. Great for long-term wealth building!"),
        (["etf", "index fund"],
         "ETFs (Exchange-Traded Funds) hold baskets of assets and trade like stocks. Popular ones: SPY (S&P 500), QQQ (Nasdaq 100), VTI (total US market). Benefits: instant diversification, low fees, easy to trade. Warren Buffett recommends index ETFs for most investors."),
        (["ipo"],
         "An IPO (Initial Public Offering) is when a private company first offers shares to the public. IPOs are often volatile — prices may spike on hype then drop. Tip: Avoid buying on day one. Wait for the lock-up period expiry (~180 days) when insiders can sell, which often causes price drops."),
        (["short sell", "shorting", "short"],
         "Short selling means selling borrowed shares, hoping to buy them back at a lower price. You profit when the price drops. Risk: unlimited loss potential if price surges (like GameStop). Short selling requires discipline, tight stop-losses, and should only be attempted by experienced traders."),
        (["leverage", "margin"],
         "Leverage amplifies both gains AND losses. With 5x leverage, a 10% move becomes 50%. Margin calls happen when losses eat your collateral. Rule: Never use more than 2-3x leverage, and always have a stop-loss. Leverage is the #1 reason retail traders blow up their accounts."),
        (["options", "call", "put"],
         "Options give you the RIGHT (not obligation) to buy (call) or sell (put) at a set price by a date. They're used for speculation, hedging, and income generation. Key greeks: Delta (direction), Theta (time decay), Vega (volatility). Options are powerful but complex — learn paper trading first!"),
    ]

    for keywords, response in responses:
        for keyword in keywords:
            if keyword in msg:
                return response

    # If nothing matches, give a contextual default based on message characteristics
    if "?" in msg:
        return "Great question! While I process that, here's a tip: the best traders combine technical analysis (chart patterns), fundamental analysis (company financials), and risk management (position sizing). Which of these areas would you like to dive deeper into?"
    elif len(msg.split()) <= 3:
        return "Hi there! I'm TradeQuest AI — I can help you with trading strategies, chart patterns, risk management, portfolio analysis, market concepts, and much more. Try asking me something like 'What is a stop-loss?' or 'Explain RSI' to get started!"
    else:
        return "Interesting topic! I'm most helpful with specific finance questions. Try asking about: candlestick patterns, risk management, portfolio diversification, moving averages, support & resistance, market sentiment, or trading psychology. What interests you most?"


def _fallback_learning_analysis():
    return [
        {"type": "strength", "title": "Strength: Chart Reading", "description": "You've shown strong pattern recognition in candlestick analysis. Keep practicing with advanced patterns."},
        {"type": "focus", "title": "Focus Area: Risk Management", "description": "Consider completing the risk management module — it's crucial for consistent trading performance."},
        {"type": "recommendation", "title": "Recommended Next", "description": "Start \"Behavioral Finance\" to understand the psychological aspects that affect your trading decisions."},
    ]


def _fallback_portfolio_analysis():
    return [
        {"title": "Diversification: Good", "description": "Your portfolio spans 4 asset classes with reasonable distribution. Consider adding fixed income for stability.", "color": "green"},
        {"title": "Risk: Moderate", "description": "24% crypto allocation adds volatility. Your Sharpe ratio of 1.4 is healthy but could improve with rebalancing.", "color": "yellow"},
        {"title": "Suggestion", "description": "Consider taking partial profits on BTC (+44% gain) and reallocating to index ETFs to reduce individual asset risk.", "color": "purple"},
    ]
