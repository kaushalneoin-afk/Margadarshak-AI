'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const data = [
  { name: 'Cars', value: 58, color: '#00f0ff' },
  { name: 'Trucks', value: 18, color: '#ffaa00' },
  { name: 'Buses', value: 12, color: '#7c3aed' },
  { name: 'Motorcycles', value: 8, color: '#00ff88' },
  { name: 'Emergency', value: 4, color: '#ff3355' },
]

export function TrafficDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'rgba(0,0,0,0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', color: '#ffffff80' }}
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
