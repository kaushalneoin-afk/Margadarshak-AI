from fastapi import APIRouter
from datetime import datetime
from analytics_engine import TrafficAnalyticsEngine
from simulation import TrafficSimulator

router = APIRouter()
sim = TrafficSimulator()
engine = TrafficAnalyticsEngine()


@router.post("/api/demo/run")
async def run_demo():
    sequence_id = "DEMO-" + str(hash(datetime.now()))[-6:]

    step1 = sim._rush_hour_scenario(0.6)
    vc1, sp1, lo1 = step1["vehicle_count"], step1["average_speed"], step1["lane_occupancy"]
    cs1 = engine.calculate_congestion_score(vc1, sp1, lo1)
    r1 = engine.generate_reasoning(vc1, sp1, lo1)
    step1["analysis"] = {"congestion_score": cs1, "congestion_level": r1["congestion_level"], "risk_score": r1["risk_score"]}
    step1["step"] = 1; step1["title"] = "Generating Traffic"; step1["description"] = f"Rush hour flow: {vc1} vehicles at {sp1} km/h"

    step2 = sim._city_congestion_scenario(0.5)
    vc2, sp2, lo2 = step2["vehicle_count"], step2["average_speed"], step2["lane_occupancy"]
    cs2 = engine.calculate_congestion_score(vc2, sp2, lo2)
    r2 = engine.generate_reasoning(vc2, sp2, lo2)
    step2["analysis"] = {"congestion_score": cs2, "congestion_level": r2["congestion_level"], "risk_score": r2["risk_score"]}
    step2["step"] = 2; step2["title"] = "Increasing Density"; step2["description"] = f"Density reaching {r2['vehicle_density']}%"

    step3 = sim._rush_hour_scenario(0.85)
    vc3, sp3, lo3 = step3["vehicle_count"], step3["average_speed"], step3["lane_occupancy"]
    cs3 = engine.calculate_congestion_score(vc3, sp3, lo3)
    r3 = engine.generate_reasoning(vc3, sp3, lo3)
    step3["analysis"] = {"congestion_score": cs3, "congestion_level": r3["congestion_level"], "risk_score": r3["risk_score"]}
    step3["step"] = 3; step3["title"] = "Creating Congestion"; step3["description"] = f"Critical: {vc3} vehicles at {sp3} km/h"

    vc4, sp4, lo4 = 650, 8, 85
    cs4 = engine.calculate_congestion_score(vc4, sp4, lo4)
    r4 = engine.generate_reasoning(vc4, sp4, lo4, accident=True)
    step4 = {"step": 4, "title": "Triggering Accident", "description": "Multi-vehicle collision at MG Road - Church Street",
             "analysis": {"congestion_score": cs4, "congestion_level": r4["congestion_level"], "risk_score": r4["risk_score"]},
             "recommendations": engine.generate_recommendations(vc4, sp4, lo4, accident=True)[:2]}

    route = engine.calculate_emergency_route(12.9352, 77.6245, 12.9716, 77.5946, "high")
    step5 = {"step": 5, "title": "Dispatching Ambulance", "description": f"Distance: {route['distance_km']} km, ETA with corridor: {route['corridor_time_minutes']} min",
             "route": route}

    cs6 = engine.calculate_congestion_score(800, 10, 90)
    level6 = engine.get_congestion_level(cs6)
    step6 = {"step": 6, "title": "Generating Green Corridor", "description": f"Time saved: {route['time_saved_minutes']} min ({route['time_saved_percentage']}%)",
             "corridor": {"time_saved_minutes": route["time_saved_minutes"], "time_saved_percentage": route["time_saved_percentage"]}}

    preds = engine.generate_predictions(vc3, sp3, lo3)
    step7 = {"step": 7, "title": "Running Prediction", "description": f"30-min: {preds['30min']['predicted_congestion']}/100 ({preds['30min']['confidence']}% confidence)",
             "predictions": preds}

    step8 = {"step": 8, "title": "Updating Dashboard", "description": f"Metrics: {vc1} vehicles, CS:{cs1}, Speed:{sp1} km/h",
             "metrics": {"vehicles": vc1, "congestion": cs1, "speed": sp1}}

    step9 = {"step": 9, "title": "Generating AI Explanation", "description": f"AI analysis complete: {r3['traffic_status_label']}",
             "explanation": r3["factors"][:3]}

    step10 = {"step": 10, "title": "Final Recommendations", "description": f"Top priority: {engine.generate_recommendations(vc3, sp3, lo3)[0]['action'] if engine.generate_recommendations(vc3, sp3, lo3) else 'None'}",
              "recommendations": engine.generate_recommendations(vc3, sp3, lo3)}

    return {
        "status": "success",
        "demo_id": sequence_id,
        "title": "Margadarshak AI - Full Demonstration",
        "total_steps": 10,
        "sequence": [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],
    }
