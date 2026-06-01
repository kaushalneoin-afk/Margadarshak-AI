'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { MetricsPanel } from '@/components/dashboard/MetricsPanel'
import { TrafficChart } from '@/components/dashboard/TrafficChart'
import { CongestionForecast } from '@/components/dashboard/CongestionForecast'
import { SceneWrapper } from '@/components/3d/SceneWrapper'
import { AICopilot } from '@/components/ai/AICopilot'
import { AIExplanation } from '@/components/ai/AIExplanation'
import { useStore } from '@/lib/store'
import {
  Car, AlertTriangle, Ambulance, Brain, RefreshCw, Play, StepForward,
  ListChecks, Sparkles, Loader2, CheckCircle2, Zap, BarChart3, Timer,
  Route, SkipForward, MapPin, Activity, Gauge, Flame, Video,
} from 'lucide-react'

const scenarios = [
  { id: 'normal', name: 'Normal Flow', desc: 'Regular traffic patterns with moderate congestion', icon: Car },
  { id: 'rush_hour', name: 'Rush Hour Surge', desc: 'Peak hour traffic with 200% volume increase', icon: Timer },
  { id: 'accident', name: 'Accident Response', desc: 'Multi-vehicle collision with emergency dispatch', icon: AlertTriangle },
  { id: 'emergency', name: 'Emergency Corridor', desc: 'Ambulance routing with green wave signals', icon: Ambulance },
  { id: 'city_congestion', name: 'Full Crisis Response', desc: 'Complex multi-incident city-wide response', icon: Route },
]

const demoSteps = [
  { icon: Car, label: 'Generate Traffic', desc: 'Spawning 18,427 vehicles across the network', status: 'pending' },
  { icon: Activity, label: 'Increase Density', desc: 'Rush hour surge activating in downtown core', status: 'pending' },
  { icon: Flame, label: 'Create Congestion', desc: 'Congestion building at key junctions', status: 'pending' },
  { icon: AlertTriangle, label: 'Trigger Accident', desc: 'Multi-vehicle collision detected on Highway 101', status: 'pending' },
  { icon: Ambulance, label: 'Dispatch Emergency', desc: 'Ambulance deployed with priority routing', status: 'pending' },
  { icon: Route, label: 'Generate Green Corridor', desc: 'Signal preemption active across 12 intersections', status: 'pending' },
  { icon: Brain, label: 'Run Prediction', desc: 'LSTM model forecasting 15/30/60 min congestion', status: 'pending' },
  { icon: BarChart3, label: 'Update Dashboard', desc: 'Real-time metrics flowing to command center', status: 'pending' },
  { icon: Sparkles, label: 'AI Explanation', desc: 'Generating explainable insights for all events', status: 'pending' },
  { icon: CheckCircle2, label: 'Final Recommendations', desc: '10-point optimization plan generated', status: 'pending' },
]

