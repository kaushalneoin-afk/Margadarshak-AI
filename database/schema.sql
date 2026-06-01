-- Margadarshak AI - Database Schema
-- PostgreSQL 15+

-- Users table for platform authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'operator',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Traffic cameras/sensors
CREATE TABLE IF NOT EXISTS sensors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    location_lat DECIMAL(10, 7),
    location_lng DECIMAL(10, 7),
    zone VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    type VARCHAR(50) DEFAULT 'camera',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual vehicle detections
CREATE TABLE IF NOT EXISTS vehicle_detections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sensor_id UUID REFERENCES sensors(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    vehicle_type VARCHAR(30) CHECK (vehicle_type IN ('car', 'bike', 'bus', 'truck', 'ambulance', 'emergency')),
    vehicle_count INTEGER NOT NULL,
    average_speed DECIMAL(5, 2),
    lane_number INTEGER,
    confidence DECIMAL(5, 4)
);

-- Aggregated traffic metrics
CREATE TABLE IF NOT EXISTS traffic_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    zone VARCHAR(50),
    total_vehicles INTEGER,
    average_speed DECIMAL(5, 2),
    lane_occupancy DECIMAL(5, 2),
    congestion_score DECIMAL(5, 2),
    congestion_level VARCHAR(10) CHECK (congestion_level IN ('low', 'medium', 'high', 'critical')),
    vehicle_distribution JSONB
);

-- AI Predictions
CREATE TABLE IF NOT EXISTS predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    predicted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    time_horizon VARCHAR(10) CHECK (time_horizon IN ('15min', '30min', '60min')),
    congestion_level VARCHAR(10),
    confidence DECIMAL(5, 4),
    factors JSONB,
    recommendations JSONB,
    actual_congestion VARCHAR(10),
    accuracy_verified BOOLEAN DEFAULT FALSE
);

-- Incidents and accidents
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    incident_type VARCHAR(30) CHECK (incident_type IN ('accident', 'congestion', 'emergency', 'road_closure', 'hazard')),
    severity VARCHAR(20) CHECK (severity IN ('minor', 'moderate', 'severe', 'critical')),
    zone VARCHAR(50),
    location_lat DECIMAL(10, 7),
    location_lng DECIMAL(10, 7),
    description TEXT,
    vehicles_involved INTEGER DEFAULT 0,
    lane_blocked BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active',
    recovery_estimate_minutes INTEGER,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Emergency vehicle routes
CREATE TABLE IF NOT EXISTS emergency_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ambulance_id VARCHAR(50),
    incident_id UUID REFERENCES incidents(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source_lat DECIMAL(10, 7),
    source_lng DECIMAL(10, 7),
    dest_lat DECIMAL(10, 7),
    dest_lng DECIMAL(10, 7),
    route_geometry JSONB,
    signal_priority_plan JSONB,
    estimated_time_normal INTEGER,
    estimated_time_corridor INTEGER,
    time_saved INTEGER,
    status VARCHAR(20) DEFAULT 'active'
);

-- Predefined scenarios
CREATE TABLE IF NOT EXISTS scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    scenario_type VARCHAR(30) UNIQUE NOT NULL,
    description TEXT,
    parameters JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI chat history and insights
CREATE TABLE IF NOT EXISTS ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    query_type VARCHAR(50),
    user_query TEXT,
    ai_response TEXT,
    context JSONB,
    model_version VARCHAR(20) DEFAULT '1.0.0'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_traffic_metrics_timestamp ON traffic_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_traffic_metrics_zone ON traffic_metrics(zone);
CREATE INDEX IF NOT EXISTS idx_predictions_timestamp ON predictions(timestamp);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_timestamp ON incidents(timestamp);
CREATE INDEX IF NOT EXISTS idx_detections_timestamp ON vehicle_detections(timestamp);
CREATE INDEX IF NOT EXISTS idx_detections_sensor_id ON vehicle_detections(sensor_id);
CREATE INDEX IF NOT EXISTS idx_emergency_routes_status ON emergency_routes(status);
CREATE INDEX IF NOT EXISTS idx_ai_insights_timestamp ON ai_insights(timestamp);

-- Insert default scenarios
INSERT INTO scenarios (name, scenario_type, description, parameters) VALUES
('Normal Traffic Flow', 'normal', 'Regular traffic patterns with moderate congestion during peak hours', '{"vehicle_count": 5000, "avg_speed": 45, "congestion_level": "low", "incident_probability": 0.05}'),
('Rush Hour Surge', 'rush_hour', 'Peak hour traffic with 200% volume increase', '{"vehicle_count": 15000, "avg_speed": 20, "congestion_level": "high", "incident_probability": 0.3}'),
('Multi-Vehicle Accident', 'accident', 'Multi-vehicle collision with lane blockages and emergency dispatch', '{"vehicle_count": 8000, "avg_speed": 15, "congestion_level": "critical", "incident_type": "accident", "severity": "severe"}'),
('Emergency Ambulance Corridor', 'emergency', 'Emergency vehicle routing with green wave signal priority', '{"vehicle_count": 6000, "avg_speed": 35, "congestion_level": "medium", "emergency_vehicles": 3}'),
('City-Wide Congestion Crisis', 'city_congestion', 'Complex multi-incident city-wide traffic crisis requiring full response', '{"vehicle_count": 25000, "avg_speed": 8, "congestion_level": "critical", "incident_probability": 0.8}')
ON CONFLICT (scenario_type) DO NOTHING;
