'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Car, Timer, AlertTriangle, Ambulance, Route, Loader2, CheckCircle2 } from 'lucide-react'

const scenarios = [
  { id: 'normal', name: 'Normal Traffic', icon: Car, color: 'from-cyan-500 to-blue-600', desc: 'Regular patterns, moderate flow' },
  { id: 'rush_hour', name: 'Rush Hour', icon: Timer, color: 'from-amber-500 to-orange-600', desc: '200% volume increase' },
  { id: 'accident', name: 'Accident', icon: AlertTriangle, color: 'from-red-500 to-rose-600', desc: 'Multi-vehicle collision' },
  { id: 'emergency', name: 'Emergency', icon: Ambulance, color: 'from-purple-500 to-violet-600', desc: 'Ambulance corridor' },
  { id: 'city_congestion', name: 'City Crisis', icon: Route, color: 'from-red-600 to-orange-600', desc: 'City-wide congestion' },
]

export function ScenarioSimulator() {
  const [running, setRunning] = useState<string | null>(null)
  const [completed, setCompleted] = useState<string | null>(null)

  const handleRun = (id: string) => {
    setRunning(id)
    setCompleted(null)
    setTimeout(() => {
      setRunning(null)
      setCompleted(id)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-4 h-4 text-green-400" />
          Scenario Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {scenarios.map((s) => {
          const isRunning = running === s.id
          const isDone = completed === s.id
          return (
            <button
              key={s.id}
              onClick={() => handleRun(s.id)}
              disabled={running !== null}
              className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3
                ${isDone ? 'bg-green-500/10 border-green-500/30' :
                  isRunning ? 'bg-cyan-500/10 border-cyan-500/30' :
                  'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}
              `}
            >
              <div className={`p-2 rounded-lg bg-gradient-to-br ${s.color} ${isRunning ? 'animate-pulse' : ''}`}>
                {isRunning ? (
                  <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                ) : isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                ) : (
                  <s.icon className="w-3.5 h-3.5 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium ${isDone ? 'text-green-400' : isRunning ? 'text-cyan-400' : 'text-white'}`}>
                  {isRunning ? 'Simulating...' : isDone ? 'Complete!' : s.name}
                </p>
                <p className="text-[10px] text-white/30 truncate">{s.desc}</p>
              </div>
              {!isRunning && !isDone && (
                <Badge variant="outline" className="text-[9px] border-white/10 text-white/30">Run</Badge>
              )}
            </button>
          )
        })}
      </CardContent>
    </Card>
  )
}
