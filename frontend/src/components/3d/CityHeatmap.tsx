'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

function HeatCell({ position, intensity, size = 0.8 }: { position: [number, number, number]; intensity: number; size?: number }) {
  const color = new THREE.Color()
  if (intensity < 0.25) color.setHex(0x00ff88)
  else if (intensity < 0.5) color.setHex(0x00f0ff)
  else if (intensity < 0.75) color.setHex(0xffaa00)
  else color.setHex(0xff3355)

  return (
    <mesh position={[position[0], 0.02, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial color={color} transparent opacity={0.3 * intensity + 0.1} />
    </mesh>
  )
}

export function CityHeatmap({ congestionData }: { congestionData?: [number, number, number][] }) {
  const defaultData: [number, number, number][] = useMemo(() => {
    const cells: [number, number, number][] = []
    for (let x = -8; x <= 8; x += 2) {
      for (let z = -8; z <= 8; z += 2) {
        const intensity = Math.random() * 0.8 + 0.1
        cells.push([x, z, intensity])
      }
    }
    return cells
  }, [])

  const data = congestionData || defaultData

  return (
    <group>
      {data.map(([x, z, intensity], i) => (
        <HeatCell key={i} position={[x, 0, z]} intensity={intensity} />
      ))}
    </group>
  )
}
