from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from routers import traffic, predictions, emergency, accidents, scenarios, ai, demo, dashboard

load_dotenv()

app = FastAPI(
    title=os.getenv("APP_NAME", "AI Urban Traffic Digital Twin"),
    description="Backend platform for AI-powered urban traffic management, prediction, and emergency response",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(traffic.router)
app.include_router(predictions.router)
app.include_router(emergency.router)
app.include_router(accidents.router)
app.include_router(scenarios.router)
app.include_router(ai.router)
app.include_router(demo.router)
app.include_router(dashboard.router)


@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": os.getenv("APP_NAME", "AI Urban Traffic Digital Twin"),
        "version": "1.0.0",
        "timestamp": __import__("datetime").datetime.now().isoformat(),
    }
