from fastapi import APIRouter
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/community", tags=["community"])

# --- In-Memory State ---
COMMUNITY_USERS = [
    { "id": 'u1', "name": 'AlphaHunter', "avatar": '🦅', "repScore": 2840, "accuracy": 91.2, "winStreak": 12, "dnaType": 'Disciplined Strategist', "tier": 'Master', "web3Verified": True },
    { "id": 'u2', "name": 'CryptoSage', "avatar": '🧙', "repScore": 2610, "accuracy": 88.5, "winStreak": 8, "dnaType": 'Calculated Risk-Taker', "tier": 'Master', "web3Verified": True },
    { "id": 'u3', "name": 'MarketWhisper', "avatar": '🐺', "repScore": 2350, "accuracy": 85.7, "winStreak": 6, "dnaType": 'Conservative Guardian', "tier": 'Expert', "web3Verified": True },
    { "id": 'u4', "name": 'TrendRider', "avatar": '🏄', "repScore": 2180, "accuracy": 82.3, "winStreak": 5, "dnaType": 'Momentum Chaser', "tier": 'Expert', "web3Verified": False },
    { "id": 'u5', "name": 'ValueSeeker', "avatar": '🔍', "repScore": 1920, "accuracy": 79.8, "winStreak": 4, "dnaType": 'Patient Accumulator', "tier": 'Expert', "web3Verified": True },
    { "id": 'u6', "name": 'RiskMatrix', "avatar": '🎯', "repScore": 1640, "accuracy": 76.1, "winStreak": 3, "dnaType": 'Aggressive Scalper', "tier": 'Intermediate', "web3Verified": False },
    { "id": 'u7', "name": 'QuietCapital', "avatar": '🦉', "repScore": 1450, "accuracy": 73.4, "winStreak": 2, "dnaType": 'Conservative Guardian', "tier": 'Intermediate', "web3Verified": False },
    { "id": 'u8', "name": 'BullishBear', "avatar": '🐻', "repScore": 1280, "accuracy": 70.9, "winStreak": 4, "dnaType": 'Contrarian', "tier": 'Intermediate', "web3Verified": False },
    { "id": 'u9', "name": 'ChartNinja', "avatar": '🥷', "repScore": 980, "accuracy": 67.2, "winStreak": 1, "dnaType": 'Technical Analyst', "tier": 'Beginner', "web3Verified": False },
    { "id": 'u10', "name": 'NewTrader42', "avatar": '🌱', "repScore": 420, "accuracy": 54.1, "winStreak": 0, "dnaType": 'Hype Chaser', "tier": 'Beginner', "web3Verified": False },
    { "id": 'u11', "name": 'MoonShot', "avatar": '🚀', "repScore": 310, "accuracy": 48.3, "winStreak": 0, "dnaType": 'Panic Seller', "tier": 'Beginner', "web3Verified": False },
    { "id": 'u12', "name": 'DiamondHands', "avatar": '💎', "repScore": 1750, "accuracy": 77.5, "winStreak": 3, "dnaType": 'Patient Accumulator', "tier": 'Intermediate', "web3Verified": True },
]

CHAT_MESSAGES = [
    { "id": 'm1', "userId": 'u1', "text": 'The Fed minutes confirm what I said last week — no cuts until Q3. Short-term bearish on SPY, but accumulating on dips below 5750.', "time": '2m ago', "type": 'insight', "isPinned": True },
    { "id": 'm2', "userId": 'u10', "text": 'BTC to the moon! 🚀🚀🚀 Everyone buying!!!', "time": '3m ago', "type": 'noise' },
    { "id": 'm3', "userId": 'u3', "text": 'NVDA RSI at 78 — overbought territory. I\'m trimming 15% of my position here. Will re-enter below $820.', "time": '5m ago', "type": 'insight' },
    { "id": 'm4', "userId": 'u11', "text": 'just yolo\'d my entire portfolio into BTC lol', "time": '6m ago', "type": 'noise' },
    { "id": 'rc1', "type": 'reality-check', "asset": 'BTC', "bubbleRisk": 78, "text": 'BTC chat sentiment is 92% bullish while RSI is at 81 (overbought). Historical pattern: when community bullishness exceeds 85% on overbought assets, a 10-15% correction follows within 2 weeks.', "dataPoints": ['RSI: 81 (Overbought)', 'Fear & Greed: 84 (Extreme Greed)', 'Funding Rate: 0.08% (Elevated)'] },
    { "id": 'm5', "userId": 'u2', "text": 'ETH merge upgrade is being underpriced by the market. Layer 2 transaction costs dropped 90% — this is the real bull case, not memes.', "time": '8m ago', "type": 'insight' },
    { "id": 'm6', "userId": 'u6', "text": 'Scalped TSLA for 2.3% today. In at $196, out at $200.50. Quick flip on the oversold bounce.', "time": '10m ago', "type": 'trade' },
    { "id": 'm7', "userId": 'u4', "text": 'Oil breaking out of the wedge pattern. XOM calls looking juicy for a swing trade to $115.', "time": '12m ago', "type": 'insight' },
    { "id": 'm8', "userId": 'u9', "text": 'Can someone explain what a golden cross means? Seeing it mentioned for AAPL.', "time": '14m ago', "type": 'question' },
    { "id": 'm9', "userId": 'u5', "text": 'JPM Q1 earnings in 3 weeks. Historically they beat by 8% on average. Accumulating shares below $195.', "time": '15m ago', "type": 'insight' },
    { "id": 'm10', "userId": 'u7', "text": 'Gold at ATH — I\'m not chasing. Waiting for a retest of $2,380 support before adding.', "time": '18m ago', "type": 'insight' },
    { "id": 'm11', "userId": 'u8', "text": 'Contrarian take: Everyone\'s bearish on TSLA which means it\'s probably bottoming. Adding small position here.', "time": '20m ago', "type": 'insight' },
    { "id": 'm12', "userId": 'u12', "text": 'Diamond-handing my BTC since $28K. Not selling until six figures. Conviction > emotion.', "time": '22m ago', "type": 'trade' },
]

