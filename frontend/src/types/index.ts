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
