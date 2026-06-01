# 🏙️ AI Urban Traffic Digital Twin Platform

> **Next-Generation Smart City Traffic Command Center**
> 
> *Predicting, Preventing, and Optimizing Urban Traffic Through Artificial Intelligence*

---

## 🌟 Overview

The **AI Urban Traffic Digital Twin** is a comprehensive smart-city traffic management platform that combines computer vision, predictive analytics, 3D digital twin visualization, and AI-powered decision support to revolutionize urban traffic management.

Built for the modern smart city, this platform provides traffic operators with real-time monitoring, predictive insights, and intelligent automation to reduce congestion, improve emergency response times, and optimize traffic flow across the entire city network.

---

## ✨ Key Features

### 🚗 Computer Vision & Vehicle Detection
- Real-time vehicle detection from traffic camera feeds
- Classification: Cars, Bikes, Buses, Trucks, Ambulances
- Speed estimation and density analysis
- Lane occupancy monitoring

### 📊 Congestion Prediction
- Multi-timescale predictions (15/30/60 minutes)
- AI-powered congestion level forecasting
- Confidence scoring with explainable factors
- Historical pattern analysis

### 🚨 Intelligent Incident Detection
- Automatic accident detection and severity assessment
- Road blockage identification
- Recovery time estimation
- Diversion route suggestions

### 🚑 Emergency Vehicle Corridor
- Real-time ambulance detection and tracking
- Dynamic green wave corridor generation
- Signal priority optimization
- Time-saved calculations

### 🏗️ 3D Digital Twin
- Realistic 3D city visualization
- Animated traffic flow with live updates
- Congestion heatmap overlay
- Interactive orbital controls (zoom, pan, rotate)

### 🤖 AI Copilot
- Natural language query interface
- Context-aware traffic insights
- Explainable AI recommendations
- Conversational decision support

### 🎮 Interactive Demo Mode
- 5 Predefined scenarios
- One-click full demonstration
- Live dashboard updates
- Cinematic hackathon presentation mode

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 16)                     │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │ Landing │ │Dashboard │ │  Demo    │ │ 3D Digital     │  │
│  │  Page   │ │  Center  │ │  Page    │ │    Twin        │  │
│  └─────────┘ └──────────┘ └──────────┘ └────────────────┘  │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │ Recharts│ │ Three.js │ │Framer    │ │ Zustand        │  │
│  │ Charts  │ │   R3F    │ │ Motion   │ │   State        │  │
│  └─────────┘ └──────────┘ └──────────┘ └────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                     API LAYER (REST)                        │
│              http://localhost:8000/api/*                     │
├─────────────────────────────────────────────────────────────┤
│                   BACKEND (FastAPI)                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │ Traffic  │ │Predict.  │ │Emergency │ │   AI Chat    │   │
│  │ Router   │ │ Router   │ │ Router   │ │   Router     │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │ Accidents│ │Scenarios │ │ Dashboard│                    │
│  │ Router   │ │ Router   │ │ Router   │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
├─────────────────────────────────────────────────────────────┤
│                  SIMULATION ENGINE                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ TrafficSimulator - Generates realistic traffic data   │   │
│  │ Supports 5 scenarios, time-based patterns, incidents  │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    DATA LAYER                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │PostgreSQL│ │  Redis   │ │   File   │ │   Metrics    │   │
│  │          │ │  Cache   │ │  Store   │ │   Pipeline    │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework with App Router |
| React 19 | UI component library |
| TypeScript | Type-safe development |
| Tailwind CSS 4 | Utility-first CSS framework |
| Three.js / React Three Fiber | 3D city visualization |
| Framer Motion | Smooth animations |
| Recharts | Interactive charts |
| Zustand | Global state management |
| Lucide React | Professional icons |

### Backend
| Technology | Purpose |
|------------|---------|
| FastAPI | High-performance Python API |
| Uvicorn | ASGI server |
| Pydantic | Data validation |
| NumPy | Numerical computing |
| Pandas | Data processing |