ACTIVE_DEBATE = {
    "id": 'debate-1',
    "topic": 'Fed Rate Decision Impact on Markets',
    "triggerEvent": 'Federal Reserve holds rates steady at 4.25-4.50%',
    "status": 'LIVE',
    "participants": 47,
    "bullSide": {
        "leader": "u4",
        "argument": 'The market has already priced in "higher for longer." Any hint of a dovish pivot in the statement will trigger a massive relief rally. SPY has support at 5,700 and the dip will be bought aggressively.',
        "votes": 124,
        "dnaType": 'Momentum Chaser',
    },
    "bearSide": {
        "leader": "u3",
        "argument": 'Inflation is sticky at 2.8% and the Fed just killed rate-cut expectations. Credit spreads are widening and consumer spending is slowing. This is not a "buy-the-dip" setup — it\'s a "sell-the-rally" environment.',
        "votes": 156,
        "dnaType": 'Conservative Guardian',
    },
    "aiVerdict": {
        "lean": 'BEARISH',
        "confidence": 68,
        "reasoning": 'Historical data shows that when the Fed surprises hawkishly after the market has priced in cuts, follow-through selling occurs in 72% of cases over the subsequent 2-week period. However, the strong labor market provides a floor. Expect 3-5% drawdown before stabilization.',
    },
    "timeRemaining": '2h 14m',
}

ECHO_CHAMBER_DATA = {
    "overallBubbleRisk": 72,
    "trendingKeywords": [
        { "word": 'moon', "count": 89, "sentiment": 'extreme-bullish', "risk": 'HIGH' },
        { "word": 'buy the dip', "count": 67, "sentiment": 'bullish', "risk": 'MEDIUM' },
        { "word": 'diamond hands', "count": 54, "sentiment": 'extreme-bullish', "risk": 'HIGH' },
        { "word": 'recession', "count": 31, "sentiment": 'bearish', "risk": 'LOW' },
        { "word": 'hedge', "count": 18, "sentiment": 'neutral', "risk": 'LOW' },
    ],
    "assetBubbles": [
        { "ticker": 'BTC', "bubbleRisk": 78, "reason": '92% bullish sentiment with RSI at 81 — classic euphoria pattern' },
        { "ticker": 'XOM', "bubbleRisk": 61, "reason": 'Community ignoring falling demand signals despite bullish OPEC narrative' },
        { "ticker": 'ETH', "bubbleRisk": 45, "reason": 'Moderate bullish consensus backed by on-chain fundamentals' },
    ],
}

# --- Routes ---

from pydantic import BaseModel

class ChatMessage(BaseModel):
    text: str
    userId: str = "u10" # Default to NewTrader42 for demo

class VoteRequest(BaseModel):
    side: str # "bull" or "bear"

@router.get("/leaderboard")
async def get_leaderboard():
    return {"users": COMMUNITY_USERS}

@router.get("/chat")
async def get_chat():
    return {"messages": CHAT_MESSAGES}

@router.post("/chat")
async def send_chat_message(msg: ChatMessage):
    # Create simple new message payload
    # Add to front or back depending on UI render - data says oldest first natively, but real apps want latest?
    # Actually the messages array shows latest at Top (2m ago) down to bottom (22m ago)
    # We'll prepend to the list so it shows up first.
    
    new_msg = {
        "id": f"msg-{uuid.uuid4()}",
        "userId": msg.userId,
        "text": msg.text,
        "time": "Just now",
        "type": "insight" if len(msg.text) > 40 else "noise"
    }

    # Remove the 'just now' text of an old one theoretically, but keep it simple.
    CHAT_MESSAGES.insert(0, new_msg)
    return new_msg

@router.get("/debates/active")
async def get_active_debate():
    # Expand leader IDs before returning
    debate = dict(ACTIVE_DEBATE)
    
    bull_leader = next((u for u in COMMUNITY_USERS if u["id"] == debate["bullSide"]["leader"]), None)
    bear_leader = next((u for u in COMMUNITY_USERS if u["id"] == debate["bearSide"]["leader"]), None)

    return {
        **debate,
        "bullSide": { **debate["bullSide"], "leader": bull_leader },
        "bearSide": { **debate["bearSide"], "leader": bear_leader }
    }

@router.post("/debates/{debate_id}/vote")
async def vote_debate(debate_id: str, req: VoteRequest):
    if ACTIVE_DEBATE["id"] == debate_id:
        if req.side == "bull":
            ACTIVE_DEBATE["bullSide"]["votes"] += 1
        elif req.side == "bear":
            ACTIVE_DEBATE["bearSide"]["votes"] += 1
        ACTIVE_DEBATE["participants"] += 1
    
    return get_active_debate() # Returns expanded active debate

@router.get("/echo-chamber")
async def get_echo_chamber():
    return ECHO_CHAMBER_DATA
