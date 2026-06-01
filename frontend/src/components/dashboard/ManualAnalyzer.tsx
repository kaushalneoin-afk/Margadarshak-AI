'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { manualAnalyze } from '@/lib/api'
import type { ManualAnalysisInput, ManualAnalysisResult } from '@/types'
import { Brain, Car, Gauge, Activity, AlertTriangle, Cloud, Route, BarChart3, Loader2, ArrowRight } from 'lucide-react'

export function ManualAnalyzer() {
  const [inputs, setInputs] = useState<ManualAnalysisInput>({
    vehicle_count: 350,
    average_speed: 25,
    lane_occupancy: 65,
    emergency_vehicle: false,
    accident_present: false,
    weather_condition: 'clear',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ManualAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await manualAnalyze(inputs)
      setResult(res)
    } catch (e) {
      setError('Analysis failed. Using local calculation.')
      const { TrafficAnalyticsEngine } = await import('@/lib/localEngine')
      const engine = new TrafficAnalyticsEngine()
      const local = engine.generateReasoning(
        inputs.vehicle_count, inputs.average_speed, inputs.lane_occupancy,
        inputs.emergency_vehicle, inputs.accident_present, inputs.weather_condition
      )
      setResult(local)
    }
    setLoading(false)
  }

  const statusColor = (s: string) => {
    if (s.includes('CRITICAL')) return 'text-red-400'
    if (s.includes('HIGH')) return 'text-orange-400'
    if (s.includes('MODERATE')) return 'text-yellow-400'
    return 'text-green-400'
  }

  const scoreColor = (s: number) => s > 70 ? 'text-red-400' : s > 40 ? 'text-amber-400' : 'text-green-400'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-400" />
          AI Traffic Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] text-white/40 uppercase tracking-wider flex items-center gap-1 mb-1">
              <Car className="w-3 h-3" /> Vehicle Count
            </label>
            <input type="number" min={0} max={2000} value={inputs.vehicle_count}
              onChange={e => setInputs({ ...inputs, vehicle_count: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500/50" />
          </div>
          <div>
            <label className="text-[10px] text-white/40 uppercase tracking-wider flex items-center gap-1 mb-1">
              <Gauge className="w-3 h-3" /> Avg Speed (km/h)
            </label>
            <input type="number" min={0} max={120} step={0.1} value={inputs.average_speed}
              onChange={e => setInputs({ ...inputs, average_speed: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500/50" />
          </div>
          <div>
            <label className="text-[10px] text-white/40 uppercase tracking-wider flex items-center gap-1 mb-1">
              <Activity className="w-3 h-3" /> Lane Occupancy (%)
            </label>
            <input type="number" min={0} max={100} step={0.1} value={inputs.lane_occupancy}
              onChange={e => setInputs({ ...inputs, lane_occupancy: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500/50" />
          </div>
          <div>
            <label className="text-[10px] text-white/40 uppercase tracking-wider flex items-center gap-1 mb-1">
              <AlertTriangle className="w-3 h-3" /> Emergency Vehicle
            </label>
            <select value={inputs.emergency_vehicle ? 'yes' : 'no'}
              onChange={e => setInputs({ ...inputs, emergency_vehicle: e.target.value === 'yes' })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500/50">
              <option value="no">No</option><option value="yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-white/40 uppercase tracking-wider flex items-center gap-1 mb-1">
              <AlertTriangle className="w-3 h-3" /> Accident Present
            </label>
            <select value={inputs.accident_present ? 'yes' : 'no'}
              onChange={e => setInputs({ ...inputs, accident_present: e.target.value === 'yes' })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500/50">
              <option value="no">No</option><option value="yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-white/40 uppercase tracking-wider flex items-center gap-1 mb-1">
              <Cloud className="w-3 h-3" /> Weather
            </label>
            <select value={inputs.weather_condition}
              onChange={e => setInputs({ ...inputs, weather_condition: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500/50">
              <option value="clear">Clear</option><option value="rain">Rain</option><option value="fog">Fog</option><option value="storm">Storm</option>
            </select>
          </div>
        </div>

        <Button variant="glass" className="w-full gap-2" onClick={handleAnalyze} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
          {loading ? 'Analyzing...' : 'Run AI Analysis'}
        </Button>

        {error && <p className="text-[10px] text-amber-400">{error}</p>}

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className={`p-4 rounded-xl border ${result.congestion_level === 'critical' || result.congestion_level === 'high' ? 'bg-red-500/5 border-red-500/20' : result.congestion_level === 'moderate' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
                <p className={`text-lg font-bold ${statusColor(result.traffic_status)}`}>{result.traffic_status}</p>
                <p className="text-xs text-white/40 mt-1">Traffic Status</p>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Risk Score', value: `${result.risk_score}/100`, color: scoreColor(result.risk_score) },
                  { label: 'Congestion', value: `${result.congestion_score}/100`, color: scoreColor(result.congestion_score) },
                  { label: 'Density', value: `${result.vehicle_density}%`, color: scoreColor(result.vehicle_density) },
                  { label: 'Flow Eff.', value: `${result.flow_efficiency}%`, color: scoreColor(100 - result.flow_efficiency) },
                ].map(m => (
                  <div key={m.label} className="p-2 rounded-lg bg-white/5 border border-white/10 text-center">
                    <p className={`text-xs font-bold ${m.color}`}>{m.value}</p>
                    <p className="text-[9px] text-white/30">{m.label}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Contributing Factors
                </p>
                <ul className="space-y-1">
                  {result.factors.slice(0, 4).map((f, i) => (
                    <li key={i} className="text-xs text-white/60 flex gap-1.5">
                      <span className="text-purple-400 mt-0.5">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {['15min', '30min', '60min'].map(t => (
                  <div key={t} className="p-2 rounded-lg bg-white/5 border border-white/10 text-center">
                    <p className="text-[9px] text-white/40">{t} Forecast</p>
                    <p className={`text-xs font-bold ${scoreColor(result.predictions[t]?.predicted_congestion || 0)}`}>
                      {result.predictions[t]?.predicted_congestion || '-'}/100
                    </p>
                    <p className="text-[9px] text-white/30">{result.predictions[t]?.predicted_level || '-'}</p>
                    <p className="text-[8px] text-white/20">{result.predictions[t]?.confidence || '-'}% conf</p>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <p className="text-[10px] text-purple-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" /> AI Reasoning
                </p>
                <p className="text-xs text-white/60 whitespace-pre-line leading-relaxed">{result.explanation}</p>
              </div>

              {result.recommendations.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider flex items-center gap-1">
                    <Route className="w-3 h-3" /> Recommendations
                  </p>
                  {result.recommendations.slice(0, 3).map((r, i) => (
                    <div key={i} className={`p-2 rounded-lg border-l-2 ${r.priority === 'CRITICAL' ? 'border-l-red-500 bg-red-500/5' : r.priority === 'HIGH' ? 'border-l-amber-500 bg-amber-500/5' : 'border-l-blue-500 bg-blue-500/5'}`}>
                      <p className="text-xs text-white/80 font-medium">{r.action}</p>
                      <p className="text-[10px] text-white/40 mt-0.5">{r.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
