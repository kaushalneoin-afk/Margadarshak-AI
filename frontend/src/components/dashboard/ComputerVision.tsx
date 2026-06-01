'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Upload, Camera, Car, Bike, Bus, Truck, Ambulance, Gauge, Activity, BarChart3, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'

const vehicleTypes = [
  { type: 'Car', icon: Car, count: 142, color: 'from-cyan-400 to-blue-400', bg: 'bg-cyan-500/10' },
  { type: 'Bike', icon: Bike, count: 38, color: 'from-green-400 to-emerald-400', bg: 'bg-green-500/10' },
  { type: 'Bus', icon: Bus, count: 16, color: 'from-amber-400 to-orange-400', bg: 'bg-amber-500/10' },
  { type: 'Truck', icon: Truck, count: 28, color: 'from-purple-400 to-violet-400', bg: 'bg-purple-500/10' },
  { type: 'Ambulance', icon: Ambulance, count: 3, color: 'from-red-400 to-rose-400', bg: 'bg-red-500/10' },
]

const detectionResults = [
  { label: 'Vehicle Count', value: '227', icon: Car, color: 'text-cyan-400' },
  { label: 'Avg Speed', value: '42.3 km/h', icon: Gauge, color: 'text-green-400' },
  { label: 'Density', value: 'MEDIUM', icon: Activity, color: 'text-amber-400' },
  { label: 'Congestion Score', value: '67.8%', icon: BarChart3, color: 'text-red-400' },
]

export function ComputerVision() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [processed, setProcessed] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
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

  const simulateProcessing = () => {
    setIsProcessing(true)
    setProcessed(false)
    setTimeout(() => {
      setIsProcessing(false)
      setProcessed(true)
    }, 2500)
  }

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
                  <p className="text-xs text-white/30 mt-1">Running YOLO detection + DeepSORT tracking</p>
                </div>
                <Progress value={65} barClassName="bg-gradient-to-r from-cyan-500 to-blue-600" className="max-w-xs" />
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
              {detectionResults.map((r) => (
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
                {vehicleTypes.map((v) => (
                  <div key={v.type} className="flex items-center gap-2">
                    <div className={`p-1 rounded ${v.bg}`}>
                      <v.icon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs text-white/60 flex-1">{v.type}</span>
                    <span className="text-xs font-bold text-white">{v.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-amber-400 font-medium">AI Recommendation</p>
                <p className="text-[10px] text-amber-400/60">Consider optimizing signal timing at junction 42B to reduce congestion by estimated 18%</p>
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
