import React, { useMemo } from 'react';
import { Html, Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const Group = 'group' as any;
const Mesh = 'mesh' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;

const Fraction = ({ n, d, color = "text-slate-700" }: { n: React.ReactNode, d: React.ReactNode, color?: string }) => (
  <div className={`inline-flex flex-col items-center align-middle mx-1 ${color}`}>
    <span className="border-b border-current px-1 leading-none pb-0.5 text-[0.85em]">{n}</span>
    <span className="leading-none pt-0.5 text-[0.85em]">{d}</span>
  </div>
);

const OctahedronInCubeVisualizer: React.FC = () => {
  const size = 3; 
  const s = size / 2;

  // Cube Vertices
  const cv = useMemo(() => ({
    A: new THREE.Vector3(-s, -s, s), B: new THREE.Vector3(s, -s, s), 
    C: new THREE.Vector3(s, s, s), D: new THREE.Vector3(-s, s, s),
    E: new THREE.Vector3(-s, -s, -s), f: new THREE.Vector3(s, -s, -s), 
    G: new THREE.Vector3(s, s, -s), H: new THREE.Vector3(-s, s, -s),
  }), [s]);

  // Octahedron Vertices (Face Centers)
  // 映射關係：藍=X (Z-axis), 紅=Y (X-axis), 綠=Z (Y-axis)
  const ov = useMemo(() => ({
    top: new THREE.Vector3(0, s, 0), // Y-axis in Three -> User Z (Green)
    bottom: new THREE.Vector3(0, -s, 0),
    front: new THREE.Vector3(0, 0, s), // Z-axis in Three -> User X (Blue)
    back: new THREE.Vector3(0, 0, -s),
    right: new THREE.Vector3(s, 0, 0), // X-axis in Three -> User Y (Red)
    left: new THREE.Vector3(-s, 0, 0),
  }), [s]);

  // Face Diagonals of the Cube
  const faceDiagonals = useMemo(() => [
    [cv.A, cv.C], [cv.B, cv.D], 
    [cv.E, cv.G], [cv.f, cv.H], 
    [cv.A, cv.H], [cv.D, cv.E], 
    [cv.B, cv.G], [cv.C, cv.f], 
    [cv.D, cv.G], [cv.C, cv.H], 
    [cv.A, cv.f], [cv.B, cv.E], 
  ], [cv]);

  // Octahedron Geometry with Normals
  const octaGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      ...ov.top.toArray(), ...ov.front.toArray(), ...ov.right.toArray(),
      ...ov.top.toArray(), ...ov.right.toArray(), ...ov.back.toArray(),
      ...ov.top.toArray(), ...ov.back.toArray(), ...ov.left.toArray(),
      ...ov.top.toArray(), ...ov.left.toArray(), ...ov.front.toArray(),
      ...ov.bottom.toArray(), ...ov.right.toArray(), ...ov.front.toArray(),
      ...ov.bottom.toArray(), ...ov.back.toArray(), ...ov.right.toArray(),
      ...ov.bottom.toArray(), ...ov.left.toArray(), ...ov.back.toArray(),
      ...ov.bottom.toArray(), ...ov.front.toArray(), ...ov.left.toArray(),
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    return geometry;
  }, [ov]);

  return (
    <Group rotation={[0.1, Math.PI / 4, 0]}>
      {/* Cube Skeleton */}
      <Group>
        <Line points={[cv.A, cv.B, cv.f, cv.E, cv.A]} color="#475569" lineWidth={2} opacity={0.6} transparent />
        <Line points={[cv.D, cv.C, cv.G, cv.H, cv.D]} color="#475569" lineWidth={2} opacity={0.6} transparent />
        <Line points={[cv.A, cv.D]} color="#475569" lineWidth={2} opacity={0.6} transparent />
        <Line points={[cv.B, cv.C]} color="#475569" lineWidth={2} opacity={0.6} transparent />
        <Line points={[cv.f, cv.G]} color="#475569" lineWidth={2} opacity={0.6} transparent />
        <Line points={[cv.E, cv.H]} color="#475569" lineWidth={2} opacity={0.6} transparent />
      </Group>

      {/* Cube Face Diagonals */}
      <Group>
        {faceDiagonals.map((pts, i) => (
          <Line key={i} points={pts} color="#8b5cf6" lineWidth={1} dashed dashScale={15} opacity={0.3} transparent />
        ))}
      </Group>

      {/* Octahedron Surface */}
      <Mesh geometry={octaGeometry}>
        <MeshStandardMaterial 
          color="#f59e0b" 
          transparent 
          opacity={0.4} 
          side={THREE.DoubleSide} 
          metalness={0.4} 
          roughness={0.3} 
        />
      </Mesh>

      {/* Octahedron Edges */}
      <Group>
        {[ov.front, ov.right, ov.back, ov.left, ov.front].map((p, i, arr) => (
          <React.Fragment key={i}>
            <Line points={[ov.top, p]} color="#f59e0b" lineWidth={3} />
            <Line points={[ov.bottom, p]} color="#f59e0b" lineWidth={3} />
            {i < arr.length - 1 && <Line points={[p, arr[i+1]]} color="#f59e0b" lineWidth={3} />}
          </React.Fragment>
        ))}
      </Group>

      {/* 內部對角線：依使用者映射顯色 */}
      <Group>
        {/* User Z (Green) - Three Y-axis */}
        <Line points={[ov.top, ov.bottom]} color="#22c55e" lineWidth={4} dashed dashScale={12} />
        
        {/* User Y (Red) - Three X-axis */}
        <Line points={[ov.left, ov.right]} color="#ef4444" lineWidth={3} dashed dashScale={12} />
        
        {/* User X (Blue) - Three Z-axis */}
        <Line points={[ov.front, ov.back]} color="#3b82f6" lineWidth={3} dashed dashScale={12} />
      </Group>

      {/* Face Center Dots */}
      {Object.entries(ov).map(([key, pos]) => (
        <Group key={key} position={pos}>
          <Sphere args={[0.08, 16, 16]}>
            <MeshStandardMaterial color="#9a3412" />
          </Sphere>
        </Group>
      ))}

      {/* Math Info Panel */}
      <Group position={[0, 4.8, 0]}>
        <Html center>
          <div className="bg-white/95 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-amber-200/50 shadow-[0_40px_80px_rgba(0,0,0,0.15)] w-[820px] max-w-[95vw] select-none flex flex-col md:flex-row gap-6 items-stretch">
            <div className="flex-1 min-w-[200px] flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.5)]" />
                <h4 className="font-black text-slate-800 text-xl tracking-tight">正八面體內部結構</h4>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Internal Structure</p>
            </div>

            <div className="flex-[1.8] flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:px-4">
              <p className="text-[9px] text-slate-400 font-black mb-3 uppercase tracking-widest">特徵說明 (藍X, 紅Y, 綠Z)</p>
              <div className="space-y-2 text-[11px] font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-blue-500 rounded-full" />
                  <span>藍色虛線：正八面體的 X 軸</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-red-500 rounded-full" />
                  <span>紅色虛線：正八面體的 Y 軸</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-green-500 rounded-full" />
                  <span>綠色虛線：正八面體的 Z 軸 (高)</span>
                </div>
              </div>
            </div>

            <div className="flex-[2] flex flex-col justify-center md:pl-2">
              <div className="bg-slate-900 p-5 rounded-3xl shadow-2xl text-center">
                <p className="font-black text-amber-400 text-xs tracking-widest uppercase mb-2">座標關係</p>
                <p className="text-white text-[11px] leading-relaxed">
                  三條對角線等長 (L)，且分別平行於 X, Y, Z 軸。
                </p>
              </div>
            </div>
          </div>
        </Html>
      </Group>
    </Group>
  );
};

export default OctahedronInCubeVisualizer;