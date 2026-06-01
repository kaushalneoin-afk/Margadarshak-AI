from fastapi import APIRouter
from datetime import datetime
import random
import uuid

from models import AccidentReport

router = APIRouter()
active_reports = []


@router.post("/api/accident/report")
async def report_accident(report: AccidentReport):
    severity_map = {"minor": 20, "moderate": 40, "severe": 65, "critical": 85}
    base_score = severity_map.get(report.severity, 40)
    impact_radius_km = round(0.5 + (base_score / 100) * 2.0, 2)
    recovery_minutes = {
        "minor": random.randint(15, 30),
        "moderate": random.randint(30, 60),
        "severe": random.randint(60, 120),
        "critical": random.randint(120, 240),
    }
    rec_time = recovery_minutes.get(report.severity, 45)
    diversions = [
        {
            "route": "Service Road A",
            "extra_time_minutes": random.randint(5, 15),
            "status": "recommended",
        },
        {
            "route": "Ring Road Bypass",
            "extra_time_minutes": random.randint(10, 25),
            "status": "available",
        },
    ]
    incident_id = f"ACC-{uuid.uuid4().hex[:6].upper()}"
    response = {
        "incident_id": incident_id,
        "status": "reported",
        "timestamp": datetime.now().isoformat(),
        "severity": report.severity,
        "severity_score": base_score,
        "location": report.location,
        "impact_zone": {
            "radius_km": impact_radius_km,
            "affected_roads": random.sample([
                "MG Road", "Brigade Road", "Church Street",
                "Indiranagar Main", "Koramangala Road",
            ], random.randint(2, 4)),
            "estimated_vehicles_affected": int(200 * impact_radius_km),
            "congestion_increase_percent": int(base_score * 0.8),
        },
        "recovery_estimate": {
            "clearance_time_minutes": rec_time,
            "traffic_normalization_minutes": rec_time + random.randint(15, 30),
            "estimated_clearance_time": datetime.now().isoformat(),
        },
        "diversion_suggestions": diversions,
        "lanes_blocked": report.lane_blocked,
        "vehicles_involved": report.vehicles_involved,
        "authorities_notified": ["Traffic Police", "Ambulance Services", "Tow Truck"],
    }
    active_reports.append({
        "incident_id": incident_id,
        "severity": report.severity,
        "location": report.location,
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