export default function DemoPage() {
  const [activeScenario, setActiveScenario] = useState('normal')
  const [demoRunning, setDemoRunning] = useState(false)
  const [demoStep, setDemoStep] = useState(-1)
  const [showDashboard, setShowDashboard] = useState(false)
  const [demoComplete, setDemoComplete] = useState(false)
  type StepStatus = 'pending' | 'running' | 'completed'
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(demoSteps.map(() => 'pending'))
  const [showLog, setShowLog] = useState(true)
  const logRef = useRef<HTMLDivElement>(null)
  const { addAiMessage, setDashboardMetrics } = useStore()

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [stepStatuses, demoStep])

  const runDemoSequence = useCallback(async () => {
    setDemoComplete(false)
    setShowDashboard(false)
    setDemoRunning(true)
    setDemoStep(0)
    setStepStatuses(demoSteps.map(() => 'pending'))

    const metricsUpdates = [
      { totalVehicles: 2500, congestionIndex: 0.15, averageSpeed: 55.0, activeIncidents: 0, emergencyAlerts: 0, predictedLoad: 18, vehicleDistribution: { cars: 62, trucks: 15, buses: 10, motorcycles: 12, emergency: 1 }, trends: { vehicles: 2.1, congestion: 0.5, speed: 1.2 } },
      { totalVehicles: 5800, congestionIndex: 0.28, averageSpeed: 48.5, activeIncidents: 0, emergencyAlerts: 0, predictedLoad: 32, vehicleDistribution: { cars: 60, trucks: 16, buses: 11, motorcycles: 11, emergency: 2 }, trends: { vehicles: 5.8, congestion: 2.1, speed: -0.8 } },
      { totalVehicles: 12500, congestionIndex: 0.62, averageSpeed: 32.1, activeIncidents: 2, emergencyAlerts: 0, predictedLoad: 65, vehicleDistribution: { cars: 58, trucks: 18, buses: 12, motorcycles: 9, emergency: 3 }, trends: { vehicles: 12.4, congestion: 8.7, speed: -5.3 } },
      { totalVehicles: 14800, congestionIndex: 0.78, averageSpeed: 22.5, activeIncidents: 4, emergencyAlerts: 1, predictedLoad: 82, vehicleDistribution: { cars: 55, trucks: 20, buses: 13, motorcycles: 8, emergency: 4 }, trends: { vehicles: 15.2, congestion: 12.1, speed: -8.7 } },
      { totalVehicles: 16500, congestionIndex: 0.82, averageSpeed: 18.2, activeIncidents: 5, emergencyAlerts: 2, predictedLoad: 89, vehicleDistribution: { cars: 53, trucks: 22, buses: 14, motorcycles: 7, emergency: 4 }, trends: { vehicles: 16.8, congestion: 14.3, speed: -10.2 } },
      { totalVehicles: 17200, congestionIndex: 0.80, averageSpeed: 20.5, activeIncidents: 5, emergencyAlerts: 2, predictedLoad: 85, vehicleDistribution: { cars: 54, trucks: 21, buses: 14, motorcycles: 7, emergency: 4 }, trends: { vehicles: 14.5, congestion: 11.2, speed: -8.1 } },
      { totalVehicles: 17800, congestionIndex: 0.78, averageSpeed: 24.8, activeIncidents: 6, emergencyAlerts: 2, predictedLoad: 80, vehicleDistribution: { cars: 54, trucks: 21, buses: 13, motorcycles: 8, emergency: 4 }, trends: { vehicles: 13.1, congestion: 9.8, speed: -6.5 } },
      { totalVehicles: 18100, congestionIndex: 0.75, averageSpeed: 28.5, activeIncidents: 6, emergencyAlerts: 2, predictedLoad: 76, vehicleDistribution: { cars: 55, trucks: 20, buses: 13, motorcycles: 8, emergency: 4 }, trends: { vehicles: 11.8, congestion: 8.2, speed: -4.9 } },
      { totalVehicles: 18300, congestionIndex: 0.73, averageSpeed: 30.2, activeIncidents: 7, emergencyAlerts: 3, predictedLoad: 72, vehicleDistribution: { cars: 55, trucks: 20, buses: 13, motorcycles: 8, emergency: 4 }, trends: { vehicles: 10.5, congestion: 7.1, speed: -3.8 } },
      { totalVehicles: 18427, congestionIndex: 0.72, averageSpeed: 32.1, activeIncidents: 7, emergencyAlerts: 3, predictedLoad: 70, vehicleDistribution: { cars: 52, trucks: 22, buses: 14, motorcycles: 7, emergency: 5 }, trends: { vehicles: 8.7, congestion: 5.6, speed: -2.4 } },
    ]

    for (let i = 0; i < demoSteps.length; i++) {
      setDemoStep(i)
      setStepStatuses(prev => {
        const next = [...prev]
        next[i] = 'running'
        return next
      })

      if (i > 0) {
        setStepStatuses(prev => {
          const next = [...prev]
          next[i - 1] = 'completed'
          return next
        })
        setDashboardMetrics(metricsUpdates[i - 1])
      }

      const waitTime = i === 0 ? 800 : 500 + Math.random() * 400
      await new Promise(r => setTimeout(r, waitTime))

      if (i === 4) {
        setShowDashboard(true)
      }
    }

    setStepStatuses(prev => {
      const next = [...prev]
      next[demoSteps.length - 1] = 'completed'
      return next
    })

    setDashboardMetrics(metricsUpdates[metricsUpdates.length - 1])

    addAiMessage({
      role: 'ai',
      content: '# 🚦 Full Demonstration Complete\n\n## System Summary\n\nAfter executing the complete AI traffic management sequence, here is the comprehensive analysis:\n\n### Network Status\n- **18,427 vehicles** actively tracked across the network\n- **72.3% congestion index** (reduced from peak of 82%)\n- **32.1 km/h average speed** (improving as interventions take effect)\n- **7 active incidents** being managed\n- **3 emergency corridors** operational\n\n### AI Actions Taken\n1. Traffic generation across 12 city zones\n2. Rush hour density management activated\n3. Congestion mitigation at 8 critical junctions\n4. Accident response team dispatched to Highway 101\n5. Emergency ambulance routed via green corridor\n6. Signal preemption at 12 intersections\n7. Predictive models updated with real-time data\n8. Dashboard metrics synchronized across all views\n9. AI explanations generated for all decisions\n10. 10-point optimization plan deployed\n\n### Recommendations\n| Priority | Action | Impact |\n|----------|--------|--------|\n| High | Adaptive signal control at Main & 5th | -25% delay |\n| High | Dynamic lane assignment on Highway 101 | +18% throughput |\n| Medium | Bus lane expansion on 4 corridors | +12% transit speed |\n| Medium | VMS deployment for alternate routing | -8% network load |\n| Low | Intersection geometry review | -5% conflict points |\n\n### Confidence\nOverall system confidence: **94.2%** based on historical validation across 50K+ data points.',
    })

    setDemoStep(demoSteps.length)
    setDemoRunning(false)
    setDemoComplete(true)
  }, [addAiMessage, setDashboardMetrics])

  const handleScenarioAction = async (action: string) => {
    addAiMessage({ role: 'user', content: `Execute: ${action}` })
    await new Promise(r => setTimeout(r, 400))
    const responses: Record<string, string> = {
      'Generate Traffic': '✅ Traffic generation complete. **18,427 vehicles** now active across the network. Density increased 340% in downtown zone.',
      'Create Congestion': '✅ Congestion scenario activated. Bottlenecks forming at Main & 5th (Index: 87%), Highway 101 (Index: 82%), and Downtown Core (Index: 79%).',
      'Trigger Accident': '🚨 Accident simulation triggered. Multi-vehicle collision at Highway 101 & Exit 42. Severity: SEVERE. 3 lanes blocked. Emergency response dispatched.',
      'Run Prediction': '📊 Prediction complete. 15min: LOW (12% confidence), 30min: HIGH (87% confidence), 60min: CRITICAL (94% confidence). Peak congestion expected at 18:23.',
      'Update Dashboard': '🔄 Dashboard synchronized. All 847 sensor feeds active. 12 KPI widgets updated. 3D city view refreshed with real-time traffic flow.',
      'Dispatch Ambulance': '🚑 Ambulance dispatched. Unit A-42 en route to incident. ETA: 8 minutes (with green corridor). Normal ETA: 14 minutes. Time saved: 6 minutes.',
    }
    addAiMessage({ role: 'ai', content: responses[action] || `✅ **${action}** executed successfully. System updated with real-time data.` })
  }

  const quickActions = [
    { icon: Car, label: 'Generate Traffic', color: 'from-cyan-500 to-blue-600' },
    { icon: Flame, label: 'Create Congestion', color: 'from-amber-500 to-red-500' },
    { icon: AlertTriangle, label: 'Trigger Accident', color: 'from-red-500 to-rose-600' },
    { icon: Ambulance, label: 'Dispatch Ambulance', color: 'from-purple-500 to-violet-600' },
    { icon: Brain, label: 'Run Prediction', color: 'from-emerald-500 to-teal-600' },
    { icon: BarChart3, label: 'Update Dashboard', color: 'from-green-500 to-emerald-600' },
  ]

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-red-600">
              <Play className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Interactive Demo</h1>
              <p className="text-white/50 text-sm">Experience the AI traffic management platform in action</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-cyan-400" />
                  Scenarios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {scenarios.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveScenario(s.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      activeScenario === s.id
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-white'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <s.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{s.name}</span>
                    </div>
                    <p className="text-xs text-white/40">{s.desc}</p>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    variant="glass"
                    size="sm"
                    className={`w-full justify-start text-xs bg-gradient-to-r ${action.color} bg-opacity-10 hover:bg-opacity-20 border-transparent`}
                    onClick={() => handleScenarioAction(action.label)}
                    disabled={demoRunning}
                  >
                    <action.icon className="w-3.5 h-3.5 mr-2" />
                    {action.label}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              onClick={runDemoSequence}
              disabled={demoRunning}
            >
              {demoRunning ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Running Demo...</>
              ) : demoComplete ? (
                <><RefreshCw className="w-4 h-4" /> Re-run Demo</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Run Full Demonstration</>
              )}
            </Button>
          </div>

          {/* Main content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Demo progress */}
            {(demoRunning || demoComplete) && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      {demoRunning ? (
                        <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      )}
                      {demoRunning ? 'Demo In Progress' : 'Demo Complete'}
                    </CardTitle>
                    <button
                      onClick={() => setShowLog(!showLog)}
                      className="text-xs text-white/40 hover:text-white/60"
                    >
                      {showLog ? 'Hide' : 'Show'} Log
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress
                    value={demoStep === demoSteps.length ? 100 : (demoStep / demoSteps.length) * 100}
                    barClassName="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600"
                    className="mb-4"
                  />
                  {showLog && (
                    <div ref={logRef} className="max-h-[200px] overflow-y-auto space-y-1.5 scrollbar-thin">
                      {demoSteps.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`flex items-center gap-2 text-xs py-1 px-2 rounded ${
                            stepStatuses[i] === 'completed' ? 'text-green-400 bg-green-500/5' :
                            stepStatuses[i] === 'running' ? 'text-cyan-400 bg-cyan-500/5' :
                            'text-white/20'
                          }`}
                        >
                          {stepStatuses[i] === 'completed' ? (
                            <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                          ) : stepStatuses[i] === 'running' ? (
                            <Loader2 className="w-3 h-3 animate-spin flex-shrink-0" />
                          ) : (
                            <div className="w-3 h-3 rounded-full border border-current flex-shrink-0" />
                          )}
                          <span className="font-medium">{step.label}</span>
                          <span className="text-[10px] opacity-60 ml-1">{step.desc}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Dashboard preview */}
            <AnimatePresence>
              {showDashboard && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <MetricsPanel />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TrafficChart />
                    <CongestionForecast />
                  </div>
                  <div className="h-[350px] rounded-xl overflow-hidden border border-white/10">
                    <SceneWrapper />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!showDashboard && !demoRunning && !demoComplete && (
              <div className="flex items-center justify-center h-[500px] rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mx-auto mb-6 border border-cyan-500/20">
                    <Sparkles className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Ready to Demonstrate</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-6">
                    Click <span className="text-cyan-400 font-medium">&quot;Run Full Demonstration&quot;</span> to experience the complete AI traffic management platform in a cinematic 10-step sequence, or use Quick Actions to test individual features.
                  </p>
                  <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
                    {demoSteps.slice(0, 5).map((step, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                          <step.icon className="w-3.5 h-3.5 text-white/30" />
                        </div>
                        <span className="text-[8px] text-white/20 text-center leading-tight">{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* AI Copilot at bottom */}
            <div className="h-[350px]">
              <AICopilot />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
