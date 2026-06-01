from fastapi import APIRouter
from datetime import datetime
from analytics_engine import TrafficAnalyticsEngine
from models import PredictionInput

router = APIRouter()
engine = TrafficAnalyticsEngine()
prediction_history = []


@router.post("/api/predict")
async def predict_congestion(data: PredictionInput):
    cs = engine.calculate_congestion_score(data.vehicle_count, data.average_speed, data.lane_occupancy)
    level = engine.get_congestion_level(cs)
    predictions = engine.generate_predictions(data.vehicle_count, data.average_speed, data.lane_occupancy)
    risk = engine.calculate_risk_score(data.vehicle_count, data.average_speed, data.lane_occupancy)
    efficiency = engine.calculate_flow_efficiency(data.average_speed, data.lane_occupancy)
    recs = engine.generate_recommendations(data.vehicle_count, data.average_speed, data.lane_occupancy)

    factors = []
    if data.vehicle_count > 600:
        factors.append({"name": "High vehicle density", "impact": "negative", "value": f"{data.vehicle_count} vehicles", "threshold": "600"})
    if data.average_speed < 20:
        factors.append({"name": "Critically slow traffic", "impact": "negative", "value": f"{data.average_speed} km/h", "threshold": "20 km/h"})
    if data.lane_occupancy > 70:
        factors.append({"name": "High lane occupancy", "impact": "negative", "value": f"{data.lane_occupancy}%", "threshold": "70%"})

    response = {
        "status": "success",
        "timestamp": datetime.now().isoformat(),
        "current_analysis": {
            "congestion_score": cs,
            "congestion_level": level,
            "risk_score": risk,
            "flow_efficiency": efficiency,
            "confidence": round(max(50, min(98, 95 - cs * 0.2)), 1),
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
        from fastapi import HTTPException; raise HTTPException(400, "Limit must be between 1 and 100")
    history = prediction_history[-limit:] if prediction_history else []
    return {"status": "success", "total": len(prediction_history), "returned": len(history), "predictions": history}
