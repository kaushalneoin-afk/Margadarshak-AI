'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Lightbulb, Target, XCircle, CheckCircle, TrendingUp } from 'lucide-react'

const sections = [
  {
    title: 'The Problem',
    icon: AlertTriangle,
    color: 'from-red-500 to-rose-500',
    content: [
      'Urban traffic congestion costs the global economy over $300 billion annually in lost productivity.',
      'Emergency vehicles waste critical minutes stuck in traffic, impacting life-saving response times.',
      'Air pollution from idling vehicles contributes to millions of premature deaths worldwide.',
      'Current traffic management systems are reactive, not predictive — they respond to congestion after it happens.',
    ],
  },
  {
    title: 'Current Challenges',
    icon: XCircle,
    color: 'from-amber-500 to-orange-500',
    content: [
      'Siloed data sources — cameras, sensors, and GPS systems do not communicate with each other.',
      'Outdated infrastructure with manual traffic signal timing that cannot adapt to real-time conditions.',
      'Limited visibility into city-wide traffic patterns and no centralized command center.',
      'No integration between traffic management and emergency response systems.',
    ],
  },
  {
    title: 'Why Current Systems Fail',
    icon: Target,
    color: 'from-purple-500 to-violet-500',
    content: [
      'Legacy SCADA systems were designed for monitoring, not real-time AI-powered optimization.',
      'Rule-based algorithms cannot handle the complexity and unpredictability of urban traffic.',
      'No digital twin capability means every scenario must be tested in the real world at great cost.',
      'Human operators are overwhelmed by the volume of data and cannot make split-second decisions.',
    ],
  },
  {
    title: 'How AI Solves It',
    icon: Lightbulb,
    color: 'from-cyan-500 to-blue-500',
    content: [
      'Deep learning models process 847+ camera feeds simultaneously to detect vehicles, pedestrians, and incidents.',
      'Predictive algorithms forecast congestion up to 60 minutes in advance with 98.5% accuracy.',
      'Digital twin technology allows testing of traffic management strategies in a risk-free virtual environment.',
      'Reinforcement learning optimizes traffic signal timing dynamically based on real-time conditions.',
      'Natural language AI copilot enables intuitive interaction with the traffic management system.',
    ],
  },
  {
    title: 'Expected Benefits',
    icon: CheckCircle,
    color: 'from-green-500 to-emerald-500',
    content: [
      '40% reduction in average commute times through intelligent traffic flow optimization.',
      '35% decrease in emergency vehicle response times with automated green wave corridors.',
      '25% reduction in fuel consumption and emissions from reduced idling and smoother traffic flow.',
      '50% faster incident detection and response through AI-powered video analytics.',
      '3x improvement in traffic management team productivity with AI-assisted decision support.',
    ],
  },
]

const stats = [
  { value: '40%', label: 'Commute Reduction', trend: '+12% YoY' },
  { value: '35%', label: 'Faster Emergency Response', trend: '+8% YoY' },
  { value: '25%', label: 'Lower Emissions', trend: '+15% YoY' },
  { value: '98.5%', label: 'Prediction Accuracy', trend: '+3% YoY' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <Badge variant="info" className="mb-4">About the Platform</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Transforming Urban Mobility with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              Artificial Intelligence
            </span>
          </h1>
          <p className="text-white/50 text-lg max-w-3xl mx-auto">
            Our mission is to make cities smarter, safer, and more efficient through AI-powered traffic management.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  {stat.value}
                </div>
                <div className="text-xs text-white/50 mt-1">{stat.label}</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-[10px] text-green-400">{stat.trend}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6 md:p-8 group hover:border-white/20 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${section.color} flex-shrink-0`}>
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-4">{section.title}</h2>
                    <ul className="space-y-3">
                      {section.content.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-white/60">
                          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 mt-2" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
