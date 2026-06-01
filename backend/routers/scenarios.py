from fastapi import APIRouter
from models import ScenarioRequest
from simulation import TrafficSimulator

router = APIRouter()
sim = TrafficSimulator()

SCENARIOS = {
    "normal": {
        "id": "normal",
        "name": "Normal Traffic Flow",
        "description": "Standard traffic conditions with typical vehicle density and flow",
        "difficulty": "easy",
        "parameters": {"vehicle_range": "200-500", "speed_range": "35-65 km/h"},
    },
    "rush_hour": {
        "id": "rush_hour",
        "name": "Rush Hour Peak",
        "description": "Peak hour traffic with high density, stop-and-go conditions",
        "difficulty": "medium",
        "parameters": {"vehicle_range": "700-1200", "speed_range": "8-20 km/h"},
    },
    "accident": {
        "id": "accident",
        "name": "Accident Response",
        "description": "Multi-vehicle accident scenario with lane blockages and emergency response",
        "difficulty": "hard",
        "parameters": {"vehicles_involved": "2-4", "lanes_blocked": "1-3"},
    },
    "emergency": {
        "id": "emergency",
        "name": "Emergency Corridor",
        "description": "Emergency vehicle dispatch requiring green corridor creation",
        "difficulty": "hard",
        "parameters": {"ambulances": "1-3", "priority_signals": "3-5"},
    },
    "city_congestion": {
        "id": "city_congestion",
        "name": "City-Wide Congestion",
        "description": "Gridlock scenario affecting major city arterials and intersections",
        "difficulty": "expert",
        "parameters": {"gridlock_index": "0.3-0.9", "affected_routes": "5-10"},
    },
}


@router.post("/api/scenario/run")
async def run_scenario(req: ScenarioRequest):
    if req.scenario_type not in SCENARIOS:
        return {"status": "error", "message": f"Unknown scenario: {req.scenario_type}"}
    data = sim.generate_scenario(req.scenario_type, req.intensity)
    return {
        "status": "success",
        "scenario": SCENARIOS[req.scenario_type],
        "intensity": req.intensity,
        "results": data,
    }


@router.get("/api/scenarios")
async def list_scenarios():
    return {
        "status": "success",
        "total_scenarios": len(SCENARIOS),
        "scenarios": list(SCENARIOS.values()),
    }
