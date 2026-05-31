'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Reusable temp color to avoid per-frame allocation
const _tempColor = new THREE.Color()

function WarmParticles({ count }: { count: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const { positions, speeds, phases } = useMemo(() => ({
    positions: Array.from({ length: count }, () => [
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 4,
    ] as [number, number, number]),
    speeds: Array.from({ length: count }, () => 0.2 + Math.random() * 0.4),
    phases: Array.from({ length: count }, () => Math.random() * Math.PI * 2),
  }), [count])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const [x, baseY, z] = positions[i]
      dummy.position.set(x, baseY + Math.sin(t * speeds[i] + phases[i]) * 0.3, z)
      dummy.scale.setScalar(0.03 + Math.sin(t * speeds[i] * 1.5 + phases[i]) * 0.015)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 5, 5]} />
      <meshBasicMaterial color="#D6A84F" transparent opacity={0.22} />
    </instancedMesh>
  )
}

function SteamParticles({ count }: { count: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const data = useMemo(() => Array.from({ length: count }, (_, i) => ({
    x: (Math.random() - 0.5) * 8,
    baseY: -2 + Math.random() * 2,
    z: (Math.random() - 0.5) * 2,
    speed: 0.3 + Math.random() * 0.4,
    phase: (i / count) * Math.PI * 2,
  })), [count])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const d = data[i]
      const progress = ((t * d.speed + d.phase) % (Math.PI * 2)) / (Math.PI * 2)
      dummy.position.set(d.x + Math.sin(t * 0.5 + d.phase) * 0.3, d.baseY + progress * 5, d.z)
      dummy.scale.setScalar(0.05 + progress * 0.08)
      dummy.rotation.z = t * 0.3 + d.phase
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
      // Reuse _tempColor instead of allocating new THREE.Color() every frame
      meshRef.current.setColorAt(i, _tempColor.setHSL(0.08, 0.5, 0.7 - progress * 0.3))
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial transparent opacity={0.16} vertexColors />
    </instancedMesh>
  )
}

/** Disposes the renderer on unmount and handles context loss/restore inside r3f. */
function SceneLifecycle({ onContextLost }: { onContextLost: () => void }) {
  const { gl } = useThree()

  useEffect(() => {
    const canvas = gl.domElement

    const handleLost = (e: Event) => {
      e.preventDefault()
      if (process.env.NODE_ENV !== 'production') console.warn('[ImmersiveHeroScene] WebGL context lost')
      onContextLost()
    }
    const handleRestored = () => {
      if (process.env.NODE_ENV !== 'production') console.info('[ImmersiveHeroScene] WebGL context restored')
    }

    canvas.addEventListener('webglcontextlost', handleLost)
    canvas.addEventListener('webglcontextrestored', handleRestored)

    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost)
      canvas.removeEventListener('webglcontextrestored', handleRestored)
      gl.dispose()
    }
  }, [gl, onContextLost])

  return null
}

interface ImmersiveHeroSceneProps {
  onContextLost: () => void
  isMobile: boolean
}

export default function ImmersiveHeroScene({ onContextLost, isMobile }: ImmersiveHeroSceneProps) {
  const warmCount = isMobile ? 30 : 60
  const steamCount = isMobile ? 10 : 20

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, isMobile ? 1 : 1.5]}
      gl={{ antialias: false, powerPreference: 'low-power', alpha: true, preserveDrawingBuffer: false }}
      style={{ background: 'transparent' }}
      frameloop="always"
    >
      <SceneLifecycle onContextLost={onContextLost} />
      <ambientLight intensity={0.5} color="#FFF0DC" />
      <pointLight position={[4, 4, 4]} intensity={0.6} color="#D9824B" />
      <WarmParticles count={warmCount} />
      <SteamParticles count={steamCount} />
    </Canvas>
  )
}
