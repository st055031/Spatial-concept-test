import React, { useMemo } from 'react';
import { Html, Line } from '@react-three/drei';
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

const StellaOctangulaVisualizer: React.FC = () => {
  const size = 3; 
  const s = size / 2;

  // Cube Vertices
  const v = useMemo(() => ({
    A: new THREE.Vector3(-s, -s, s), B: new THREE.Vector3(s, -s, s),
    C: new THREE.Vector3(s, s, s), D: new THREE.Vector3(-s, s, s),
    E: new THREE.Vector3(-s, -s, -s), F: new THREE.Vector3(s, -s, -s),
    G: new THREE.Vector3(s, s, -s), H: new THREE.Vector3(-s, s, -s),
  }), [s]);

  // Tetrahedra with Normals
  const t1Geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array([
      ...v.A.toArray(), ...v.C.toArray(), ...v.F.toArray(),
      ...v.A.toArray(), ...v.F.toArray(), ...v.H.toArray(),
      ...v.A.toArray(), ...v.H.toArray(), ...v.C.toArray(),
      ...v.C.toArray(), ...v.H.toArray(), ...v.F.toArray(),
    ]);
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.computeVertexNormals();
    return g;
  }, [v]);

  const t2Geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array([
      ...v.B.toArray(), ...v.D.toArray(), ...v.E.toArray(),
      ...v.B.toArray(), ...v.E.toArray(), ...v.G.toArray(),
      ...v.B.toArray(), ...v.G.toArray(), ...v.D.toArray(),
      ...v.D.toArray(), ...v.G.toArray(), ...v.E.toArray(),
    ]);
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.computeVertexNormals();
    return g;
  }, [v]);

  // Intersection Octahedron (Face Centers)
  // Mapping: Blue=X, Red=Y, Green=Z
  const ov = useMemo(() => ({
    top: new THREE.Vector3(0, s, 0), // User Z (Green)
    bottom: new THREE.Vector3(0, -s, 0),
    front: new THREE.Vector3(0, 0, s), // User X (Blue)
    back: new THREE.Vector3(0, 0, -s),
    right: new THREE.Vector3(s, 0, 0), // User Y (Red)
    left: new THREE.Vector3(-s, 0, 0),
  }), [s]);

  const octaGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array([
      ...ov.top.toArray(), ...ov.front.toArray(), ...ov.right.toArray(),
      ...ov.top.toArray(), ...ov.right.toArray(), ...ov.back.toArray(),
      ...ov.top.toArray(), ...ov.back.toArray(), ...ov.left.toArray(),
      ...ov.top.toArray(), ...ov.left.toArray(), ...ov.front.toArray(),
      ...ov.bottom.toArray(), ...ov.right.toArray(), ...ov.front.toArray(),
      ...ov.bottom.toArray(), ...ov.back.toArray(), ...ov.right.toArray(),
      ...ov.bottom.toArray(), ...ov.left.toArray(), ...ov.back.toArray(),
      ...ov.bottom.toArray(), ...ov.front.toArray(), ...ov.left.toArray(),
    ]);
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.computeVertexNormals();
    return g;
  }, [ov]);

  return (
    <Group rotation={[0.1, Math.PI / 4, 0]}>
      {/* Cube Skeleton */}
      <Group>
        <Line points={[v.A, v.B, v.F, v.E, v.A]} color="#64748b" lineWidth={1} dashed dashScale={20} opacity={0.3} transparent />
        <Line points={[v.D, v.C, v.G, v.H, v.D]} color="#64748b" lineWidth={1} dashed dashScale={20} opacity={0.3} transparent />
        <Line points={[v.A, v.D]} color="#64748b" lineWidth={1} dashed dashScale={20} opacity={0.3} transparent />
        <Line points={[v.B, v.C]} color="#64748b" lineWidth={1} dashed dashScale={20} opacity={0.3} transparent />
        <Line points={[v.F, v.G]} color="#64748b" lineWidth={1} dashed dashScale={20} opacity={0.3} transparent />
        <Line points={[v.E, v.H]} color="#64748b" lineWidth={1} dashed dashScale={20} opacity={0.3} transparent />
      </Group>

      {/* Tetrahedra Surfaces */}
      <Mesh geometry={t1Geo}>
        <MeshStandardMaterial color="#0ea5e9" transparent opacity={0.1} side={THREE.DoubleSide} />
      </Mesh>
      <Mesh geometry={t2Geo}>
        <MeshStandardMaterial color="#f43f5e" transparent opacity={0.1} side={THREE.DoubleSide} />
      </Mesh>

      {/* Intersection Octahedron */}
      <Mesh geometry={octaGeo}>
        <MeshStandardMaterial color="#10b981" transparent opacity={0.6} side={THREE.DoubleSide} metalness={0.5} roughness={0.2} />
      </Mesh>
      
      {/* Octahedron Edges */}
      <Group>
        {[ov.front, ov.right, ov.back, ov.left, ov.front].map((p, i, arr) => (
          <React.Fragment key={i}>
            <Line points={[ov.top, p]} color="#064e3b" lineWidth={2} />
            <Line points={[ov.bottom, p]} color="#064e3b" lineWidth={2} />
            {i < arr.length - 1 && <Line points={[p, arr[i+1]]} color="#064e3b" lineWidth={2} />}
          </React.Fragment>
        ))}
      </Group>

      {/* 對角線：藍=X, 紅=Y, 綠=Z */}
      <Group>
        <Line points={[ov.top, ov.bottom]} color="#22c55e" lineWidth={2} dashed dashScale={10} opacity={0.7} transparent />
        <Line points={[ov.left, ov.right]} color="#ef4444" lineWidth={1.5} dashed dashScale={10} opacity={0.7} transparent />
        <Line points={[ov.front, ov.back]} color="#3b82f6" lineWidth={1.5} dashed dashScale={10} opacity={0.7} transparent />
      </Group>

      {/* Cube Face Diagonals */}
      <Group>
        <Line points={[v.A, v.C, v.F, v.A, v.H, v.C]} color="#0ea5e9" lineWidth={3} opacity={0.6} transparent />
        <Line points={[v.H, v.F]} color="#0ea5e9" lineWidth={3} opacity={0.6} transparent />
        <Line points={[v.B, v.D, v.E, v.B, v.G, v.D]} color="#f43f5e" lineWidth={3} opacity={0.6} transparent />
        <Line points={[v.G, v.E]} color="#f43f5e" lineWidth={3} opacity={0.6} transparent />
      </Group>

      {/* Info Panel */}
      <Group position={[0, 4.8, 0]}>
        <Html center>
          <div className="bg-white/95 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-emerald-200/50 shadow-[0_40px_80px_rgba(0,0,0,0.15)] w-[840px] max-w-[95vw] select-none flex flex-col md:flex-row gap-6 items-stretch">
            <div className="flex-1 min-w-[200px] flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <h4 className="font-black text-slate-800 text-xl tracking-tight">星形八面體交集</h4>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Intersection Analysis</p>
            </div>

            <div className="flex-[2.8] flex flex-col justify-center md:pl-2">
              <p className="text-[9px] text-slate-400 font-black mb-3 uppercase tracking-widest text-center">內部對角線 (藍X, 紅Y, 綠Z)</p>
              <div className="bg-slate-900 p-4 rounded-3xl shadow-2xl flex justify-around">
                <div className="text-center">
                  <span className="block text-[9px] text-blue-400 font-black uppercase">X軸</span>
                  <span className="text-white font-mono text-xs">L</span>
                </div>
                <div className="text-center">
                  <span className="block text-[9px] text-red-400 font-black uppercase">Y軸</span>
                  <span className="text-white font-mono text-xs">L</span>
                </div>
                <div className="text-center">
                  <span className="block text-[9px] text-green-400 font-black uppercase">Z軸</span>
                  <span className="text-white font-mono text-xs">L</span>
                </div>
              </div>
            </div>
          </div>
        </Html>
      </Group>
    </Group>
  );
};

export default StellaOctangulaVisualizer;