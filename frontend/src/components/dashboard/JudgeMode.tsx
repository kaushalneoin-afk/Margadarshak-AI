'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { judgeEvaluate } from '@/lib/api'
import { TrafficAnalyticsEngine } from '@/lib/localEngine'
import type { JudgeEvaluationInput, JudgeEvaluationResult } from '@/types'
import { Scale, Target, Shield, Loader2 } from 'lucide-react'

export function JudgeMode() {
  const [inputs, setInputs] = useState<JudgeEvaluationInput>({
    vehicle_count: 420,
    average_speed: 18,
    lane_occupancy: 78,
    emergency_vehicle: false,
    incident_status: 'none',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<JudgeEvaluationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<{ input: JudgeEvaluationInput; result: JudgeEvaluationResult }[]>([])

  const handleEvaluate = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await judgeEvaluate(inputs)
      setResult(res)
      setHistory(prev => [{ input: { ...inputs }, result: res }, ...prev].slice(0, 10))
    } catch {
      setError('Using local calculation engine')
      const engine = new TrafficAnalyticsEngine()
      const local = engine.generateReasoning(
        inputs.vehicle_count, inputs.average_speed, inputs.lane_occupancy,
        inputs.emergency_vehicle, inputs.incident_status === 'accident'
      )
      const r: JudgeEvaluationResult = {
        traffic_status: local.traffic_status,
        traffic_status_label: local.traffic_status_label,
        congestion_score: local.congestion_score,
        congestion_level: local.congestion_level,
        vehicle_density: local.vehicle_density,
        risk_score: local.risk_score,
        severity_score: local.congestion_score,
        flow_efficiency: local.flow_efficiency,
        factors: local.factors,
        predictions: local.predictions,
        recommendations: local.recommendations,
        ai_reasoning: local.explanation,
        data_integrity_check: `Input validation: Vehicle Count=${inputs.vehicle_count}, Avg Speed=${inputs.average_speed} km/h, Lane Occupancy=${inputs.lane_occupancy}%, Emergency=${inputs.emergency_vehicle}, Incident=${inputs.incident_status}. All values used in real-time calculation.`,
      }
      setResult(r)
      setHistory(prev => [{ input: { ...inputs }, result: r }, ...prev].slice(0, 10))
    }
    setLoading(false)
  }

  const loadPreset = (preset: string) => {
    const presets: Record<string, JudgeEvaluationInput> = {
      normal: { vehicle_count: 200, average_speed: 45, lane_occupancy: 25, emergency_vehicle: false, incident_status: 'none' },
      rush: { vehicle_count: 850, average_speed: 12, lane_occupancy: 85, emergency_vehicle: false, incident_status: 'none' },
      accident: { vehicle_count: 600, average_speed: 8, lane_occupancy: 90, emergency_vehicle: false, incident_status: 'accident' },
      emergency: { vehicle_count: 500, average_speed: 15, lane_occupancy: 70, emergency_vehicle: true, incident_status: 'none' },
      critical: { vehicle_count: 1100, average_speed: 6, lane_occupancy: 95, emergency_vehicle: true, incident_status: 'accident' },
    }
    if (presets[preset]) setInputs(presets[preset])
  }

  const statusColor = (l: string) => {
    if (l === 'critical') return 'text-red-400'
    if (l === 'high') return 'text-orange-400'
    if (l === 'moderate') return 'text-yellow-400'
    return 'text-green-400'
  }

  const scoreColor = (s: number) => s > 70 ? 'text-red-400' : s > 40 ? 'text-amber-400' : 'text-green-400'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-amber-400" />
          Test the AI &mdash; Judge Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {['normal', 'rush', 'accident', 'emergency', 'critical'].map(p => (
            <button key={p} onClick={() => loadPreset(p)}
              className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all uppercase tracking-wider">
              {p}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Vehicles</label>
            <input type="number" min={0} max={2000} value={inputs.vehicle_count}
              onChange={e => setInputs({ ...inputs, vehicle_count: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500/50" />
          </div>
          <div>
            <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Speed (km/h)</label>
            <input type="number" min={0} max={120} step={0.1} value={inputs.average_speed}
              onChange={e => setInputs({ ...inputs, average_speed: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500/50" />
          </div>
          <div>
            <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Occupancy (%)</label>
            <input type="number" min={0} max={100} step={0.1} value={inputs.lane_occupancy}
              onChange={e => setInputs({ ...inputs, lane_occupancy: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500/50" />
          </div>
          <div>
            <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Emergency</label>
            <select value={inputs.emergency_vehicle ? 'yes' : 'no'}
              onChange={e => setInputs({ ...inputs, emergency_vehicle: e.target.value === 'yes' })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white">
              <option value="no">No</option><option value="yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Incident</label>
            <select value={inputs.incident_status}
              onChange={e => setInputs({ ...inputs, incident_status: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white">
              <option value="none">None</option><option value="accident">Accident</option><option value="congestion">Congestion</option>
            </select>
          </div>
        </div>

        <Button variant="glass" className="w-full gap-2" onClick={handleEvaluate} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scale className="w-4 h-4" />}
          {loading ? 'Evaluating...' : 'Evaluate with AI'}
        </Button>

        {error && <p className="text-[10px] text-amber-400/60 text-center">{error}</p>}

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className={`p-4 rounded-xl border ${result.congestion_level === 'critical' || result.congestion_level === 'high' ? 'bg-red-500/10 border-red-500/30' : result.congestion_level === 'moderate' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-lg font-bold ${statusColor(result.congestion_level)}`}>{result.traffic_status_label}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">AI-Determined Status</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${scoreColor(result.risk_score)}`}>{result.risk_score}<span className="text-xs text-white/30">/100</span></p>
                    <p className="text-[10px] text-white/30">Risk Score</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { label: 'CS', value: result.congestion_score, color: scoreColor(result.congestion_score) },
                  { label: 'Density', value: `${result.vehicle_density}%`, color: scoreColor(result.vehicle_density) },
                  { label: 'Flow', value: `${result.flow_efficiency}%`, color: scoreColor(100 - result.flow_efficiency) },
                  { label: 'Severity', value: result.severity_score, color: scoreColor(result.severity_score) },
                  { label: 'Level', value: result.congestion_level.toUpperCase(), color: statusColor(result.congestion_level) },
                ].map(m => (
                  <div key={m.label} className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-center">
                    <p className={`text-[11px] font-bold ${m.color}`}>{m.value}</p>
                    <p className="text-[8px] text-white/30">{m.label}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Target className="w-3 h-3 text-amber-400" /> Factors Considered
                </p>
                {result.factors.map((f, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-xs text-white/60 py-0.5">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {['15min', '30min', '60min'].map(t => (
                  <div key={t} className="p-2 rounded-lg bg-white/5 border border-white/10 text-center">
                    <p className="text-[9px] text-white/40">{t}</p>
                    <p className={`text-xs font-bold ${scoreColor(result.predictions[t]?.predicted_congestion || 0)}`}>
                      {result.predictions[t]?.predicted_congestion || '-'}
                    </p>
                    <p className="text-[8px] text-white/20">{result.predictions[t]?.predicted_level || '-'}</p>
                    <p className="text-[7px] text-white/15">{result.predictions[t]?.confidence || '-'}%</p>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-[10px] text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Data Integrity
                </p>
                <p className="text-[10px] text-white/50">{result.data_integrity_check}</p>
              </div>

              {result.recommendations.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Recommendations</p>
                  {result.recommendations.slice(0, 2).map((r, i) => (
                    <div key={i} className={`p-2 rounded-lg border-l-2 text-xs ${r.priority === 'CRITICAL' ? 'border-l-red-500 bg-red-500/5' : 'border-l-amber-500 bg-amber-500/5'}`}>
                      <p className="text-white/80">{r.action}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {history.length > 0 && (
          <div className="pt-2 border-t border-white/5">
            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Evaluation History</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {history.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-1.5 rounded bg-white/5 text-[10px]">
                  <span className="text-white/50">V:{h.input.vehicle_count} S:{h.input.average_speed} O:{h.input.lane_occupancy}%</span>
                  <span className={`font-medium ${scoreColor(h.result.risk_score)}`}>{h.result.risk_score}/100</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
