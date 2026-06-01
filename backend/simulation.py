import random
import math
from datetime import datetime, timedelta
from typing import List, Dict


class TrafficSimulator:
    def __init__(self):
        self.current_time = datetime.now()
        self.incidents = []
        self.history = []

    def get_hour_factor(self, dt: datetime = None):
        if dt is None:
            dt = self.current_time
        hour = dt.hour
        day = dt.weekday()
        is_weekend = day >= 5

        if is_weekend:
            base = 0.3
            if 10 <= hour <= 14:
                base = 0.5
            elif 18 <= hour <= 22:
                base = 0.6
            return base

        if 7 <= hour <= 9:
            return 0.4 + (hour - 7) * 0.4
        elif 9 <= hour <= 11:
            return 0.6 - (hour - 9) * 0.05
        elif 11 <= hour <= 14:
            return 0.45
        elif 14 <= hour <= 16:
            return 0.4
        elif 16 <= hour <= 19:
            return 0.4 + (hour - 16) * 0.3
        elif 19 <= hour <= 21:
            return 0.6 - (hour - 19) * 0.1
        elif 22 <= hour or hour < 5:
            return 0.15
        else:
            return 0.25

    def generate_vehicle_count(self, hour_factor: float = None):
        if hour_factor is None:
            hour_factor = self.get_hour_factor()
        base = 800
        variation = random.gauss(0, 0.1)
        raw = base * hour_factor * (1 + variation)
        return max(10, int(raw))

    def generate_speed(self, vehicle_count: int, hour_factor: float = None):
        if hour_factor is None:
            hour_factor = self.get_hour_factor()
        if vehicle_count > 700:
            speed = random.uniform(10, 30)
        elif vehicle_count > 500:
            speed = random.uniform(20, 45)
        elif vehicle_count > 300:
            speed = random.uniform(35, 55)
        elif vehicle_count > 100:
            speed = random.uniform(45, 65)
        else:
            speed = random.uniform(55, 80)
        return round(speed * (0.85 + 0.15 * (1 - hour_factor)), 1)

    def generate_lane_occupancy(self, vehicle_count: int):
        raw = vehicle_count / 1200.0 * 100
        return round(min(100, raw + random.uniform(-5, 5)), 1)

    def generate_congestion_score(self, vehicle_count, avg_speed, lane_occupancy):
        vf = min(1.0, vehicle_count / 1000.0)
        sf = max(0.0, 1.0 - avg_speed / 80.0)
        lf = lane_occupancy / 100.0
        score = (vf * 35 + sf * 40 + lf * 25) * (0.85 + 0.15 * random.random())
        return round(min(100, max(0, score)), 1)

    def get_density_label(self, congestion_score: float) -> str:
        if congestion_score < 20:
            return "very_low"
        elif congestion_score < 40:
            return "low"
        elif congestion_score < 60:
            return "medium"
        elif congestion_score < 80:
            return "high"
        else:
            return "critical"

    def get_vehicle_type_distribution(self, total_count: int) -> dict:
        car_pct = random.uniform(0.50, 0.65)
        bike_pct = random.uniform(0.10, 0.20)
        bus_pct = random.uniform(0.05, 0.10)
        truck_pct = random.uniform(0.05, 0.10)
        ambulance_pct = random.uniform(0.005, 0.02)
        total_pct = car_pct + bike_pct + bus_pct + truck_pct + ambulance_pct
        car_pct /= total_pct
        bike_pct /= total_pct
        bus_pct /= total_pct
        truck_pct /= total_pct
        ambulance_pct /= total_pct
        return {
            "cars": int(total_count * car_pct),
            "bikes": int(total_count * bike_pct),
            "buses": int(total_count * bus_pct),
            "trucks": int(total_count * truck_pct),
            "ambulances": max(1, int(total_count * ambulance_pct)),
        }

    def generate_incident(self, force: bool = False):
        if not force and random.random() > 0.15:
            return None
        types = ["accident", "congestion", "emergency", "road_work", "none"]
        weights = [0.15, 0.25, 0.05, 0.10, 0.45]
        typ = random.choices(types, weights=weights)[0]
        if typ == "none":
            return None
        severity = random.choices(
            ["minor", "moderate", "severe", "critical"],
            weights=[0.4, 0.3, 0.2, 0.1],
        )[0]
        lanes_affected = random.randint(1, 3)
        incident = {
            "id": f"INC-{random.randint(1000, 9999)}",
            "type": typ,
            "severity": severity,
            "location": {
                "lat": round(random.uniform(12.90, 13.00), 4),
                "lng": round(random.uniform(77.55, 77.70), 4),
                "road": random.choice([
                    "MG Road", "Brigade Road", "Church Street",
                    "Indiranagar Main Road", "Koramangala Road", "Whitefield Road"
                ]),
            },
            "lanes_affected": lanes_affected,
            "timestamp": datetime.now().isoformat(),
            "vehicles_involved": random.randint(1, 4) if typ == "accident" else 0,
            "status": "active",
        }
        return incident

    def generate_traffic_snapshot(self, dt: datetime = None):
        if dt is None:
            dt = self.current_time
        hour_factor = self.get_hour_factor(dt)
        vc = self.generate_vehicle_count(hour_factor)
        sp = self.generate_speed(vc, hour_factor)
        lo = self.generate_lane_occupancy(vc)
        cs = self.generate_congestion_score(vc, sp, lo)
        types = self.get_vehicle_type_distribution(vc)
        incident = self.generate_incident()
        if incident:
            self.incidents.append(incident)
        return {
            "timestamp": dt.isoformat(),
            "hour_factor": round(hour_factor, 2),
            "vehicle_count": vc,
            "average_speed": sp,
            "lane_occupancy": lo,
            "congestion_score": cs,
            "congestion_level": self.get_density_label(cs),
            "vehicle_types": types,
            "incident": incident,
        }

    def get_current_metrics(self):
        snapshot = self.generate_traffic_snapshot()
        self.history.append(snapshot)
        return snapshot

    def get_history(self, hours: int = 24):
        now = datetime.now()
        data = []
        for h in range(hours):
            for m in range(0, 60, 5):
                t = now - timedelta(hours=h, minutes=m)
                data.append(self.generate_traffic_snapshot(t))
        return data

    def get_dashboard_metrics(self):
        snap = self.get_current_metrics()
        active_inc = [i for i in self.incidents if i["status"] == "active"]
        return {
            "total_vehicles": snap["vehicle_count"],
            "congestion_index": snap["congestion_score"],
            "average_speed": snap["average_speed"],
            "active_incidents": len([i for i in active_inc if i["type"] in ["accident", "congestion", "road_work"]]),
            "emergency_alerts": len([i for i in active_inc if i["type"] == "emergency"]),
            "predicted_traffic_load": self.get_density_label(
                snap["congestion_score"] * random.uniform(0.9, 1.2)
            ),
            "lane_occupancy": snap["lane_occupancy"],
            "vehicle_types": snap["vehicle_types"],
            "timestamp": snap["timestamp"],
        }

    def generate_scenario(self, scenario_type: str, intensity: float = 0.5):
        if scenario_type == "normal":
            return self.generate_traffic_snapshot()
        elif scenario_type == "rush_hour":
            return self._rush_hour_scenario(intensity)
        elif scenario_type == "accident":
            return self._accident_scenario(intensity)
        elif scenario_type == "emergency":
            return self._emergency_scenario(intensity)
        elif scenario_type == "city_congestion":
            return self._city_congestion_scenario(intensity)
        else:
            return self.generate_traffic_snapshot()

    def _rush_hour_scenario(self, intensity: float):
        hour_factor = 0.85 * intensity + 0.15
        vc = int(1200 * hour_factor)
        sp = round(random.uniform(8, 20), 1)
        lo = round(min(100, 60 + 30 * intensity), 1)
        cs = self.generate_congestion_score(vc, sp, lo)
        return {
            "timestamp": datetime.now().isoformat(),
            "scenario": "rush_hour",
            "intensity": intensity,
            "vehicle_count": vc,
            "average_speed": sp,
            "lane_occupancy": lo,
            "congestion_score": cs,
            "congestion_level": self.get_density_label(cs),
            "vehicle_types": self.get_vehicle_type_distribution(vc),
            "description": f"Rush hour traffic with {vc} vehicles moving at {sp} km/h",
        }

    def _accident_scenario(self, intensity: float):
        base_vc = int(600 + 400 * intensity)
        sp = round(random.uniform(5, 15), 1)
        lo = round(min(100, 70 + 20 * intensity), 1)
        cs = self.generate_congestion_score(base_vc, sp, lo)
        return {
            "timestamp": datetime.now().isoformat(),
            "scenario": "accident",
            "intensity": intensity,
            "vehicle_count": base_vc,
            "average_speed": sp,
            "lane_occupancy": lo,
            "congestion_score": cs,
            "congestion_level": self.get_density_label(cs),
            "vehicle_types": self.get_vehicle_type_distribution(base_vc),
            "accident": {
                "severity": "moderate" if intensity < 0.6 else "severe",
                "lanes_blocked": max(1, int(3 * intensity)),
                "diversion_available": intensity < 0.8,
            },
            "description": f"Accident blocking {max(1, int(3 * intensity))} lanes, vehicles moving at {sp} km/h",
        }

    def _emergency_scenario(self, intensity: float):
        vc = int(400 + 300 * intensity)
        sp = round(random.uniform(15, 35), 1)
        lo = round(40 + 30 * intensity, 1)
        cs = self.generate_congestion_score(vc, sp, lo)
        return {
            "timestamp": datetime.now().isoformat(),
            "scenario": "emergency",
            "intensity": intensity,
            "vehicle_count": vc,
            "average_speed": sp,
            "lane_occupancy": lo,
            "congestion_score": cs,
            "congestion_level": self.get_density_label(cs),
            "vehicle_types": self.get_vehicle_type_distribution(vc),
            "emergency": {
                "ambulances_dispatched": max(1, int(3 * intensity)),
                "green_corridor_created": intensity > 0.3,
                "estimated_time_saved_minutes": int(10 + 15 * intensity),
            },
            "description": f"Emergency response active, {max(1, int(3 * intensity))} ambulances dispatched",
        }

    def _city_congestion_scenario(self, intensity: float):
        vc = int(1000 + 400 * intensity)
        sp = round(random.uniform(5, 12), 1)
        lo = round(min(100, 75 + 20 * intensity), 1)
        cs = self.generate_congestion_score(vc, sp, lo)
        return {
            "timestamp": datetime.now().isoformat(),
            "scenario": "city_congestion",
            "intensity": intensity,
            "vehicle_count": vc,
            "average_speed": sp,
            "lane_occupancy": lo,
            "congestion_score": cs,
            "congestion_level": self.get_density_label(cs),
            "vehicle_types": self.get_vehicle_type_distribution(vc),
            "city_metrics": {
                "gridlock_index": round(min(1.0, 0.3 + 0.6 * intensity), 2),
                "public_transport_impact": "severe" if intensity > 0.7 else "moderate",
                "recommended_alternatives": ["metro", "bypass_route", "carpool"],
            },
            "description": f"City-wide congestion with {vc} vehicles, gridlock index {round(0.3 + 0.6 * intensity, 2)}",
        }

    def get_congestion_data_for_chart(self, hours: int = 24):
        now = datetime.now()
        data = []
        for h in range(hours, 0, -1):
            for m in range(0, 60, 15):
                t = now - timedelta(hours=h, minutes=m)
                hf = self.get_hour_factor(t)
                vc = self.generate_vehicle_count(hf)
                sp = self.generate_speed(vc, hf)
                lo = self.generate_lane_occupancy(vc)
                cs = self.generate_congestion_score(vc, sp, lo)
                data.append({
                    "time": t.strftime("%H:%M"),
                    "vehicle_count": vc,
                    "average_speed": sp,
                    "congestion_score": cs,
                })
        return data

    def get_forecast_data(self, hours_ahead: int = 6):
        now = datetime.now()
        data = []
        for h in range(hours_ahead):
            for m in range(0, 60, 30):
                t = now + timedelta(hours=h, minutes=m)
                hf = self.get_hour_factor(t)
                vc = self.generate_vehicle_count(hf)
                sp = self.generate_speed(vc, hf)
                lo = self.generate_lane_occupancy(vc)
                cs = self.generate_congestion_score(vc, sp, lo)
                data.append({
                    "time": t.strftime("%H:%M"),
                    "predicted_congestion": cs,
                    "lower_bound": round(cs * 0.85, 1),
                    "upper_bound": round(cs * 1.15, 1),
                    "vehicle_count": vc,
                })
        return data

    def get_incident_timeline(self, days: int = 1):
        incidents = []
        now = datetime.now()
        types = ["accident", "congestion", "emergency", "road_work"]
        for i in range(random.randint(5, 15)):
            t = now - timedelta(
                hours=random.randint(0, days * 24),
                minutes=random.randint(0, 59),
            )
            typ = random.choice(types)
            sev = random.choice(["minor", "moderate", "severe", "critical"])
            incidents.append({
                "id": f"INC-{1000 + i}",
                "type": typ,
                "severity": sev,
                "timestamp": t.isoformat(),
                "location": f"Intersection {random.randint(1, 20)}",
                "resolved": random.random() > 0.3,
                "resolution_time_minutes": random.randint(10, 120) if random.random() > 0.3 else None,
            })
        return sorted(incidents, key=lambda x: x["timestamp"], reverse=True)
