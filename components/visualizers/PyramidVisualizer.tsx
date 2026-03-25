import React, { useMemo } from 'react';
import { Html, Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Fix: Define intrinsic elements as local constants to bypass JSX type checking issues
const Group = 'group' as any;
const Mesh = 'mesh' as any;
const MeshBasicMaterial = 'meshBasicMaterial' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const ConeGeometry = 'coneGeometry' as any;

const PyramidVisualizer: React.FC = () => {
  const s = 2; // half-width of base
  const h = 3; // height

  // Vertices
  const V: [number, number, number] = [0, h, 0]; // Apex
  const A: [number, number, number] = [-s, 0, -s];
  const B: [number, number, number] = [s, 0, -s];
  const C: [number, number, number] = [s, 0, s];
  const D: [number, number, number] = [-s, 0, s];
  const O: [number, number, number] = [0, 0, 0]; // Base center

  // 1. Base-to-Side Dihedral Angle Construction (VBC vs Base)
  const M: [number, number, number] = [s, 0, 0]; // Midpoint of BC

  // 2. Side-to-Side Dihedral Angle Construction (VBC vs VCD)
  // Finding point K on edge VC such that BK is perpendicular to VC
  // Vector VC = (s, -h, s)
  // Using projection formula: t = h^2 / (h^2 + 2s^2)
  const kPoint = useMemo(() => {
    const t = (h * h) / (h * h + 2 * s * s);
    return [
      V[0] + t * (C[0] - V[0]),
      V[1] + t * (C[1] - V[1]),
      V[2] + t * (C[2] - V[2])
    ] as [number, number, number];
  }, [s, h]);

  return (
    <Group>
      {/* --- Main Structure --- */}
      <Line points={[A, B, C, D, A]} color="#334155" lineWidth={3} />
      <Line points={[V, A]} color="#475569" lineWidth={3} />
      <Line points={[V, B]} color="#475569" lineWidth={3} />
      <Line points={[V, C]} color="#475569" lineWidth={3} />
      <Line points={[V, D]} color="#475569" lineWidth={3} />

      {/* Height */}
      <Line points={[V, O]} color="#ef4444" lineWidth={4} />
      <Html position={[0, h * 0.7, 0]}>
        <div className="bg-red-500 text-white text-[10px] px-2 py-1 rounded shadow-lg font-bold whitespace-nowrap">高 Height</div>
      </Html>

      {/* --- Base-to-Side Dihedral Angle (Amber) --- */}
      <Group>
        <Line points={[O, M]} color="#f59e0b" lineWidth={4} />
        <Line points={[V, M]} color="#f59e0b" lineWidth={4} />
        <Sphere position={M} args={[0.08]}>
          <MeshBasicMaterial color="#f59e0b" />
        </Sphere>
        <Html position={[s + 0.4, 0.3, 0]} center>
          <div className="bg-amber-500 text-white text-[10px] px-3 py-1.5 rounded-full shadow-lg font-bold border border-amber-300 whitespace-nowrap">
            底面與側面夾角
          </div>
        </Html>
        {/* Right angle symbol at base center */}
        <Line points={[[0.2, 0, 0], [0.2, 0, 0.2], [0, 0, 0.2]]} color="#f59e0b" lineWidth={1.5} />
      </Group>

      {/* --- Side-to-Side Dihedral Angle (Purple) --- */}
      <Group>
        <Line points={[B, kPoint]} color="#8b5cf6" lineWidth={4} />
        <Line points={[D, kPoint]} color="#8b5cf6" lineWidth={4} />
        
        <Sphere position={kPoint} args={[0.1]}>
          <MeshBasicMaterial color="#8b5cf6" />
        </Sphere>

        <Html position={[kPoint[0] - 0.4, kPoint[1] + 0.4, kPoint[2] + 0.4]} center>
          <div className="bg-purple-600 text-white text-[10px] px-3 py-1.5 rounded-full shadow-lg font-bold border border-purple-400 whitespace-nowrap">
            相鄰側面夾角
          </div>
        </Html>

        {/* Perpendicular Markers at K */}
        <Group position={kPoint}>
          <Sphere args={[0.04]}><MeshBasicMaterial color="#8b5cf6" /></Sphere>
          {/* Conceptual markers for perpendicularity */}
          <Html position={[0.1, 0, 0.1]}>
            <div className="text-[10px] font-bold text-purple-700 opacity-50">∟</div>
          </Html>
        </Group>
      </Group>

      {/* Volume awareness */}
      <Mesh position={[0, h / 2, 0]}>
        <ConeGeometry args={[s * Math.sqrt(2), h, 4]} />
        <MeshStandardMaterial color="#64748b" transparent opacity={0.08} />
      </Mesh>
    </Group>
  );
};

export default PyramidVisualizer;