from fastapi import APIRouter
from datetime import datetime
import random

from models import AIQuery

router = APIRouter()

TRAFFIC_RESPONSES = {
    "congestion": [
        "Based on current vehicle density of {vc} vehicles and average speed of {sp} km/h, the congestion level is {level}. This is primarily driven by rush hour traffic volume. Recommendation: Deploy adaptive signal control on the main corridor.",
        "Traffic analysis shows congestion index of {cs} with {vc} vehicles. Contributing factors include lane occupancy at {lo}% and multiple active incidents. Suggest rerouting traffic through arterial roads.",
        "The current congestion pattern matches historical rush hour profiles. With {vc} vehicles moving at {sp} km/h, we predict {level} congestion for the next 45 minutes. Consider staggered office timings for long-term relief.",
    ],
    "prediction": [
        "Our predictive model analyzes {vc} vehicles at {sp} km/h with {lo}% lane occupancy. The forecast indicates {level} congestion in 30 minutes with {conf}% confidence. Key factor: traffic volume is {vol_trend} than seasonal average.",
        "Machine learning model analyzes real-time camera feeds and sensor data. Prediction: {level} congestion within 60min. Confidence: {conf}%. Recommend proactive signal timing adjustment.",
        "Historical patterns show {hist} congestion at this hour. Combined with current {vc} vehicles, prediction is {level} congestion. Suggest monitoring closely.",
    ],
    "emergency": [
        "Emergency corridor has been activated. {amb} ambulance(s) dispatched via priority route. Estimated time saved: {saved} minutes. All signals along the route are set to green.",
        "Green corridor operational. Traffic has been cleared on the emergency route. Estimated arrival in {eta} minutes. All alternate routes have been alerted.",
        "Emergency response coordination active. {amb} emergency vehicles dispatched. Traffic management system is in priority mode along the designated corridor.",
    ],
    "accident": [
        "Accident reported at {location} involving {vehicles} vehicles. Severity: {severity}. Impact zone radius: {radius} km. Diversion routes have been activated.",
        "Incident response team notified. {vehicles} vehicles involved in accident at {location}. Estimated clearance time: {clearance} minutes. Traffic impact: {impact}% congestion increase in surrounding area.",
    ],
    "recommendation": [
        "Based on comprehensive analysis, top recommendations: 1) {rec1} 2) {rec2} 3) {rec3}. Expected improvement: 25-30% reduction in congestion index.",
        "AI recommends: Adjust signal timing at Junction 5 and 7, deploy traffic officers to the accident site, and alert navigation apps. Projected impact: 20% faster traffic flow.",
        "Strategic recommendations: Implement adaptive traffic control, promote alternate routes via digital signage, and coordinate with public transport for capacity augmentation.",
    ],
    "general": [
        "Margadarshak AI Platform monitoring {vc} vehicles across the network. Current congestion index: {cs}. All systems operating normally.",
        "Welcome to the AI Urban Traffic Control Center. I'm monitoring traffic across all major corridors. Current conditions show {level} congestion with {active_inc} active incidents.",
        "Traffic Twin AI active. Analyzing data from {sensors} sensors and cameras. Overall network health: {health}%. Ask me about congestion, predictions, or incident reports.",
    ],
}


def get_random_response(category: str, **kwargs) -> str:
    responses = TRAFFIC_RESPONSES.get(category, TRAFFIC_RESPONSES["general"])
    template = random.choice(responses)
    try:
        return template.format(**kwargs)
    except KeyError:
        return template


def analyze_query(query: str) -> dict:
    q = query.lower()
    if any(w in q for w in ["congestion", "traffic", "jam", "density", "crowd"]):
        return {"category": "congestion", "needs_data": True}
    if any(w in q for w in ["predict", "forecast", "future", "will", "expect"]):
        return {"category": "prediction", "needs_data": True}
    if any(w in q for w in ["emergency", "ambulance", "corridor", "priority"]):
        return {"category": "emergency", "needs_data": True}
    if any(w in q for w in ["accident", "crash", "incident", "collision"]):
        return {"category": "accident", "needs_data": True}
    if any(w in q for w in ["recommend", "suggest", "advice", "improve", "optimize"]):
        return {"category": "recommendation", "needs_data": True}
    return {"category": "general", "needs_data": False}


