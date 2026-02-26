import uuid
import random
import time
from typing import Optional

# In-memory session storage
_sessions: dict = {}


def generate_candlestick_data(base_price: float = 45000, count: int = 101) -> list:
    data = []
    price = base_price
    now = int(time.time())
    for i in range(count, 0, -1):
        open_price = price + (random.random() - 0.5) * 500
        close_price = open_price + (random.random() - 0.5) * 800
        high = max(open_price, close_price) + random.random() * 300
        low = min(open_price, close_price) - random.random() * 300
        data.append({
            "time": now - i * 3600,
            "open": round(open_price, 2),
            "high": round(high, 2),
            "low": round(low, 2),
            "close": round(close_price, 2),
        })
        price = close_price
    return data


def create_session(scenario_id: str) -> dict:
    session_id = str(uuid.uuid4())[:8]
    session = {
        "id": session_id,
        "scenario_id": scenario_id,
        "balance": 1000000.0,
        "start_balance": 1000000.0,
        "position": None,
        "trades": [],
        "status": "active",
    }
    _sessions[session_id] = session
    return session


def get_session(session_id: str) -> Optional[dict]:
    return _sessions.get(session_id)


def execute_trade(session_id: str, order_type: str, quantity: int, scenario_id: str) -> dict:
    session = _sessions.get(session_id)
    if not session:
        session = create_session(scenario_id)

    price = 45000 + (random.random() - 0.5) * 2000
    cost = quantity * price

    trade_record = {
        "type": order_type.upper(),
        "quantity": quantity,
        "price": round(price, 2),
        "cost": round(cost, 2),
        "timestamp": int(time.time()),
    }

    if order_type == "buy" and cost <= session["balance"]:
        session["balance"] -= cost
        session["position"] = {
            "type": "LONG",
            "qty": quantity,
            "price": round(price, 2),
            "asset": scenario_id,
        }
        trade_record["status"] = "filled"
    elif order_type == "sell" and session["position"]:
        pos = session["position"]
        pnl = (price - pos["price"]) * pos["qty"]
        session["balance"] += pos["price"] * pos["qty"] + pnl
        trade_record["pnl"] = round(pnl, 2)
        trade_record["status"] = "filled"
        session["position"] = None
    else:
        trade_record["status"] = "rejected"

    session["trades"].append(trade_record)
    session["balance"] = round(session["balance"], 2)
    return session


def end_session(session_id: str) -> Optional[dict]:
    session = _sessions.get(session_id)
    if session:
        session["status"] = "ended"
        if session["position"]:
            price = 45000 + (random.random() - 0.5) * 2000
            pos = session["position"]
            pnl = (price - pos["price"]) * pos["qty"]
            session["balance"] += pos["price"] * pos["qty"] + pnl
            session["balance"] = round(session["balance"], 2)
            session["position"] = None
    return session
