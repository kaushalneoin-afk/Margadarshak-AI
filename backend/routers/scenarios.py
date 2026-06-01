from fastapi import APIRouter
from datetime import datetime
from analytics_engine import TrafficAnalyticsEngine
from models import ScenarioRequest, ScenarioData

router = APIRouter()
engine = TrafficAnalyticsEngine()

SCENARIO_PARAMS = {
    "normal": {
        "id": "normal", "name": "Normal Traffic Flow",
        "description": "Standard traffic conditions with typical vehicle density and flow",
        "difficulty": "easy",
        "params": {"vehicles": (200, 400), "speed": (35, 55), "occupancy": (25, 45)},
    },
    "rush_hour": {
        "id": "rush_hour", "name": "Rush Hour Peak",
        "description": "Peak hour traffic with high density, stop-and-go conditions",
        "difficulty": "medium",
        "params": {"vehicles": (700, 1100), "speed": (8, 20), "occupancy": (65, 90)},
    },
    "accident": {
        "id": "accident", "name": "Accident Response",
        "description": "Multi-vehicle accident scenario with lane blockages",
        "difficulty": "hard",
        "params": {"vehicles": (500, 800), "speed": (5, 15), "occupancy": (70, 95)},
    },
    "emergency": {
        "id": "emergency", "name": "Emergency Corridor",
        "description": "Emergency vehicle dispatch requiring green corridor creation",
        "difficulty": "hard",
        "params": {"vehicles": (400, 650), "speed": (15, 30), "occupancy": (45, 70)},
    },
    "city_congestion": {
        "id": "city_congestion", "name": "City-Wide Congestion",
        "description": "Gridlock scenario affecting major city arterials",
        "difficulty": "expert",
        "params": {"vehicles": (900, 1300), "speed": (5, 12), "occupancy": (80, 98)},
    },
}


def run_scenario_analysis(scenario_type: str, intensity: float):
    import random
    params = SCENARIO_PARAMS.get(scenario_type, SCENARIO_PARAMS["normal"])
    p = params["params"]
    vc_range = p["vehicles"]
    sp_range = p["speed"]
    lo_range = p["occupancy"]

    vc = int(vc_range[0] + (vc_range[1] - vc_range[0]) * intensity + random.uniform(-20, 20))
    sp = round(sp_range[0] + (sp_range[1] - sp_range[0]) * (1 - intensity * 0.5) + random.uniform(-3, 3), 1)
    lo = round(lo_range[0] + (lo_range[1] - lo_range[0]) * intensity + random.uniform(-5, 5), 1)
    vc = max(10, vc); sp = max(3, sp); lo = max(5, min(100, lo))

    cs = engine.calculate_congestion_score(vc, sp, lo)
    level = engine.get_congestion_level(cs)
    density = engine.calculate_density(vc)
    risk = engine.calculate_risk_score(vc, sp, lo, scenario_type == "emergency", scenario_type == "accident")
    efficiency = engine.calculate_flow_efficiency(sp, lo)
    predictions = engine.generate_predictions(vc, sp, lo)
    recs = engine.generate_recommendations(vc, sp, lo, scenario_type == "emergency", scenario_type == "accident")
    reasoning = engine.generate_reasoning(vc, sp, lo, scenario_type == "emergency", scenario_type == "accident")

    return {
        "scenario": params["name"],
        "scenario_type": scenario_type,
        "intensity": intensity,
        "vehicle_count": vc,
        "average_speed": sp,
        "lane_occupancy": lo,
        "congestion_score": cs,
        "congestion_level": level,
        "vehicle_density": density,
        "risk_score": risk,
        "flow_efficiency": efficiency,
        "predictions": predictions,
        "recommendations": recs,
        "reasoning": reasoning["explanation"],
        "timestamp": datetime.now().isoformat(),
    }


@router.post("/api/scenario/run")
async def run_scenario(req: ScenarioRequest):
    if req.scenario_type not in SCENARIO_PARAMS:
        return {"status": "error", "message": f"Unknown scenario: {req.scenario_type}"}
    return {
        "status": "success",
        "results": run_scenario_analysis(req.scenario_type, req.intensity),
    }


@router.get("/api/scenarios")
async def list_scenarios():
    return {
        "status": "success",
        "total_scenarios": len(SCENARIO_PARAMS),
        "scenarios": [v for v in SCENARIO_PARAMS.values()],
    }
