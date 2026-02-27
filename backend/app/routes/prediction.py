from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List
from app.services import lstm_service

router = APIRouter(prefix="/api/prediction", tags=["prediction"])


class BatchRequest(BaseModel):
    tickers: List[str]
    days: int = 7


@router.get("/forecast")
async def get_forecast(
    ticker: str = Query(..., description="Stock ticker symbol, e.g. AAPL"),
    days: int = Query(7, ge=1, le=30, description="Days ahead to predict"),
):
    """Get LSTM-based stock price forecast for a given ticker."""
    try:
        result = lstm_service.predict_stock(ticker, days)
        # Remove internal cache key
        result.pop("_cached_at", None)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.get("/analysis")
async def get_analysis(
    ticker: str = Query(..., description="Stock ticker symbol, e.g. AAPL"),
):
    """Get stock analysis: moving averages, daily returns, volatility."""
    try:
        result = lstm_service.get_stock_analysis(ticker)
        result.pop("_cached_at", None)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/batch")
async def get_batch_forecast(req: BatchRequest):
    """Get LSTM forecasts for multiple tickers at once."""
    try:
        results = lstm_service.predict_batch(req.tickers, req.days)
        # Clean cache keys
        for r in results:
            r.pop("_cached_at", None)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")
