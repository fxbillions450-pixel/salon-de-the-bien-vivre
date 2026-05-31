'use client'

import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const COLORS = [
  new THREE.Color('#F5F0E8'), // cream
  new THREE.Color('#8FAF8B'), // sage
  new THREE.Color('#D4A853'), // warm gold
]

interface ParticleFieldProps {
  count: number
}

function ParticleField({ count }: ParticleFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Build initial positions, speeds, and colors
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 14,
      y: (Math.random() - 0.5) * 8,
      z: (Math.random() - 0.5) * 4,
      speedY: 0.003 + Math.random() * 0.005,
      drift: (Math.random() - 0.5) * 0.001,
      phase: Math.random() * Math.PI * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: 0.1 + Math.random() * 0.2,
    }))
  }, [count])

  // Precompute color array for vertex colors
  useEffect(() => {
    if (!meshRef.current) return
    particles.forEach((p, i) => {
      meshRef.current!.setColorAt(i, p.color)
    })
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  }, [particles])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    particles.forEach((p, i) => {
      p.y += p.speedY
      // Reset when goes out of bounds
      if (p.y > 5) {
        p.y = -5
        p.x = (Math.random() - 0.5) * 14
      }
      dummy.position.set(
        p.x + Math.sin(t * 0.3 + p.phase) * 0.15,
        p.y,
        p.z
      )
      const scale = 0.04 + Math.sin(t * 0.5 + p.phase) * 0.01
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial vertexColors transparent opacity={0.18} />
    </instancedMesh>
  )
}

function DisposeOnUnmount() {
  const { gl } = useThree()
  useEffect(() => {
    return () => {
      gl.dispose()
    }
  }, [gl])
  return null
}

interface AmbientHeroCanvasProps {
  particleCount?: number
}

export function AmbientHeroCanvas({ particleCount = 40 }: AmbientHeroCanvasProps) {
  return (
    <Canvas
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
    >
      <DisposeOnUnmount />
      <ParticleField count={particleCount} />
    </Canvas>
  )
}
