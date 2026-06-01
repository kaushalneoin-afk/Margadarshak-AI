'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Upload, Camera, Car, Bike, Bus, Truck, Ambulance, Gauge, Activity, BarChart3, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'

type VehicleClass = 'Car' | 'Bike' | 'Bus' | 'Truck' | 'Ambulance'

function generateResults(seed?: number) {
  const hour = new Date().getHours()
  const isPeak = (hour >= 7 && hour <= 10) || (hour >= 16 && hour <= 19)
  const baseMultiplier = isPeak ? 1.4 : 0.85

  const car = Math.floor((80 + Math.random() * 90) * baseMultiplier)
  const bike = Math.floor((20 + Math.random() * 40) * baseMultiplier)
  const bus = Math.floor((8 + Math.random() * 16) * baseMultiplier)
  const truck = Math.floor((12 + Math.random() * 28) * baseMultiplier)
  const ambulance = Math.floor(1 + Math.random() * 4)
  const total = car + bike + bus + truck + ambulance

  const avgSpeed = isPeak ? (20 + Math.random() * 20) : (40 + Math.random() * 25)
  const density = total > 250 ? 'HIGH' : total > 140 ? 'MEDIUM' : 'LOW'
  const congestion = isPeak ? (55 + Math.random() * 35) : (20 + Math.random() * 35)

  return {
    vehicles: [
      { type: 'Car' as VehicleClass, count: car, color: 'from-cyan-400 to-blue-400', bg: 'bg-cyan-500/10' },
      { type: 'Bike' as VehicleClass, count: bike, color: 'from-green-400 to-emerald-400', bg: 'bg-green-500/10' },
      { type: 'Bus' as VehicleClass, count: bus, color: 'from-amber-400 to-orange-400', bg: 'bg-amber-500/10' },
      { type: 'Truck' as VehicleClass, count: truck, color: 'from-purple-400 to-violet-400', bg: 'bg-purple-500/10' },
      { type: 'Ambulance' as VehicleClass, count: ambulance, color: 'from-red-400 to-rose-400', bg: 'bg-red-500/10' },
    ],
    metrics: [
      { label: 'Vehicle Count', value: `${total}`, icon: Car, color: 'text-cyan-400' },
      { label: 'Avg Speed', value: `${avgSpeed.toFixed(1)} km/h`, icon: Gauge, color: 'text-green-400' },
      { label: 'Density', value: density, icon: Activity, color: density === 'HIGH' ? 'text-red-400' : density === 'MEDIUM' ? 'text-amber-400' : 'text-green-400' },
      { label: 'Congestion Score', value: `${congestion.toFixed(1)}%`, icon: BarChart3, color: congestion > 70 ? 'text-red-400' : congestion > 40 ? 'text-amber-400' : 'text-green-400' },
    ],
  }
}

const vehicleIcons: Record<VehicleClass, typeof Car> = { Car, Bike, Bus, Truck, Ambulance }

