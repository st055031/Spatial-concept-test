import React from 'react';
import { Html, Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const Group = 'group' as any;
const Mesh = 'mesh' as any;
const PlaneGeometry = 'planeGeometry' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;

const ThreePerpendicularsVisualizer: React.FC = () => {
  const P: [number, number, number] = [0, 3, 0];
  const O: [number, number, number] = [0, 0, 0];
  const A: [number, number, number] = [2, 0, 2];
  
  const dirL = new THREE.Vector3(-1, 0, 1).normalize();
  const startL = new THREE.Vector3(...A).add(dirL.clone().multiplyScalar(-4));
  const endL = new THREE.Vector3(...A).add(dirL.clone().multiplyScalar(4));

  return (
    <Group>
      <Mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <PlaneGeometry args={[12, 12]} />
        <MeshStandardMaterial color="#cbd5e1" transparent opacity={0.2} />
      </Mesh>

      <Line points={[startL, endL]} color="#f59e0b" lineWidth={5} />
      <Line points={[P, O]} color="#ef4444" lineWidth={4} />
      <Line points={[O, A]} color="#3b82f6" lineWidth={4} />
      <Line points={[P, A]} color="#10b981" lineWidth={4} />

      <Sphere position={P} args={[0.1]}><MeshStandardMaterial color="#ef4444" /></Sphere>
      <Sphere position={O} args={[0.08]}><MeshStandardMaterial color="#475569" /></Sphere>
      <Sphere position={A} args={[0.1]}><MeshStandardMaterial color="#3b82f6" /></Sphere>

      <Html position={P} center><div className="text-[10px] font-black bg-red-500 text-white px-1.5 rounded -translate-y-6">P</div></Html>
      <Html position={O} center><div className="text-[10px] font-black bg-slate-500 text-white px-1.5 rounded translate-y-6">O</div></Html>
      <Html position={A} center><div className="text-[10px] font-black bg-blue-500 text-white px-1.5 rounded translate-x-6">A</div></Html>

      {/* Redesigned Horizontal Info Panel */}
      <Group position={[0, 4.5, 0]}>
        <Html center>
          <div className="bg-white/90 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/50 shadow-[0_30px_60px_rgba(0,0,0,0.12)] w-[700px] max-w-[95vw] select-none flex flex-col md:flex-row gap-6 items-stretch overflow-hidden">
            
            <div className="flex-1 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h4 className="font-black text-slate-800 text-lg tracking-tight">三垂線定理</h4>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em]">Three Perpendiculars</p>
            </div>

            <div className="flex-[1.5] flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:px-4">
              <p className="text-[9px] text-slate-400 font-black mb-3 uppercase tracking-widest">定理步驟 Step-by-Step</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[8px]">1</span>
                  <span>PO ⊥ 平面 E</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[8px]">2</span>
                  <span>OA ⊥ 直線 L</span>
                </div>
              </div>
            </div>

            <div className="flex-[1.5] flex flex-col justify-center md:pl-2">
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex flex-col items-center justify-center">
                <p className="text-[9px] text-emerald-500 font-black uppercase mb-1">結論 Conclusion</p>
                <p className="text-emerald-700 font-black text-lg underline decoration-emerald-300 decoration-4 underline-offset-4">
                  PA ⊥ 直線 L
                </p>
              </div>
            </div>
          </div>
        </Html>
      </Group>
    </Group>
  );
};

export default ThreePerpendicularsVisualizer;