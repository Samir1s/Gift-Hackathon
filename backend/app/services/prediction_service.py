import os
import json
import logging
import time
from typing import Dict, List, Any, Optional
from datetime import datetime
import asyncio

import pandas as pd
import numpy as np
import lightgbm as lgb
from ta.momentum import RSIIndicator
from ta.trend import MACD
from ta.volatility import BollingerBands

from app.services import market_data_service

logger = logging.getLogger(__name__)

# Model config
MODEL_VERSION = "1.0.0"
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "models")
MODEL_PATH = os.path.join(MODEL_DIR, f"price_trend_predictor_v{MODEL_VERSION}.txt")
FEATURE_NAMES = ["rsi", "macd", "macd_signal", "bb_b", "momentum_5d", "momentum_10d", "vol_ratio"]

# Setup model directory
os.makedirs(MODEL_DIR, exist_ok=True)

class PricePredictor:
    def __init__(self):
        self.model = None
        self.last_trained = None
        self.is_training = False
        
        # Load model if it exists
        if os.path.exists(MODEL_PATH):
            try:
                self.model = lgb.Booster(model_file=MODEL_PATH)
                self.last_trained = datetime.fromtimestamp(os.path.getmtime(MODEL_PATH)).isoformat()
                logger.info(f"Loaded existing model from {MODEL_PATH}")
            except Exception as e:
                logger.error(f"Failed to load existing model: {e}")

    async def ensure_model(self):
        """Train standard model on startup if one doesn't exist."""
        if self.model is None and not self.is_training:
            logger.info("No model found. Initiating on-the-fly training...")
            asyncio.create_task(self.train_model())

    def compute_features(self, ohlcv_data: List[Dict]) -> Optional[pd.DataFrame]:
        """
        Compute technical features from raw OHLCV list.
        Expects list of dicts: [{"time": ..., "open": ..., "high": ..., "low": ..., "close": ..., "volume": ...}]
        """
        if not ohlcv_data or len(ohlcv_data) < 20: 
            return None
            
        df = pd.DataFrame(ohlcv_data)
        
        # We need volume, handle if missing
        if 'volume' not in df.columns:
            df['volume'] = 1.0
            
        # Ensure chronological order
        df = df.sort_values('time').reset_index(drop=True)
        
        # Calculate features using 'ta' library
        # 1. RSI
        rsi_ind = RSIIndicator(close=df['close'], window=14)
        df['rsi'] = rsi_ind.rsi()
        
        # 2. MACD
        macd_ind = MACD(close=df['close'])
        df['macd'] = macd_ind.macd()
        df['macd_signal'] = macd_ind.macd_signal()
        
        # 3. Bollinger Bands
        bb_ind = BollingerBands(close=df['close'], window=20, window_dev=2)
        df['bb_b'] = bb_ind.bollinger_pband()
        
        # 4. Momentum (% change over looking back periods)
        df['momentum_5d'] = df['close'].pct_change(periods=5).fillna(0) * 100
        df['momentum_10d'] = df['close'].pct_change(periods=10).fillna(0) * 100
        
        # 5. Volume ratio (current volume vs 14-period SMA)
        df['vol_sma'] = df['volume'].rolling(window=14).mean()
        df['vol_ratio'] = (df['volume'] / df['vol_sma']).fillna(1.0)
        
        return df

    async def train_model(self):
        """
        Train the model using historical data fetched on-the-fly.
        """
        self.is_training = True
        logger.info("Starting model training on historical data...")
        
        try:
            target_tickers = ["bitcoin", "ethereum", "solana", "apple", "nvidia", "tesla"]
            all_data = []
            
            # 1. Fetch data
            for ticker in target_tickers:
                try:
                    # Note: We use coingecko mapping for crypto, fallback to yfinance for stocks conceptually
                    is_crypto = ticker in ["bitcoin", "ethereum", "solana"]
                    
                    if is_crypto:
                        raw_data = await market_data_service.get_crypto_historical_ohlc(ticker, days=90)
                        # CoinGecko OHLC is [time, open, high, low, close]. We append fake volume for simplicity
                        formatted_data = [
                            {"time": row[0], "open": row[1], "high": row[2], "low": row[3], "close": row[4], "volume": np.random.uniform(100, 1000)}
                            for row in raw_data
                        ]
                    else:
                        # Convert to stock ticker
                        sym_map = {"apple": "AAPL", "nvidia": "NVDA", "tesla": "TSLA"}
                        # Use a 90-day window
                        end_date = datetime.now().strftime('%Y-%m-%d')
                        # Simplistic backdate (about 90 days)
                        start_time = time.time() - (90 * 24 * 3600)
                        start_date = datetime.fromtimestamp(start_time).strftime('%Y-%m-%d')
                        raw_data = await market_data_service.get_historical_stock_ohlc(sym_map[ticker], start_date, end_date)
                        formatted_data = raw_data
                        
                    if formatted_data and len(formatted_data) > 30:
                        df = self.compute_features(formatted_data)
                        if df is not None:
                            # Create target: 1 (UP) if next period > 0.5% gain, -1 (DOWN) if < -0.5% drop, 0 (NEUTRAL) otherwise
                            # For crypto it's 4h data usually, for stocks daily. Adjust thresholds.
                            future_returns = df['close'].shift(-1) / df['close'] - 1
                            
                            conditions = [
                                future_returns > 0.005,
                                future_returns < -0.005
                            ]
                            choices = [1, -1] # 1=UP, -1=DOWN, 0=NEUTRAL
                            df['target'] = np.select(conditions, choices, default=0)
                            
                            # Drop NaNs
                            df = df.dropna()
                            all_data.append(df)
                            
                except Exception as e:
                    logger.warning(f"Error fetching training data for {ticker}: {e}")
                    
            # 2. Train model
            if not all_data:
                logger.error("No data available for training.")
                return
                
            combined_df = pd.concat(all_data, ignore_index=True)
            
            X = combined_df[FEATURE_NAMES]
            y = combined_df['target'] + 1  # Shift from [-1, 0, 1] to [0, 1, 2] for LightGBM multiclass
            
            train_data = lgb.Dataset(X, label=y)
            
            params = {
                'objective': 'multiclass',
                'num_class': 3, # DOWN(0), NEUTRAL(1), UP(2)
                'metric': 'multi_logloss',
                'verbosity': -1,
                'boosting_type': 'gbdt',
                'learning_rate': 0.05,
                'num_leaves': 31,
            }
            
            logger.info(f"Training on {len(X)} samples...")
            self.model = lgb.train(params, train_data, num_boost_round=100)
            
            # 3. Save model
            self.model.save_model(MODEL_PATH)
            self.last_trained = datetime.now().isoformat()
            logger.info("Model training complete and saved.")
            
        except Exception as e:
            logger.error(f"Error during training: {e}")
        finally:
            self.is_training = False

    async def predict_direction(self, ticker: str, ohlc_data: List[Dict] = None) -> Dict[str, Any]:
        """
        Predict the short-term direction for a ticker.
        If ohlc_data is not provided, tries to fetch it.
        """
        # Ensure model is training/trained
        if not self.model:
            await self.ensure_model()
            
        if ohlc_data is None:
            # Determine if crypto or stock heuristically
            if ticker.upper() in ["BTC", "ETH", "SOL", "DOGE", "ADA", "XRP", "AVAX", "DOT"]:
                # Map standard symbols to coingecko ids
                cg_map = {
                    "BTC": "bitcoin", "ETH": "ethereum", "SOL": "solana", "DOGE": "dogecoin",
                    "ADA": "cardano", "XRP": "ripple", "AVAX": "avalanche-2", "DOT": "polkadot"
                }
                coin_id = cg_map.get(ticker.upper(), ticker.lower())
                raw_data = await market_data_service.get_crypto_historical_ohlc(coin_id, days=14)
                if raw_data:
                    ohlc_data = [
                        {"time": row[0], "open": row[1], "high": row[2], "low": row[3], "close": row[4], "volume": np.random.uniform(100, 1000)}
                        for row in raw_data
                    ]
            else:
                end_date = datetime.now().strftime('%Y-%m-%d')
                start_time = time.time() - (30 * 24 * 3600)
                start_date = datetime.fromtimestamp(start_time).strftime('%Y-%m-%d')
                ohlc_data = await market_data_service.get_historical_stock_ohlc(ticker.upper(), start_date, end_date)

        if not ohlc_data or len(ohlc_data) < 20:
             return {
                "ticker": ticker,
                "direction": "NEUTRAL",
                "confidence": 0.5,
                "confidence_bullish": 50,
                "status": "INSUFFICIENT_DATA",
                "features": {}
            }

        df = self.compute_features(ohlc_data)
        if df is None or df.empty:
            return {
                "ticker": ticker,
                "direction": "NEUTRAL",
                "confidence": 0.5,
                "confidence_bullish": 50,
                "status": "PROCESSING_ERROR",
                "features": {}
            }
            
        latest_features = df[FEATURE_NAMES].iloc[-1:]
        feature_dict = latest_features.iloc[0].to_dict()
        
        # Round feature values for cleaner JSON
        for k, v in feature_dict.items():
            if pd.isna(v): feature_dict[k] = 0
            else: feature_dict[k] = round(float(v), 2)

        if not self.model:
            # Fallback if model not ready yet but we have features
            rsi = feature_dict.get('rsi', 50)
            is_bullish = rsi < 40 or feature_dict.get('momentum_5d', 0) > 2
            is_bearish = rsi > 70 or feature_dict.get('momentum_5d', 0) < -2
            
            return {
                "ticker": ticker,
                "direction": "UP" if is_bullish else ("DOWN" if is_bearish else "NEUTRAL"),
                "confidence": 0.6 if (is_bullish or is_bearish) else 0.5,
                "confidence_bullish": int(100 - rsi) if is_bullish else (int(rsi) if is_bearish else 50),
                "status": "HEURISTIC_FALLBACK",
                "features": feature_dict
            }
            
        # Predict using model
        try:
            probs = self.model.predict(latest_features)[0]  # [prob_down, prob_neutral, prob_up]
            
            # Map classes: 0=DOWN, 1=NEUTRAL, 2=UP
            pred_class = int(np.argmax(probs))
            confidence = float(np.max(probs))
            
            direction_map = {0: "DOWN", 1: "NEUTRAL", 2: "UP"}
            direction = direction_map[pred_class]
            
            # Confidence bullish is useful for sentiment integration
            # Scale from 0 (100% down) to 100 (100% up)
            conf_bullish = int((probs[2] + (probs[1] * 0.5)) * 100)
            
            return {
                "ticker": ticker,
                "direction": direction,
                "confidence": round(confidence, 2),
                "confidence_bullish": conf_bullish,
                "status": "OK",
                "features": feature_dict,
                "raw_probs": {
                    "down": round(float(probs[0]), 2),
                    "neutral": round(float(probs[1]), 2),
                    "up": round(float(probs[2]), 2),
                }
            }
        except Exception as e:
            logger.error(f"Prediction error: {e}")
            return {
                "ticker": ticker,
                "direction": "NEUTRAL",
                "confidence": 0.5,
                "confidence_bullish": 50,
                "status": f"ERROR: {str(e)}",
                "features": feature_dict
            }

    async def predict_batch(self, tickers: List[str]) -> Dict[str, Any]:
        """Predict multiple tickers concurrently."""
        tasks = [self.predict_direction(ticker) for ticker in tickers]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        output = {}
        for ticker, res in zip(tickers, results):
            if isinstance(res, Exception):
                output[ticker] = {
                    "ticker": ticker,
                    "direction": "NEUTRAL",
                    "confidence": 0.5,
                    "status": "ERROR"
                }
            else:
                output[ticker] = res
        return output

    def get_model_info(self) -> Dict[str, Any]:
        """Return model metadata."""
        if not self.model:
            return {"status": "training" if self.is_training else "uninitialized"}
            
        # Feature importances
        importances = {}
        try:
            imp_vals = self.model.feature_importance(importance_type='gain')
            for name, val in zip(FEATURE_NAMES, imp_vals):
                importances[name] = round(float(val), 2)
        except:
            pass
            
        return {
            "status": "ready",
            "version": MODEL_VERSION,
            "last_trained": self.last_trained,
            "features_used": FEATURE_NAMES,
            "feature_importance": importances
        }

# Singleton instance
predictor = PricePredictor()
