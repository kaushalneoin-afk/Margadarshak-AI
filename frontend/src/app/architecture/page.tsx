'use client'

import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowDown, Cloud, Database, Brain, Monitor, Radio, Shield, Cpu } from 'lucide-react'

const layers = [
  {
    title: 'Frontend Layer',
    icon: Monitor,
    color: 'from-cyan-400 to-blue-400',
    items: ['Next.js 14', 'React Three Fiber', 'Tailwind CSS', 'Framer Motion', 'Recharts', 'Zustand'],
  },
  {
    title: 'Backend Layer',
    icon: Cpu,
    color: 'from-blue-400 to-purple-400',
    items: ['FastAPI', 'Python 3.11', 'WebSocket', 'REST API', 'Celery Tasks', 'JWT Auth'],
  },
  {
    title: 'AI & ML Layer',
    icon: Brain,
    color: 'from-purple-400 to-violet-400',
    items: ['PyTorch', 'YOLOv8 Detection', 'LSTM Networks', 'Reinforcement Learning', 'Anomaly Detection', 'TrafficGPT'],
  },
  {
    title: 'Data Layer',
    icon: Database,
    color: 'from-emerald-400 to-green-400',
    items: ['PostgreSQL', 'Redis Cache', 'InfluxDB', 'MinIO Storage', 'Kafka Streams', 'TimescaleDB'],
  },
  {
    title: 'Infrastructure',
    icon: Cloud,
    color: 'from-amber-400 to-orange-400',
    items: ['Docker', 'Kubernetes', 'Railway Deploy', 'Nginx', 'CDN', 'Load Balancer'],
  },
  {
    title: 'IoT & Edge',
    icon: Radio,
    color: 'from-rose-400 to-red-400',
    items: ['Traffic Cameras', 'Road Sensors', 'GPS Trackers', 'VMS Boards', 'Signal Controllers', 'Edge GPUs'],
  },
]

const badges = [
  'Next.js', 'TypeScript', 'Python', 'FastAPI', 'PyTorch', 'PostgreSQL',
  'Redis', 'Docker', 'Kubernetes', 'Three.js', 'TensorFlow', 'Kafka',
  'WebSocket', 'REST', 'GraphQL', 'gRPC', 'Nginx', 'GitHub Actions',
]

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">System Architecture</h1>
          <p className="text-white/50 max-w-2xl mx-auto">
            A modern, scalable, microservices-based architecture powering the Margadarshak AI Platform.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-transparent hidden lg:block" />

          <div className="space-y-8 relative">
            {layers.map((layer, i) => (
              <motion.div
                key={layer.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-6 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'lg:text-right' : ''}`}>
                  <Card className="p-6 group hover:border-cyan-500/30 transition-all duration-300">
                    <div className={`flex items-center gap-3 ${i % 2 === 0 ? 'lg:flex-row-reverse' : ''} mb-4`}>
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${layer.color}`}>
                        <layer.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white">{layer.title}</h3>
                    </div>
                    <div className={`flex flex-wrap gap-2 ${i % 2 === 0 ? 'lg:justify-end' : ''}`}>
                      {layer.items.map((item) => (
                        <Badge key={item} className="text-xs">{item}</Badge>
                      ))}
                    </div>
                  </Card>
                </div>

                <div className="hidden lg:flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                    {i + 1}
                  </div>
                  {i < layers.length - 1 && (
                    <div className="h-12 w-px bg-gradient-to-b from-cyan-500/50 to-purple-500/50">
                      <ArrowDown className="w-3 h-3 text-cyan-400 mx-auto -mt-1" />
                    </div>
                  )}
                </div>

                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="p-8">
            <CardTitle className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-cyan-400" />
              Tech Stack
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              {badges.map((tech) => (
                <Badge key={tech} variant="info" className="text-xs px-3 py-1.5">
                  {tech}
                </Badge>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { label: 'Data Pipeline Latency', value: '< 50ms', color: 'from-green-400 to-emerald-400' },
            { label: 'API Response Time', value: '< 10ms', color: 'from-cyan-400 to-blue-400' },
            { label: 'System Uptime', value: '99.99%', color: 'from-purple-400 to-violet-400' },
            { label: 'Concurrent Users', value: '10K+', color: 'from-amber-400 to-orange-400' },
          ].map((stat) => (
            <Card key={stat.label} className="p-6 text-center">
              <div className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-white/50 mt-1">{stat.label}</div>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
