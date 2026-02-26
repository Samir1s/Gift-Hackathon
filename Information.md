# TradeQuest - AI-Powered Finance Education & Investment Intelligence Platform

## 📋 Project Overview

**TradeQuest** is a gamified finance education platform that helps users learn about trading, market analysis, and investment strategies through interactive modules. The platform combines AI-powered analysis (Google Gemini), simulated trading environments, real-time market news, and personal portfolio tracking to make financial education engaging, practical, and accessible.

---

## 🧭 Application Flow

### Onboarding Flow
```
Onboard Page → Login Page → Main Page
```

1. **Onboard Page**: Welcome screen introducing TradeQuest's mission, key features overview, and a CTA to get started.
2. **Login Page**: Authentication via Supabase Auth (email/password, Google OAuth). New users are redirected to onboarding first.
3. **Main Page**: The central dashboard hub with navigation to the four core modules.

### Main Page Modules
The main page provides access to four primary sections:

| Module | Description |
|--------|-------------|
| **Learn** | AI-curated learning modules & lessons with progress graphs and analysis |
| **Playgrounds** | Simulated trading environment with limited fake currency |
| **Daily Updates** | Live market-impacting news with real-time alert system |
| **Portfolio** | Personal trading portfolio tracker and performance analytics |

---

## 🎯 Core Modules

### 1. 📚 Learn

AI-curated learning modules and lessons for finance education.

#### UI Layout
```
┌──────────────────────────────────────────────────────────────┐
│                         LEARN PAGE                           │
├─────────────────────────┬────────────────────────────────────┤
│                         │           Right Side (50%)         │
│    Left Side (50%)      │ ┌────────────────────────────────┐ │
│                         │ │     Graph/Chart Section (60%)  │ │
│   Learning Modules &    │ │  - Progress visualization      │ │
│   Lessons curated by    │ │  - Performance metrics          │ │
│   Gemini AI             │ │  - Learning analytics graphs    │ │
│                         │ ├────────────────────────────────┤ │
│   - Module cards        │ │   AI Analysis Section (40%)    │ │
│   - Lesson lists        │ │  - Gemini-powered analysis     │ │
│   - Progress indicators │ │  - Personalized insights       │ │
│   - Difficulty badges   │ │  - Recommendations             │ │
│                         │ └────────────────────────────────┘ │
└─────────────────────────┴────────────────────────────────────┘
```

- **Left Side (50%)**: Horizontally scrollable or list-based learning modules and lessons curated by Gemini AI. Includes module cards with titles, descriptions, difficulty levels, and progress indicators.
- **Right Side (50%)**: Vertically divided in a **3:2 ratio**:
  - **Top (60% — "3")**: Interactive graph/chart section — learning progress visualization, performance metrics, topic mastery graphs.
  - **Bottom (40% — "2")**: AI Analysis section — Gemini API provides personalized learning analysis, strengths/weaknesses assessment, and next-step recommendations.

#### Learn Features
- 7+ trading scenarios covering market events (cybersecurity breaches, earnings reports, interest rate changes, etc.)
- Difficulty levels: Beginner, Intermediate, Advanced
- XP rewards system for learning progression
- AI-curated lesson sequencing based on user performance
- Interactive candlestick chart analysis exercises

#### Learning Topics
- Market reaction to news events
- Technical analysis basics
- Risk management strategies
- Behavioral finance concepts
- AI vs human prediction comparison
- Financial terminology & glossary

---

### 2. 🎮 Playgrounds

A simulated trading environment where users practice trading with limited fake currency.

#### Features
- **Simulated Trading Engine**: Users start with a fixed amount of fake currency (e.g., ₹10,00,000 virtual)
- **Live-style Market Data**: Simulated real-time price movements using historical patterns
- **Trade Execution**: Buy/sell stocks, crypto, commodities, and forex with realistic order types (market, limit, stop-loss)
- **Gemini AI Analysis**: After each trading simulation session:
  - Post-trade analysis of decisions
  - Risk assessment of portfolio
  - Strategy recommendations
  - Comparison of user strategy vs optimal strategy
- **Performance Metrics**: Win rate, P&L, Sharpe ratio, max drawdown
- **Scenario-based Challenges**: Timed trading challenges with specific market conditions
- **Leaderboard**: Compare performance against other users

