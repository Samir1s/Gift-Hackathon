from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
import asyncio
import logging

from app.services.prediction_service import predictor

router = APIRouter(prefix="/api/predictions", tags=["predictions"])
logger = logging.getLogger(__name__)


class PredictionResponse(BaseModel):
    ticker: str
    direction: str
    confidence: float
    confidence_bullish: int
    status: str
    features: dict
    raw_probs: Optional[dict] = None


class BatchPredictionRequest(BaseModel):
    tickers: List[str]


@router.get("/model-info")
async def get_model_info():
    """Get metadata about the trained ML model."""
    try:
        return predictor.get_model_info()
    except Exception as e:
        logger.error(f"Error getting model info: {e}")
        raise HTTPException(status_code=500, detail="Failed to get model info")


@router.post("/train")
async def force_train():
    """Trigger manual re-training of the prediction model (non-blocking)."""
    if predictor.is_training:
        return {"status": "Already training"}
    
    asyncio.create_task(predictor.train_model())
    return {"status": "Training started in background"}


@router.get("/{ticker}", response_model=PredictionResponse)
async def get_prediction(ticker: str):
    """Get a prediction for a single ticker."""
    try:
        result = await predictor.predict_direction(ticker)
        return result
    except Exception as e:
        logger.error(f"Error predicting {ticker}: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.post("/batch")
async def get_batch_predictions(req: BatchPredictionRequest):
    """Get predictions for multiple tickers at once."""
    try:
        results = await predictor.predict_batch(req.tickers)
        return results
    except Exception as e:
        logger.error(f"Error in batch prediction: {e}")
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")

