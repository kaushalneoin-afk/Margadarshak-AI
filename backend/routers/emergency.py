from fastapi import APIRouter, HTTPException
from datetime import datetime
from analytics_engine import TrafficAnalyticsEngine
from models import EmergencyRequest

router = APIRouter()
engine = TrafficAnalyticsEngine()
active_emergencies = []


@router.post("/api/emergency/corridor")
async def create_emergency_corridor(req: EmergencyRequest):
    try:
        clat = float(req.current_location.get("lat", 12.9352))
        clng = float(req.current_location.get("lng", 77.6245))
        dlat = float(req.destination.get("lat", 12.9716))
        dlng = float(req.destination.get("lng", 77.5946))
    except (TypeError, ValueError):
        raise HTTPException(400, "Invalid location coordinates")

    route = engine.calculate_emergency_route(clat, clng, dlat, dlng, req.traffic_density)
    density_map = {"low": "LOW", "medium": "MEDIUM", "high": "HIGH", "critical": "CRITICAL"}

    import uuid
    corridor_id = str(uuid.uuid4())[:8]
    response = {
        "corridor_id": corridor_id,
        "ambulance_id": req.ambulance_id,
        "status": "green_corridor_active",
        "timestamp": datetime.now().isoformat(),
        "route": route["route_points"],
        "total_distance_km": route["distance_km"],
        "estimated_normal_time_minutes": route["normal_time_minutes"],
        "estimated_corridor_time_minutes": route["corridor_time_minutes"],
        "time_saved_minutes": route["time_saved_minutes"],
        "time_saved_percentage": route["time_saved_percentage"],
        "traffic_density_at_dispatch": density_map.get(req.traffic_density, "UNKNOWN"),
        "signal_priority_plan": route["signal_priority"],
        "traffic_cleared_ahead": True,
        "alternate_routes_alerted": True,
        "eta_at_destination_minutes": route["corridor_time_minutes"],
    }

    active_emergencies.append({
        "corridor_id": corridor_id,
        "ambulance_id": req.ambulance_id,
        "status": "active",
        "created_at": datetime.now().isoformat(),
        "location": req.current_location,
        "destination": req.destination,
    })
    return response


@router.get("/api/emergency/active")
async def get_active_emergencies():
    return {
        "status": "success",
        "total_active": len(active_emergencies),
        "emergencies": active_emergencies[-10:] if active_emergencies else [],
    }