#### Playground Game Flow
1. User selects a trading scenario or free-trade mode
2. Simulated market opens with historical/generated price data
3. User executes trades (buy/sell) with fake currency balance
4. Market simulation runs with price movements
5. Session ends — Gemini AI provides comprehensive analysis
6. XP rewarded based on performance

---

### 3. 📰 Daily Updates

Live market news intelligence module powered by a News API with real-time alert mechanisms.

#### Features
- **Live News Feed**: Integration with a financial news API (e.g., NewsAPI, Alpha Vantage News, Finnhub) to fetch current/live news with the most impact on trading in real time.
- **Market Impact Scoring**: Each news item tagged with an impact severity score (Low / Medium / High / Critical)
- **Real-Time Alert System**:
  - Lightweight alert mechanism that monitors incoming news for major market-impacting events
  - Alerts generated and displayed within the platform in real time
  - Visual notification badges, toast notifications, and a dedicated alert panel
  - Configurable alert thresholds (user can set which severity levels trigger notifications)
- **AI News Analysis**: Gemini API provides:
  - Impact prediction on specific assets/sectors
  - Historical parallel analysis (similar past events and their outcomes)
  - Recommended actions for learners
- **News Categories**: Stocks, Crypto, Forex, Commodities, Macro Economics, Central Bank, Geopolitics
- **Ticker-wise Filtering**: Filter news by specific ticker symbols or asset classes
- **News Sentiment Indicator**: Bullish / Bearish / Neutral sentiment tags on each article

#### Alert Mechanism Architecture
```
News API → Event Detector → Impact Scorer → Alert Generator → UI Notification
                                                  ↓
                                          Gemini Analysis
                                          (Impact Prediction)
```

---

### 4. 💼 Portfolio

Personal trading portfolio tracker for the TradeQuest platform.

#### Features
- **Portfolio Dashboard**: Overview of all virtual holdings, total value, daily P&L, and all-time performance
- **Asset Allocation**: Visual pie/donut chart showing distribution across asset classes
- **Holdings Table**: Detailed list of all current positions with:
  - Asset name & ticker
  - Quantity held
  - Average buy price
  - Current price
  - Unrealized P&L (%)
  - Day change
- **Transaction History**: Complete log of all buy/sell trades with timestamps
- **Performance Charts**: Line charts showing portfolio value over time, benchmark comparison
- **AI Portfolio Review**: Gemini API provides:
  - Diversification analysis
  - Risk exposure assessment
  - Portfolio optimization suggestions
  - Sector/asset class breakdown analysis
- **Watchlist**: Track assets of interest before trading
- **Export**: Download portfolio reports as CSV/PDF

---

## 💬 Chatbot (Gemini AI Assistant)

A persistent chatbot popup card positioned at the **bottom-right corner** of every page.

### Features
- **Always Accessible**: Floating action button (FAB) in the bottom-right corner; expands to a chat card on click
- **Gemini API Powered**: Uses Google Gemini API for intelligent conversational responses
- **Context-Aware**: Understands which module the user is currently on and provides relevant help
- **Capabilities**:
  - Answer finance/trading questions
  - Explain chart patterns, indicators, and strategies
  - Provide learning recommendations
  - Help with playground trading decisions
  - Summarize daily news and market impact
  - Analyze portfolio performance on request
- **Chat UI**: Modern chat card with message bubbles, typing indicator, quick-reply suggestions
- **Persistent History**: Chat history maintained per session

### Chat Card UI
```
                              ┌─────────────────────┐
                              │  🤖 TradeQuest AI    │
                              │  ─────────────────── │
                              │                     │
                              │  [Chat messages]     │
                              │  ...                 │
                              │                     │
                              │  ┌─────────────────┐ │
                              │  │ Type a message..│ │
                              │  └─────────────────┘ │
                              └─────────────────────┘
                                                  📎 FAB
```

---

## 🏗️ Technical Stack

### Backend
```
- FastAPI 0.1.0
- Uvicorn (ASGI server)
- Pydantic & Pydantic Settings
- Google Generative AI SDK (Gemini API)
- Supabase Python client
- Python 3.12+
- News API client (requests/httpx)
```

### Frontend
```
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Lightweight Charts (trading charts)
- Recharts / Chart.js (analytics graphs)
```

### Database
```
- Supabase PostgreSQL
- Row-Level Security (RLS)
- Auth integration (email, Google OAuth)
- Real-time capabilities (alerts, live data)
```

