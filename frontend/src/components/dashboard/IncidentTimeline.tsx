'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getSeverityColor, formatTime } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { AlertCircle, AlertTriangle, Info } from 'lucide-react'

const sampleIncidents = [
  { id: '1', type: 'accident', severity: 'high', location: 'Main St & 5th Ave', description: 'Multi-vehicle collision', timestamp: new Date().toISOString(), status: 'active' as const },
  { id: '2', type: 'congestion', severity: 'medium', location: 'Highway 101', description: 'Heavy traffic buildup', timestamp: new Date(Date.now() - 900000).toISOString(), status: 'active' as const },
  { id: '3', type: 'emergency', severity: 'critical', location: 'Downtown Core', description: 'Emergency vehicle dispatched', timestamp: new Date(Date.now() - 1800000).toISOString(), status: 'responding' as const },
  { id: '4', type: 'road_closure', severity: 'low', location: 'Oak Street', description: 'Road maintenance', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'investigating' as const },
]

export function IncidentTimeline() {
  const incidents = useStore((s) => s.incidents)
  const items = incidents.length > 0 ? incidents : sampleIncidents

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          Active Incidents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 scrollbar-thin">
          {items.map((incident, i) => (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex-shrink-0 mt-0.5">
                {incident.severity === 'critical' || incident.severity === 'high' ? (
                  <AlertCircle className="w-4 h-4" style={{ color: getSeverityColor(incident.severity) }} />
                ) : (
                  <AlertTriangle className="w-4 h-4" style={{ color: getSeverityColor(incident.severity) }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-white truncate">{incident.location}</span>
                  <Badge variant={
                    incident.severity === 'critical' ? 'danger' :
                    incident.severity === 'high' ? 'warning' :
                    'info'
                  } className="text-[10px] uppercase">
                    {incident.severity}
                  </Badge>
                </div>
                <p className="text-xs text-white/60 truncate">{incident.description}</p>
                <p className="text-[10px] text-white/30 mt-0.5">{formatTime(incident.timestamp)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
