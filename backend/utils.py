import random


def calculate_congestion_score(vehicle_count: int, avg_speed: float, lane_occupancy: float) -> float:
    vf = min(1.0, vehicle_count / 1000.0)
    sf = max(0.0, 1.0 - avg_speed / 80.0)
    lf = min(1.0, lane_occupancy / 100.0)
    score = vf * 35 + sf * 40 + lf * 25
    return round(min(100, max(0, score)), 1)


def get_congestion_level(score: float) -> str:
    if score < 20:
        return "low"
    elif score < 40:
        return "moderate"
    elif score < 60:
        return "high"
    else:
        return "critical"


def generate_recommendations(congestion_level: str, data: dict) -> list:
    recs = []
    if congestion_level in ("high", "critical"):
        recs.append({
            "priority": "high",
            "action": "Deploy traffic officers to affected junctions",
            "expected_impact": "15-20% improvement in flow",
        })
        recs.append({
            "priority": "high",
            "action": "Adjust traffic signal timings for optimized flow",
            "expected_impact": "10-15% reduction in wait times",
        })
        recs.append({
            "priority": "medium",
            "action": "Alert public via navigation apps about congestion",
            "expected_impact": "Encourage alternate route usage",
        })
        if data.get("incident_status") == "accident":
            recs.append({
                "priority": "critical",
                "action": "Dispatch emergency services and create green corridor",
                "expected_impact": "Rapid incident clearance",
            })
    elif congestion_level == "moderate":
        recs.append({
            "priority": "medium",
            "action": "Monitor traffic flow for emerging congestion patterns",
            "expected_impact": "Early intervention possible",
        })
        recs.append({
            "priority": "low",
            "action": "Update variable message signs with travel times",
            "expected_impact": "Better driver information",
        })
    else:
        recs.append({
            "priority": "low",
            "action": "Continue normal traffic management operations",
            "expected_impact": "Maintain smooth flow",
        })
    recs.append({
        "priority": "info",
        "action": "Real-time adaptive signal control engaged",
        "expected_impact": "Ongoing optimization",
    })
    return recs


def calculate_confidence(score: float, data_quality: float = 0.85) -> float:
    base = max(0, 1.0 - score / 100.0)
    adjusted = base * data_quality
    noise = random.uniform(-0.02, 0.02)
    return round(min(0.98, max(0.5, adjusted + noise)), 3)


def get_prediction_factors(vehicle_count: int, avg_speed: float, lane_occupancy: float, historical_congestion: str) -> list:
    factors = []
    if vehicle_count > 600:
        factors.append({
            "name": "High vehicle density",
            "impact": "negative",
            "detail": f"{vehicle_count} vehicles detected, exceeding threshold of 600",
        })
    elif vehicle_count < 200:
        factors.append({
            "name": "Low vehicle density",
            "impact": "positive",
            "detail": f"Only {vehicle_count} vehicles detected, well below capacity",
        })

    if avg_speed < 20:
        factors.append({
            "name": "Critically slow traffic",
            "impact": "negative",
            "detail": f"Average speed {avg_speed} km/h indicates severe congestion",
        })
    elif avg_speed < 35:
        factors.append({
            "name": "Moderate traffic speed",
            "impact": "negative",
            "detail": f"Average speed {avg_speed} km/h suggests building congestion",
        })
    elif avg_speed > 50:
        factors.append({
            "name": "Good traffic flow",
            "impact": "positive",
            "detail": f"Average speed {avg_speed} km/h indicates free-flowing traffic",
        })

    if lane_occupancy > 70:
        factors.append({
            "name": "High lane occupancy",
            "impact": "negative",
            "detail": f"Lane occupancy at {lane_occupancy}% indicates dense traffic",
        })
    elif lane_occupancy < 30:
        factors.append({
            "name": "Low lane occupancy",
            "impact": "positive",
            "detail": f"Lane occupancy at {lane_occupancy}% indicates available capacity",
        })

    historical_map = {"low": 0.2, "medium": 0.5, "high": 0.8}
    hf = historical_map.get(historical_congestion, 0.5)
    if hf > 0.6:
        factors.append({
            "name": "Historical congestion pattern",
            "impact": "negative",
            "detail": f"Historically {historical_congestion} congestion at this time",
        })
    else:
        factors.append({
            "name": "Historical traffic pattern",
            "impact": "positive",
            "detail": f"Historically {historical_congestion} congestion at this time",
        })
    return factors


def get_route_with_priority(current_location: dict, destination: dict, traffic_density: str) -> dict:
    density_factor = {"low": 0.3, "medium": 0.5, "high": 0.8}.get(traffic_density, 0.5)
    base_time_minutes = random.randint(15, 30)
    traffic_delay = int(base_time_minutes * density_factor)
    total_time = base_time_minutes + traffic_delay
    time_saved = int(traffic_delay * random.uniform(0.3, 0.7))
    return {
        "route": [
            {"instruction": "Proceed straight on MG Road for 2.5 km", "distance_km": 2.5},
            {"instruction": "Turn right at Signal 5 onto Brigade Road", "distance_km": 1.2},
            {"instruction": "Continue straight for 1.8 km to destination", "distance_km": 1.8},
        ],
        "total_distance_km": round(2.5 + 1.2 + 1.8, 2),
        "estimated_normal_time": total_time,
        "estimated_corridor_time": total_time - time_saved,
        "time_saved_minutes": time_saved,
        "time_saved_percentage": round(time_saved / total_time * 100, 1),
        "signal_priority": [
            {"signal_id": 1, "action": "Preempt to green", "location": "MG Road Junction"},
            {"signal_id": 2, "action": "Preempt to green", "location": "Brigade Road Intersection"},
            {"signal_id": 3, "action": "Hold green until passage", "location": "Destination Approach"},
        ],
    }