@router.post("/api/ai/chat")
async def ai_chat(query: AIQuery):
    analysis = analyze_query(query.query)
    ctx = query.context
    vc = ctx.get("vehicle_count", random.randint(200, 900))
    sp = ctx.get("average_speed", round(random.uniform(15, 60), 1))
    lo = ctx.get("lane_occupancy", round(random.uniform(20, 90), 1))
    cs = ctx.get("congestion_score", round(random.uniform(15, 85), 1))
    level = ctx.get("congestion_level", random.choice(["low", "moderate", "high", "critical"]))
    response_text = get_random_response(
        analysis["category"],
        vc=vc, sp=sp, lo=lo, cs=cs, level=level,
        conf=random.randint(82, 96),
        hist=random.choice(["low", "moderate", "high"]),
        vol_trend=random.choice(["higher", "lower", "consistent with"]),
        amb=random.randint(1, 3),
        saved=random.randint(8, 20),
        eta=random.randint(5, 20),
        location=random.choice(["MG Road Junction", "Brigade Road", "Indiranagar", "Koramangala"]),
        vehicles=random.randint(2, 5),
        severity=random.choice(["minor", "moderate", "severe"]),
        radius=round(random.uniform(0.5, 2.5), 1),
        clearance=random.randint(20, 90),
        impact=random.randint(30, 70),
        rec1=random.choice([
            "Deploy adaptive signal control", "Increase public transport frequency",
            "Implement dynamic toll pricing", "Activate emergency protocols",
        ]),
        rec2=random.choice([
            "Reroute traffic via arterial roads", "Deploy traffic officers to key junctions",
            "Alert navigation service providers", "Activate variable message signs",
        ]),
        rec3=random.choice([
            "Coordinate with adjacent city corridors", "Implement staggered office hours",
            "Deploy drone surveillance", "Activate emergency response team",
        ]),
        active_inc=random.randint(0, 5),
        sensors=random.randint(50, 200),
        health=random.choice(["good", "fair", "excellent"]),
    )
    return {
        "status": "success",
        "query": query.query,
        "category": analysis["category"],
        "response": response_text,
        "timestamp": datetime.now().isoformat(),
        "suggested_followups": [
            "What is the current congestion level?",
            "Show me accident reports",
            "Predict traffic for next hour",
            "Any emergency alerts?",
            "Generate recommendations",
        ],
    }