### AI/ML Stack
| Technology | Purpose |
|------------|---------|
| YOLO | Vehicle detection (computer vision) |
| DeepSORT | Vehicle tracking |
| XGBoost | Congestion prediction |
| LSTM | Time-series forecasting |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| PostgreSQL | Primary database |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- Python 3.12+
- Docker (optional)

### Option 1: Docker (Recommended)

```bash
# Clone and start all services
docker compose up --build

# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the API server
uvicorn main:app --reload --port 8000
```

#### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install Node.js dependencies
npm install

# Set environment variable
# Windows PowerShell:
$env:NEXT_PUBLIC_API_URL="http://localhost:8000"

# Start the development server
npm run dev
```

#### 3. Access the Platform

| Service | URL |
|---------|-----|
| Landing Page | http://localhost:3000 |
| Dashboard | http://localhost:3000/dashboard |
| Interactive Demo | http://localhost:3000/demo |
| Architecture | http://localhost:3000/architecture |
| About | http://localhost:3000/about |
| API Docs | http://localhost:8000/docs |
| Health Check | http://localhost:8000/api/health |

---

## 📋 API Endpoints

### Traffic Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/traffic/current` | Current traffic metrics |
| GET | `/api/traffic/history` | 24-hour traffic history |
| POST | `/api/traffic/process` | Process manual traffic data |
| POST | `/api/video/upload` | Upload and analyze traffic video |

### Predictions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predict` | Run congestion prediction |
| GET | `/api/predictions/history` | Prediction history |

### Emergency & Incidents
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/emergency/corridor` | Generate emergency corridor |
| GET | `/api/emergency/active` | Active emergency events |
| POST | `/api/accident/report` | Report traffic accident |
| GET | `/api/accidents/active` | Active incidents |

### Scenarios & Demo
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/scenarios` | List predefined scenarios |
| POST | `/api/scenario/run` | Run a scenario |
| POST | `/api/demo/run` | Run full demonstration sequence |

### AI & Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | AI Copilot chat |
| POST | `/api/ai/explain` | Generate AI explanation |
| GET | `/api/dashboard/metrics` | Dashboard KPIs |
| GET | `/api/dashboard/charts/*` | Chart data |

---

## 🎮 Demo Scenarios

1. **Normal Traffic Flow** - Regular traffic patterns with moderate congestion
2. **Rush Hour Surge** - Peak hour traffic with 200% volume increase
3. **Multi-Vehicle Accident** - Collision with lane blockages and emergency dispatch
4. **Emergency Ambulance Corridor** - Green wave signal priority routing
5. **City-Wide Congestion Crisis** - Complex multi-incident city response

### Hackathon Movie Mode
Click **"Run Full Demonstration"** on the Demo page to watch the platform's complete capabilities in a cinematic automated sequence:
1. Generate traffic across city zones
2. Increase density to simulate rush hour
3. Create congestion bottlenecks
4. Trigger an accident event
5. Dispatch emergency ambulance
6. Generate green corridor
7. Run AI predictions
8. Update live dashboard
9. Generate AI explanations
10. Show final recommendations

---

## 📊 Database Schema

The platform uses PostgreSQL with the following tables:
- `users` - Platform authentication
- `sensors` - Traffic cameras and sensors
- `vehicle_detections` - Individual detection events
- `traffic_metrics` - Aggregated traffic statistics
- `predictions` - AI prediction records
- `incidents` - Accident and incident reports
- `emergency_routes` - Emergency vehicle corridors
- `scenarios` - Predefined simulation scenarios
- `ai_insights` - AI chat history and insights

---

## 🤝 Contributing

This project is built for hackathon demonstration. Contributions, ideas, and feedback are welcome!

---

## 📝 License

MIT - Open source for smart city innovation.

---

## 👥 Team

Built with ❤️ for smarter, safer cities.

---

*"The best way to predict the future is to create it." - Peter Drucker*
