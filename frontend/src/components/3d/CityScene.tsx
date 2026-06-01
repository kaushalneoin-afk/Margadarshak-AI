'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Plane, Cone, Cylinder, Grid } from '@react-three/drei'
import * as THREE from 'three'

function Building({ position, height, color }: { position: [number, number, number]; height: number; color?: string }) {
  return (
    <Box position={position} args={[1, height, 1]}>
      <meshStandardMaterial
        color={color || '#1a1a2e'}
        metalness={0.3}
        roughness={0.7}
        emissive={color || '#1a1a2e'}
        emissiveIntensity={0.05}
      />
    </Box>
  )
}

function Road({ position, rotation, length }: { position: [number, number, number]; rotation?: [number, number, number]; length: number }) {
  return (
    <mesh position={position} rotation={rotation || [0, 0, 0]}>
      <planeGeometry args={[length, 1.2]} />
      <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
    </mesh>
  )
}

function LaneMarking({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <mesh position={position} rotation={rotation || [0, 0, 0]}>
      <planeGeometry args={[0.6, 0.05]} />
      <meshStandardMaterial color="#333355" />
    </mesh>
  )
}

function TrafficLight({ position, color }: { position: [number, number, number]; color?: string }) {
  const lightColor = color || '#ff3355'
  return (
    <group position={position}>
      <Box args={[0.15, 0.4, 0.15]}>
        <meshStandardMaterial color="#222" />
      </Box>
      <mesh position={[0, 0.15, 0.08]}>
        <circleGeometry args={[0.05, 16]} />
        <meshStandardMaterial color={lightColor} emissive={lightColor} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.08]}>
        <circleGeometry args={[0.05, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0, -0.15, 0.08]}>
        <circleGeometry args={[0.05, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  )
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Cylinder args={[0.05, 0.08, 0.4]}>
        <meshStandardMaterial color="#4a3728" />
      </Cylinder>
      <Cone args={[0.3, 0.5, 6]} position={[0, 0.45, 0]}>
        <meshStandardMaterial color="#1a5c3a" />
      </Cone>
      <Cone args={[0.2, 0.35, 6]} position={[0, 0.7, 0]}>
        <meshStandardMaterial color="#1a7c4a" />
      </Cone>
    </group>
  )
}

function Vehicle({ position, color, rotation }: { position: [number, number, number]; color?: string; rotation?: [number, number, number] }) {
  return (
    <Box position={position} args={[0.4, 0.15, 0.25]} rotation={rotation || [0, 0, 0]}>
      <meshStandardMaterial color={color || '#00f0ff'} metalness={0.6} roughness={0.3} emissive={color || '#00f0ff'} emissiveIntensity={0.1} />
    </Box>
  )
}

