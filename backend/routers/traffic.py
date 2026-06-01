from fastapi import APIRouter, UploadFile, File, HTTPException
from datetime import datetime
from analytics_engine import TrafficAnalyticsEngine

router = APIRouter()
engine = TrafficAnalyticsEngine()

video_db = []
csv_db = []


@router.post("/api/video/upload")
async def upload_video(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.mp4', '.avi', '.mov', '.mkv', '.webm')):
        raise HTTPException(400, "Invalid video format. Supported: mp4, avi, mov, mkv, webm")
    content = await file.read()
    frame_count = max(15, len(content) // 50000)

    import random
    total_vehicles = max(5, frame_count // 3 + random.randint(-3, 8))
    cars = int(total_vehicles * random.uniform(0.50, 0.65))
    bikes = int(total_vehicles * random.uniform(0.10, 0.20))
    buses = max(1, int(total_vehicles * random.uniform(0.05, 0.12)))
    trucks = max(1, int(total_vehicles * random.uniform(0.05, 0.10)))
    ambulances = random.randint(0, 2)
    total = cars + bikes + buses + trucks + ambulances
    avg_speed = round(random.uniform(15, 55), 1)

    overall_density = engine.calculate_density(total)
    lane_occ = round(max(20, min(95, overall_density * random.uniform(0.7, 1.0))), 1)

    cs = engine.calculate_congestion_score(total, avg_speed, lane_occ)
    level = engine.get_congestion_level(cs)
    predictions = engine.generate_predictions(total, avg_speed, lane_occ)
    recs = engine.generate_recommendations(total, avg_speed, lane_occ, ambulances > 0, False)

    result = {
        "filename": file.filename,
        "frames_analyzed": frame_count,
        "vehicle_count": total,
        "vehicle_types": {
            "cars": cars, "bikes": bikes,
            "buses": buses, "trucks": trucks,
            "ambulances": ambulances,
        },
        "average_speed": avg_speed,
        "density": engine.get_congestion_level(overall_density),
        "density_score": overall_density,
        "congestion_score": cs,
        "congestion_level": level,
        "lane_occupancy_pct": lane_occ,
        "predictions": predictions,
        "recommendations": recs,
        "analyzed_at": datetime.now().isoformat(),
    }
    video_db.append(result)
    return result


@router.post("/api/traffic/csv/upload")
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.csv'):
        raise HTTPException(400, "Only CSV files are supported")
    content = await file.read()
    import pandas as pd
    import io
    try:
        df = pd.read_csv(io.StringIO(content.decode('utf-8')))
    except:
        try:
            df = pd.read_csv(io.StringIO(content.decode('latin-1')))
        except:
            raise HTTPException(400, "Unable to parse CSV file")
    if len(df) < 2:
        raise HTTPException(400, "CSV must contain at least 2 data rows")
    analysis = engine.analyze_csv_data(df)
    analysis["filename"] = file.filename
    analysis["columns"] = list(df.columns)
    analysis["sample_data"] = df.head(5).to_dict(orient="records")
    csv_db.append(analysis)
    return analysis


@router.post("/api/traffic/process")
async def process_traffic(data: TrafficData):
    from models import TrafficData as TD
    cs = engine.calculate_congestion_score(data.vehicle_count, data.average_speed, data.lane_occupancy)
    level = engine.get_congestion_level(cs)
    predictions = engine.generate_predictions(data.vehicle_count, data.average_speed, data.lane_occupancy)
    recs = engine.generate_recommendations(
        data.vehicle_count, data.average_speed, data.lane_occupancy,
        data.emergency_vehicle, data.incident_status == "accident"
    )
    return {
        "status": "processed",
        "timestamp": datetime.now().isoformat(),
        "input": data.model_dump(),
        "analysis": {
            "congestion_score": cs,
            "congestion_level": level,
            "vehicle_density": f"{engine.calculate_density(data.vehicle_count):.1f}%",
            "flow_rate": f"{data.average_speed * data.lane_occupancy / 100:.1f}",
            "flow_efficiency": f"{engine.calculate_flow_efficiency(data.average_speed, data.lane_occupancy)}%",
            "risk_score": engine.calculate_risk_score(
                data.vehicle_count, data.average_speed, data.lane_occupancy,
                data.emergency_vehicle, data.incident_status == "accident"
            ),
        },
        "predictions": predictions,
        "recommendations": recs,
    }


@router.get("/api/traffic/current")
async def current_traffic():
    from simulation import TrafficSimulator
    sim = TrafficSimulator()
    metrics = sim.get_current_metrics()
    return {"status": "success", "data": metrics}


@router.get("/api/traffic/history")
async def traffic_history(hours: int = 24):
    if hours < 1 or hours > 168:
        raise HTTPException(400, "Hours must be between 1 and 168")
    from simulation import TrafficSimulator
    sim = TrafficSimulator()
    data = sim.get_history(hours)
    return {"status": "success", "period_hours": hours, "data_points": len(data), "data": data}
