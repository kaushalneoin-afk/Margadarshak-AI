'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { time: '15 min', congestion: 0.65, confidence: 0.92 },
  { time: '30 min', congestion: 0.78, confidence: 0.85 },
  { time: '45 min', congestion: 0.72, confidence: 0.76 },
  { time: '60 min', congestion: 0.58, confidence: 0.64 },
]

export function CongestionForecast() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Congestion Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="time" stroke="#ffffff40" fontSize={12} tickLine={false} />
              <YAxis domain={[0, 1]} stroke="#ffffff40" fontSize={12} tickLine={false} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(0,0,0,0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(12px)',
                  color: '#fff',
                }}
                formatter={(value: any) => [`${(Number(value) * 100).toFixed(0)}%`]}
              />
              <Bar dataKey="congestion" fill="#ffaa00" radius={[4, 4, 0, 0]} opacity={0.8} />
              <Bar dataKey="confidence" fill="#7c3aed" radius={[4, 4, 0, 0]} opacity={0.4} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