export function CityScene() {
  const vehiclesRef = useRef<THREE.Group>(null)

  const vehicles = useMemo(() => {
    const v = []
    const colors = ['#00f0ff', '#0066ff', '#7c3aed', '#00ff88', '#ffaa00', '#ff3355', '#ffffff', '#ff66aa']
    const routes = [
      { start: -8, end: 8, z: 2, axis: 'x' as const, rot: [0, 0, 0] as [number, number, number] },
      { start: -8, end: 8, z: -2, axis: 'x' as const, rot: [0, 0, 0] as [number, number, number] },
      { start: -8, end: 8, z: 6, axis: 'x' as const, rot: [0, 0, 0] as [number, number, number] },
      { start: -8, end: 8, z: -6, axis: 'x' as const, rot: [0, 0, 0] as [number, number, number] },
      { start: -8, end: 8, x: 2, axis: 'z' as const, rot: [0, Math.PI / 2, 0] as [number, number, number] },
      { start: -8, end: 8, x: -2, axis: 'z' as const, rot: [0, Math.PI / 2, 0] as [number, number, number] },
      { start: -8, end: 8, x: 6, axis: 'z' as const, rot: [0, Math.PI / 2, 0] as [number, number, number] },
      { start: -8, end: 8, x: -6, axis: 'z' as const, rot: [0, Math.PI / 2, 0] as [number, number, number] },
    ]
    for (let i = 0; i < 40; i++) {
      const route = routes[i % routes.length]
      const progress = Math.random()
      const speed = 0.005 + Math.random() * 0.01
      const pos: [number, number, number] = [0, 0.15, 0]
      if (route.axis === 'x') {
        const zVal = route.z || 0
        pos[0] = route.start + (route.end - route.start) * progress
        pos[2] = zVal + (Math.random() - 0.5) * 0.6
      } else {
        const xVal = route.x || 0
        pos[0] = xVal + (Math.random() - 0.5) * 0.6
        pos[2] = route.start + (route.end - route.start) * progress
      }
      v.push({ id: i, position: pos, color: colors[Math.floor(Math.random() * colors.length)], speed, route, direction: Math.random() > 0.5 ? 1 : -1 })
    }
    return v
  }, [])

  const trafficLights = useMemo(() => {
    const lights = []
    const intersections = [
      [-4, -4], [-4, 0], [-4, 4],
      [0, -4], [0, 0], [0, 4],
      [4, -4], [4, 0], [4, 4],
    ]
    const colors = ['#ff3355', '#ffaa00', '#00ff88']
    for (const [x, z] of intersections) {
      lights.push({ position: [x - 0.5, 0.2, z - 0.5] as [number, number, number], color: colors[Math.floor(Math.random() * 3)] })
      lights.push({ position: [x + 0.5, 0.2, z + 0.5] as [number, number, number], color: colors[Math.floor(Math.random() * 3)] })
    }
    return lights
  }, [])

  const buildings = useMemo(() => {
    const b = []
    const positions = [
      [-7, -6], [-5, -6], [-3, -6], [-1, -6], [1, -6], [3, -6], [5, -6], [7, -6],
      [-7, -3], [-5, -3], [5, -3], [7, -3],
      [-7, 0], [-7, 3], [-7, 6], [7, 0], [7, 3], [7, 6],
      [-7, 3], [-5, 3], [3, 3], [5, 3],
      [-5, 0], [5, 0],
      [-7, -3], [-7, 0], [-7, 3],
      [-5, -3], [5, -3],
      [-5, 6], [-3, 6], [-1, 6], [1, 6], [3, 6], [5, 6],
    ]
    const colors = ['#0a0a1a', '#0d0d25', '#10102e', '#151538', '#12122a']
    for (const [x, z] of positions) {
      const h = 0.5 + Math.random() * 2.5
      b.push({ position: [x, h / 2, z] as [number, number, number], height: h, color: colors[Math.floor(Math.random() * colors.length)] })
    }
    // Tall center building
    b.push({ position: [0, 3, 0] as [number, number, number], height: 6, color: '#0d0d30' })
    return b
  }, [])

  const trees = useMemo(() => {
    const t = []
    const positions = [
      [-9, -8], [9, -8], [-9, 8], [9, 8],
      [-9, -5], [9, -5], [-9, 5], [9, 5],
      [-9, -2], [9, -2], [-9, 2], [9, 2],
      [-5, -9], [5, -9], [-5, 9], [5, 9],
      [-2, -9], [2, -9], [-2, 9], [2, 9],
    ]
    for (const [x, z] of positions) {
      t.push({ position: [x, 0, z] as [number, number, number] })
    }
    return t
  }, [])

  useFrame((_, delta) => {
    if (!vehiclesRef.current) return
    const children = vehiclesRef.current.children
    vehicles.forEach((v, i) => {
      if (i >= children.length) return
      const mesh = children[i]
      if (v.route.axis === 'x') {
        mesh.position.x += v.speed * v.direction * delta * 30
        if (mesh.position.x > 9) mesh.position.x = -9
        if (mesh.position.x < -9) mesh.position.x = 9
      } else {
        mesh.position.z += v.speed * v.direction * delta * 30
        if (mesh.position.z > 9) mesh.position.z = -9
        if (mesh.position.z < -9) mesh.position.z = 9
      }
    })
  })

  return (
    <group>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 15, 10]} intensity={0.8} />
      <directionalLight position={[-5, 10, -5]} intensity={0.3} color="#0066ff" />
      <pointLight position={[0, 8, 0]} intensity={0.3} color="#00f0ff" />

      <Plane args={[22, 22]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <meshStandardMaterial color="#050510" />
      </Plane>

      <Grid
        args={[22, 22]}
        position={[0, 0, 0]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1a1a3e"
        sectionSize={4}
        sectionThickness={1}
        sectionColor="#2a2a5e"
        fadeDistance={30}
      />

      {buildings.map((b, i) => (
        <Building key={i} position={b.position} height={b.height} color={b.color} />
      ))}

      {/* Roads */}
      {[-6, -2, 2, 6].map((z) => (
        <Road key={`road-h-${z}`} position={[0, 0.005, z]} length={22} />
      ))}
      {[-6, -2, 2, 6].map((x) => (
        <Road key={`road-v-${x}`} position={[x, 0.005, 0]} length={22} rotation={[0, Math.PI / 2, 0]} />
      ))}

      {/* Lane markings horizontal */}
      {[-6, -2, 2, 6].map((z) =>
        [-9, -7, -5, -3, -1, 1, 3, 5, 7, 9].map((x) => (
          <LaneMarking key={`lm-h-${z}-${x}`} position={[x, 0.006, z - 0.3]} />
        ))
      )}

      {/* Lane markings vertical */}
      {[-6, -2, 2, 6].map((x) =>
        [-9, -7, -5, -3, -1, 1, 3, 5, 7, 9].map((z) => (
          <LaneMarking key={`lm-v-${x}-${z}`} position={[x + 0.3, 0.006, z]} rotation={[0, Math.PI / 2, 0]} />
        ))
      )}

      {trafficLights.map((tl, i) => (
        <TrafficLight key={i} position={tl.position} color={tl.color} />
      ))}

      {trees.map((t, i) => (
        <Tree key={i} position={t.position} />
      ))}

      <group ref={vehiclesRef}>
        {vehicles.map((v) => (
          <Vehicle key={v.id} position={v.position} color={v.color} rotation={v.route.axis === 'z' ? [0, Math.PI / 2, 0] : [0, 0, 0]} />
        ))}
      </group>
    </group>
  )
}
