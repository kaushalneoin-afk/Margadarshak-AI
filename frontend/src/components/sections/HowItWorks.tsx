'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Camera, Scan, Fingerprint, BarChart3, TrendingUp, GitBranch, Box, ShieldCheck, ChevronRight, ArrowDown } from 'lucide-react'

const steps = [
  { icon: Camera, title: 'Traffic Cameras', description: 'Real-time video feeds from traffic cameras capture raw traffic data across the entire city network. Every vehicle, pedestrian, and movement is recorded for AI analysis.' },
  { icon: Scan, title: 'Vehicle Detection', description: 'YOLO-based computer vision detects and classifies vehicles in real-time — cars, bikes, buses, trucks, and emergency vehicles. Each vehicle is identified with 98.5% accuracy.' },
  { icon: Fingerprint, title: 'Vehicle Tracking', description: 'DeepSORT tracking algorithm assigns unique IDs to each vehicle, tracking movement paths, speed, direction, and lane changes across multiple camera views.' },
  { icon: BarChart3, title: 'Traffic Analytics', description: 'Real-time analytics engine processes detection data to compute vehicle counts, average speed, lane occupancy, density maps, and traffic flow metrics every second.' },
  { icon: TrendingUp, title: 'Congestion Prediction', description: 'LSTM and XGBoost AI models analyze historical patterns and real-time data to predict congestion levels 15, 30, and 60 minutes ahead with confidence scoring.' },
  { icon: GitBranch, title: 'Optimization Engine', description: 'AI-driven optimization recommends adaptive signal timing, dynamic routing, lane management, and traffic flow adjustments to minimize congestion city-wide.' },
  { icon: Box, title: 'Digital Twin', description: 'A real-time 3D digital twin of the city visualizes every vehicle, traffic light, and congestion zone. The virtual city mirrors the physical world with sub-second latency.' },
  { icon: ShieldCheck, title: 'Decision Support', description: 'Actionable intelligence delivered through the command center dashboard and AI Copilot. Operators receive clear recommendations with explainable AI reasoning.' },
]

export function HowItWorks() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/10 to-black" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-cyan-400/60 font-medium mb-4 block">Pipeline</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-white/50 max-w-2xl mx-auto text-lg">
            From raw camera feeds to intelligent decisions — an 8-step AI pipeline that transforms traffic data into city-wide optimization.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[31px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/50 via-blue-500/30 to-purple-500/50" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className={`relative flex items-start gap-6 mb-12 md:mb-16 group ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
              onMouseEnter={() => setHoveredStep(i)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              {/* Step number - centered on timeline */}
              <div className="relative z-10 flex-shrink-0">
                <motion.div
                  animate={{
                    scale: hoveredStep === i ? 1.15 : 1,
                    boxShadow: hoveredStep === i ? '0 0 30px rgba(0, 240, 255, 0.3)' : 'none',
                  }}
                  className="w-[62px] h-[62px] rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-white/10 flex items-center justify-center"
                >
                  <step.icon className="w-6 h-6 text-cyan-400" />
                </motion.div>
              </div>

              {/* Content card */}
              <motion.div
                animate={{
                  x: hoveredStep === i ? (i % 2 === 0 ? 5 : -5) : 0,
                }}
                className={`flex-1 max-w-lg ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}
              >
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-cyan-400/60 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/20">
                    Step {i + 1}
                  </span>
                  <span className="text-xs text-white/20">//</span>
                  <span className="text-xs text-white/30">{step.title.split(' ').pop()}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20">
            <ArrowDown className="w-4 h-4 text-cyan-400 animate-bounce" />
            <span className="text-sm text-white/50">8 stages of AI-powered traffic intelligence</span>
            <ArrowDown className="w-4 h-4 text-cyan-400 animate-bounce" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
