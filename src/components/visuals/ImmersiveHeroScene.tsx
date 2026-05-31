'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function WarmParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const count = 60
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const { positions, speeds, phases } = useMemo(() => {
    const positions = Array.from({ length: count }, () => [
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 4,
    ])
    const speeds = Array.from({ length: count }, () => 0.2 + Math.random() * 0.4)
    const phases = Array.from({ length: count }, () => Math.random() * Math.PI * 2)
    return { positions, speeds, phases }
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const [x, , z] = positions[i]
      const y = positions[i][1] + Math.sin(t * speeds[i] + phases[i]) * 0.3
      dummy.position.set(x, y, z)
      const s = 0.03 + Math.sin(t * speeds[i] * 1.5 + phases[i]) * 0.015
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#D6A84F" transparent opacity={0.25} />
    </instancedMesh>
  )
}

function SteamParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const count = 20
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const data = useMemo(() => Array.from({ length: count }, (_, i) => ({
    x: (Math.random() - 0.5) * 8,
    y: -2 + Math.random() * 2,
    z: (Math.random() - 0.5) * 2,
    speed: 0.3 + Math.random() * 0.4,
    phase: (i / count) * Math.PI * 2,
  })), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const d = data[i]
      const progress = ((t * d.speed + d.phase) % (Math.PI * 2)) / (Math.PI * 2)
      dummy.position.set(
        d.x + Math.sin(t * 0.5 + d.phase) * 0.3,
        d.y + progress * 5,
        d.z
      )
      const scale = 0.05 + progress * 0.08
      dummy.scale.setScalar(scale)
      dummy.rotation.z = t * 0.3 + d.phase
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
      meshRef.current.setColorAt(i, new THREE.Color().setHSL(0.08, 0.5, 0.7 - progress * 0.3))
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial transparent opacity={0.18} vertexColors />
    </instancedMesh>
  )
}

export default function ImmersiveHeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: 'low-power', alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.5} color="#FFF0DC" />
      <pointLight position={[4, 4, 4]} intensity={0.8} color="#D9824B" />
      <pointLight position={[-4, -2, 2]} intensity={0.4} color="#8AA66A" />
      <WarmParticles />
      <SteamParticles />
    </Canvas>
  )
}
