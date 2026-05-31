'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function BreathingOrb() {
  const outerRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (outerRef.current) {
      outerRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.08)
      outerRef.current.rotation.y = t * 0.1
    }
    if (innerRef.current) {
      innerRef.current.scale.setScalar(0.6 + Math.sin(t * 0.5 + 0.5) * 0.05)
    }
  })

  return (
    <group>
      <mesh ref={outerRef}>
        {/* Reduced from 32×32 to 16×16 */}
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color="#8AA66A" transparent opacity={0.12} />
      </mesh>
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color="#556B45" transparent opacity={0.18} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshBasicMaterial color="#D6A84F" transparent opacity={0.35} />
      </mesh>
    </group>
  )
}

function SceneLifecycle({ onContextLost }: { onContextLost: () => void }) {
  const { gl } = useThree()
  useEffect(() => {
    const canvas = gl.domElement
    const handleLost = (e: Event) => {
      e.preventDefault()
      if (process.env.NODE_ENV !== 'production') console.warn('[WellnessOrbScene] WebGL context lost')
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

export default function WellnessOrbScene({ onContextLost }: { onContextLost: () => void }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: 'low-power', alpha: true, preserveDrawingBuffer: false }}
      style={{ background: 'transparent' }}
      frameloop="always"
    >
      <SceneLifecycle onContextLost={onContextLost} />
      <ambientLight intensity={0.8} color="#E8F5E0" />
      <BreathingOrb />
    </Canvas>
  )
}
