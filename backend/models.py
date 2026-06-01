from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


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


class ManualAnalysisInput(BaseModel):
    vehicle_count: int = Field(..., ge=0, le=2000)
    average_speed: float = Field(..., ge=0, le=120)
    lane_occupancy: float = Field(..., ge=0, le=100)
    emergency_vehicle: bool = False
    accident_present: bool = False
    weather_condition: str = "clear"
    road_capacity: Optional[float] = None


class JudgeEvaluation(BaseModel):
    vehicle_count: int = Field(..., ge=0, le=2000)
    average_speed: float = Field(..., ge=0, le=120)
    lane_occupancy: float = Field(..., ge=0, le=100)
    emergency_vehicle: bool = False
    incident_status: str = "none"


class VideoDetectionResult(BaseModel):
    type: str
    confidence: float = Field(..., ge=0, le=1)
    bbox: List[float] = []
    lane: Optional[int] = None
    speed_estimate: Optional[float] = None


class ScenarioData(BaseModel):
    scenario_type: str
    intensity: float = 0.5
    custom_parameters: dict = {}
