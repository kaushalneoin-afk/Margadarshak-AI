'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Eye, BarChart3, AlertTriangle, Shield, Ambulance, Bot, Box, Flame, TrendingUp, Activity } from 'lucide-react'

const features = [
  { icon: Eye, title: 'Vehicle Detection', tag: 'Computer Vision', description: 'YOLOv8-based real-time vehicle detection from traffic camera feeds. Detects and classifies cars, bikes, buses, trucks, and emergency vehicles with 98.5% accuracy. Generates vehicle counts, speed estimates, and density analysis for every frame.', color: 'from-cyan-400 to-blue-400' },
  { icon: TrendingUp, title: 'Traffic Prediction', tag: 'AI/ML', description: 'Multi-time horizon congestion prediction using LSTM and XGBoost ensembles. Predicts traffic conditions 15, 30, and 60 minutes ahead with confidence scoring. Factors in historical patterns, weather data, events, and real-time sensor inputs.', color: 'from-blue-400 to-purple-400' },
  { icon: Route, title: 'Emergency Corridor', tag: 'Emergency Response', description: 'Intelligent emergency vehicle routing with automatic traffic signal preemption. Detects ambulances in traffic, generates fastest green wave corridors, and provides estimated time saved. Reduce emergency response times by up to 40%.', color: 'from-purple-400 to-violet-400' },
  { icon: AlertTriangle, title: 'Accident Detection', tag: 'Incident Management', description: 'AI-powered automatic accident detection from traffic camera feeds. Identifies road blockages, sudden stops, possible collisions, and anomalous events. Assesses severity, impact zone, and generates recovery estimates with diversion suggestions.', color: 'from-red-400 to-rose-400' },
  { icon: Bot, title: 'AI Copilot', tag: 'Conversational AI', description: 'Natural language traffic management assistant. Ask questions about congestion, get prediction explanations, request optimization strategies, and receive real-time traffic insights. Every response includes explainable AI reasoning with confidence metrics.', color: 'from-cyan-400 to-teal-400' },
  { icon: BarChart3, title: 'Smart Dashboard', tag: 'Operations', description: 'Enterprise-grade traffic command center with real-time KPIs, interactive charts, heatmaps, and live 3D city view. Monitor total vehicles, congestion index, average speed, active incidents, and emergency alerts at a glance.', color: 'from-green-400 to-emerald-400' },
  { icon: Box, title: '3D Digital Twin', tag: 'Visualization', description: 'Real-time 3D city simulation powered by Three.js and React Three Fiber. Animated vehicles, dynamic traffic lights, building models, and congestion heatmap overlays. Interactive orbital controls for full city exploration.', color: 'from-indigo-400 to-blue-400' },
  { icon: Flame, title: 'Heatmaps', tag: 'Analytics', description: 'Real-time congestion heatmaps overlay on the 3D city view. Color-coded zones from green (free flow) through yellow and orange to red (critical congestion). Identify bottleneck areas instantly across the entire city network.', color: 'from-orange-400 to-amber-400' },
  { icon: Activity, title: 'Forecasting Engine', tag: 'Predictions', description: 'Advanced time-series forecasting engine using ensemble ML models. Analyzes historical traffic patterns, current conditions, and external factors to predict future congestion. Provides actionable recommendations with explainable AI.', color: 'from-cyan-400 to-blue-400' },
]

function Route({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
}

function RouteIcon(props: React.SVGProps<SVGSVGElement>) {
  return <Route className="w-5 h-5 text-white" {...props} />
}

export function FeaturesSection() {
  const [selected, setSelected] = useState<number | null>(null)

  const gridFeatures = features.map((f, i) => ({
    ...f,
    icon: i === 2 ? RouteIcon : f.icon,
  }))

  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/5 to-black" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-cyan-400/60 font-medium mb-4 block">Capabilities</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Platform Features</h2>
          <p className="text-white/50 max-w-2xl mx-auto text-lg">
            Nine integrated modules that work together to create a comprehensive traffic intelligence platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gridFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className="p-6 h-full cursor-pointer group hover:border-cyan-500/30 transition-all duration-300 relative overflow-hidden"
                onClick={() => setSelected(i)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-blue-600/0 group-hover:from-cyan-500/5 group-hover:to-blue-600/5 transition-all duration-500" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-10 w-fit group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant="outline" className="text-[10px] border-white/10 text-white/40">{feature.tag}</Badge>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed line-clamp-2">{feature.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selected !== null && (() => {
            const feat = gridFeatures[selected]
            const IconComponent = feat.icon
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={() => setSelected(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="max-w-lg w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Card className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${feat.color}`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-white/10 text-white/40">{feat.tag}</Badge>
                        <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                    <p className="text-white/60 leading-relaxed">{feat.description}</p>
                    <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs text-white/30">
                        This module integrates with all other platform components through the AI pipeline.
                      </p>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            )
          })()}
        </AnimatePresence>
      </div>
    </section>
  )
}
