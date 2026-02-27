import uuid
import random
import time
from typing import Optional

# In-memory session storage
_sessions: dict = {}

def get_scenario_params(scenario_id: str) -> dict:
    """Returns base_price, volatility, trend, event_candle, event_type based on scenario"""
    params = {
        'zero-day-vulnerability': {'base': 450, 'vol': 2, 'trend': 0.5, 'event': 60, 'type': 'crash'},
        'earnings-surprise-rally': {'base': 850, 'vol': 5, 'trend': 0, 'event': 80, 'type': 'gap-up'},
        'interest-rate-shock': {'base': 5100, 'vol': 15, 'trend': -2, 'event': 0, 'type': 'steady-drop'},
        'crypto-flash-crash': {'base': 60000, 'vol': 200, 'trend': 50, 'event': 50, 'type': 'flash-crash'},
        'oil-supply-disruption': {'base': 75, 'vol': 0.5, 'trend': 0.1, 'event': 40, 'type': 'spike-consolidate'},
    }
    return params.get(scenario_id, {'base': 45000, 'vol': 100, 'trend': 0, 'event': 0, 'type': 'random'})

def generate_candlestick_data(scenario_id: str = "default", count: int = 101) -> list:
    params = get_scenario_params(scenario_id)
    base_price = params['base']
    volatility = params['vol']
    trend = params['trend']
    event_candle = params['event']
    event_type = params['type']
    
    data = []
    current_price = base_price
    prices = []
    
    # Generate price path forward
    for i in range(count + 1):
        if event_type == 'crash' and i >= event_candle:
            current_price -= current_price * 0.05 + random.random() * (current_price * 0.02)
        elif event_type == 'gap-up' and i == event_candle:
            current_price += current_price * 0.15
        elif event_type == 'gap-up' and i > event_candle:
            current_price += current_price * 0.01 + random.random() * (current_price * 0.01)
        elif event_type == 'flash-crash' and i == event_candle:
            current_price -= current_price * 0.20
        elif event_type == 'flash-crash' and event_candle < i < event_candle + 20:
            current_price += current_price * 0.015
        elif event_type == 'spike-consolidate' and i == event_candle:
            current_price += current_price * 0.10
        elif event_type == 'spike-consolidate' and i > event_candle:
            current_price += (random.random() - 0.5) * volatility
        else:
            current_price += trend + (random.random() - 0.5) * volatility * 2
            
        current_price = max(0.01, current_price)
        prices.append(current_price)

    now = int(time.time())
    
    # Construct candles backward in time
    for j in range(count + 1):
        i_retro = count - j
        open_price = prices[j]
        close_price = prices[j + 1] if j + 1 < len(prices) else open_price + (random.random() - 0.5) * volatility
        
        if event_type == 'gap-up' and j == event_candle:
            close_price = open_price
            
        max_price = max(open_price, close_price)
        min_price = min(open_price, close_price)
        high = max_price + random.random() * volatility * 1.5
        low = max(0.01, min_price - random.random() * volatility * 1.5)

        data.append({
            "time": now - i_retro * 3600,
            "open": round(open_price, 2),
            "high": round(high, 2),
            "low": round(low, 2),
            "close": round(close_price, 2),
        })
        
    return data

def get_current_price(scenario_id: str) -> float:
    params = get_scenario_params(scenario_id)
    base_price = params['base']
    # Add a bit of realistic jitter to the current price
    jitter = (random.random() - 0.5) * (params['vol'] * 2)
    return max(0.01, round(base_price + jitter, 2))

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

    price = get_current_price(scenario_id)
    cost = quantity * price

    trade_record = {
        "type": order_type.upper(),
        "quantity": quantity,
        "price": price,
        "cost": round(cost, 2),
        "timestamp": int(time.time()),
    }

    if order_type == "buy" and cost <= session["balance"]:
        session["balance"] -= cost
        session["position"] = {
            "type": "LONG",
            "qty": quantity,
            "price": price,
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
            scenario_id = session.get("scenario_id", "default")
            price = get_current_price(scenario_id)
            pos = session["position"]
            pnl = (price - pos["price"]) * pos["qty"]
            session["balance"] += pos["price"] * pos["qty"] + pnl
            session["balance"] = round(session["balance"], 2)
            session["position"] = None
    return session
