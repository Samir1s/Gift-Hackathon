"""
LSTM Stock Market Prediction Service
Based on: https://www.kaggle.com/code/faressayah/stock-market-analysis-prediction-using-lstm

Provides stock price forecasting using LSTM neural networks (PyTorch) and
stock analysis (moving averages, daily returns, volatility).
"""

import numpy as np
import pandas as pd
import yfinance as yf
import torch
import torch.nn as nn
from datetime import datetime, timedelta
from sklearn.preprocessing import MinMaxScaler
import logging
import time

logger = logging.getLogger(__name__)

# ── In-memory cache ───────────────────────────────────────────────────
_prediction_cache: dict = {}
CACHE_TTL_SECONDS = 1800  # 30 minutes


def _is_cache_valid(key: str) -> bool:
    if key not in _prediction_cache:
        return False
    cached_time = _prediction_cache[key].get("_cached_at", 0)
    return (time.time() - cached_time) < CACHE_TTL_SECONDS


# ── PyTorch LSTM Model ────────────────────────────────────────────────
class LSTMModel(nn.Module):
    """2-layer LSTM model matching the Kaggle notebook architecture."""

    def __init__(self, input_size=1, hidden_size=50, num_layers=2, output_size=1):
        super(LSTMModel, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True, dropout=0.2)
        self.fc1 = nn.Linear(hidden_size, 25)
        self.fc2 = nn.Linear(25, output_size)

    def forward(self, x):
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size)
        out, _ = self.lstm(x, (h0, c0))
        out = self.fc1(out[:, -1, :])
        out = self.fc2(out)
        return out


# ── Data Fetching ─────────────────────────────────────────────────────
def _fetch_stock_data(ticker: str, period: str = "2y") -> pd.DataFrame:
    """Download historical stock data from Yahoo Finance."""
    try:
        stock = yf.Ticker(ticker)
        df = stock.history(period=period)
        if df.empty:
            raise ValueError(f"No data found for ticker: {ticker}")
        return df
    except Exception as e:
        logger.error(f"Error fetching data for {ticker}: {e}")
        raise


# ── LSTM Prediction ───────────────────────────────────────────────────
def predict_stock(ticker: str, days_ahead: int = 7) -> dict:
    """
    Predict future stock closing prices using an LSTM model (PyTorch).

    Based on the Kaggle notebook approach:
    1. Fetch 2 years of historical closing prices via yfinance
    2. Scale data with MinMaxScaler
    3. Build sequences with 60-day lookback window
    4. Construct & train a 2-layer LSTM model (50 units each)
    5. Predict closing prices for the next N days

    Returns dict with: ticker, current_price, predictions, train_score, currency
    """
    cache_key = f"predict_{ticker}_{days_ahead}"
    if _is_cache_valid(cache_key):
        return _prediction_cache[cache_key]

    try:
        # 1. Fetch data
        df = _fetch_stock_data(ticker)
        close_prices = df["Close"].values.reshape(-1, 1)
        current_price = float(df["Close"].iloc[-1])

        # Try to get currency info
        try:
            stock_info = yf.Ticker(ticker).info
            currency = stock_info.get("currency", "USD")
        except Exception:
            currency = "USD"

        # 2. Scale data
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(close_prices)

        # 3. Build sequences (60-day lookback)
        lookback = 60
        X_train, y_train = [], []

        for i in range(lookback, len(scaled_data)):
            X_train.append(scaled_data[i - lookback:i, 0])
            y_train.append(scaled_data[i, 0])

        X_train = np.array(X_train)
        y_train = np.array(y_train)

        # Convert to PyTorch tensors
        X_tensor = torch.FloatTensor(X_train).unsqueeze(-1)  # (samples, lookback, 1)
        y_tensor = torch.FloatTensor(y_train).unsqueeze(-1)  # (samples, 1)

        # 4. Build & train LSTM model
        model = LSTMModel(input_size=1, hidden_size=50, num_layers=2, output_size=1)
        criterion = nn.MSELoss()
        optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

        # Train (fewer epochs for speed — hackathon mode)
        model.train()
        epochs = 10
        batch_size = 32

        dataset = torch.utils.data.TensorDataset(X_tensor, y_tensor)
        dataloader = torch.utils.data.DataLoader(dataset, batch_size=batch_size, shuffle=False)

        for epoch in range(epochs):
            for batch_X, batch_y in dataloader:
                optimizer.zero_grad()
                outputs = model(batch_X)
                loss = criterion(outputs, batch_y)
                loss.backward()
                optimizer.step()

        # 5. Calculate training score (RMSE)
        model.eval()
        with torch.no_grad():
            train_predict = model(X_tensor).numpy()

        train_predict = scaler.inverse_transform(train_predict)
        y_train_actual = scaler.inverse_transform(y_train.reshape(-1, 1))
        rmse = float(np.sqrt(np.mean((train_predict - y_train_actual) ** 2)))

        # 6. Predict future days
        last_sequence = scaled_data[-lookback:]
        predictions = []

        model.eval()
        with torch.no_grad():
            for day in range(1, days_ahead + 1):
                input_seq = torch.FloatTensor(last_sequence).unsqueeze(0).unsqueeze(-1)  # (1, lookback, 1)
                # Fix shape if needed
                if input_seq.dim() == 4:
                    input_seq = input_seq.squeeze(-1).unsqueeze(-1)
                if input_seq.shape != (1, lookback, 1):
                    input_seq = input_seq.reshape(1, lookback, 1)

                predicted_scaled = model(input_seq).numpy()
                predicted_price = float(scaler.inverse_transform(predicted_scaled)[0, 0])

                future_date = datetime.now() + timedelta(days=day)
                predictions.append({
                    "day": day,
                    "date": future_date.strftime("%Y-%m-%d"),
                    "price": round(predicted_price, 2),
                })

                # Slide window forward
                new_entry = predicted_scaled[0, 0]
                last_sequence = np.append(last_sequence[1:], [[new_entry]], axis=0)

        # Calculate predicted change
        predicted_final = predictions[-1]["price"] if predictions else current_price
        change_pct = round(((predicted_final - current_price) / current_price) * 100, 2)
        trend = "bullish" if change_pct > 1 else ("bearish" if change_pct < -1 else "neutral")

        result = {
            "ticker": ticker,
            "current_price": round(current_price, 2),
            "currency": currency,
            "predictions": predictions,
            "change_pct": change_pct,
            "trend": trend,
            "train_rmse": round(rmse, 2),
            "model_info": {
                "type": "LSTM",
                "framework": "PyTorch",
                "layers": 2,
                "units": 50,
                "lookback_days": lookback,
                "training_samples": len(X_train),
            },
            "_cached_at": time.time(),
        }

        _prediction_cache[cache_key] = result
        return result

    except Exception as e:
        logger.error(f"LSTM prediction failed for {ticker}: {e}")
        raise


