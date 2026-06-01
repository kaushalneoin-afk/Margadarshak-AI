'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, formatNumber, formatSpeed, formatPercent } from '@/lib/utils'
import {
  Car, AlertTriangle, Gauge, Shield, Ambulance, BarChart3,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import type { DashboardMetrics } from '@/types'

function getMetricValue(m: DashboardMetrics | null, key: string): number {
  if (!m) return 0
  switch (key) {
    case 'totalVehicles': return m.totalVehicles
    case 'congestionIndex': return m.congestionIndex
    case 'averageSpeed': return m.averageSpeed
    case 'activeIncidents': return m.activeIncidents
    case 'emergencyAlerts': return m.emergencyAlerts
    case 'predictedLoad': return m.predictedLoad
    default: return 0
  }
}

function getTrend(m: DashboardMetrics | null, key: string): number | undefined {
  if (!m?.trends) return undefined
  if (key === 'totalVehicles') return m.trends.vehicles
  if (key === 'congestionIndex') return m.trends.congestion
  if (key === 'averageSpeed') return m.trends.speed
  return undefined
}

const metricsConfig = [
  { key: 'totalVehicles', label: 'Total Vehicles', icon: Car, format: formatNumber, color: 'from-cyan-400 to-blue-400' },
  { key: 'congestionIndex', label: 'Congestion Index', icon: AlertTriangle, format: formatPercent, color: 'from-amber-400 to-red-400' },
  { key: 'averageSpeed', label: 'Average Speed', icon: Gauge, format: formatSpeed, color: 'from-green-400 to-emerald-400' },
  { key: 'activeIncidents', label: 'Active Incidents', icon: Shield, format: formatNumber, color: 'from-red-400 to-rose-400' },
  { key: 'emergencyAlerts', label: 'Emergency Alerts', icon: Ambulance, format: formatNumber, color: 'from-purple-400 to-violet-400' },
  { key: 'predictedLoad', label: 'Predicted Load', icon: BarChart3, format: (v: number) => v.toFixed(0) + '%', color: 'from-orange-400 to-amber-400' },
]

export function MetricsPanel() {
  const dashboardMetrics = useStore((s) => s.dashboardMetrics)

  const metrics = metricsConfig.map((cfg) => ({
    ...cfg,
    value: getMetricValue(dashboardMetrics, cfg.key),
    trend: getTrend(dashboardMetrics, cfg.key),
  }))

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
        >
          <Card className="p-4 h-full">
            <div className="flex items-start justify-between mb-3">
              <div className={cn('p-2 rounded-lg bg-gradient-to-br', metric.color, 'bg-opacity-10')}>
                <metric.icon className="w-4 h-4 text-white" />
              </div>
              {metric.trend !== undefined && (
                <Badge variant={metric.trend >= 0 ? 'danger' : 'success'} className="text-[10px]">
                  {metric.trend >= 0 ? '+' : ''}{metric.trend.toFixed(1)}%
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-xs text-white/50 font-medium uppercase tracking-wider">{metric.label}</p>
              <motion.p
                key={metric.value}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl font-bold text-white tabular-nums"
              >
                {metric.format(metric.value)}
              </motion.p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
