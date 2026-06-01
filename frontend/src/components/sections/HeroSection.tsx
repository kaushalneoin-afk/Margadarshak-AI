'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, BarChart3, Building2, Sparkles } from 'lucide-react'

function MovingCars({ count = 30 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const cars = useRef(Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 30,
    z: (Math.random() - 0.5) * 30,
    speed: 0.02 + Math.random() * 0.03,
    dir: Math.random() > 0.5 ? 1 : -1,
    color: ['#00f0ff', '#0066ff', '#7c3aed', '#00ff88', '#ffaa00', '#ff3355', '#ffffff'][Math.floor(Math.random() * 7)],
    size: 0.3 + Math.random() * 0.2,
    lane: Math.floor(Math.random() * 4),
    onXAxis: Math.random() > 0.5,
  })))

  useFrame(() => {
    if (!groupRef.current) return
    cars.current.forEach((car, i) => {
      const mesh = groupRef.current!.children[i]
      if (!mesh) return
      if (car.onXAxis) {
        mesh.position.x += car.speed * car.dir
        if (mesh.position.x > 15) mesh.position.x = -15
        if (mesh.position.x < -15) mesh.position.x = 15
      } else {
        mesh.position.z += car.speed * car.dir
        if (mesh.position.z > 15) mesh.position.z = -15
        if (mesh.position.z < -15) mesh.position.z = 15
      }
    })
  })

  const lanes = [-3, -1, 1, 3]
  return (
    <group ref={groupRef}>
      {cars.current.map((car, i) => {
        const pos: [number, number, number] = car.onXAxis
          ? [car.x, 0.1 + Math.random() * 0.1, lanes[car.lane]]
          : [lanes[car.lane], 0.1 + Math.random() * 0.1, car.z]
        const rot: [number, number, number] = car.onXAxis ? [0, 0, 0] : [0, Math.PI / 2, 0]
        return (
          <mesh key={i} position={pos} rotation={rot}>
            <boxGeometry args={[car.size, car.size * 0.4, car.size * 0.6]} />
            <meshStandardMaterial color={car.color} metalness={0.6} roughness={0.3} emissive={car.color} emissiveIntensity={0.15} />
          </mesh>
        )
      })}
    </group>
  )
}

function Buildings() {
  const positions = []
  for (let x = -14; x <= 14; x += 2.5) {
    for (let z = -14; z <= 14; z += 2.5) {
      if (Math.random() > 0.35 && !(Math.abs(x) < 1 && Math.abs(z) < 1)) {
        const h = 0.5 + Math.random() * 4
        positions.push({ pos: [x, h / 2, z] as [number, number, number], h, color: ['#0a0a1a', '#0d0d25', '#10102e', '#12122a'][Math.floor(Math.random() * 4)] })
      }
    }
  }
  return (
    <group>
      {positions.map((b, i) => (
        <mesh key={i} position={b.pos}>
          <boxGeometry args={[1.8, b.h, 1.8]} />
          <meshStandardMaterial color={b.color} metalness={0.4} roughness={0.6} emissive={b.color} emissiveIntensity={0.03} />
          {Array.from({ length: Math.floor(b.h / 0.6) }).map((_, wi) => (
            <mesh key={wi} position={[0, -b.h / 2 + 0.3 + wi * 0.6 + 0.15, 0.91]}>
              <planeGeometry args={[0.15, 0.1]} />
              <meshBasicMaterial color={Math.random() > 0.4 ? '#ffdd66' : '#334455'} opacity={0.6 + Math.random() * 0.4} transparent />
            </mesh>
          ))}
        </mesh>
      ))}
    </group>
  )
}

function TrafficLights() {
  const intersections = [[-5, -5], [-5, 0], [-5, 5], [0, -5], [0, 5], [5, -5], [5, 0], [5, 5]]
  return (
    <group>
      {intersections.map(([x, z], i) => {
        const color = ['#ff3355', '#ffaa00', '#00ff88'][Math.floor((Date.now() / 3000 + i) % 3)]
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[0.12, 0.5, 0.12]} />
              <meshStandardMaterial color="#222" />
            </mesh>
            <mesh position={[0, 0.6, 0.1]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

function RoadNetwork() {
  return (
    <group>
      {[-5, 0, 5].map((z) => (
        <mesh key={`road-h-${z}`} position={[0, -0.01, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 1.8]} />
          <meshStandardMaterial color="#111122" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      {[-5, 0, 5].map((x) => (
        <mesh key={`road-v-${x}`} position={[x, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.8, 30]} />
          <meshStandardMaterial color="#111122" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  )
}

function Scene3D() {
  return (
    <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <PerspectiveCamera makeDefault position={[8, 12, 8]} fov={60} />
      <color attach="background" args={['#000005']} />
      <fog attach="fog" args={['#000005', 12, 25]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 15, 10]} intensity={0.5} />
      <pointLight position={[0, 6, 0]} intensity={0.2} color="#00f0ff" />
      <gridHelper args={[30, 30, '#1a1a3e', '#111133']} position={[0, 0, 0]} />
      <RoadNetwork />
      <Buildings />
      <TrafficLights />
      <MovingCars count={40} />
      <OrbitControls enableRotate={false} enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.5} target={[0, 0.5, 0]} />
    </Canvas>
  )
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <Scene3D />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

      <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Next-Generation Smart City Traffic Management Platform
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="text-white">AI Urban Traffic</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            Digital Twin
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-white/50 max-w-4xl mx-auto mb-10 leading-relaxed"
        >
          Predicting, Preventing and Optimizing Urban Traffic Through Artificial Intelligence
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/demo">
            <Button size="xl" className="text-base group">
              <Play className="w-5 h-5" />
              View Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/architecture">
            <Button variant="glass" size="xl" className="text-base">
              <Building2 className="w-5 h-5" />
              Explore Architecture
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="xl" className="text-base border-white/20 hover:bg-white/10">
              <BarChart3 className="w-5 h-5" />
              Launch Dashboard
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          {[
            { value: '99.9%', label: 'System Uptime', sub: 'Enterprise reliability' },
            { value: '<50ms', label: 'Response Time', sub: 'Real-time processing' },
            { value: '50K+', label: 'Connected Sensors', sub: 'City-wide coverage' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5">
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                {stat.value}
              </div>
              <div className="text-sm text-white/60 mt-1 font-medium">{stat.label}</div>
              <div className="text-xs text-white/30 mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
