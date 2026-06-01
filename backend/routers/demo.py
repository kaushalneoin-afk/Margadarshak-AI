from fastapi import APIRouter
from datetime import datetime
import random
import uuid

from simulation import TrafficSimulator
from utils import calculate_congestion_score, get_congestion_level, get_prediction_factors, calculate_confidence

router = APIRouter()
sim = TrafficSimulator()


@router.post("/api/demo/run")
async def run_demo():
    sequence_id = str(uuid.uuid4())[:8]
    base_time = datetime.now()

    step1 = sim._rush_hour_scenario(0.6)
    step1["step"] = 1
    step1["title"] = "Generating Traffic"
    step1["description"] = "Rush hour traffic flow initialized on all major corridors"
    step1["timestamp"] = base_time.isoformat()

    step2 = sim._city_congestion_scenario(0.5)
    step2["step"] = 2
    step2["title"] = "Increasing Density"
    step2["description"] = "Vehicle density increasing as more commuters enter the network"
    step2["timestamp"] = datetime.now().isoformat()

    step3 = sim._rush_hour_scenario(0.85)
    step3["step"] = 3
    step3["title"] = "Creating Congestion"
    step3["description"] = f"Critical congestion detected - {step3['vehicle_count']} vehicles at {step3['average_speed']} km/h"
    step3["timestamp"] = datetime.now().isoformat()

    step4_data = sim.generate_traffic_snapshot()
    step4 = {
        "step": 4,
        "title": "Triggering Accident",
        "description": "Multi-vehicle collision reported at MG Road - Church Street intersection",
        "accident_details": {
            "incident_id": f"ACC-{uuid.uuid4().hex[:6].upper()}",
            "location": {"lat": 12.9716, "lng": 77.5946, "road": "MG Road - Church Street Intersection"},
            "vehicles_involved": 3,
            "severity": "severe",
            "lanes_blocked": 2,
            "timestamp": datetime.now().isoformat(),
        },
        "impact": {
            "congestion_spike": f"+{random.randint(30, 50)}%",
            "affected_radius_km": round(random.uniform(1.0, 2.5), 2),
            "estimated_backlog_vehicles": random.randint(300, 800),
        },
        "timestamp": datetime.now().isoformat(),
    }

    step5 = {
        "step": 5,
        "title": "Dispatching Ambulance",
        "description": "Emergency services dispatched to accident location",
        "ambulance": {
            "ambulance_id": f"AMB-{random.randint(100, 999)}",
            "status": "dispatched",
            "current_location": {"lat": 12.9352, "lng": 77.6245},
            "destination": {"lat": 12.9716, "lng": 77.5946},
            "distance_km": round(random.uniform(3.5, 6.0), 2),
            "estimated_normal_time": random.randint(15, 25),
        },
        "timestamp": datetime.now().isoformat(),
    }

    vc = random.randint(600, 1000)
    sp = round(random.uniform(8, 18), 1)
    lo = round(random.uniform(60, 90), 1)
    cs = calculate_congestion_score(vc, sp, lo)
    level = get_congestion_level(cs)
    step6 = {
        "step": 6,
        "title": "Generating Green Corridor",
        "description": "Emergency corridor created - all signals along route preempted to green",
        "green_corridor": {
            "corridor_id": f"GC-{uuid.uuid4().hex[:6].upper()}",
            "route": [
                {"signal_id": 1, "action": "Preempted to GREEN", "location": "Koramangala Junction"},
                {"signal_id": 2, "action": "Preempted to GREEN", "location": "Sony World Junction"},
                {"signal_id": 3, "action": "Preempted to GREEN", "location": "MG Road Crossing"},
                {"signal_id": 4, "action": "Preempted to GREEN", "location": "Church Street Approach"},
            ],
            "time_saved_minutes": random.randint(8, 18),
            "time_saved_percentage": round(random.uniform(35, 60), 1),
            "traffic_cleared": True,
            "alternate_routes_alerted": True,
        },
        "timestamp": datetime.now().isoformat(),
    }

    factors = get_prediction_factors(vc, sp, lo, "high")
    conf = calculate_confidence(cs)
    time_horizons = ["15min", "30min", "60min"]
    predictions = []
    for th in time_horizons:
        wave = random.uniform(-0.12, 0.12)
        future_cs = min(100, max(0, cs + wave * 100))
        predictions.append({
            "time_horizon": th,
            "predicted_congestion_score": round(future_cs, 1),
            "predicted_congestion_level": get_congestion_level(future_cs),
            "confidence": round(calculate_confidence(future_cs, 0.85), 3),
        })
    step7 = {
        "step": 7,
        "title": "Running Prediction",
        "description": "AI prediction model analyzing current conditions and forecasting traffic evolution",
        "prediction": {
            "current_congestion_level": level,
            "congestion_score": cs,
            "confidence": conf,
            "predictions": predictions,
            "factors": factors,
        },
        "timestamp": datetime.now().isoformat(),
    }

    step8 = {
        "step": 8,
        "title": "Updating Dashboard",
        "description": "Real-time dashboard updated with latest metrics and visualizations",
        "dashboard_metrics": {
            "total_vehicles": vc,
            "congestion_index": cs,
            "average_speed": sp,
            "active_incidents": 3,
            "emergency_alerts": 1,
            "predicted_traffic_load": "high",
            "signal_status": "adaptive",
            "data_freshness_seconds": random.randint(1, 5),
        },
        "timestamp": datetime.now().isoformat(),
    }

    step9 = {
        "step": 9,
        "title": "Generating AI Explanation",
        "description": "AI provides comprehensive explanation of current traffic situation and decisions",
        "ai_explanation": {
            "summary": f"Network experiencing {level} congestion with {vc} vehicles. Accident at MG Road causing spillover congestion on 3 alternate routes.",
            "key_factors": [
                "Rush hour volume exceeds road capacity by 35%",
                "Accident blocking 2 lanes at critical intersection",
                "Limited alternate route capacity in affected area",
            ],
            "ai_confidence": "HIGH",
            "recommended_actions": [
                "Deploy traffic officers to MG Road intersection",
                "Activate dynamic signal timing on alternate routes",
                "Alert commuters via mobile apps and VMS boards",
            ],
        },
        "timestamp": datetime.now().isoformat(),
    }

    step10 = {
        "step": 10,
        "title": "Final Recommendations",
        "description": "AI-generated comprehensive recommendations for traffic management",
        "final_recommendations": [
            {
                "priority": "CRITICAL",
                "action": "Clear accident site and restore 2 blocked lanes",
                "responsible": "Traffic Police & Emergency Services",
                "timeline": "Immediate",
                "expected_impact": "Restore 50% capacity at intersection",
            },
            {
                "priority": "HIGH",
                "action": "Implement adaptive signal control on all affected corridors",
                "responsible": "Traffic Control Center",
                "timeline": "Within 5 minutes",
                "expected_impact": "15-20% improvement in traffic flow",
            },
            {
                "priority": "HIGH",
                "action": "Activate variable message signs for alternate route guidance",
                "responsible": "Traffic Management System",
                "timeline": "Within 2 minutes",
                "expected_impact": "Divert 30% traffic from affected area",
            },
            {
                "priority": "MEDIUM",
                "action": "Increase public transport frequency on affected routes",
                "responsible": "Transport Department",
                "timeline": "Within 15 minutes",
                "expected_impact": "Reduce private vehicle demand by 10%",
            },
            {
                "priority": "MEDIUM",
                "action": "Coordinate with ride-sharing apps to promote carpooling",
                "responsible": "Smart City Team",
                "timeline": "Within 30 minutes",
                "expected_impact": "5-8% reduction in vehicle count",
            },
            {
                "priority": "LOW",
                "action": "Analyze incident for long-term traffic pattern improvements",
                "responsible": "Data Analytics Team",
                "timeline": "Post-incident review",
                "expected_impact": "Preventive measures for future",
            },
        ],
        "timestamp": datetime.now().isoformat(),
    }

    return {
        "status": "success",
        "demo_id": sequence_id,
        "title": "AI Urban Traffic Digital Twin - Full Demonstration",
        "total_steps": 10,
        "duration_seconds": "simulated",
        "sequence": [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],
    }
