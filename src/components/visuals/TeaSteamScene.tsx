'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function SteamRings() {
  const groupRef = useRef<THREE.Group>(null)
  const rings = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    phase: (i / 8) * Math.PI * 2,
    radius: 0.3 + Math.random() * 0.4,
    speed: 0.4 + Math.random() * 0.3,
  })), [])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.children.forEach((child, i) => {
      const r = rings[i]
      const progress = ((t * r.speed + r.phase) % (Math.PI * 2)) / (Math.PI * 2)
      child.position.y = -1 + progress * 3
      child.scale.setScalar(0.2 + progress * 0.8)
      const mat = (child as THREE.Mesh).material
      if (mat instanceof THREE.MeshBasicMaterial) {
        mat.opacity = 0.3 * (1 - progress)
      }
    })
  })

  return (
    <group ref={groupRef}>
      {rings.map((r, i) => (
        <mesh key={i} position={[Math.sin(r.phase) * 0.2, 0, 0]}>
          <torusGeometry args={[r.radius, 0.02, 6, 12]} />
          <meshBasicMaterial color="#D6A84F" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  )
}

export default function TeaSteamScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: 'low-power', alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.6} color="#FFF0DC" />
      <SteamRings />
    </Canvas>
  )
}