# ── Stock Analysis ────────────────────────────────────────────────────
def get_stock_analysis(ticker: str) -> dict:
    """
    Returns moving averages, daily returns, and volatility stats.
    Mirrors the analysis portion of the Kaggle notebook.
    """
    cache_key = f"analysis_{ticker}"
    if _is_cache_valid(cache_key):
        return _prediction_cache[cache_key]

    try:
        df = _fetch_stock_data(ticker, period="1y")

        # Moving averages (10, 20, 50 day)
        df["MA10"] = df["Close"].rolling(window=10).mean()
        df["MA20"] = df["Close"].rolling(window=20).mean()
        df["MA50"] = df["Close"].rolling(window=50).mean()

        # Daily returns
        df["Daily_Return"] = df["Close"].pct_change()

        # Current values
        latest = df.iloc[-1]
        current_price = float(latest["Close"])

        # Volatility (annualized std of daily returns)
        volatility = float(df["Daily_Return"].std() * np.sqrt(252) * 100)

        # Recent trend (last 20 days)
        recent_prices = df["Close"].tail(20).values
        trend_direction = "up" if recent_prices[-1] > recent_prices[0] else "down"
        trend_strength = abs(float((recent_prices[-1] - recent_prices[0]) / recent_prices[0] * 100))

        # Moving average signals
        ma_signal = "bullish"
        if not pd.isna(latest.get("MA10")) and not pd.isna(latest.get("MA50")):
            ma_signal = "bullish" if latest["MA10"] > latest["MA50"] else "bearish"

        # Price history for chart (last 90 days)
        chart_data = []
        for idx, row in df.tail(90).iterrows():
            chart_data.append({
                "date": idx.strftime("%Y-%m-%d"),
                "close": round(float(row["Close"]), 2),
                "ma10": round(float(row["MA10"]), 2) if not pd.isna(row["MA10"]) else None,
                "ma20": round(float(row["MA20"]), 2) if not pd.isna(row["MA20"]) else None,
                "ma50": round(float(row["MA50"]), 2) if not pd.isna(row["MA50"]) else None,
            })

        result = {
            "ticker": ticker,
            "current_price": round(current_price, 2),
            "moving_averages": {
                "ma10": round(float(latest["MA10"]), 2) if not pd.isna(latest["MA10"]) else None,
                "ma20": round(float(latest["MA20"]), 2) if not pd.isna(latest["MA20"]) else None,
                "ma50": round(float(latest["MA50"]), 2) if not pd.isna(latest["MA50"]) else None,
            },
            "volatility_annual_pct": round(volatility, 2),
            "avg_daily_return_pct": round(float(df["Daily_Return"].mean() * 100), 4),
            "trend": {
                "direction": trend_direction,
                "strength_pct": round(trend_strength, 2),
            },
            "ma_signal": ma_signal,
            "chart_data": chart_data,
            "_cached_at": time.time(),
        }

        _prediction_cache[cache_key] = result
        return result

    except Exception as e:
        logger.error(f"Stock analysis failed for {ticker}: {e}")
        raise


# ── Batch Prediction ──────────────────────────────────────────────────
def predict_batch(tickers: list, days_ahead: int = 7) -> list:
    """Predict for multiple tickers. Returns list of results (or error entries)."""
    results = []
    for ticker in tickers:
        try:
            result = predict_stock(ticker, days_ahead)
            results.append(result)
        except Exception as e:
            results.append({
                "ticker": ticker,
                "error": str(e),
            })
    return results
