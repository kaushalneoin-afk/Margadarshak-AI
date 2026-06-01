import axios from 'axios';
import type { ManualAnalysisInput, ManualAnalysisResult, JudgeEvaluationInput, JudgeEvaluationResult } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

export async function getTrafficCurrent() {
  const { data } = await api.get('/api/traffic/current');
  return data;
}

export async function getTrafficHistory(params?: { hours?: number }) {
  const { data } = await api.get('/api/traffic/history', { params });
  return data;
}

export async function getDashboardMetrics() {
  const { data } = await api.get('/api/dashboard/metrics');
  return data;
}

export async function getChartData(type: string) {
  const { data } = await api.get(`/api/dashboard/charts/${type}`);
  return data;
}

export async function processTrafficData(data: unknown) {
  const { data: response } = await api.post('/api/traffic/process', data);
  return response;
}

export async function runPrediction(data?: { vehicle_count?: number; average_speed?: number; lane_occupancy?: number }) {
  const { data: response } = await api.post('/api/predict', data || { vehicle_count: 500, average_speed: 30, lane_occupancy: 50 });
  return response;
}

export async function runScenario(type: string, intensity = 0.5) {
  const { data: response } = await api.post('/api/scenario/run', { scenario_type: type, intensity });
  return response;
}

export async function detectVideo(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/api/video/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function uploadCsv(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/api/traffic/csv/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getEmergencyCorridor(request: { current_location: object; destination: object; ambulance_id: string; traffic_density: string }) {
  const { data } = await api.post('/api/emergency/corridor', request);
  return data;
}

export async function reportAccident(data: { location: object; severity: string; vehicles_involved: number }) {
  const { data: response } = await api.post('/api/accident/report', data);
  return response;
}

export async function aiChat(query: string, context?: Record<string, unknown>) {
  const { data } = await api.post('/api/ai/chat', { query, context: context || {} });
  return data;
}

export async function aiExplain(query: string, context?: Record<string, unknown>) {
  const { data: response } = await api.post('/api/ai/explain', { query, context: context || {} });
  return response;
}

export async function manualAnalyze(input: ManualAnalysisInput): Promise<ManualAnalysisResult> {
  const { data } = await api.post('/api/analyze/manual', input);
  return data.analysis;
}

export async function judgeEvaluate(input: JudgeEvaluationInput): Promise<JudgeEvaluationResult> {
  const { data } = await api.post('/api/judge/evaluate', input);
  return data.judgment;
}

export async function runDemo() {
  const { data } = await api.post('/api/demo/run');
  return data;
}

export async function getActiveIncidents() {
  const { data } = await api.get('/api/accidents/active');
  return data;
}

export async function getPredictionHistory() {
  const { data } = await api.get('/api/predictions/history');
  return data;
}

export async function getScenarios() {
  const { data } = await api.get('/api/scenarios');
  return data;
}

export default api;
