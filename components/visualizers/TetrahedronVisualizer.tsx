import React from 'react';
import { Html, Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const Group = 'group' as any;
const Mesh = 'mesh' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const MeshBasicMaterial = 'meshBasicMaterial' as any;
const BufferGeometry = 'bufferGeometry' as any;
const BufferAttribute = 'bufferAttribute' as any;

const Fraction = ({ n, d, color = "text-slate-700" }: { n: React.ReactNode, d: React.ReactNode, color?: string }) => (
  <div className={`inline-flex flex-col items-center align-middle mx-1 ${color}`}>
    <span className="border-b border-current px-1 leading-none pb-0.5 text-[0.85em]">{n}</span>
    <span className="leading-none pt-0.5 text-[0.85em]">{d}</span>
  </div>
);

const TetrahedronVisualizer: React.FC = () => {
  const a = 4;
  const h = (Math.sqrt(6) / 3) * a;
  const r = a / Math.sqrt(3);

  const v0: [number, number, number] = [0, h, 0];
  const v1: [number, number, number] = [r, 0, 0];
  const v2: [number, number, number] = [-r / 2, 0, a / 2];
  const v3: [number, number, number] = [-r / 2, 0, -a / 2];

  const vertices = [v0, v1, v2, v3];
  const edges = [[v0, v1], [v0, v2], [v0, v3], [v1, v2], [v2, v3], [v3, v1]];

  const baseCenter = new THREE.Vector3(0, 0, 0);
  const apex = new THREE.Vector3(...v0);
  const mid01 = new THREE.Vector3().addVectors(new THREE.Vector3(...v0), new THREE.Vector3(...v1)).divideScalar(2);
  const mid23 = new THREE.Vector3().addVectors(new THREE.Vector3(...v2), new THREE.Vector3(...v3)).divideScalar(2);
  const mEdge = mid23;

  return (
    <Group position={[0, 0, 0]}>
      <Mesh>
        <BufferGeometry>
          <BufferAttribute attach="attributes-position" array={new Float32Array([...v1, ...v2, ...v3, ...v0, ...v1, ...v2, ...v0, ...v2, ...v3, ...v0, ...v3, ...v1])} count={12} itemSize={3} />
        </BufferGeometry>
        <MeshStandardMaterial color="#6366f1" transparent opacity={0.2} side={THREE.DoubleSide} />
      </Mesh>

      {edges.map((edge, i) => <Line key={i} points={[edge[0], edge[1]]} color="#4338ca" lineWidth={4} />)}

      {vertices.map((v, i) => (
        <Group key={i} position={v}>
          <Sphere args={[0.1, 16, 16]}><MeshStandardMaterial color="#1e293b" /></Sphere>
          <Html distanceFactor={10} position={[0.2, 0.2, 0]}>
            <div className="text-slate-900 font-black bg-white/90 px-1.5 py-0.5 rounded shadow-sm text-xs border border-slate-200">V{i}</div>
          </Html>
        </Group>
      ))}

      <Line points={[apex, baseCenter]} color="#ef4444" lineWidth={4} dashed dashScale={10} />
      <Line points={[mid01, mid23]} color="#10b981" lineWidth={4} dashed dashScale={10} />
      
      <Group>
        <Line points={[apex, mEdge, v1]} color="#f59e0b" lineWidth={3} />
        <Sphere position={mEdge} args={[0.08]}><MeshBasicMaterial color="#f59e0b" /></Sphere>
      </Group>

      <Group position={[0, 4.5, 0]}>
        <Html center>
          <div className="bg-white/95 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-indigo-200/50 shadow-[0_40px_80px_rgba(0,0,0,0.15)] w-[800px] max-w-[95vw] select-none flex flex-col md:flex-row gap-6 items-stretch overflow-hidden">
            <div className="flex-1 min-w-[200px] flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                <h4 className="font-black text-slate-800 text-xl tracking-tight">正四面體幾何</h4>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Regular Tetrahedron</p>
            </div>

            <div className="flex-[2] flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:px-4">
              <p className="text-[9px] text-slate-400 font-black mb-3 uppercase tracking-widest">空間結構分析</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-50 p-2.5 rounded-xl border border-red-100 flex items-center justify-between">
                  <p className="text-[9px] text-red-600 font-bold">高 Height</p>
                  <div className="flex items-center text-xs font-black text-slate-700 font-mono">
                    h = <Fraction n="√6" d="3" /> a
                  </div>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between">
                  <p className="text-[9px] text-emerald-600 font-bold">歪斜線距離</p>
                  <div className="flex items-center text-xs font-black text-slate-700 font-mono">
                    d = <Fraction n="√2" d="2" color="text-emerald-700" /> a
                  </div>
                </div>
                <div className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-100 col-span-2 flex items-center justify-between">
                  <p className="text-[9px] text-indigo-600 font-bold">外接球半徑 R</p>
                  <div className="flex items-center text-xs font-black text-slate-700 font-mono">
                    R = <Fraction n="√6" d="4" color="text-indigo-700" /> a
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-[1.5] flex flex-col justify-center md:pl-2">
              <div className="bg-slate-900 p-4 rounded-3xl shadow-2xl relative overflow-hidden">
                <p className="font-black text-amber-400 text-[10px] tracking-widest uppercase mb-2 text-center">關鍵角度</p>
                <div className="bg-white/10 p-3 rounded-2xl text-center border border-white/10">
                  <div className="text-white font-serif text-sm italic mb-1 flex items-center justify-center">
                    cos θ = <Fraction n="1" d="3" color="text-white" />
                  </div>
                  <p className="text-amber-300 font-black text-xs">θ ≈ 70°32'</p>
                </div>
              </div>
            </div>
          </div>
        </Html>
      </Group>
    </Group>
  );
};

export default TetrahedronVisualizer;