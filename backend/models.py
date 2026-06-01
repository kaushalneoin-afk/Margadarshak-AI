from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TrafficData(BaseModel):
    vehicle_count: int
    average_speed: float
    lane_occupancy: float
    emergency_vehicle: bool = False
    incident_status: str = "none"
    timestamp: Optional[datetime] = None


class PredictionInput(BaseModel):
    vehicle_count: int
    average_speed: float
    lane_occupancy: float
    historical_congestion: str = "low"


class EmergencyRequest(BaseModel):
    ambulance_id: str
    current_location: dict
    destination: dict
    traffic_density: str = "medium"


class AccidentReport(BaseModel):
    location: dict
    vehicles_involved: int = 2
    lane_blocked: bool = True
    severity: str = "moderate"


class ScenarioRequest(BaseModel):
    scenario_type: str = "normal"
    intensity: float = 0.5


class AIQuery(BaseModel):
    query: str
    context: dict = {}


class VideoProcessResponse(BaseModel):
    vehicle_count: int
    vehicle_types: dict
    average_speed: float
    density: str
    congestion_score: float
    lane_occupancy: dict
    recommendations: list


class PredictionResponse(BaseModel):
    congestion_level: str
    confidence: float
    time_horizon: str
    factors: list
    recommendations: list
