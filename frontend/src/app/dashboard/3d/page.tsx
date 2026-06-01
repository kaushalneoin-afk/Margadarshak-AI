'use client'

import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SceneWrapper } from '@/components/3d/SceneWrapper'
import { AIExplanation } from '@/components/ai/AIExplanation'
import { Progress } from '@/components/ui/progress'
import { formatNumber, formatSpeed } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { Car, Gauge, AlertTriangle, Activity } from 'lucide-react'

export default function ThreeDPage() {
  const { dashboardMetrics } = useStore()

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-0">
        <div className="lg:col-span-3 relative">
          <SceneWrapper showHeatmap />

          <div className="absolute top-4 left-4 z-10">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="p-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-medium text-white">LIVE</span>
                  <Badge variant="info" className="text-[10px]">3D Digital Twin</Badge>
                </div>
              </Card>
            </motion.div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 overflow-x-auto pb-1"
            >
              {[
                { label: 'Total Vehicles', value: formatNumber(dashboardMetrics?.totalVehicles || 0), icon: Car, color: 'from-cyan-500 to-blue-600' },
                { label: 'Avg Speed', value: formatSpeed(dashboardMetrics?.averageSpeed || 0), icon: Gauge, color: 'from-green-500 to-emerald-600' },
                { label: 'Congestion', value: `${Math.round((dashboardMetrics?.congestionIndex || 0) * 100)}%`, icon: AlertTriangle, color: 'from-amber-500 to-red-600' },
                { label: 'Incidents', value: `${dashboardMetrics?.activeIncidents || 0}`, icon: Activity, color: 'from-purple-500 to-violet-600' },
              ].map((stat) => (
                <Card key={stat.label} className="p-3 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${stat.color}`}>
                      <stat.icon className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/50">{stat.label}</p>
                      <p className="text-sm font-bold text-white tabular-nums">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="border-l border-white/10 overflow-y-auto p-4 space-y-4 bg-black/40">
          <AIExplanation />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Zone Congestion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Downtown', value: 85, color: '#ff3355' },
                { name: 'Midtown', value: 62, color: '#ffaa00' },
                { name: 'Airport', value: 35, color: '#00f0ff' },
                { name: 'Industrial', value: 28, color: '#00ff88' },
                { name: 'Residential', value: 15, color: '#00ff88' },
              ].map((zone) => (
                <div key={zone.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">{zone.name}</span>
                    <span className="text-white font-medium">{zone.value}%</span>
                  </div>
                  <Progress value={zone.value} barClassName="h-1.5" color={zone.color} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Car className="w-4 h-4 text-cyan-400" />
                Traffic Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { road: 'Main St', direction: 'Northbound', flow: 87, color: '#ffaa00' },
                  { road: '5th Ave', direction: 'Southbound', flow: 72, color: '#ffaa00' },
                  { road: 'Highway 101', direction: 'Eastbound', flow: 45, color: '#00f0ff' },
                  { road: 'Broadway', direction: 'Westbound', flow: 22, color: '#00ff88' },
                ].map((road) => (
                  <div key={road.road} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0">
                    <div>
                      <span className="text-white/70">{road.road}</span>
                      <span className="text-white/30 ml-2">{road.direction}</span>
                    </div>
                    <Badge variant={
                      road.flow > 80 ? 'danger' : road.flow > 60 ? 'warning' : 'info'
                    } className="text-[10px]">
                      {road.flow}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
