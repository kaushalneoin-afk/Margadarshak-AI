'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Lightbulb, Brain, Target, ListChecks } from 'lucide-react'
import { getCongestionColor } from '@/lib/utils'

const factors = [
  { name: 'Peak Hour Volume', impact: 0.85, description: 'Current time falls in peak traffic window' },
  { name: 'Weather Conditions', impact: 0.32, description: 'Light rain reducing visibility' },
  { name: 'Road Incidents', impact: 0.72, description: 'Accident on main corridor causing ripple effects' },
  { name: 'Special Events', impact: 0.45, description: 'Concert at stadium generating extra traffic' },
  { name: 'Traffic Signal Timing', impact: 0.28, description: 'Suboptimal signal coordination' },
]

const recommendations = [
  'Activate adaptive signal control at downtown intersections',
  'Deploy variable message signs for alternate route guidance',
  'Increase public transit frequency on affected corridors',
  'Pre-position emergency response teams at key bottlenecks',
]

export function AIExplanation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-400" />
          AI Prediction Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-white">Confidence Score</span>
            </div>
            <Badge variant="success" className="text-xs">91.2%</Badge>
          </div>
          <Progress value={91.2} barClassName="bg-gradient-to-r from-cyan-500 to-blue-600" />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-white">Key Factors</span>
          </div>
          <div className="space-y-2.5">
            {factors.map((factor, i) => (
              <motion.div
                key={factor.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70">{factor.name}</span>
                  <span className="text-white/50">{Math.round(factor.impact * 100)}%</span>
                </div>
                <Progress
                  value={factor.impact * 100}
                  barClassName="h-1.5"
                  color={getCongestionColor(factor.impact)}
                />
                <p className="text-[10px] text-white/30">{factor.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <ListChecks className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-white">Recommendations</span>
          </div>
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.5 }}
                className="flex items-start gap-2 text-xs text-white/60"
              >
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-[9px] font-bold">
                  {i + 1}
                </span>
                {rec}
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
