import math
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple


class TrafficAnalyticsEngine:
    """Core analytics engine - all calculations derive from real inputs."""

    ROAD_CAPACITY_DEFAULT = 100
    OPTIMAL_SPEED_KMH = 45
    MAX_SPEED_KMH = 80
    MIN_SPEED_KMH = 5
    DENSITY_THRESHOLDS = {
        "very_low": (0, 15),
        "low": (15, 30),
        "moderate": (30, 50),
        "high": (50, 70),
        "critical": (70, 100),
    }

    @staticmethod
    def calculate_density(vehicle_count: int, road_capacity: float = None) -> float:
        cap = road_capacity or TrafficAnalyticsEngine.ROAD_CAPACITY_DEFAULT
        density = (vehicle_count / cap) * 100
        return round(min(100, max(0, density)), 1)

    @staticmethod
    def calculate_congestion_score(vehicle_count: int, avg_speed: float, lane_occupancy: float) -> float:
        vf = min(1.0, vehicle_count / 1000.0)
        sf = max(0.0, 1.0 - avg_speed / TrafficAnalyticsEngine.MAX_SPEED_KMH)
        lf = min(1.0, lane_occupancy / 100.0)
        score = vf * 35 + sf * 40 + lf * 25
        return round(min(100, max(0, score)), 1)

    @staticmethod
    def get_congestion_level(score: float) -> str:
        if score < 15: return "very_low"
        if score < 30: return "low"
        if score < 50: return "moderate"
        if score < 70: return "high"
        return "critical"

    @staticmethod
    def calculate_risk_score(vehicle_count: int, avg_speed: float, lane_occupancy: float, emergency: bool = False, accident: bool = False, weather: str = "clear") -> float:
        density = TrafficAnalyticsEngine.calculate_density(vehicle_count)
        speed_factor = max(0, 1 - avg_speed / 80.0)
        occ_factor = lane_occupancy / 100.0
        base = (density * 0.3 + speed_factor * 40 + occ_factor * 30)
        if emergency: base += 15
        if accident: base += 20
        weather_map = {"clear": 0, "rain": 10, "fog": 15, "storm": 25}
        base += weather_map.get(weather, 0)
        return round(min(100, max(0, base)), 1)

    @staticmethod
    def calculate_flow_efficiency(avg_speed: float, lane_occupancy: float) -> float:
        speed_ratio = min(1.0, avg_speed / TrafficAnalyticsEngine.OPTIMAL_SPEED_KMH)
        occ_penalty = max(0, lane_occupancy - 30) / 70.0
        efficiency = (speed_ratio * 0.6 + (1 - occ_penalty) * 0.4) * 100
        return round(min(100, max(0, efficiency)), 1)

    @staticmethod
    def calculate_prediction_score(vehicle_count: int, avg_speed: float, lane_occupancy: float, historical_trend: float = 0.5) -> float:
        cs = TrafficAnalyticsEngine.calculate_congestion_score(vehicle_count, avg_speed, lane_occupancy)
        trend_factor = historical_trend * 20
        score = cs * 0.7 + trend_factor * 0.3
        return round(min(100, max(0, score)), 1)

    @staticmethod
    def generate_predictions(vehicle_count: int, avg_speed: float, lane_occupancy: float) -> dict:
        cs = TrafficAnalyticsEngine.calculate_congestion_score(vehicle_count, avg_speed, lane_occupancy)
        predictions = {}
        for minutes in [15, 30, 60]:
            wave = math.sin(minutes / 60.0 * math.pi) * 5
            trend = (vehicle_count / 800.0) * 8
            predicted_cs = min(100, max(0, cs + wave + trend * (minutes / 60.0)))
            predicted_vc = int(vehicle_count * (1 + (minutes / 60.0) * 0.05))
            predicted_sp = max(5, avg_speed - (minutes / 60.0) * 3)
            confidence = max(50, min(98, 95 - minutes * 0.3 - (predicted_cs - 50) * 0.1))
            predictions[f"{minutes}min"] = {
                "predicted_vehicles": predicted_vc,
                "predicted_speed": round(predicted_sp, 1),
                "predicted_congestion": round(predicted_cs, 1),
                "predicted_level": TrafficAnalyticsEngine.get_congestion_level(predicted_cs),
                "confidence": round(confidence, 1),
            }
        return predictions

    @staticmethod
    def generate_recommendations(vehicle_count: int, avg_speed: float, lane_occupancy: float, emergency: bool = False, accident: bool = False) -> list:
        cs = TrafficAnalyticsEngine.calculate_congestion_score(vehicle_count, avg_speed, lane_occupancy)
        level = TrafficAnalyticsEngine.get_congestion_level(cs)
        density = TrafficAnalyticsEngine.calculate_density(vehicle_count)
        recs = []

        if level in ("high", "critical"):
            recs.append({
                "priority": "CRITICAL" if level == "critical" else "HIGH",
                "action": f"Deploy traffic management team - {level.upper()} congestion detected with {vehicle_count} vehicles at {avg_speed} km/h",
                "reason": f"Vehicle density at {density}% with lane occupancy {lane_occupancy}% exceeds safe threshold of 70%",
                "expected_impact": "15-25% improvement in traffic flow",
            })
            if avg_speed < 15:
                recs.append({
                    "priority": "CRITICAL",
                    "action": "Implement hold-and-release signal pattern at all upstream junctions",
                    "reason": f"Average speed {avg_speed} km/h indicates gridlock conditions forming",
                    "expected_impact": "Prevent complete gridlock, reduce queue spillback",
                })
            recs.append({
                "priority": "HIGH",
                "action": "Activate dynamic message signs advising alternate routes",
                "reason": f"Current congestion score {cs}/100 exceeds threshold for normal operation",
                "expected_impact": "Divert 20-30% traffic to alternate corridors",
            })
        elif level == "moderate":
            recs.append({
                "priority": "MEDIUM",
                "action": "Adjust signal timing splits for 10% longer green on main corridor",
                "reason": f"Moderate congestion ({cs}) with {vehicle_count} vehicles - proactive signal tuning can prevent escalation",
                "expected_impact": "Prevent 15% congestion increase in next 30 minutes",
            })
            recs.append({
                "priority": "LOW",
                "action": "Monitor traffic cameras for incident detection",
                "reason": "Moderate conditions require active monitoring for early intervention",
                "expected_impact": "Early detection of incidents reduces response time by 40%",
            })
        else:
            recs.append({
                "priority": "INFO",
                "action": "Continue normal traffic management operations",
                "reason": f"Traffic flowing well at {avg_speed} km/h with {vehicle_count} vehicles",
                "expected_impact": "Maintain current smooth flow conditions",
            })

        if accident:
            recs.insert(0, {
                "priority": "CRITICAL",
                "action": "Dispatch emergency services and establish incident command post",
                "reason": f"Active accident with {vehicle_count} vehicles accumulating at accident zone",
                "expected_impact": "Rapid incident clearance, reduce secondary accident risk",
            })
        if emergency:
            recs.insert(0, {
                "priority": "CRITICAL",
                "action": "Activate green corridor for emergency vehicle passage",
                "reason": f"Emergency vehicle requires priority routing through congestion level {level}",
                "expected_impact": "40-60% reduction in emergency response time",
            })

        return recs

    @staticmethod
    def generate_reasoning(vehicle_count: int, avg_speed: float, lane_occupancy: float, emergency: bool = False, accident: bool = False, weather: str = "clear", road_capacity: float = None) -> dict:
        density = TrafficAnalyticsEngine.calculate_density(vehicle_count, road_capacity)
        cs = TrafficAnalyticsEngine.calculate_congestion_score(vehicle_count, avg_speed, lane_occupancy)
        level = TrafficAnalyticsEngine.get_congestion_level(cs)
        risk = TrafficAnalyticsEngine.calculate_risk_score(vehicle_count, avg_speed, lane_occupancy, emergency, accident, weather)
        efficiency = TrafficAnalyticsEngine.calculate_flow_efficiency(avg_speed, lane_occupancy)
        predictions = TrafficAnalyticsEngine.generate_predictions(vehicle_count, avg_speed, lane_occupancy)
        recs = TrafficAnalyticsEngine.generate_recommendations(vehicle_count, avg_speed, lane_occupancy, emergency, accident)

        factors = []
        if density > 70:
            factors.append(f"Vehicle density ({density}%) exceeds optimal threshold of 70%")
        elif density > 50:
            factors.append(f"Vehicle density ({density}%) approaching critical threshold")

        if avg_speed < 15:
            factors.append(f"Average speed ({avg_speed} km/h) significantly below normal urban traffic speed of 35-45 km/h")
        elif avg_speed < 30:
            factors.append(f"Average speed ({avg_speed} km/h) indicates building congestion conditions")
        else:
            factors.append(f"Average speed ({avg_speed} km/h) within acceptable range")

        if lane_occupancy > 80:
            factors.append(f"Lane occupancy ({lane_occupancy}%) indicates saturation - over 80% triggers gridlock risk")
        elif lane_occupancy > 60:
            factors.append(f"Lane occupancy ({lane_occupancy}%) at elevated level, monitoring required")

        if accident:
            factors.append("Active accident incident detected - contributing 20 points to risk score")
        if emergency:
            factors.append("Emergency vehicle active - priority routing engaged")
        if weather != "clear":
            weather_factor = {"rain": 10, "fog": 15, "storm": 25}.get(weather, 0)
            factors.append(f"Weather condition ({weather}) adding {weather_factor} points to congestion risk")

        traffic_status = level.upper()
        if level == "critical":
            traffic_status_label = "CRITICAL - Immediate intervention required"
        elif level == "high":
            traffic_status_label = "HIGH - Active traffic management needed"
        elif level == "moderate":
            traffic_status_label = "MODERATE - Monitoring advised"
        else:
            traffic_status_label = "NORMAL - Traffic flowing smoothly"

        worst_prediction = max(predictions.items(), key=lambda x: x[1]["predicted_congestion"])
        prediction_text = (
            f"Traffic congestion predicted to trend {'upward' if worst_prediction[1]['predicted_congestion'] > cs else 'downward'}. "
            f"In {worst_prediction[0]}, congestion score estimated at {worst_prediction[1]['predicted_congestion']}/100 "
            f"({worst_prediction[1]['predicted_level']}) with {worst_prediction[1]['confidence']}% confidence."
        )

        return {
            "traffic_status": traffic_status,
            "traffic_status_label": traffic_status_label,
            "congestion_score": cs,
            "congestion_level": level,
            "vehicle_density": density,
            "risk_score": risk,
            "flow_efficiency": efficiency,
            "factors": factors,
            "predictions": predictions,
            "recommendations": recs,
            "explanation": (
                f"Traffic Status: {traffic_status_label}\n\n"
                + "Reason:\n" + "\n".join(f"• {f}" for f in factors[:3]) + "\n\n"
                + f"Risk Score: {risk}/100\n\n"
                + f"Prediction: {prediction_text}\n\n"
                + "Recommendations:\n" + "\n".join(f"• [{r['priority']}] {r['action']}" for r in recs[:3])
            ),
        }

    @staticmethod
    def analyze_csv_data(df) -> dict:
        total_rows = len(df)
        avg_vehicles = float(df.get("vehicle_count", df.get("vehicles", [0])).mean())
        avg_speed = float(df.get("avg_speed", df.get("speed", df.get("average_speed", [0]))).mean())
        avg_occupancy = float(df.get("lane_occupancy", df.get("occupancy", [0])).mean())

        peak_hours = []
        if "timestamp" in df.columns or "time" in df.columns:
            time_col = "timestamp" if "timestamp" in df.columns else "time"
            df_copy = df.copy()
            df_copy[time_col] = pd.to_datetime(df_copy[time_col])
            df_copy["hour"] = df_copy[time_col].dt.hour
            hourly = df_copy.groupby("hour")[df.columns[1]].mean() if len(df.columns) > 1 else None
            if hourly is not None:
                peak_hours = hourly.nlargest(3).index.tolist()

        vc = int(avg_vehicles) if not math.isnan(avg_vehicles) else 200
        sp = round(avg_speed, 1) if not math.isnan(avg_speed) else 35
        lo = round(avg_occupancy, 1) if not math.isnan(avg_occupancy) else 40
        cs = TrafficAnalyticsEngine.calculate_congestion_score(vc, sp, lo)
        level = TrafficAnalyticsEngine.get_congestion_level(cs)
        predictions = TrafficAnalyticsEngine.generate_predictions(vc, sp, lo)

        trend = "increasing" if cs > 50 else "decreasing" if cs < 30 else "stable"
        return {
            "total_records": total_rows,
            "avg_vehicles": vc,
            "avg_speed": sp,
            "avg_lane_occupancy": lo,
            "congestion_score": cs,
            "congestion_level": level,
            "peak_hours": [int(h) for h in peak_hours],
            "trend": trend,
            "predictions": predictions,
            "insights": [
                f"Dataset contains {total_rows} traffic observations",
                f"Average congestion score: {cs}/100 ({level}) - {trend} trend",
                f"Peak traffic hours identified: {', '.join(f'{h}:00' for h in peak_hours[:3])}" if peak_hours else "Peak hours: Unable to determine from data",
                f"Flow efficiency: {TrafficAnalyticsEngine.calculate_flow_efficiency(sp, lo)}%",
            ],
        }

    @staticmethod
    def analyze_video_detections(detections: List[dict]) -> dict:
        counts = {"car": 0, "bike": 0, "bus": 0, "truck": 0, "ambulance": 0}
        total_conf = 0
        for d in detections:
            vehicle_type = d.get("type", "car").lower()
            if vehicle_type in counts:
                counts[vehicle_type] += 1
            total_conf += d.get("confidence", 0.85)

        total = sum(counts.values()) or 1
        avg_conf = round(total_conf / len(detections), 3) if detections else 0.85
        car_pct = round(counts["car"] / total * 100, 1)
        density_score = min(100, total * 15)
        flow_rate = round(total * (1 - density_score / 200), 1)

        return {
            "vehicle_count": total,
            "vehicle_types": counts,
            "average_confidence": avg_conf,
            "composition": {
                "car_percentage": car_pct,
                "bike_percentage": round(counts["bike"] / total * 100, 1),
                "bus_percentage": round(counts["bus"] / total * 100, 1),
                "truck_percentage": round(counts["truck"] / total * 100, 1),
                "ambulance_percentage": round(counts["ambulance"] / total * 100, 1),
            },
            "density_score": density_score,
            "flow_rate": flow_rate,
            "density_label": TrafficAnalyticsEngine.get_congestion_level(density_score),
        }

    @staticmethod
    def calculate_emergency_route(current_lat: float, current_lng: float, dest_lat: float, dest_lng: float, traffic_density: str) -> dict:
        dlat = dest_lat - current_lat
        dlng = dest_lng - current_lng
        approx_distance_km = math.sqrt(dlat**2 + dlng**2) * 111

        density_factor = {"low": 0.3, "medium": 0.5, "high": 0.8, "critical": 1.0}.get(traffic_density, 0.5)
        base_time_minutes = approx_distance_km / 0.8
        traffic_delay = base_time_minutes * density_factor
        normal_time = base_time_minutes + traffic_delay
        corridor_time = normal_time * 0.55
        time_saved = normal_time - corridor_time

        return {
            "distance_km": round(approx_distance_km, 2),
            "normal_time_minutes": round(normal_time, 1),
            "corridor_time_minutes": round(corridor_time, 1),
            "time_saved_minutes": round(time_saved, 1),
            "time_saved_percentage": round((time_saved / normal_time) * 100, 1) if normal_time > 0 else 0,
            "route_points": [
                {"lat": current_lat, "lng": current_lng, "instruction": "Start - Emergency vehicle dispatch"},
                {"lat": round((current_lat + dest_lat) / 2, 4), "lng": round((current_lng + dest_lng) / 2, 4), "instruction": "Priority corridor active - all signals preempted to green"},
                {"lat": dest_lat, "lng": dest_lng, "instruction": "Destination - Hospital emergency entrance"},
            ],
            "signal_priority": [
                {"signal_id": i + 1, "action": "Preempted to GREEN", "intersection": f"Junction {chr(65 + i)}"}
                for i in range(4)
            ],
        }


import pandas as pd
