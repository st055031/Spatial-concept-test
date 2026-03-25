import React from 'react';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';

// Fix: Define intrinsic elements as local constants to bypass JSX type checking issues
const Group = 'group' as any;
const Mesh = 'mesh' as any;
const PlaneGeometry = 'planeGeometry' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const RingGeometry = 'ringGeometry' as any;
const MeshBasicMaterial = 'meshBasicMaterial' as any;

const DihedralAngleVisualizer: React.FC = () => {
  const angle = Math.PI / 3; // 60 degrees

  return (
    /* Fix: use Group constant for intrinsic element */
    <Group>
      {/* Intersection line (The hinge) */}
      <Line points={[[0, -3.5, 0], [0, 3.5, 0]]} color="#f59e0b" lineWidth={6} />
      <Html position={[0, 3.8, 0]}>
        <div className="bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">交線 Intersection Line</div>
      </Html>

      {/* Plane 1 (Static) */}
      {/* Fix: use Mesh constant for intrinsic element */}
      <Mesh rotation={[0, 0, 0]} position={[1.75, 0, 0]}>
        {/* Fix: use PlaneGeometry constant for intrinsic element */}
        <PlaneGeometry args={[3.5, 7]} />
        {/* Fix: use MeshStandardMaterial constant for intrinsic element */}
        <MeshStandardMaterial color="#3b82f6" transparent opacity={0.3} side={THREE.DoubleSide} />
      </Mesh>

      {/* Plane 2 (Angled) */}
      {/* Fix: use Group constant for intrinsic element */}
      <Group rotation={[0, -angle, 0]}>
        {/* Fix: use Mesh constant for intrinsic element */}
        <Mesh position={[1.75, 0, 0]}>
          {/* Fix: use PlaneGeometry constant for intrinsic element */}
          <PlaneGeometry args={[3.5, 7]} />
          {/* Fix: use MeshStandardMaterial constant for intrinsic element */}
          <MeshStandardMaterial color="#ef4444" transparent opacity={0.3} side={THREE.DoubleSide} />
        </Mesh>
      </Group>

      {/* Angle indicator */}
      {/* Fix: use Mesh constant for intrinsic element */}
      <Mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        {/* Fix: use RingGeometry constant for intrinsic element */}
        <RingGeometry args={[1.2, 1.4, 32, 1, 0, angle]} />
        {/* Fix: use MeshBasicMaterial constant for intrinsic element */}
        <MeshBasicMaterial color="#1e293b" side={THREE.DoubleSide} />
      </Mesh>
      
      <Html position={[2, 0.8, -1.2]}>
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-slate-200 text-slate-800 text-2xl font-serif">
          θ = 60°
        </div>
      </Html>

      <Html position={[3.5, 0, 0]}>
        <div className="text-blue-600 font-black text-xl italic opacity-70">E1</div>
      </Html>
      <Html position={[3.5 * Math.cos(angle), 0, -3.5 * Math.sin(angle)]}>
        <div className="text-red-600 font-black text-xl italic opacity-70">E2</div>
      </Html>
    </Group>
  );
};

export default DihedralAngleVisualizer;