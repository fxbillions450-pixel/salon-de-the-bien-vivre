'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function BreathingOrb() {
  const meshRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (meshRef.current) {
      const s = 1 + Math.sin(t * 0.5) * 0.08
      meshRef.current.scale.setScalar(s)
      meshRef.current.rotation.y = t * 0.1
    }
    if (innerRef.current) {
      const s = 0.6 + Math.sin(t * 0.5 + 0.5) * 0.05
      innerRef.current.scale.setScalar(s)
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#8AA66A" transparent opacity={0.12} />
      </mesh>
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial color="#556B45" transparent opacity={0.18} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshBasicMaterial color="#D6A84F" transparent opacity={0.35} />
      </mesh>
    </group>
  )
}

export default function WellnessOrbScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: 'low-power', alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.8} color="#E8F5E0" />
      <BreathingOrb />
    </Canvas>
  )
}
