from fastapi import APIRouter, HTTPException
from datetime import datetime
import random

from models import PredictionInput
from utils import (
    calculate_congestion_score,
    get_congestion_level,
    get_prediction_factors,
    calculate_confidence,
    generate_recommendations,
)

router = APIRouter()
prediction_history = []


@router.post("/api/predict")
async def predict_congestion(data: PredictionInput):
    cs = calculate_congestion_score(data.vehicle_count, data.average_speed, data.lane_occupancy)
    level = get_congestion_level(cs)
    factors = get_prediction_factors(
        data.vehicle_count, data.average_speed, data.lane_occupancy, data.historical_congestion
    )
    confidence = calculate_confidence(cs)
    time_horizons = ["15min", "30min", "60min"]
    predictions = []
    for th in time_horizons:
        horizon_hours = int(th.replace("min", "")) / 60.0
        wave = random.uniform(-0.12, 0.12)
        future_cs = min(100, max(0, cs + wave * 100))
        future_level = get_congestion_level(future_cs)
        predictions.append({
            "time_horizon": th,
            "predicted_congestion_score": round(future_cs, 1),
            "predicted_congestion_level": future_level,
            "confidence": round(calculate_confidence(future_cs, random.uniform(0.75, 0.95)), 3),
            "vehicle_count_estimate": int(data.vehicle_count * (1 + wave)),
        })
    recs = generate_recommendations(level, data.model_dump())
    response = {
        "status": "success",
        "timestamp": datetime.now().isoformat(),
        "current_analysis": {
            "congestion_score": cs,
            "congestion_level": level,
            "confidence": confidence,
        },
        "predictions": predictions,
        "factors": factors,
        "recommendations": recs,
    }
    prediction_history.append({
        "timestamp": datetime.now().isoformat(),
        "input": data.model_dump(),
        "output": response,
    })
    return response


@router.get("/api/predictions/history")
async def get_prediction_history(limit: int = 20):
    if limit < 1 or limit > 100:
        raise HTTPException(400, "Limit must be between 1 and 100")
    history = prediction_history[-limit:] if prediction_history else []
    return {
        "status": "success",
        "total": len(prediction_history),
        "returned": len(history),
        "predictions": history,
    }
