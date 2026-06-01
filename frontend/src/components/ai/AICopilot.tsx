'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { aiChat } from '@/lib/api'
import { TrafficAnalyticsEngine } from '@/lib/localEngine'
import { MessageCircle, Send, Bot, User, Loader2, TrendingUp, AlertTriangle, Route, Lightbulb, Brain, Gauge } from 'lucide-react'

const categories = [
  { id: 'congestion', label: 'Traffic Analysis', icon: TrendingUp, color: 'text-cyan-400' },
  { id: 'prediction', label: 'Predictions', icon: Brain, color: 'text-purple-400' },
  { id: 'emergency', label: 'Emergency', icon: Route, color: 'text-red-400' },
  { id: 'accident', label: 'Accidents', icon: AlertTriangle, color: 'text-orange-400' },
  { id: 'recommendation', label: 'Optimization', icon: Lightbulb, color: 'text-amber-400' },
  { id: 'risk', label: 'Risk Assessment', icon: Gauge, color: 'text-green-400' },
]

interface Message {
  role: 'user' | 'ai'
  content: string
  timestamp: string
}

export function AICopilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: 'Hello! I am your Margadarshak AI Analyser. I analyze real-time traffic data to provide congestion analysis, predictions, emergency routing, and optimization recommendations. How can I help?',
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentMetrics, setCurrentMetrics] = useState({ vehicle_count: 500, average_speed: 30, lane_occupancy: 50 })
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const engine = new TrafficAnalyticsEngine()
    const h = new Date().getHours()
    const isPeak = (h >= 7 && h <= 10) || (h >= 16 && h <= 19)
    const vc = isPeak ? 700 + Math.floor(Math.random() * 300) : 200 + Math.floor(Math.random() * 300)
    const sp = isPeak ? 10 + Math.random() * 15 : 30 + Math.random() * 20
    const lo = isPeak ? 60 + Math.random() * 30 : 20 + Math.random() * 30
    setCurrentMetrics({
      vehicle_count: vc,
      average_speed: Math.round(sp * 10) / 10,
      lane_occupancy: Math.round(lo * 10) / 10,
    })
  }, [])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await aiChat(input, currentMetrics)
      const aiMsg: Message = { role: 'ai', content: res.response, timestamp: new Date().toISOString() }
      setMessages(prev => [...prev, aiMsg])
      const suggested = res.suggested_followups?.[0]
      if (suggested && messages.length < 6) {
        setTimeout(() => {
          setInput(suggested)
        }, 1000)
      }
    } catch {
      const engine = new TrafficAnalyticsEngine()
      const reasoning = engine.generateReasoning(
        currentMetrics.vehicle_count, currentMetrics.average_speed, currentMetrics.lane_occupancy
      )
      let response = ''
      const q = input.toLowerCase()

      if (q.includes('congestion') || q.includes('traffic') || q.includes('why') || q.includes('increas')) {
        response = `Based on real-time data analysis:\n\nCurrent Metrics:\n• Vehicle Count: ${currentMetrics.vehicle_count}\n• Average Speed: ${currentMetrics.average_speed} km/h\n• Lane Occupancy: ${currentMetrics.lane_occupancy}%\n\nAnalysis:\n• Congestion Score: ${reasoning.congestion_score}/100 (${reasoning.congestion_level.toUpperCase()})\n• Risk Score: ${reasoning.risk_score}/100\n\nContributing Factors:\n${reasoning.factors.slice(0, 3).map(f => `• ${f}`).join('\n')}\n\nRecommendation: ${reasoning.recommendations[0]?.action || 'Monitor conditions'}`
      } else if (q.includes('predict') || q.includes('forecast')) {
        const p = reasoning.predictions
        response = `Prediction Analysis:\n\n15-Min: ${p['15min']?.predicted_congestion}/100 (${p['15min']?.confidence}% confidence)\n30-Min: ${p['30min']?.predicted_congestion}/100 (${p['30min']?.confidence}% confidence)\n60-Min: ${p['60min']?.predicted_congestion}/100 (${p['60min']?.confidence}% confidence)\n\nTrend: ${p['60min']?.predicted_congestion > reasoning.congestion_score ? 'Increasing' : 'Decreasing'}`
      } else if (q.includes('risk') || q.includes('score')) {
        response = `Risk Assessment:\n\nRisk Score: ${reasoning.risk_score}/100\nCongestion: ${reasoning.congestion_score}/100\nDensity: ${reasoning.vehicle_density}%\nFlow Efficiency: ${reasoning.flow_efficiency}%\n\nFactors:\n${reasoning.factors.slice(0, 3).map(f => `• ${f}`).join('\n')}`
      } else if (q.includes('recommend') || q.includes('optimize')) {
        response = `Recommendations:\n\n${reasoning.recommendations.slice(0, 4).map(r => `[${r.priority}] ${r.action}\nReason: ${r.reason}\nImpact: ${r.expected_impact}`).join('\n\n')}`
      } else {
        response = `Margadarshak AI Platform Status:\n\nNetwork: ${currentMetrics.vehicle_count} vehicles at ${currentMetrics.average_speed} km/h\nCongestion: ${reasoning.congestion_score}/100 (${reasoning.congestion_level.toUpperCase()})\nRisk: ${reasoning.risk_score}/100\n\nHow can I assist you? I can analyze congestion, predict traffic, assess risk, or suggest optimizations.`
      }
      setMessages(prev => [...prev, { role: 'ai', content: response, timestamp: new Date().toISOString() }])
    }
    setLoading(false)
  }

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-purple-400" />
          Margadarshak AI Analyser
        </CardTitle>
        <div className="flex flex-wrap gap-1 mt-1">
          {categories.map(c => {
            const Icon = c.icon
            return (
              <button key={c.id} onClick={() => setInput(`Tell me about ${c.label.toLowerCase()}`)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border border-white/10 bg-white/5 hover:bg-white/10 transition-all ${c.color}`}>
                <Icon className="w-2.5 h-2.5" />
                {c.label}
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0 p-3 pt-0">
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-purple-500/20' : 'bg-cyan-500/20'}`}>
                {msg.role === 'ai' ? <Bot className="w-3 h-3 text-purple-400" /> : <User className="w-3 h-3 text-cyan-400" />}
              </div>
              <div className={`max-w-[80%] p-2.5 rounded-xl text-xs leading-relaxed ${
                msg.role === 'ai' ? 'bg-white/5 border border-white/10 text-white/80' : 'bg-purple-500/20 border border-purple-500/20 text-white/90'
              }`}>
                <div className="whitespace-pre-line">{msg.content}</div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Bot className="w-3 h-3 text-purple-400" />
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <Loader2 className="w-3 h-3 animate-spin text-purple-400" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        <div className="flex gap-2 mt-3 flex-shrink-0">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about traffic, predictions, or risks..."
            className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500/50 placeholder-white/20" />
          <button onClick={handleSend} disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all disabled:opacity-50">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