### External APIs
```
- Google Gemini API (AI analysis, chatbot, lesson curation)
- News API (live financial news — NewsAPI / Finnhub / Alpha Vantage)
```

### DevOps & Tooling
```
- Git for version control
- Environment variables (.env files)
- ESLint for code quality
- npm for package management
```

---

## 📁 Project Structure

```
GIFT/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI entry point
│   │   ├── config.py                # Configuration management
│   │   ├── routes/
│   │   │   ├── learn.py             # Learn module endpoints
│   │   │   ├── playground.py        # Playground trading endpoints
│   │   │   ├── daily_updates.py     # Daily updates / news endpoints
│   │   │   ├── portfolio.py         # Portfolio endpoints
│   │   │   ├── chatbot.py           # Chatbot message endpoints
│   │   │   ├── auth.py              # Authentication endpoints
│   │   │   └── settings.py          # User settings
│   │   ├── services/
│   │   │   ├── gemini_service.py    # Gemini AI integration
│   │   │   ├── news_service.py      # News API integration
│   │   │   ├── trading_engine.py    # Simulated trading logic
│   │   │   └── alert_service.py     # Real-time alert generator
│   │   ├── models/
│   │   │   └── schemas.py           # Pydantic schemas
│   │   ├── data/
│   │   │   ├── mock_chart_data.py   # Mock chart data
│   │   │   ├── scenarios_data.py    # Trading scenarios
│   │   │   └── settings_data.py     # User settings persistence
│   ├── venv/
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx             # Onboard page (landing)
│   │   │   ├── login/page.tsx       # Login page
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx         # Main dashboard (hub)
│   │   │   │   ├── learn/page.tsx   # Learn module page
│   │   │   │   ├── playground/page.tsx  # Playground page
│   │   │   │   ├── daily-updates/page.tsx # Daily Updates page
│   │   │   │   └── portfolio/page.tsx    # Portfolio page
│   │   │   └── settings/page.tsx    # Settings page
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── DashboardLayout.tsx  # Main dashboard layout
│   │   │   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   │   │   └── Navbar.tsx           # Top navigation bar
│   │   │   ├── learn/
│   │   │   │   ├── LessonCard.tsx       # Individual lesson card
│   │   │   │   ├── ModuleList.tsx       # Module listing
│   │   │   │   ├── ProgressGraph.tsx    # Learning progress graph
│   │   │   │   └── AIAnalysis.tsx       # Gemini analysis panel
│   │   │   ├── playground/
│   │   │   │   ├── TradingSimulator.tsx # Simulated trading UI
│   │   │   │   ├── OrderPanel.tsx       # Buy/sell order panel
│   │   │   │   ├── CandlestickChart.tsx # Interactive chart
│   │   │   │   └── TradeResults.tsx     # Post-trade analysis
│   │   │   ├── daily-updates/
│   │   │   │   ├── NewsFeed.tsx         # Live news feed
│   │   │   │   ├── AlertPanel.tsx       # Real-time alert panel
│   │   │   │   ├── NewsCard.tsx         # Individual news card
│   │   │   │   └── ImpactBadge.tsx      # Impact severity badge
│   │   │   ├── portfolio/
│   │   │   │   ├── PortfolioDashboard.tsx  # Portfolio overview
│   │   │   │   ├── HoldingsTable.tsx       # Asset holdings table
│   │   │   │   ├── AllocationChart.tsx     # Asset allocation chart
│   │   │   │   └── PerformanceChart.tsx    # Performance over time
│   │   │   ├── chatbot/
│   │   │   │   ├── ChatbotFAB.tsx       # Floating action button
│   │   │   │   ├── ChatCard.tsx         # Chat popup card
│   │   │   │   └── ChatMessage.tsx      # Individual message bubble
│   │   │   ├── onboarding/
│   │   │   │   ├── OnboardHero.tsx      # Onboarding hero section
│   │   │   │   └── FeatureShowcase.tsx  # Feature highlights
│   │   │   └── shared/
│   │   │       ├── XPBadge.tsx          # XP display badge
│   │   │       └── DifficultyTag.tsx    # Difficulty level tag
│   │   ├── lib/
│   │   │   ├── api.ts               # API client
│   │   │   ├── supabase.ts          # Supabase client setup
│   │   │   └── utils.ts             # Utility functions
│   │   └── styles/
│   │       └── globals.css          # Global styles
│   ├── public/
│   ├── package.json
│   └── .env.local.example
│
├── supabase/
│   └── schema.sql                   # Database schema
│
├── Pictures/                        # Project images/logos
├── Information.md                   # Project documentation (this file)
└── Readme.md
```

