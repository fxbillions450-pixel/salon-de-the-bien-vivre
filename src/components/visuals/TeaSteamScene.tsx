'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function SteamRings({ count }: { count: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const rings = useMemo(() => Array.from({ length: count }, (_, i) => ({
    phase: (i / count) * Math.PI * 2,
    radius: 0.3 + Math.random() * 0.4,
    speed: 0.4 + Math.random() * 0.3,
  })), [count])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.children.forEach((child, i) => {
      if (i >= rings.length) return
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
          <torusGeometry args={[r.radius, 0.02, 5, 10]} />
          <meshBasicMaterial color="#D6A84F" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  )
}

function SceneLifecycle({ onContextLost }: { onContextLost: () => void }) {
  const { gl } = useThree()
  useEffect(() => {
    const canvas = gl.domElement
    const handleLost = (e: Event) => {
      e.preventDefault()
      if (process.env.NODE_ENV !== 'production') console.warn('[TeaSteamScene] WebGL context lost')
      onContextLost()
    }
    canvas.addEventListener('webglcontextlost', handleLost)
    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost)
      gl.dispose()
    }
  }, [gl, onContextLost])
  return null
}

export default function TeaSteamScene({ onContextLost, isMobile = false }: { onContextLost: () => void; isMobile?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, isMobile ? 1 : 1.5]}
      gl={{ antialias: false, powerPreference: 'low-power', alpha: true, preserveDrawingBuffer: false }}
      style={{ background: 'transparent' }}
      frameloop="always"
    >
      <SceneLifecycle onContextLost={onContextLost} />
      <ambientLight intensity={0.6} color="#FFF0DC" />
      <SteamRings count={isMobile ? 4 : 8} />
    </Canvas>
  )
}
