from fastapi import APIRouter
from datetime import datetime
import random
import uuid

from models import EmergencyRequest
from utils import get_route_with_priority

router = APIRouter()
active_emergencies = []


@router.post("/api/emergency/corridor")
async def create_emergency_corridor(req: EmergencyRequest):
    route_data = get_route_with_priority(req.current_location, req.destination, req.traffic_density)
    response = {
        "corridor_id": str(uuid.uuid4())[:8],
        "ambulance_id": req.ambulance_id,
        "status": "green_corridor_active",
        "timestamp": datetime.now().isoformat(),
        "route": route_data["route"],
        "total_distance_km": route_data["total_distance_km"],
        "estimated_normal_time_minutes": route_data["estimated_normal_time"],
        "estimated_corridor_time_minutes": route_data["estimated_corridor_time"],
        "time_saved_minutes": route_data["time_saved_minutes"],
        "time_saved_percentage": route_data["time_saved_percentage"],
        "signal_priority_plan": route_data["signal_priority"],
        "traffic_cleared_ahead": True,
        "alternate_routes_alerted": True,
        "eta_at_destination": route_data["estimated_corridor_time"],
    }
    active_emergencies.append({
        "corridor_id": response["corridor_id"],
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
