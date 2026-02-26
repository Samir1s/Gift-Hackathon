from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


# ── Auth ──────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    email: str
    password: str
    name: str

class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    xp: int = 0
    level: int = 1
    streak: int = 0


# ── Learn ─────────────────────────────────────────────────────────────
class Lesson(BaseModel):
    id: int
    title: str
    completed: bool = False

class LearningModule(BaseModel):
    id: int
    title: str
    description: str
    difficulty: str
    lessons: int
    completed: int = 0
    xp: int
    icon: str

class ProgressDataPoint(BaseModel):
    day: str
    xp: int

class AIAnalysisItem(BaseModel):
    type: str
    title: str
    description: str
    color: str


# ── Playground ────────────────────────────────────────────────────────
class Scenario(BaseModel):
    id: str
    title: str
    asset: str
    difficulty: str
    xp: int
    description: str = ""
    actual_outcome: str = ""

class TradeRequest(BaseModel):
    order_type: str  # "buy" or "sell"
    quantity: int
    scenario_id: str

class TradeSession(BaseModel):
    id: str
    scenario_id: str
    balance: float
    position: Optional[dict] = None
    trades: list = []
    status: str = "active"

class CandlestickPoint(BaseModel):
    time: int
    open: float
    high: float
    low: float
    close: float


# ── Daily Updates ─────────────────────────────────────────────────────
class NewsArticle(BaseModel):
    id: int
    title: str
    source: str
    time: str
    category: str
    impact: str
    sentiment: str
    description: str
    url: str = ""

class Alert(BaseModel):
    id: int
    message: str
    severity: str
    time: str


# ── Portfolio ─────────────────────────────────────────────────────────
class Holding(BaseModel):
    name: str
    ticker: str
    qty: float
    avgPrice: float
    currentPrice: float
    dayChange: float

class AllocationItem(BaseModel):
    name: str
    value: float
    color: str

class PerformancePoint(BaseModel):
    month: str
    value: float

class PortfolioOverview(BaseModel):
    total_value: float
    daily_pnl: float
    total_pnl: float
    win_rate: float
    holdings: List[Holding]
    allocation: List[AllocationItem]
    performance: List[PerformancePoint]


# ── Chatbot ───────────────────────────────────────────────────────────
class ChatMessage(BaseModel):
    message: str
    context: str = "general"

class ChatResponse(BaseModel):
    role: str = "ai"
    content: str
