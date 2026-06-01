'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react'

const suggestions = [
  'What is the current congestion level?',
  'Predict traffic for the next hour',
  'Analyze accident patterns',
  'Suggest traffic improvements',
  'Explain the latest prediction',
]

export function AICopilot() {
  const { aiMessages, addAiMessage, setIsLoading, isLoading } = useStore()
  const [input, setInput] = useState('')
  const [typingMessage, setTypingMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiMessages, typingMessage])

  const simulateAIResponse = (query: string) => {
    setIsLoading(true)
    const responses: Record<string, string> = {
      'congestion': 'Current congestion index is at 67.3%, which is elevated for this time of day. Primary bottlenecks are at Downtown intersection (Main & 5th) and Highway 101 near exit 42. I recommend activating dynamic traffic signal timing at these locations to improve flow by an estimated 23%.',
      'predict': 'Based on historical patterns and current conditions, I predict congestion will peak at 82% in approximately 45 minutes during the evening rush hour. The AI model shows 91% confidence in this prediction. Recommended actions: (1) Deploy traffic management at 3 key intersections, (2) Activate variable speed limits on Highway 101, (3) Alert transit providers to add capacity.',
      'accident': 'Analysis of accident patterns over the past 30 days shows: Downtown core accounts for 42% of incidents (high correlation with peak hours 17:00-19:00). Main St & 5th Ave intersection has the highest frequency. Weather conditions contributed to 28% of incidents. I recommend predictive patrol deployment during high-risk windows.',
      'improve': 'Based on comprehensive traffic analysis, I recommend: (1) Implement adaptive signal control at 12 intersections (estimated 18% delay reduction), (2) Create dynamic bus lanes on 4 major corridors, (3) Deploy variable message signs for real-time rerouting, (4) Establish emergency vehicle preemption system. Estimated ROI: 3.2x within 12 months.',
      'default': 'I am analyzing the real-time traffic data streams from 847 sensors across the city. Current network-wide traffic volume is 12,847 vehicles with average speed of 38 km/h. Congestion is trending upward. I have identified 3 anomalies that may need attention. Would you like me to deep dive into any specific area?',
    }

    let response = responses.default
    const lower = query.toLowerCase()
    if (lower.includes('congestion') || lower.includes('jam')) response = responses.congestion
    else if (lower.includes('predict') || lower.includes('forecast')) response = responses.predict
    else if (lower.includes('accident') || lower.includes('incident') || lower.includes('crash')) response = responses.accident
    else if (lower.includes('improve') || lower.includes('optimize') || lower.includes('recommend')) response = responses.improve

    let idx = 0
    setTypingMessage('')
    const interval = setInterval(() => {
      if (idx < response.length) {
        setTypingMessage(response.slice(0, idx + 1))
        idx++
      } else {
        clearInterval(interval)
        addAiMessage({ role: 'ai', content: response })
        setTypingMessage('')
        setIsLoading(false)
      }
    }, 15)
  }

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    addAiMessage({ role: 'user', content: input.trim() })
    setInput('')
    simulateAIResponse(input.trim())
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Bot className="w-3.5 h-3.5 text-white" />
          </div>
          Margadarshak AI Copilot
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 scrollbar-thin">
          {aiMessages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'flex gap-2 max-w-[85%]',
                msg.role === 'user' ? 'ml-auto' : ''
              )}
            >
              {msg.role === 'ai' && (
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mt-1">
                  <Bot className="w-3 h-3 text-white" />
                </div>
              )}
              <div className={cn(
                'rounded-xl px-3 py-2 text-sm',
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 text-white'
                  : 'bg-white/5 border border-white/10 text-white/80'
              )}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mt-1">
                  <User className="w-3 h-3 text-white" />
                </div>
              )}
            </motion.div>
          ))}
          {typingMessage && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 max-w-[85%]">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mt-1">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="rounded-xl px-3 py-2 text-sm bg-white/5 border border-white/10 text-white/80">
                {typingMessage}
                <span className="inline-block w-0.5 h-4 bg-cyan-400 ml-0.5 animate-pulse" />
              </div>
            </motion.div>
          )}
          {isLoading && !typingMessage && (
            <div className="flex gap-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="rounded-xl px-3 py-2 bg-white/5 border border-white/10">
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => { setInput(s); handleSend() }}
              disabled={isLoading}
              className="text-[11px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40"
            >
              <Sparkles className="w-2.5 h-2.5 inline mr-1" />
              {s}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask the AI copilot..."
            disabled={isLoading}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-cyan-500/50 transition-colors disabled:opacity-50"
          />
          <Button size="sm" onClick={handleSend} disabled={isLoading || !input.trim()}>
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
