import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
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

export async function runPrediction(data?: { hours?: number }) {
  const { data: response } = await api.post('/api/predict', data || {});
  return response;
}

export async function runScenario(type: string) {
  const { data: response } = await api.post('/api/scenario/run', { type });
  return response;
}

export async function detectVideo(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/api/detect/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getEmergencyCorridor(request: { location: string; destination: string; type: string }) {
  const { data } = await api.post('/api/emergency/corridor', request);
  return data;
}

export async function reportAccident(data: { location: string; severity: string; description: string }) {
  const { data: response } = await api.post('/api/incidents/report', data);
  return response;
}

export async function aiChat(query: string, context?: string) {
  const { data } = await api.post('/api/ai/chat', { query, context });
  return data;
}

export async function aiExplain(data: { type: string; payload: unknown }) {
  const { data: response } = await api.post('/api/ai/explain', data);
  return response;
}

export async function runDemo() {
  const { data } = await api.post('/api/demo/run');
  return data;
}

export async function getActiveIncidents() {
  const { data } = await api.get('/api/incidents/active');
  return data;
}

export async function getPredictionHistory() {
  const { data } = await api.get('/api/predict/history');
  return data;
}

export async function getScenarios() {
  const { data } = await api.get('/api/scenarios');
  return data;
}

export default api;
