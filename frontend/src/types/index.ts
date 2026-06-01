export interface TrafficData {
  id: string;
  timestamp: string;
  location: string;
  vehicleCount: number;
  averageSpeed: number;
  congestionLevel: number;
  vehicleTypes: VehicleTypeDistribution;
}

export interface VehicleTypeDistribution {
  cars: number;
  trucks: number;
  buses: number;
  motorcycles: number;
  emergency: number;
}

export interface PredictionResult {
  id: string;
  timestamp: string;
  predictionFor: string;
  congestionIndex: number;
  confidence: number;
  factors: PredictionFactor[];
  recommendations: string[];
}

export interface PredictionFactor {
  name: string;
  impact: number;
  description: string;
}

export interface VehicleDetection {
  id: string;
  type: string;
  speed: number;
  direction: string;
  lane: number;
  timestamp: string;
}

export interface Incident {
  id: string;
  type: 'accident' | 'congestion' | 'road_closure' | 'hazard' | 'emergency';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  latitude: number;
  longitude: number;
  description: string;
  timestamp: string;
  status: 'active' | 'resolved' | 'investigating';
  vehiclesInvolved?: number;
}

export interface EmergencyEvent {
  id: string;
  type: 'ambulance' | 'fire' | 'police';
  status: 'dispatched' | 'responding' | 'on_scene' | 'completed';
  location: string;
  destination: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedArrival: number;
  corridorActive: boolean;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  type: string;
  parameters: Record<string, unknown>;
}

export interface AIResponse {
  message: string;
  confidence: number;
  factors: PredictionFactor[];
  recommendations: string[];
}

export interface DashboardMetrics {
  totalVehicles: number;
  congestionIndex: number;
  averageSpeed: number;
  activeIncidents: number;
  emergencyAlerts: number;
  predictedLoad: number;
  vehicleDistribution: VehicleTypeDistribution;
  trends: {
    vehicles: number;
    congestion: number;
    speed: number;
  };
}

export interface ChartDataPoint {
  timestamp: string;
  value: number;
  label?: string;
  secondary?: number;
}

export interface TrafficFlowData {
  time: string;
  flow: number;
  speed: number;
  occupancy: number;
}

export interface ZoneData {
  name: string;
  congestion: number;
  vehicles: number;
  coordinates: { x: number; y: number };
}

export interface ManualAnalysisInput {
  vehicle_count: number;
  average_speed: number;
  lane_occupancy: number;
  emergency_vehicle: boolean;
  accident_present: boolean;
  weather_condition: string;
  road_capacity?: number;
}

export interface ManualAnalysisResult {
  traffic_status: string;
  congestion_score: number;
  congestion_level: string;
  vehicle_density: number;
  risk_score: number;
  flow_efficiency: number;
  factors: string[];
  predictions: Record<string, {
    predicted_vehicles: number;
    predicted_speed: number;
    predicted_congestion: number;
    predicted_level: string;
    confidence: number;
  }>;
  recommendations: Array<{
    priority: string;
    action: string;
    reason: string;
    expected_impact: string;
  }>;
  explanation: string;
}

export interface JudgeEvaluationInput {
  vehicle_count: number;
  average_speed: number;
  lane_occupancy: number;
  emergency_vehicle: boolean;
  incident_status: string;
}

export interface JudgeEvaluationResult {
  traffic_status: string;
  traffic_status_label: string;
  congestion_score: number;
  congestion_level: string;
  vehicle_density: number;
  risk_score: number;
  severity_score: number;
  flow_efficiency: number;
  factors: string[];
  predictions: Record<string, any>;
  recommendations: Array<{
    priority: string;
    action: string;
    reason: string;
    expected_impact: string;
  }>;
  ai_reasoning: string;
  data_integrity_check: string;
}
