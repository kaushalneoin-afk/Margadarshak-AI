'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Ambulance, Route, Clock, Shield, Zap, MapPin, ChevronRight } from 'lucide-react'

export function EmergencyCorridor() {
  const [active, setActive] = useState(false)
  const [generating, setGenerating] = useState(false)

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setActive(true)
    }, 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
            <Ambulance className="w-3 h-3 text-white" />
          </div>
          Emergency Corridor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!active ? (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm font-medium text-red-400">Ambulance Detected</span>
              </div>
              <p className="text-xs text-white/50">Emergency vehicle en route to incident at Downtown Junction. Green corridor needed.</p>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Calculating Route...</>
              ) : (
                <><Route className="w-4 h-4" /> Generate Emergency Corridor</>
              )}
            </Button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-green-400 font-medium">Corridor Active</span>
                <Badge variant="success" className="text-[10px]">LIVE</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-white font-medium">
                <MapPin className="w-3.5 h-3.5 text-green-400" />
                Hospital District
                <ChevronRight className="w-3 h-3 text-white/30" />
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                Incident Site
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Clock, label: 'Normal Time', value: '14:32', color: 'text-red-400' },
                { icon: Zap, label: 'With Corridor', value: '8:15', color: 'text-green-400' },
                { icon: Shield, label: 'Time Saved', value: '6:17', color: 'text-cyan-400' },
                { icon: Route, label: 'Distance', value: '4.2 km', color: 'text-white' },
              ].map((s) => (
                <div key={s.label} className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-1 mb-0.5">
                    <s.icon className="w-3 h-3 opacity-60" />
                    <span className="text-[10px] text-white/40">{s.label}</span>
                  </div>
                  <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/20">
              <p className="text-xs text-green-400/80 font-medium flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Signal Priority Activated Across 8 Intersections
              </p>
            </div>

            <Button variant="glass" className="w-full" size="sm" onClick={() => setActive(false)}>
              Clear Corridor
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