---

## 🔧 API Endpoints

### Auth API (`/api/auth`)
- `POST /signup` — Register new user
- `POST /login` — User login
- `POST /logout` — User logout
- `GET /me` — Get current user profile

### Learn API (`/api/learn`)
- `GET /modules` — List all learning modules (AI-curated order)
- `GET /modules/{id}` — Get module details with lessons
- `GET /modules/{id}/lessons/{lesson_id}` — Get specific lesson content
- `POST /modules/{id}/lessons/{lesson_id}/complete` — Mark lesson complete
- `GET /progress` — Get user learning progress & analytics
- `POST /ai-analysis` — Get Gemini AI analysis of learning progress

### Playground API (`/api/playground`)
- `GET /scenarios` — List trading scenarios
- `POST /session/start` — Start a new trading session (allocate fake currency)
- `POST /session/{id}/trade` — Execute a trade (buy/sell)
- `GET /session/{id}/status` — Get current session status & portfolio
- `POST /session/{id}/end` — End session & trigger AI analysis
- `GET /session/{id}/analysis` — Get Gemini AI post-session analysis
- `GET /leaderboard` — Get playground leaderboard

### Daily Updates API (`/api/daily-updates`)
- `GET /news` — Get latest market-impacting news (via News API)
- `GET /news?category={category}` — Filter by category
- `GET /news?ticker={ticker}` — Filter by ticker symbol
- `GET /alerts` — Get current active alerts
- `POST /alerts/settings` — Configure alert thresholds
- `GET /alerts/history` — Get past alert history
- `POST /ai-analysis` — Get Gemini AI analysis of a news event

### Portfolio API (`/api/portfolio`)
- `GET /` — Get portfolio overview (holdings, total value, P&L)
- `GET /holdings` — Get detailed holdings list
- `GET /transactions` — Get transaction history
- `GET /performance` — Get performance chart data
- `GET /allocation` — Get asset allocation breakdown
- `POST /ai-review` — Get Gemini AI portfolio review
- `GET /watchlist` — Get watchlist
- `POST /watchlist` — Add asset to watchlist
- `DELETE /watchlist/{ticker}` — Remove from watchlist
- `GET /export` — Export portfolio report (CSV/PDF)

### Chatbot API (`/api/chatbot`)
- `POST /message` — Send message and get Gemini AI response
- `GET /history` — Get chat history for current session
- `DELETE /history` — Clear chat history

### Settings API (`/api/settings`)
- `GET /` — Get current user settings
- `PUT /` — Update user settings
- `POST /reset` — Reset user progress
- `POST /delete` — Delete user account

---

## 🤖 AI Integration (Google Gemini API)

Gemini AI powers multiple features across the platform:

| Feature | AI Capability |
|---------|--------------|
| **Learn — Lesson Curation** | Curates and sequences lessons based on user level & progress |
| **Learn — Analysis Panel** | Analyzes learning patterns, strengths, weaknesses, and recommendations |
| **Playground — Trade Analysis** | Post-simulation analysis of trading decisions and strategy evaluation |
| **Daily Updates — News Analysis** | Impact prediction on assets, historical parallels, recommended actions |
| **Portfolio — AI Review** | Diversification analysis, risk assessment, optimization suggestions |
| **Chatbot** | Context-aware conversational assistant across all modules |

---

## 📊 Database Schema

### Tables
1. **profiles** — User profiles with gamification data (XP, level, streak)
2. **learning_modules** — AI-curated learning modules & lessons catalog
3. **learning_progress** — User lesson completion, scores, and timestamps
4. **trading_sessions** — Playground session data (start balance, end balance, trades)
5. **trades** — Individual trade records within sessions
6. **portfolio_holdings** — User virtual portfolio holdings
7. **transactions** — Buy/sell transaction log
8. **watchlist** — User watchlist items
9. **alert_settings** — Per-user alert configuration
10. **chat_history** — Chatbot conversation logs

### Key Features
- Automatic profile creation on auth signup
- Row-level security policies for data isolation
- Relationships between tables (foreign keys)
- Indexes for performance on frequently queried columns
- Real-time subscriptions for alerts

---

## 📊 Available Trading Scenarios

