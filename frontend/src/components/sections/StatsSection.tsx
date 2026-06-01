'use client'

import { motion } from 'framer-motion'
import { Car, Clock, Shield, Zap, Building2, Gauge } from 'lucide-react'

const stats = [
  { icon: Car, value: '847', label: 'Traffic Cameras', sub: 'City-wide coverage', color: 'from-cyan-400 to-blue-400' },
  { icon: Clock, value: '38%', label: 'Delay Reduction', sub: 'AI-optimized signals', color: 'from-green-400 to-emerald-400' },
  { icon: Shield, value: '40%', label: 'Faster Emergency', sub: 'Response time saved', color: 'from-purple-400 to-violet-400' },
  { icon: Zap, value: '98.5%', label: 'Detection Accuracy', sub: 'AI model precision', color: 'from-amber-400 to-orange-400' },
  { icon: Building2, value: '500K+', label: 'Vehicles Tracked', sub: 'Daily across network', color: 'from-blue-400 to-indigo-400' },
  { icon: Gauge, value: '<50ms', label: 'Processing Latency', sub: 'Real-time analytics', color: 'from-cyan-400 to-teal-400' },
]

export function StatsSection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-cyan-950/10 to-black" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-cyan-400/60 font-medium mb-4 block">By The Numbers</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Platform Impact</h2>
          <p className="text-white/50 max-w-2xl mx-auto text-lg">
            Measurable results from our AI-powered traffic management system.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="relative"
            >
              <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 h-full hover:border-cyan-500/30 transition-all duration-300 group">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1 tabular-nums">
                  {stat.value}
                </div>
                <div className="text-sm text-white/60 font-medium">{stat.label}</div>
                <div className="text-xs text-white/30 mt-0.5">{stat.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
