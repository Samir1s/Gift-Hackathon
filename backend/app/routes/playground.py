from fastapi import APIRouter
from app.data.scenarios_data import SCENARIOS
from app.services import trading_engine, gemini_service
from app.models.schemas import TradeRequest

router = APIRouter(prefix="/api/playground", tags=["playground"])


@router.get("/scenarios")
async def get_scenarios():
    return [
        {
            "id": s["id"],
            "title": s["title"],
            "asset": s["asset"],
            "difficulty": s["difficulty"],
            "xp": s["xp"],
            "description": s["description"],
        }
        for s in SCENARIOS
    ]


@router.post("/session/start")
async def start_session(scenario_id: str = "zero-day-vulnerability"):
    session = trading_engine.create_session(scenario_id)
    return session


@router.post("/session/{session_id}/trade")
async def execute_trade(session_id: str, req: TradeRequest):
    session = trading_engine.execute_trade(
        session_id, req.order_type, req.quantity, req.scenario_id
    )
    return session


@router.get("/session/{session_id}/status")
async def get_session_status(session_id: str):
    session = trading_engine.get_session(session_id)
    if not session:
        return {"error": "Session not found"}
    return session


@router.post("/session/{session_id}/end")
async def end_session(session_id: str):
    session = trading_engine.end_session(session_id)
    if not session:
        return {"error": "Session not found"}
    analysis = await gemini_service.analyze_trade(session)
    return {"session": session, "analysis": analysis}


@router.get("/chart-data")
async def get_chart_data(base_price: float = 45000):
    data = trading_engine.generate_candlestick_data(base_price)
    return data
