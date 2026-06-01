from fastapi import APIRouter
from simulation import TrafficSimulator

router = APIRouter()
sim = TrafficSimulator()


@router.get("/api/dashboard/metrics")
async def dashboard_metrics():
    metrics = sim.get_dashboard_metrics()
    return {"status": "success", "metrics": metrics}


@router.get("/api/dashboard/charts/traffic-trends")
async def traffic_trends():
    data = sim.get_congestion_data_for_chart()
    return {"status": "success", "chart_type": "traffic_trends", "data": data}


@router.get("/api/dashboard/charts/congestion-forecast")
async def congestion_forecast():
    data = sim.get_forecast_data()
    return {"status": "success", "chart_type": "congestion_forecast", "data": data}


@router.get("/api/dashboard/charts/incident-timeline")
async def incident_timeline():
    data = sim.get_incident_timeline()
    return {"status": "success", "chart_type": "incident_timeline", "data": data}
