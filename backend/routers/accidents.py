from fastapi import APIRouter, HTTPException
from datetime import datetime
import random
from analytics_engine import TrafficAnalyticsEngine
from models import AccidentReport

router = APIRouter()
engine = TrafficAnalyticsEngine()
active_reports = []


@router.post("/api/accident/report")
async def report_accident(report: AccidentReport):
    vc = random.randint(200, 800)
    sp = round(random.uniform(5, 35), 1)
    lo = round(random.uniform(50, 95), 1)
    cs = engine.calculate_congestion_score(vc, sp, lo)
    level = engine.get_congestion_level(cs)
    risk = engine.calculate_risk_score(vc, sp, lo, accident=True)
    recs = engine.generate_recommendations(vc, sp, lo, accident=True)

    import uuid
    incident_id = f"ACC-{uuid.uuid4().hex[:6].upper()}"
    severity_scores = {"minor": 20, "moderate": 40, "severe": 65, "critical": 85}
    base_score = severity_scores.get(report.severity, 40)
    impact_radius = round(0.5 + (base_score / 100) * 2.0, 2)

    response = {
        "incident_id": incident_id,
        "status": "reported",
        "timestamp": datetime.now().isoformat(),
        "severity": report.severity,
        "severity_score": base_score,
        "location": report.location,
        "impact_zone": {
            "radius_km": impact_radius,
            "congestion_score": cs,
            "congestion_level": level,
            "risk_score": risk,
            "affected_roads": [
                "MG Road", "Brigade Road", "Church Street",
                "Indiranagar Main", "Koramangala Road",
            ][:random.randint(2, 4)],
        },
        "recovery_estimate": {
            "clearance_time_minutes": {"minor": 20, "moderate": 45, "severe": 90, "critical": 180}.get(report.severity, 45),
            "traffic_normalization_minutes": {"minor": 35, "moderate": 70, "severe": 130, "critical": 240}.get(report.severity, 70),
        },
        "recommendations": recs[:2],
        "lanes_blocked": report.lane_blocked,
        "vehicles_involved": report.vehicles_involved,
        "authorities_notified": ["Traffic Police", "Ambulance Services", "Tow Truck"],
    }
    active_reports.append({
        "incident_id": incident_id,
        "severity": report.severity,
        "status": "active",
        "reported_at": datetime.now().isoformat(),
    })
    return response


@router.get("/api/accidents/active")
async def get_active_accidents():
    return {
        "status": "success",
        "total_active": len(active_reports),
        "incidents": active_reports[-20:] if active_reports else [],
    }