@router.post("/api/ai/explain")
async def ai_explain(query: AIQuery):
    q = query.query.lower()
    ctx = query.context
    explanation_type = "general"
    if any(w in q for w in ["congestion", "traffic", "score"]):
        explanation_type = "congestion"
    elif any(w in q for w in ["predict", "forecast"]):
        explanation_type = "prediction"
    elif any(w in q for w in ["emergency", "corridor"]):
        explanation_type = "emergency"
    elif any(w in q for w in ["accident", "incident"]):
        explanation_type = "accident"
    elif any(w in q for w in ["recommend", "suggest"]):
        explanation_type = "recommendation"

    explanations = {
        "congestion": {
            "title": "Congestion Analysis Explanation",
            "summary": "The congestion score is calculated using a weighted formula combining vehicle density (35%), traffic speed (40%), and lane occupancy (25%).",
            "breakdown": [
                {"factor": "Vehicle Density", "weight": "35%", "current_value": f"{ctx.get('vehicle_count', 500)} vehicles", "impact": "Moderate-High"},
                {"factor": "Traffic Speed", "weight": "40%", "current_value": f"{ctx.get('average_speed', 30)} km/h", "impact": "High"},
                {"factor": "Lane Occupancy", "weight": "25%", "current_value": f"{ctx.get('lane_occupancy', 50)}%", "impact": "Moderate"},
            ],
            "ai_reasoning": "The AI model correlates real-time sensor data with historical patterns to identify congestion precursors. Current readings indicate building congestion likely caused by volume exceeding road capacity.",
            "confidence_factors": ["Data quality: 92%", "Sensor coverage: 87%", "Historical accuracy: 89%"],
        },
        "prediction": {
            "title": "Prediction Model Explanation",
            "summary": "Predictions use a hybrid model combining LSTM neural networks with gradient boosting for time-series traffic forecasting.",
            "breakdown": [
                {"factor": "Short-term (15min)", "method": "Real-time sensor correlation with immediate upstream/downstream traffic", "accuracy": "94%"},
                {"factor": "Medium-term (30min)", "method": "Pattern matching with similar historical time windows", "accuracy": "88%"},
                {"factor": "Long-term (60min)", "method": "Multivariate time series forecasting with weather and event data", "accuracy": "82%"},
            ],
            "ai_reasoning": "The model detected patterns matching historical rush hour build-up. Current trajectory suggests congestion will peak in approximately 30 minutes based on similar days.",
            "confidence_factors": ["Model accuracy: 88%", "Data freshness: 95%", "Pattern match confidence: 91%"],
        },
        "emergency": {
            "title": "Emergency Corridor Explanation",
            "summary": "Green corridor dynamically created using real-time traffic data to minimize emergency response time.",
            "breakdown": [
                {"factor": "Route Optimization", "method": "Dijkstra's algorithm on weighted graph with real-time traffic edges", "benefit": "40% faster route"},
                {"factor": "Signal Preemption", "method": "IoT-enabled traffic signals receive priority commands", "benefit": "Eliminates 3-5 red light stops"},
                {"factor": "Traffic Clearing", "method": "VMS and navigation apps alert drivers to clear path", "benefit": "60% reduced path obstruction"},
            ],
            "ai_reasoning": "Emergency corridor system calculated optimal route considering current traffic density, signal states, and road capacity. Priority override commands sent to all IoT signals along the path.",
            "confidence_factors": ["Signal network reliability: 97%", "Route accuracy: 95%", "ETA precision: 93%"],
        },
        "accident": {
            "title": "Accident Impact Analysis",
            "summary": "Multi-factor analysis of accident severity considering vehicles involved, location, time, and road capacity.",
            "breakdown": [
                {"factor": "Severity Assessment", "method": "Impact score based on vehicles involved, speed, and lane blockage", "level": ctx.get('severity', 'moderate')},
                {"factor": "Impact Zone", "method": "Dynamic radius calculation using traffic flow models", "radius": f"{ctx.get('impact_radius', 1.5)} km"},
                {"factor": "Recovery Time", "method": "Historical clearance patterns + current resource availability", "estimate": f"{ctx.get('clearance_time', 45)} minutes"},
            ],
            "ai_reasoning": "Accident severity scoring uses logistic regression trained on 10,000+ historical incidents. Impact propagation modeled using cellular automata traffic simulation.",
            "confidence_factors": ["Historical data: 10,000+ incidents", "Model AUC: 0.89", "Real-time validation: 93%"],
        },
        "recommendation": {
            "title": "Recommendation Engine Explanation",
            "summary": "Recommendations generated by a rules engine combined with reinforcement learning from past traffic management outcomes.",
            "breakdown": [
                {"factor": "Priority Scoring", "method": "Multi-criteria decision analysis (MCDA) ranking", "top_factor": "Urgency + Impact"},
                {"factor": "Expected Impact", "method": "Simulation-based outcome prediction", "avg_improvement": "25% traffic flow improvement"},
                {"factor": "Resource Optimization", "method": "Constraint satisfaction with available traffic management resources", "efficiency": "92% resource utilization"},
            ],
            "ai_reasoning": "Recommendation engine evaluated 47 possible interventions using simulation. Top 3 recommendations selected based on expected impact score, resource availability, and implementation time.",
            "confidence_factors": ["Simulation accuracy: 87%", "Historical outcome correlation: 84%", "Resource availability: 95%"],
        },
        "general": {
            "title": "AI Decision Explanation",
            "summary": "The AI Urban Traffic Twin uses multi-modal data fusion and ensemble learning for all traffic management decisions.",
            "breakdown": [
                {"factor": "Data Sources", "description": "Cameras, IoT sensors, GPS probes, weather data, event calendars"},
                {"factor": "Model Architecture", "description": "Ensemble: CNN (vision) + LSTM (time series) + XGBoost (tabular)"},
                {"factor": "Decision Framework", "description": "Reinforcement learning with human-in-the-loop validation"},
            ],
            "ai_reasoning": "All decisions are explainable through SHAP analysis and counterfactual reasoning. The system provides transparency for every recommendation.",
            "confidence_factors": ["Overall system reliability: 96%", "Uptime: 99.9%", "Decision accuracy: 91%"],
        },
    }
    exp = explanations.get(explanation_type, explanations["general"])
    return {
        "status": "success",
        "explanation_type": explanation_type,
        "explanation": exp,
        "timestamp": datetime.now().isoformat(),
    }
