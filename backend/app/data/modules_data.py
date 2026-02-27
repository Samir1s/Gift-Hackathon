import json

MODULES = [
    {
        "id": 1,
        "title": "Market Reaction to News",
        "description": "Learn how markets respond to breaking news events",
        "difficulty": "Beginner",
        "lessons": 5,
        "completed": 0,
        "xp": 150,
        "icon": "📰",
        "lesson_content": [
            {
                "id": 1,
                "title": "Introduction to Financial News",
                "content": "Understanding market news is essential for anticipating price action.\n\n**Key Takeaways:**\n- News moves markets because it alters expectations of future macroeconomic conditions or company earnings.\n- Not all news is actionable; parsing out the noise from the signal is a vital skill.\n- Financial markets are forward-looking, meaning you trade on the 'expected' news, not the 'current' news. If Apple reports record profits but lowers its guidance, the stock will likely fall.\n- Start by following reputable sources like Reuters, Bloomberg, and The Wall Street Journal, but always filter breaking headlines through technical analysis.",
                "xp": 30
            },
            {
                "id": 2,
                "title": "Earnings Reports",
                "content": "Quarterly earnings reports are major catalysts that can cause immediate 5-20% swings in a company's stock price.\n\n**What to look for:**\n- **EPS (Earnings Per Share):** Did they beat analyst estimates?\n- **Revenue:** Top-line growth shows the company is selling more products or services.\n- **Forward Guidance:** This is the most crucial part. A company can crush current earnings, but if they say the next quarter looks weak, the stock will plummet. \n- **Operating Margins:** Are they making more profit per dollar of revenue?",
                "xp": 30
            },
            {
                "id": 3,
                "title": "Macroeconomic Indicators",
                "content": "Broad economic data affects the entire stock market, crypto, and forex.\n\n**The Big Three:**\n- **Federal Reserve Rates:** When rates go up, growth stocks (like tech) usually go down because future cash flows are worth less.\n- **CPI (Consumer Price Index):** Measures inflation. High inflation forces central banks to raise rates.\n- **NFP (Non-Farm Payrolls):** Measures job growth in the US. A booming job market sounds good, but it can lead to inflation and higher rates. Always watch for the 'bad news is good news' phenomena.",
                "xp": 30
            },
            {
                "id": 4,
                "title": "Geopolitical Events",
                "content": "Unexpected global events—like wars, elections, or trade disputes—can cause sudden, aggressive volatility.\n\n- These events usually cause 'flight to safety' behavior. Investors will sell risky assets like crypto and small-cap stocks and buy Gold, the US Dollar, or Treasury bonds.\n- Often, the initial panic reaction is overstated, creating a 'buy the dip' opportunity once the initial shock wears off.",
                "xp": 30
            },
            {
                "id": 5,
                "title": "Sentiment Analysis",
                "content": "Markets run on fear and greed. Quantifying this can give you an edge.\n\n- **Contrarian Trading:** When everyone is terrified (extreme fear), prices are usually artificially low. When everyone is euphoric (extreme greed), it's usually the top.\n- Tools like the VIX (Volatility Index) or the Fear & Greed Index can help you measure sentiment.",
                "xp": 30
            }
        ]
    },
    {
        "id": 2,
        "title": "Technical Analysis Basics",
        "description": "Master candlestick patterns and chart reading",
        "difficulty": "Beginner",
        "lessons": 8,
        "completed": 0,
        "xp": 200,
        "icon": "📊",
        "lesson_content": [
            {"id": 1, "title": "What are Candlesticks?", "content": "A candlestick shows the battle between buyers and sellers over a specific timeframe (e.g., 1 hour, 1 day).\n\n- **Body:** Shows the difference between the open and close price. A green body means the close was higher than the open (bullish). A red body means the close was lower (bearish).\n- **Wicks (Shadows):** Show the highest and lowest prices reached during that period. Long upper wicks indicate sellers stepped in to push the price down. Long lower wicks indicate buyers bought the dip in aggressively.\n- The context of *where* the candle appears on the chart is just as important as the candle itself.", "xp": 25},
            {"id": 2, "title": "Support and Resistance", "content": "Price has a memory. \n\n- **Support:** A price level where a downtrend tends to pause due to a concentration of demand (buying interest). Think of it as a 'floor'.\n- **Resistance:** A price level where an uptrend tends to pause due to a concentration of supply (selling interest). Think of it as a 'ceiling'.\n- Once resistance is broken, it often becomes support, and vice versa. Always look left on the chart to find these historical levels.", "xp": 25},
            {"id": 3, "title": "Trendlines", "content": "Trendlines connect structural higher-lows (in an uptrend) or lower-highs (in a downtrend).\n\n- An uptrend indicates buyers are in control, repeatedly buying at higher prices.\n- A downtrend indicates sellers are in control.\n- 'The trend is your friend until the end when it bends.' Don't fight the broader market structure.", "xp": 25},
            {"id": 4, "title": "Moving Averages", "content": "Moving averages (MAs) smooth out price action by calculating the average price over a set number of periods.\n\n- **SMA (Simple):** Average price over N periods.\n- **EMA (Exponential):** Gives more weight to recent prices, reacting faster to price changes.\n- The 20, 50, and 200 period MAs are widely watched. The 200-day MA is often considered the dividing line between a long-term bull or bear market.", "xp": 25},
            {"id": 5, "title": "RSI", "content": "The Relative Strength Index (RSI) is an oscillator that measures momentum on a scale of 0 to 100.\n\n- **Overbought (>70):** The asset may be due for a pullback.\n- **Oversold (<30):** The asset may be undervalued and due for a bounce.\n- Divergences (e.g., price makes a higher high, but RSI makes a lower high) can indicate an impending trend reversal.", "xp": 25},
            {"id": 6, "title": "MACD", "content": "Moving Average Convergence Divergence shows the relationship between two moving averages.\n\n- A MACD crossover (when the MACD line crosses above the signal line) is considered a bullish signal, and vice versa.\n- The histogram shows the distance between the two lines, representing momentum acceleration or deceleration.", "xp": 25},
            {"id": 7, "title": "Volume Analysis", "content": "Volume is the fuel that drives price movements.\n\n- Price moving up on *high volume* is a strong, convicted move.\n- Price moving up on *low volume* is weak and easily reversed.\n- A volume spike at the end of a long downtrend often signals capitulation—the last of the weak hands selling out to strong buyers.", "xp": 25},
            {"id": 8, "title": "Chart Patterns", "content": "Patterns represent repeating mass psychology.\n\n- **Bullish:** Flags, Pennants, Cup and Handle.\n- **Bearish:** Head and Shoulders, Bear Flags.\n- **Reversal:** Double Bottom (W), Double Top (M).\n- Never assume a pattern will play out; wait for a confirmed breakout with volume.", "xp": 25}
        ]
    },
    {
        "id": 3,
        "title": "Risk Management Strategies",
        "description": "Protect your portfolio with smart risk controls",
        "difficulty": "Intermediate",
        "lessons": 6,
        "completed": 0,
        "xp": 250,
        "icon": "🛡️",
        "lesson_content": [
            {"id": 1, "title": "The 1% Rule", "content": "Never risk more than 1% to 2% of your overall trading capital on a single trade.\n\nThink about it: If you have $10,000, risking 1% means you stand to lose $100 if the trade hits your stop loss. Even if you lose 10 trades in a row (which will happen), you still have 90% of your capital intact to fight another day. Capital preservation is priority #1.", "xp": 40},
            {"id": 2, "title": "Position Sizing", "content": "Your position size should be dynamic based on the width of your stop loss.\n\n- Formula: `Position Size = Risk Amount / (Entry Price - Stop Loss Price)`\n- If your stop loss is wider to accommodate high volatility, your position size must shrink to keep your dollar risk constant.", "xp": 40},
            {"id": 3, "title": "Stop-Loss Orders", "content": "A stop loss takes ego out of the equation. It forces you to admit you were wrong at a predefined level before the loss gets out of hand.\n\n- Place stops at structural invalidation points, not arbitrary percentages.\n- Moving your stop loss lower as price approaches it is the cardinal sin of trading.", "xp": 40},
            {"id": 4, "title": "Diversification", "content": "Don't put all your eggs in one basket. \n\n- Have exposure across different sectors (Tech, Healthcare, Energy).\n- Be aware of correlation. Buying 5 different tech stocks is not diversification; if the Nasdaq tanks, they will all tank.", "xp": 40},
            {"id": 5, "title": "Risk/Reward Ratio", "content": "You only need to be right 40% of the time if your winners are twice as big as your losers.\n\n- Aim for at least a 1:2 or 1:3 risk/reward ratio on every trade setup.\n- Example: Risking $100 to make $300. \n- Cutting winners short while letting losers run is the fastest way to blow an account.", "xp": 40},
            {"id": 6, "title": "Drawdown Management", "content": "Drawdowns are mathematically inevitable.\n\n- When you hit a losing streak, reduce your position sizes by half. Only size back up when you regain confidence and momentum.\n- Accept that missing a trade is better than forcing a bad trade. Cash is a perfectly valid position.", "xp": 50}
        ]
    },
    {
        "id": 4,
        "title": "Behavioral Finance",
        "description": "Understand psychological biases in trading",
        "difficulty": "Intermediate",
        "lessons": 7,
        "completed": 0,
        "xp": 300,
        "icon": "🧠",
        "lesson_content": [
            {"id": 1, "title": "FOMO", "content": "Fear Of Missing Out drives irrational buying at the absolute worst possible time.\n\nWhen a stock goes parabolic, inexperienced traders chase the green candles, terrified of missing the profits everyone else seems to be making. This is exactly when smart money is selling to them. If you miss a setup, let it go. There will always be another trade.", "xp": 40},
            {"id": 2, "title": "Loss Aversion", "content": "Studies show that the psychological pain of losing $100 is twice as intense as the joy of making $100.\n\nThis leads traders to hold onto massive losing positions ('it has to bounce eventually!') to avoid converting a paper loss into a real loss, while simultaneously taking small profits way too early to secure a 'win'. You must learn to take small, emotionless losses.", "xp": 40},
            {"id": 3, "title": "Confirmation Bias", "content": "Once a trader takes a position, they aggressively seek out information that validates their thesis while ignoring massive warning signs that they are wrong.\n\nIf you buy a stock, your immediate next step should be to ask yourself: 'What data would prove my thesis wrong?' If that data appears, act on it.", "xp": 40},
            {"id": 4, "title": "Overconfidence", "content": "A streak of winning trades often breeds arrogance.\n\nThe trader begins taking larger positions, breaking their 1% risk rule, and trading sub-optimal setups because they feel 'dialed in.' The market usually humbles them shortly after.", "xp": 40},
            {"id": 5, "title": "Anchoring", "content": "Relying heavily on past prices.\n\nJust because a stock used to be $200 and is now $20 doesn't mean it's 'cheap'. A stock can go from $20 to $0 just as easily as it went from $200 to $20. Value must be determined by fundamentals and present price action, not past glory.", "xp": 40},
            {"id": 6, "title": "Revenge Trading", "content": "Taking immediate, usually oversized trades right after taking a painful loss in an attempt to 'make it back' from the market.\n\nThe market does not owe you anything. Walk away from the screen after a bad loss.", "xp": 50},
            {"id": 7, "title": "Information Overload", "content": "More data doesn't mean better trades.\n\nStaring at 15 different indicators, reading 10 newsletters, and watching financial TV will cause paralysis by analysis. Keep your strategy simple and execute it flawlessly.", "xp": 50}
        ]
    },
    {
        "id": 5,
        "title": "AI vs Human Prediction",
        "description": "Compare AI models with human trading intuition",
        "difficulty": "Advanced",
        "lessons": 4,
        "completed": 0,
        "xp": 400,
        "icon": "🤖",
        "lesson_content": [
            {"id": 1, "title": "Algorithmic Trading Basics", "content": "Over 70% of US equity trading volume is automated by computers executing pre-programmed instructions. \n\nThey excel at execution speed, identifying statistical anomalies across thousands of assets instantly, and trading without emotional interference.", "xp": 100},
            {"id": 2, "title": "Machine Learning in Finance", "content": "Neural networks digest vast amounts of alt-data—satellite imagery of parking lots, natural language processing of Twitter sentiment, supply chain manifests—to predict corporate earnings before they are announced.\n\nHowever, machine learning models can overfit historical data and fail spectacularly during unprecedented 'black swan' events.", "xp": 100},
            {"id": 3, "title": "High-Frequency Trading", "content": "HFT firms spend billions to locate their servers micro-meters closer to the exchange to shave nanoseconds off execution times. \n\nThey profit largely by arbitrage or market-making, not directional bets. Retail traders cannot and should not compete on this timescale.", "xp": 100},
            {"id": 4, "title": "The Human Edge", "content": "Where do humans still win? \n\nContextual intuition. While algorithms are rigid, experienced discretionary traders excel at interpreting highly nuanced macroeconomic shifts, paradigm changes, and the mass psychology behind unprecedented events that have no historical parallel for algorithms to train on.", "xp": 100}
        ]
    },
    {
        "id": 6,
        "title": "Financial Terminology",
        "description": "Essential glossary for every trader",
        "difficulty": "Beginner",
        "lessons": 5,
        "completed": 0,
        "xp": 100,
        "icon": "📚",
        "lesson_content": [
            {"id": 1, "title": "Market Trends", "content": "**Bull Market:** An optimistic market making higher highs.\n**Bear Market:** A pessimistic market making lower lows.\n**Chop:** A sideways, range-bound market where neither buyers nor sellers have control.", "xp": 20},
            {"id": 2, "title": "Order Types", "content": "**Limit Order:** Buy/sell at a specified price or better.\n**Market Order:** Buy/sell immediately at the current best available price.\n**Stop Loss:** An order that triggers a market sale once a certain price is hit to prevent further losses.", "xp": 20},
            {"id": 3, "title": "Market Vehicles", "content": "**Equities (Stocks):** Ownership shares in a corporation.\n**ETFs:** Funds that track indexes like the S&P 500, trading like stocks.\n**Options:** Derivatives giving the right (not obligation) to buy or sell an asset at a set price.\n**Futures:** Contracts obligating the buyer to purchase an asset at a predetermined future price.", "xp": 20},
            {"id": 4, "title": "Liquidity & Volume", "content": "**Liquidity:** How easily an asset can be bought/sold without moving the price. Apple is highly liquid; a micro-cap penny stock is illiquid.\n**Volume:** The total number of shares traded during a given period.", "xp": 20},
            {"id": 5, "title": "The Greeks", "content": "Key terms for advanced options traders:\n**Delta:** How much the option price changes for a $1 change in the stock.\n**Theta:** The rate of time decay on the option premium.\n**Implied Volatility (IV):** The market's forecast of a likely movement in security pricing.", "xp": 20}
        ]
    }
]

# Provide candle-like data where low < open, close < high, etc.
# Time is represented as a unix timestamp or simple string, we will mock them sequentially.
PROGRESS_DATA = [
    {"time": "2026-02-21", "open": 0, "high": 150, "low": 0, "close": 120},
    {"time": "2026-02-22", "open": 120, "high": 300, "low": 100, "close": 250},
    {"time": "2026-02-23", "open": 250, "high": 270, "low": 150, "close": 180},
    {"time": "2026-02-24", "open": 180, "high": 450, "low": 180, "close": 420},
    {"time": "2026-02-25", "open": 420, "high": 480, "low": 350, "close": 380},
    {"time": "2026-02-26", "open": 380, "high": 550, "low": 360, "close": 500},
    {"time": "2026-02-27", "open": 500, "high": 700, "low": 490, "close": 650},
]
