'use client'

import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { TrafficChart } from '@/components/dashboard/TrafficChart'
import { CongestionForecast } from '@/components/dashboard/CongestionForecast'
import { TrafficDistribution } from '@/components/dashboard/TrafficDistribution'
import { HeatmapView } from '@/components/dashboard/HeatmapView'
import { AIExplanation } from '@/components/ai/AIExplanation'
import { AICopilot } from '@/components/ai/AICopilot'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react'

const insights = [
  { label: 'Peak Hour Traffic', value: '+23.5%', trend: 'up', severity: 'high' },
  { label: 'Avg Speed Change', value: '-8.2%', trend: 'down', severity: 'warning' },
  { label: 'Incident Rate', value: '+12.1%', trend: 'up', severity: 'critical' },
  { label: 'Public Transit Usage', value: '+5.7%', trend: 'up', severity: 'low' },
]

export default function AnalyticsPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Advanced Analytics</h1>
        <p className="text-white/50 text-sm mt-1">Deep dive into traffic patterns and predictions</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {insights.map((insight) => (
          <Card key={insight.label} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/50">{insight.label}</span>
              <Badge variant={
                insight.severity === 'critical' ? 'danger' :
                insight.severity === 'high' ? 'warning' :
                insight.severity === 'warning' ? 'warning' : 'info'
              } className="text-[10px]">
                {insight.severity}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">{insight.value}</span>
              {insight.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-red-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-green-400" />
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrafficChart />
        <CongestionForecast />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TrafficDistribution />
        <div className="lg:col-span-2">
          <HeatmapView />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                System Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Data Pipeline Throughput', value: 94, suffix: '%', status: 'success' },
                { label: 'AI Inference Latency', value: 28, suffix: 'ms', status: 'info' },
                { label: 'API Availability', value: 99.9, suffix: '%', status: 'success' },
                { label: 'WebSocket Connections', value: 1247, suffix: '', status: 'info' },
                { label: 'Cache Hit Rate', value: 87, suffix: '%', status: 'warning' },
              ].map((metric) => (
                <div key={metric.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">{metric.label}</span>
                    <span className="text-white font-medium tabular-nums">{metric.value}{metric.suffix}</span>
                  </div>
                  <Progress
                    value={typeof metric.value === 'number' ? metric.value : 0}
                    max={metric.suffix === 'ms' ? 100 : 100}
                    barClassName={metric.status === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 
                      metric.status === 'warning' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                      'bg-gradient-to-r from-cyan-500 to-blue-500'}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <AIExplanation />
        </div>
      </div>

      <div className="h-[400px]">
        <AICopilot />
      </div>
    </div>
  )
}
