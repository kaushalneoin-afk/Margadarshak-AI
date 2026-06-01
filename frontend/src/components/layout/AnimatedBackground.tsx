'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = []
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.3 + 0.1,
      })
    }

    let animId: number
    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha})`
        ctx.fill()
      })

      animId = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#050510] to-[#0a0a1e]" />
      <motion.div
        className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #00f0ff 0%, transparent 70%)' }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -30, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}
        animate={{
          x: [0, -40, 60, 0],
          y: [0, 40, -50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}