| Slug | Title | Asset | Difficulty | Actual Outcome | XP Reward |
|------|-------|-------|------------|----------------|-----------|
| `zero-day-vulnerability` | The Zero-Day Vulnerability | CYBERFORT (CBFT) | Beginner | DOWN | 150 |
| `earnings-surprise-rally` | Earnings Surprise Rally | NVIDIA (NVDA) | Beginner | UP | 100 |
| `interest-rate-shock` | Interest Rate Shock | S&P 500 (SPY) | Intermediate | DOWN | 200 |
| `crypto-flash-crash` | Crypto Flash Crash | Bitcoin (BTC) | Advanced | DOWN | 350 |
| `oil-supply-disruption` | Oil Supply Disruption | Crude Oil (CL) | Intermediate | UP | 250 |
| `tech-ipo-frenzy` | Tech IPO Frenzy | AI Startup (AIUP) | Beginner | DOWN | 150 |
| `currency-war` | Currency War | EUR/USD | Advanced | DOWN | 400 |

---

## 🎨 Frontend Components Summary

### Layout Components
- **DashboardLayout** — Main authenticated layout with sidebar
- **Sidebar** — Navigation to Learn, Playgrounds, Daily Updates, Portfolio
- **Navbar** — Top bar with user info, XP, notifications

### Onboarding & Auth
- **OnboardHero** — Landing page hero section
- **FeatureShowcase** — Feature highlights carousel
- **LoginForm** — Authentication form

### Learn Components
- **ModuleList** — Learning modules grid/list
- **LessonCard** — Individual lesson with progress
- **ProgressGraph** — Recharts-based learning analytics
- **AIAnalysis** — Gemini analysis panel

### Playground Components
- **TradingSimulator** — Main trading interface
- **CandlestickChart** — Interactive Lightweight Charts
- **OrderPanel** — Buy/sell order form
- **TradeResults** — AI-powered post-trade analysis

### Daily Updates Components
- **NewsFeed** — Scrollable news list
- **NewsCard** — Individual article with impact badge
- **AlertPanel** — Real-time alert notifications
- **ImpactBadge** — Severity indicator (Low/Medium/High/Critical)

### Portfolio Components
- **PortfolioDashboard** — Overview with key metrics
- **HoldingsTable** — Sortable holdings table
- **AllocationChart** — Pie/donut asset allocation
- **PerformanceChart** — Line chart portfolio value over time

### Chatbot Components
- **ChatbotFAB** — Floating action button (bottom-right)
- **ChatCard** — Expandable chat popup card
- **ChatMessage** — Message bubble (user/AI)

---

## 🔐 Authentication & Security

### Auth Flow
- Supabase Auth with email/password + Google OAuth
- JWT-based session management
- Protected routes (dashboard pages require auth)
- Onboard → Login → Dashboard redirect flow

### Backend Security
- CORS restricted to frontend URL
- Environment variables for all sensitive keys
- Pydantic validation for all inputs
- HTTP error handling with proper status codes
- Rate limiting on AI endpoints

### Database Security
- Row-Level Security (RLS) policies
- User-specific data isolation
- Automatic profile creation on signup

---

## 📱 Environment Variables

### Backend (.env)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
NEWS_API_KEY=your-news-api-key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🚀 Setup & Installation

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys (Gemini, Supabase, News API)
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your API URL and Supabase keys
npm run dev
```

### Database Setup
1. Create a Supabase project
2. Run `supabase/schema.sql` in Supabase SQL Editor
3. Enable Row-Level Security on all tables
4. Configure environment variables with Supabase credentials

---

## 🎨 Design Philosophy

- **Engaging**: Game-like interface with Framer Motion animations
- **Educational**: Clear learning objectives, progress tracking, and AI feedback
- **Accessible**: Simple UI for finance beginners with progressive difficulty
- **Responsive**: Works on desktop and mobile
- **Premium**: Dark mode, glassmorphism, smooth gradients, micro-animations
- **Real-time**: Live news alerts, dynamic charts, instant AI responses

---

## 📈 Future Enhancements

- Multiplayer leaderboards & social trading
- Custom scenario creation by users
- Real market data integration (paper trading)
- Advanced charting tools (technical indicators)
- Mobile app version (React Native)
- Social sharing & achievement badges
- Tutorial/guided walkthrough mode
- Webhook integrations for external alerts

---

## 📋 License

Proprietary — GIFT Hackathon Project

---

**Last Updated**: February 2026
**Version**: 0.2.0
**Status**: Active Development