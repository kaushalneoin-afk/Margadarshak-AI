from fastapi import APIRouter, UploadFile, File, HTTPException
from datetime import datetime
import random

from models import TrafficData
from simulation import TrafficSimulator
from utils import calculate_congestion_score, get_congestion_level, generate_recommendations

router = APIRouter()
sim = TrafficSimulator()


@router.post("/api/video/upload")
async def upload_video(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.mp4', '.avi', '.mov', '.mkv', '.webm')):
        raise HTTPException(400, "Invalid video format. Supported: mp4, avi, mov, mkv, webm")
    await file.read()
    total_count = random.randint(15, 80)
    cars = int(total_count * random.uniform(0.50, 0.65))
    bikes = int(total_count * random.uniform(0.10, 0.20))
    buses = max(1, int(total_count * random.uniform(0.05, 0.12)))
    trucks = max(1, int(total_count * random.uniform(0.05, 0.10)))
    ambulances = random.randint(0, 2)
    total = cars + bikes + buses + trucks + ambulances
    avg_speed = round(random.uniform(15, 55), 1)
    density_labels = ["very_low", "low", "medium", "high", "critical"]
    density = random.choices(density_labels, weights=[0.1, 0.3, 0.3, 0.2, 0.1])[0]
    cs = calculate_congestion_score(total, avg_speed, random.uniform(20, 80))
    lane_occ = {
        "lane_1": round(random.uniform(10, 90), 1),
        "lane_2": round(random.uniform(10, 90), 1),
        "lane_3": round(random.uniform(10, 90), 1),
    }
    recs = generate_recommendations(get_congestion_level(cs), {})
    return {
        "filename": file.filename,
        "vehicle_count": total,
        "vehicle_types": {
            "cars": cars, "bikes": bikes,
            "buses": buses, "trucks": trucks,
            "ambulances": ambulances,
        },
        "average_speed": avg_speed,
        "density": density,
        "congestion_score": cs,
        "lane_occupancy": lane_occ,
        "recommendations": recs,
    }


@router.post("/api/traffic/process")
async def process_traffic(data: TrafficData):
    if data.timestamp is None:
        data.timestamp = datetime.now()
    cs = calculate_congestion_score(data.vehicle_count, data.average_speed, data.lane_occupancy)
    level = get_congestion_level(cs)
    recs = generate_recommendations(level, data.model_dump())
    return {
        "status": "processed",
        "timestamp": data.timestamp.isoformat(),
        "input": data.model_dump(),
        "analysis": {
            "congestion_score": cs,
            "congestion_level": level,
            "vehicle_density": f"{data.vehicle_count / 10:.1f} vehicles/km",
            "flow_rate": f"{data.average_speed * data.lane_occupancy / 100:.1f}",
        },
        "recommendations": recs,
    }


@router.get("/api/traffic/current")
async def current_traffic():
    metrics = sim.get_current_metrics()
    return {
        "status": "success",
        "data": metrics,
    }


@router.get("/api/traffic/history")
async def traffic_history(hours: int = 24):
    if hours < 1 or hours > 168:
        raise HTTPException(400, "Hours must be between 1 and 168")
    data = sim.get_history(hours)
    return {
        "status": "success",
        "period_hours": hours,
        "data_points": len(data),
        "data": data,
    }
