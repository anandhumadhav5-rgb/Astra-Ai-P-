"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, OrbitControls, Sphere } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function ParticleField() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const array = new Float32Array(900);

    for (let index = 0; index < array.length; index += 3) {
      const radius = 1.4 + Math.random() * 3.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      array[index] = radius * Math.sin(phi) * Math.cos(theta);
      array[index + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.7;
      array[index + 2] = radius * Math.cos(phi);
    }

    return array;
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!points.current) {
      return;
    }

    points.current.rotation.y = clock.elapsedTime * 0.035 + pointer.x * 0.08;
    points.current.rotation.x = Math.sin(clock.elapsedTime * 0.16) * 0.08 + pointer.y * 0.06;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#8ff7ff" transparent opacity={0.62} depthWrite={false} />
    </points>
  );
}

function EnergyRings() {
  const ring = useRef<THREE.Group>(null);

  useFrame(({ clock, pointer }) => {
    if (!ring.current) {
      return;
    }

    ring.current.rotation.x = Math.PI / 2 + Math.sin(clock.elapsedTime * 0.4) * 0.08 + pointer.y * 0.06;
    ring.current.rotation.z = clock.elapsedTime * 0.22 + pointer.x * 0.12;
  });

  return (
    <group ref={ring}>
      {[1.18, 1.5, 1.82].map((radius, index) => (
        <mesh key={radius} rotation={[0, 0, index * 0.75]}>
          <torusGeometry args={[radius, 0.008, 16, 180]} />
          <meshBasicMaterial
            color={index === 1 ? "#a78bfa" : "#22d3ee"}
            transparent
            opacity={0.38 - index * 0.07}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function AiOrb() {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame(({ clock, pointer }) => {
    if (group.current) {
      group.current.rotation.y = clock.elapsedTime * 0.2 + pointer.x * 0.28;
      group.current.rotation.x = Math.sin(clock.elapsedTime * 0.5) * 0.12 - pointer.y * 0.18;
      group.current.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.08;
    }

    if (inner.current) {
      const scale = 1 + Math.sin(clock.elapsedTime * 2.1) * 0.035;
      inner.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={group}>
      <Sphere ref={inner} args={[0.72, 96, 96]}>
        <MeshDistortMaterial
          color="#22d3ee"
          emissive="#5eead4"
          emissiveIntensity={1.65}
          metalness={0.35}
          roughness={0.14}
          distort={0.32}
          speed={2.2}
        />
      </Sphere>
      <Sphere args={[0.92, 96, 96]}>
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.13} wireframe blending={THREE.AdditiveBlending} />
      </Sphere>
      <EnergyRings />
    </group>
  );
}

export function NeuralCanvas() {
  return (
    <div className="absolute inset-0 h-full w-full" aria-hidden>
      <Canvas camera={{ position: [0, 0.1, 4.8], fov: 44 }} dpr={[1, 1.7]} performance={{ min: 0.55 }}>
        <color attach="background" args={["#03070d"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[2.8, 2.4, 2.2]} intensity={30} color="#22d3ee" />
        <pointLight position={[-3.2, -1.3, 2.5]} intensity={24} color="#a78bfa" />
        <pointLight position={[0, 0, -2.5]} intensity={18} color="#5eead4" />
        <ParticleField />
        <AiOrb />
        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
