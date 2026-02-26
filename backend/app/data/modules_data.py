import json

MODULES = [
    {
        "id": 1,
        "title": "Market Reaction to News",
        "description": "Learn how markets respond to breaking news events",
        "difficulty": "Beginner",
        "lessons": 5,
        "completed": 3,
        "xp": 150,
        "icon": "📰",
        "lesson_content": [
            {"id": 1, "title": "Introduction to Financial News", "content": "Understanding market news is essential. \n\n**Key Takeaways:**\n- News moves markets.\n- Not all news is actionable.", "xp": 30},
            {"id": 2, "title": "Earnings Reports", "content": "Quarterly earnings reports are major catalysts. Look for EPS and Revenue beats.", "xp": 30},
            {"id": 3, "title": "Macroeconomic Indicators", "content": "GDP, CPI, and Interest Rates affect broad market sentiment.", "xp": 30},
            {"id": 4, "title": "Geopolitical Events", "content": "Unexpected global events can cause sudden volatility.", "xp": 30},
            {"id": 5, "title": "Sentiment Analysis", "content": "Using AI and data to gauge market reaction.", "xp": 30}
        ]
    },
    {
        "id": 2,
        "title": "Technical Analysis Basics",
        "description": "Master candlestick patterns and chart reading",
        "difficulty": "Beginner",
        "lessons": 8,
        "completed": 5,
        "xp": 200,
        "icon": "📊",
        "lesson_content": [
            {"id": 1, "title": "What are Candlesticks?", "content": "Candlesticks show open, high, low, and close prices for a time period.", "xp": 25},
            {"id": 2, "title": "Support and Resistance", "content": "Key levels where price tends to bounce or break.", "xp": 25},
            {"id": 3, "title": "Trendlines", "content": "Drawing lines to identify the overall direction.", "xp": 25},
            {"id": 4, "title": "Moving Averages", "content": "Smoothing price data to identify trends.", "xp": 25},
            {"id": 5, "title": "RSI", "content": "Relative Strength Index measures momentum.", "xp": 25},
            {"id": 6, "title": "MACD", "content": "Moving Average Convergence Divergence shows trend momentum.", "xp": 25},
            {"id": 7, "title": "Volume Analysis", "content": "Volume confirms price movements.", "xp": 25},
            {"id": 8, "title": "Chart Patterns", "content": "Head and shoulders, double tops, and triangles.", "xp": 25}
        ]
    },
    {
        "id": 3,
        "title": "Risk Management Strategies",
        "description": "Protect your portfolio with smart risk controls",
        "difficulty": "Intermediate",
        "lessons": 6,
        "completed": 2,
        "xp": 250,
        "icon": "🛡️",
        "lesson_content": [
            {"id": 1, "title": "The 1% Rule", "content": "Never risk more than 1% of your account on a single trade.", "xp": 40},
            {"id": 2, "title": "Position Sizing", "content": "Calculating how many shares to buy based on risk.", "xp": 40},
            {"id": 3, "title": "Stop-Loss Orders", "content": "Automating your risk management.", "xp": 40},
            {"id": 4, "title": "Diversification", "content": "Spreading risk across different assets.", "xp": 40},
            {"id": 5, "title": "Risk/Reward Ratio", "content": "Aiming for at least a 1:2 risk/reward setup.", "xp": 40},
            {"id": 6, "title": "Drawdown Management", "content": "Handling losing streaks intellectually.", "xp": 50}
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
            {"id": 1, "title": "FOMO", "content": "Fear Of Missing Out drives irrational buying.", "xp": 40},
            {"id": 2, "title": "Loss Aversion", "content": "The pain of losing is psychologically twice as powerful as the pleasure of gaining.", "xp": 40},
            {"id": 3, "title": "Confirmation Bias", "content": "Seeking information that confirms your existing beliefs.", "xp": 40},
            {"id": 4, "title": "Overconfidence", "content": "Believing you know more than the market.", "xp": 40},
            {"id": 5, "title": "Anchoring", "content": "Relying too heavily on the first piece of information.", "xp": 40},
            {"id": 6, "title": "Herd Mentality", "content": "Following the crowd blindly.", "xp": 50},
            {"id": 7, "title": "Emotional Discipline", "content": "Strategies to stay objective.", "xp": 50}
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
            {"id": 1, "title": "Algorithmic Trading Basics", "content": "How computers process market data.", "xp": 100},
            {"id": 2, "title": "Machine Learning in Finance", "content": "Predictive models and neural networks.", "xp": 100},
            {"id": 3, "title": "High-Frequency Trading", "content": "Microseconds matter.", "xp": 100},
            {"id": 4, "title": "The Human Advantage", "content": "Where intuition and experience beat algorithms.", "xp": 100}
        ]
    },
    {
        "id": 6,
        "title": "Financial Terminology",
        "description": "Essential glossary for every trader",
        "difficulty": "Beginner",
        "lessons": 10,
        "completed": 10,
        "xp": 100,
        "icon": "📚",
        "lesson_content": [
            {"id": 1, "title": "Bull vs Bear Market", "content": "Upward vs downward trending markets.", "xp": 10},
            {"id": 2, "title": "Bid and Ask", "content": "The price buyers are willing to pay vs sellers willing to accept.", "xp": 10},
            {"id": 3, "title": "Dividends", "content": "Company profits distributed to shareholders.", "xp": 10},
            {"id": 4, "title": "ETF", "content": "Exchange Traded Funds: A basket of securities.", "xp": 10},
            {"id": 5, "title": "Blue Chip Stocks", "content": "Large, well-established, and financially sound companies.", "xp": 10},
            {"id": 6, "title": "Short Selling", "content": "Betting that a stock will go down.", "xp": 10},
            {"id": 7, "title": "Liquidity", "content": "How easily an asset can be bought or sold.", "xp": 10},
            {"id": 8, "title": "Volatility", "content": "The rate at which the price of an asset increases or decreases.", "xp": 10},
            {"id": 9, "title": "Margin", "content": "Borrowing money from a broker to purchase stock.", "xp": 10},
            {"id": 10, "title": "Market Capitalization", "content": "The total dollar market value of a companys outstanding shares.", "xp": 10}
        ]
    }
]

PROGRESS_DATA = [
    {"day": "Mon", "xp": 120},
    {"day": "Tue", "xp": 250},
    {"day": "Wed", "xp": 180},
    {"day": "Thu", "xp": 420},
    {"day": "Fri", "xp": 380},
    {"day": "Sat", "xp": 500},
    {"day": "Sun", "xp": 650},
]
