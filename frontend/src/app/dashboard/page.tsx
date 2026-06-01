'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tabs } from '@/components/ui/tabs'
import { MetricsPanel } from '@/components/dashboard/MetricsPanel'
import { TrafficChart } from '@/components/dashboard/TrafficChart'
import { CongestionForecast } from '@/components/dashboard/CongestionForecast'
import { IncidentTimeline } from '@/components/dashboard/IncidentTimeline'
import { TrafficDistribution } from '@/components/dashboard/TrafficDistribution'
import { HeatmapView } from '@/components/dashboard/HeatmapView'
import { ComputerVision } from '@/components/dashboard/ComputerVision'
import { EmergencyCorridor } from '@/components/dashboard/EmergencyCorridor'
import { ScenarioSimulator } from '@/components/dashboard/ScenarioSimulator'
import { AICopilot } from '@/components/ai/AICopilot'
import { AIExplanation } from '@/components/ai/AIExplanation'
import { SceneWrapper } from '@/components/3d/SceneWrapper'
import { ManualAnalyzer } from '@/components/dashboard/ManualAnalyzer'
import { JudgeMode } from '@/components/dashboard/JudgeMode'
import { useStore } from '@/lib/store'
import { getDashboardMetrics } from '@/lib/api'
import { LayoutDashboard, Box, BarChart3 } from 'lucide-react'

const viewTabs = [
  { id: 'dashboard', label: 'Command Center', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: '3d', label: '3D Digital Twin', icon: <Box className="w-4 h-4" /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
]

export default function DashboardPage() {
  const { selectedView, setSelectedView, setDashboardMetrics, setIsLoading } = useStore()

  useEffect(() => {
    setIsLoading(true)
    getDashboardMetrics()
      .then((data) => setDashboardMetrics(data))
      .catch(() => {
        setDashboardMetrics({
          totalVehicles: 12847,
          congestionIndex: 0.673,
          averageSpeed: 38.2,
          activeIncidents: 4,
          emergencyAlerts: 2,
          predictedLoad: 78,
          vehicleDistribution: { cars: 58, trucks: 18, buses: 12, motorcycles: 8, emergency: 4 },
          trends: { vehicles: 5.2, congestion: 3.8, speed: -2.1 },
        })
      })
      .finally(() => setIsLoading(false))
  }, [setDashboardMetrics, setIsLoading])

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Traffic Command Center</h1>
            </div>
            <p className="text-white/50 text-sm ml-11">Real-time urban traffic monitoring & control</p>
          </div>
          <Tabs tabs={viewTabs} defaultTab={selectedView} onChange={(id) => setSelectedView(id as 'dashboard' | '3d' | 'analytics')} />
        </motion.div>

        {selectedView === 'dashboard' && (
          <div className="space-y-6">
            <MetricsPanel />

            {/* Main content grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Left column - Charts */}
              <div className="xl:col-span-3 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TrafficChart />
                  <CongestionForecast />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <IncidentTimeline />
                  <TrafficDistribution />
                </div>
                <div className="h-[350px] rounded-xl overflow-hidden border border-white/10">
                  <SceneWrapper />
                </div>
              </div>

              {/* Right column - Side panels */}
              <div className="space-y-6">
                <ScenarioSimulator />
                <ComputerVision />
                <EmergencyCorridor />
              </div>
            </div>

            {/* Bottom row - Analysis + AI */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-6">
                <HeatmapView />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ManualAnalyzer />
                  <JudgeMode />
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-[420px]">
                  <AICopilot />
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedView === '3d' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 h-[75vh] rounded-xl overflow-hidden border border-white/10">
              <SceneWrapper showHeatmap />
            </div>
            <div className="lg:col-span-2 space-y-6 overflow-y-auto max-h-[75vh]">
              <AIExplanation />
              <ComputerVision />
              <EmergencyCorridor />
            </div>
          </div>
        )}

        {selectedView === 'analytics' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TrafficChart />
                <CongestionForecast />
              </div>
              <HeatmapView />
              <div className="h-[300px] rounded-xl overflow-hidden border border-white/10">
                <SceneWrapper />
              </div>
            </div>
            <div className="space-y-6">
              <TrafficDistribution />
              <IncidentTimeline />
              <AIExplanation />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
