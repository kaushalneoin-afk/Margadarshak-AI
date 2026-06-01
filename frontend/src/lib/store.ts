import { create } from 'zustand';
import type { TrafficData, PredictionResult, Incident, EmergencyEvent, AIResponse, DashboardMetrics } from '@/types';

interface AppState {
  trafficMetrics: TrafficData | null;
  congestionLevel: number;
  predictions: PredictionResult[];
  incidents: Incident[];
  emergencyEvents: EmergencyEvent[];
  scenarioActive: boolean;
  demoMode: boolean;
  aiMessages: { role: 'user' | 'ai'; content: string; timestamp: string }[];
  selectedView: 'dashboard' | '3d' | 'analytics';
  isLoading: boolean;
  dashboardMetrics: DashboardMetrics | null;

  setTrafficMetrics: (data: TrafficData) => void;
  setCongestionLevel: (level: number) => void;
  setPredictions: (data: PredictionResult[]) => void;
  addPrediction: (data: PredictionResult) => void;
  setIncidents: (data: Incident[]) => void;
  addIncident: (data: Incident) => void;
  setEmergencyEvents: (data: EmergencyEvent[]) => void;
  addEmergencyEvent: (data: EmergencyEvent) => void;
  setScenarioActive: (active: boolean) => void;
  setDemoMode: (mode: boolean) => void;
  addAiMessage: (msg: { role: 'user' | 'ai'; content: string }) => void;
  setSelectedView: (view: 'dashboard' | '3d' | 'analytics') => void;
  setIsLoading: (loading: boolean) => void;
  setDashboardMetrics: (data: DashboardMetrics) => void;
}

export const useStore = create<AppState>((set) => ({
  trafficMetrics: null,
  congestionLevel: 0,
  predictions: [],
  incidents: [],
  emergencyEvents: [],
  scenarioActive: false,
  demoMode: false,
  aiMessages: [
    {
      role: 'ai',
      content: 'Hello! I am your AI Traffic Assistant. I can help you analyze traffic patterns, predict congestion, and suggest mitigation strategies. How can I help?',
      timestamp: new Date().toISOString(),
    },
  ],
  selectedView: 'dashboard',
  isLoading: false,
  dashboardMetrics: null,

  setTrafficMetrics: (data) => set({ trafficMetrics: data }),
  setCongestionLevel: (level) => set({ congestionLevel: level }),
  setPredictions: (data) => set({ predictions: data }),
  addPrediction: (data) => set((s) => ({ predictions: [...s.predictions, data] })),
  setIncidents: (data) => set({ incidents: data }),
  addIncident: (data) => set((s) => ({ incidents: [...s.incidents, data] })),
  setEmergencyEvents: (data) => set({ emergencyEvents: data }),
  addEmergencyEvent: (data) => set((s) => ({ emergencyEvents: [...s.emergencyEvents, data] })),
  setScenarioActive: (active) => set({ scenarioActive: active }),
  setDemoMode: (mode) => set({ demoMode: mode }),
  addAiMessage: (msg) =>
    set((s) => ({
      aiMessages: [...s.aiMessages, { ...msg, timestamp: new Date().toISOString() }],
    })),
  setSelectedView: (view) => set({ selectedView: view }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setDashboardMetrics: (data) => set({ dashboardMetrics: data }),
}));
