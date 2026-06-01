'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const zones = [
  { name: 'Downtown', congestion: 0.85, x: 3, y: 2 },
  { name: 'Midtown', congestion: 0.72, x: 6, y: 4 },
  { name: 'Airport', congestion: 0.45, x: 9, y: 1 },
  { name: 'Industrial', congestion: 0.38, x: 1, y: 7 },
  { name: 'Residential A', congestion: 0.25, x: 2, y: 5 },
  { name: 'Residential B', congestion: 0.18, x: 7, y: 7 },
  { name: 'Commercial', congestion: 0.62, x: 5, y: 3 },
  { name: 'University', congestion: 0.55, x: 8, y: 5 },
  { name: 'Stadium', congestion: 0.91, x: 4, y: 1 },
]

function getHeatColor(intensity: number): string {
  if (intensity < 0.2) return 'rgba(0, 255, 136, 0.15)'
  if (intensity < 0.35) return 'rgba(0, 240, 255, 0.25)'
  if (intensity < 0.5) return 'rgba(0, 240, 255, 0.4)'
  if (intensity < 0.65) return 'rgba(255, 170, 0, 0.5)'
  if (intensity < 0.8) return 'rgba(255, 51, 85, 0.6)'
  return 'rgba(255, 51, 85, 0.8)'
}

export function HeatmapView() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          City Zone Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-square bg-black/40 rounded-xl border border-white/5 overflow-hidden">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '12.5% 12.5%',
          }} />
          {zones.map((zone) => (
            <div
              key={zone.name}
              className="absolute flex items-center justify-center rounded-lg transition-all duration-500"
              style={{
                left: `${(zone.x / 10) * 100}%`,
                top: `${(zone.y / 8) * 100}%`,
                width: '11%',
                height: '11%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: getHeatColor(zone.congestion),
                border: `1px solid ${getHeatColor(zone.congestion).replace('0.', '0.3')}`,
              }}
            >
              <span className="text-[8px] font-medium text-white/80 leading-tight text-center">
                {zone.name}
              </span>
            </div>
          ))}
          <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1">
            <span className="text-[8px] text-white/40">Low</span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden flex">
              <div className="flex-1" style={{ background: '#00ff88' }} />
              <div className="flex-1" style={{ background: '#00f0ff' }} />
              <div className="flex-1" style={{ background: '#ffaa00' }} />
              <div className="flex-1" style={{ background: '#ff3355' }} />
            </div>
            <span className="text-[8px] text-white/40">High</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
