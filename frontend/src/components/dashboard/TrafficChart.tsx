'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useStore } from '@/lib/store'

const data = [
  { time: '00:00', flow: 120, speed: 65 }, { time: '02:00', flow: 80, speed: 70 },
  { time: '04:00', flow: 60, speed: 75 }, { time: '06:00', flow: 180, speed: 55 },
  { time: '08:00', flow: 450, speed: 35 }, { time: '10:00', flow: 320, speed: 45 },
  { time: '12:00', flow: 380, speed: 40 }, { time: '14:00', flow: 400, speed: 38 },
  { time: '16:00', flow: 520, speed: 30 }, { time: '18:00', flow: 600, speed: 25 },
  { time: '20:00', flow: 350, speed: 42 }, { time: '22:00', flow: 200, speed: 55 },
]

export function TrafficChart() {
  const congestionLevel = useStore((s) => s.congestionLevel)

  const chartData = data.map((d) => ({
    ...d,
    flow: Math.round(d.flow * (1 + (congestionLevel - 0.5) * 0.4)),
  }))

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Traffic Flow & Speed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="time" stroke="#ffffff40" fontSize={12} tickLine={false} />
              <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(0,0,0,0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(12px)',
                  color: '#fff',
                }}
                labelStyle={{ color: '#ffffff80' }}
              />
              <Area type="monotone" dataKey="flow" stroke="#00f0ff" fill="url(#flowGradient)" strokeWidth={2} name="Traffic Flow" />
              <Area type="monotone" dataKey="speed" stroke="#00ff88" fill="url(#speedGradient)" strokeWidth={2} name="Avg Speed" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