export function ComputerVision() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [processed, setProcessed] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState('')
  const [results, setResults] = useState(() => generateResults())
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      simulateProcessing()
    }
  }

  const simulateProcessing = useCallback(() => {
    setIsProcessing(true)
    setProcessed(false)
    setProgress(0)
    const phases = [
      { at: 15, label: 'Decoding video frames...' },
      { at: 35, label: 'Running YOLOv8 detection...' },
      { at: 55, label: 'Tracking objects (DeepSORT)...' },
      { at: 75, label: 'Classifying vehicles...' },
      { at: 90, label: 'Computing traffic metrics...' },
    ]
    let currentPhase = 0
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + 4, 100)
        if (next >= phases[currentPhase]?.at && currentPhase < phases.length) {
          setPhase(phases[currentPhase].label)
          currentPhase++
        }
        if (next >= 100) {
          clearInterval(interval)
          setResults(generateResults())
          setIsProcessing(false)
          setProcessed(true)
        }
        return next
      })
    }, 150)
  }, [])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      setFileName(file.name)
      simulateProcessing()
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => setDragging(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-cyan-400" />
          Computer Vision Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleUpload}
          className={`relative p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center
            ${dragging ? 'border-cyan-400 bg-cyan-500/10' : processed ? 'border-green-500/30 bg-green-500/5' : 'border-white/10 bg-white/5 hover:border-cyan-500/30'}
          `}
        >
          <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                <div className="text-sm text-white/60">
                  <p className="font-medium">Analyzing Traffic Video...</p>
                  <p className="text-xs text-white/30 mt-1">{phase || 'Initializing...'}</p>
                </div>
                <Progress value={progress} barClassName="bg-gradient-to-r from-cyan-500 to-blue-600" className="max-w-xs" />
                <p className="text-[10px] text-white/20">{progress}% complete</p>
              </motion.div>
            ) : processed ? (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-sm text-green-400 font-medium">Analysis Complete</p>
                <p className="text-xs text-white/30">{fileName || 'video_2024.mp4'}</p>
              </motion.div>
            ) : (
              <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-white/30" />
                <div>
                  <p className="text-sm text-white/60 font-medium">Upload Traffic Video</p>
                  <p className="text-xs text-white/30 mt-0.5">Drop a video file or click to browse</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results */}
        {processed && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
                {results.metrics.map((r) => (
                  <div key={r.label} className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-1.5 mb-1">
                      <r.icon className={`w-3 h-3 ${r.color}`} />
                      <span className="text-[10px] text-white/40 uppercase tracking-wider">{r.label}</span>
                    </div>
                    <span className={`text-sm font-bold ${r.color}`}>{r.value}</span>
                  </div>
                ))}
              </div>

            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Car className="w-3 h-3" />
                Vehicle Classification
              </p>
              <div className="space-y-1.5">
                {results.vehicles.map((v) => {
                  const Icon = vehicleIcons[v.type]
                  return (
                    <div key={v.type} className="flex items-center gap-2">
                      <div className={`p-1 rounded ${v.bg}`}>
                        <Icon className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs text-white/60 flex-1">{v.type}</span>
                      <span className="text-xs font-bold text-white">{v.count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className={`p-3 rounded-lg border flex items-start gap-2 ${
              results.metrics[3].value.startsWith('7') || results.metrics[3].value.startsWith('8') || results.metrics[3].value.startsWith('9')
                ? 'bg-red-500/10 border-red-500/20'
                : results.metrics[3].value.startsWith('5') || results.metrics[3].value.startsWith('6')
                ? 'bg-amber-500/10 border-amber-500/20'
                : 'bg-green-500/10 border-green-500/20'
            }`}>
              <AlertTriangle className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${
                results.metrics[3].value.startsWith('7') || results.metrics[3].value.startsWith('8') || results.metrics[3].value.startsWith('9')
                  ? 'text-red-400'
                  : results.metrics[3].value.startsWith('5') || results.metrics[3].value.startsWith('6')
                  ? 'text-amber-400'
                  : 'text-green-400'
              }`} />
              <div>
                <p className={`text-xs font-medium ${
                  results.metrics[3].value.startsWith('7') || results.metrics[3].value.startsWith('8') || results.metrics[3].value.startsWith('9')
                    ? 'text-red-400'
                    : results.metrics[3].value.startsWith('5') || results.metrics[3].value.startsWith('6')
                    ? 'text-amber-400'
                    : 'text-green-400'
                }`}>
                  {results.metrics[3].value.startsWith('7') || results.metrics[3].value.startsWith('8') || results.metrics[3].value.startsWith('9')
                    ? 'High Congestion Alert'
                    : results.metrics[3].value.startsWith('5') || results.metrics[3].value.startsWith('6')
                    ? 'AI Recommendation'
                    : 'Traffic Flowing Smoothly'
                  }
                </p>
                <p className="text-[10px] text-amber-400/60">
                  {results.metrics[3].value.startsWith('7') || results.metrics[3].value.startsWith('8') || results.metrics[3].value.startsWith('9')
                    ? `Consider deploying traffic personnel at junctions 4A–7C and adjusting signal timings to reduce congestion by estimated 18%`
                    : results.metrics[3].value.startsWith('5') || results.metrics[3].value.startsWith('6')
                    ? `Consider optimizing signal timing at junction 42B to reduce congestion by estimated 12%`
                    : `No intervention needed. Current traffic flow is within optimal parameters.`
                  }
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {!processed && !isProcessing && (
          <Button variant="glass" className="w-full" size="sm" onClick={handleUpload}>
            <Camera className="w-3.5 h-3.5" />
            Select Video File
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
