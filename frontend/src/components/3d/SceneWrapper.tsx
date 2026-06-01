'use client'

import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei'
import { CityScene } from './CityScene'
import { CityHeatmap } from './CityHeatmap'

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-white/60 text-sm font-medium">Loading 3D City...</span>
      </div>
    </Html>
  )
}

export function SceneWrapper({ showHeatmap = false }: { showHeatmap?: boolean }) {
  const [hasClicked, setHasClicked] = useState(false)

  return (
    <div className="w-full h-full relative">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[12, 10, 12]} fov={50} />
        <Suspense fallback={<Loader />}>
          <color attach="background" args={['#000000']} />
          <fog attach="fog" args={['#000000', 15, 25]} />
          <CityScene />
          {showHeatmap && <CityHeatmap />}
          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            minPolarAngle={0.1}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={5}
            maxDistance={30}
            autoRotate={false}
            target={[0, 0.5, 0]}
          />
        </Suspense>
      </Canvas>
      {!hasClicked && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer bg-black/60 backdrop-blur-sm"
          onClick={() => setHasClicked(true)}
        >
          <div className="text-center">
            <p className="text-white/80 text-lg font-medium mb-2">Click to Explore 3D City</p>
            <p className="text-white/40 text-sm">Drag to rotate &middot; Scroll to zoom</p>
          </div>
        </div>
      )}
    </div>
  )
}
