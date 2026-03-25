import React, { useMemo, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';

const Group = 'group' as any;
const Mesh = 'mesh' as any;
const BufferGeometry = 'bufferGeometry' as any;
const BufferAttribute = 'bufferAttribute' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;

const FoldingRectangleVisualizer: React.FC = () => {
  const AB = 1.5;
  const BC = 2.0;
  const BD_len = Math.sqrt(AB ** 2 + BC ** 2); // 2.5
  const h = (AB * BC) / BD_len; // 1.2
  const bhA = 0.9;
  const bhC = 1.6;

  const startAngle = Math.PI; 
  const targetAngle = Math.PI / 2; 

  const [theta, setTheta] = useState(startAngle);
  const [isFinished, setIsFinished] = useState(false);

  useFrame((state, delta) => {
    if (!isFinished) {
      setTheta((prev) => {
        const next = prev - delta * 0.8;
        if (next <= targetAngle) {
          setIsFinished(true);
          return targetAngle;
        }
        return next;
      });
    }
  });

  const resetAnimation = useCallback(() => {
    setTheta(startAngle);
    setIsFinished(false);
  }, []);

  const pts = useMemo(() => {
    const halfBD = BD_len / 2;
    const B = new THREE.Vector3(0, 0, -halfBD);
    const D = new THREE.Vector3(0, 0, halfBD);
    const HA = new THREE.Vector3(0, 0, -halfBD + bhA);
    const HC = new THREE.Vector3(0, 0, -halfBD + bhC);
    const C = new THREE.Vector3(h, 0, -halfBD + bhC);
    const A = new THREE.Vector3(
      h * Math.cos(theta),
      h * Math.sin(theta),
      -halfBD + bhA
    );
    const acDist = A.distanceTo(C);
    return { A, B, C, D, HA, HC, acDist };
  }, [theta, BD_len, h, bhA, bhC]);

  return (
    <Group rotation={[0, Math.PI / 6, 0]}>
      {['A', 'B', 'C', 'D'].map((label) => (
        <Html key={label} position={pts[label as keyof typeof pts] as THREE.Vector3} center>
          <div className="bg-slate-800/80 text-white px-1.5 py-0.5 rounded text-[10px] font-bold select-none border border-white/20">
            {label}
          </div>
        </Html>
      ))}

      <Mesh>
        <BufferGeometry>
          <BufferAttribute attach="attributes-position" count={3} array={new Float32Array([...pts.B.toArray(), ...pts.C.toArray(), ...pts.D.toArray()])} itemSize={3} />
        </BufferGeometry>
        <MeshStandardMaterial transparent opacity={0} side={THREE.DoubleSide} />
      </Mesh>
      <Mesh>
        <BufferGeometry>
          <BufferAttribute attach="attributes-position" count={3} array={new Float32Array([...pts.A.toArray(), ...pts.B.toArray(), ...pts.D.toArray()])} itemSize={3} />
        </BufferGeometry>
        <MeshStandardMaterial color="#10b981" transparent opacity={0.05} side={THREE.DoubleSide} />
      </Mesh>

      <Line points={[pts.B, pts.C, pts.D]} color="#1e293b" lineWidth={2} opacity={0.3} transparent />
      <Line points={[pts.B, pts.A, pts.D]} color="#1e293b" lineWidth={2} />
      <Line points={[pts.B, pts.D]} color="#f59e0b" lineWidth={4} />

      <Group>
        <Line points={[pts.A, pts.HA]} color="#10b981" lineWidth={5} />
        <Line points={[pts.C, pts.HC]} color="#3b82f6" lineWidth={3} opacity={0.5} transparent />
        <Line points={[pts.HA, pts.HC]} color="#94a3b8" lineWidth={3} dashed dashScale={20} />
        <Line points={[pts.A, pts.C]} color={isFinished ? "#ef4444" : "#94a3b8"} lineWidth={6} dashed={!isFinished} dashScale={10} />
        
        {/* AC Distance Label - Offset to not block rectangle */}
        <Html position={pts.A.clone().lerp(pts.C, 0.5).add(new THREE.Vector3(0.8, 0.8, 0))} center>
          <div className={`whitespace-nowrap px-4 py-2 rounded-2xl backdrop-blur-md border transition-all duration-700 select-none ${
            isFinished 
              ? 'bg-emerald-500/20 border-emerald-300 text-emerald-800 shadow-[0_10px_25px_rgba(16,185,129,0.2)]' 
              : 'bg-white/10 border-white/20 text-slate-500 shadow-sm opacity-80'
          }`}>
            <span className="font-bold text-[10px] uppercase tracking-wider mr-2 opacity-60 italic">AC =</span>
            <span className="font-black text-lg">
              {isFinished ? "√337" : (pts.acDist * 10).toFixed(1)}
            </span>
          </div>
        </Html>
      </Group>

      {/* Horizontal UI Info Panel */}
      <Group position={[0, 4, 0]}>
        <Html center>
          <div className="bg-white/90 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/50 shadow-[0_30px_60px_rgba(0,0,0,0.12)] w-[720px] max-w-[95vw] select-none flex flex-col md:flex-row gap-6 items-stretch overflow-hidden">
            
            <div className="flex-1 min-w-[180px] flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${isFinished ? 'bg-red-500 animate-pulse' : 'bg-indigo-500'}`} />
                  <h4 className="font-black text-slate-800 text-lg tracking-tight">矩形摺疊動態</h4>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] mb-4">Rectangle Dynamics</p>
              </div>
              <button 
                onClick={resetAnimation}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 hover:bg-indigo-50 rounded-xl transition-all text-slate-500 hover:text-indigo-600 border border-slate-200 group active:scale-95 text-xs font-bold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-active:rotate-180 transition-transform duration-500">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
                </svg>
                重置動畫
              </button>
            </div>

            <div className="flex-[1.2] flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:px-2">
              <p className="text-[9px] text-slate-400 font-black mb-3 uppercase tracking-widest">幾何參數 Geometry</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                  <p className="text-[9px] text-slate-400 font-bold">AB / BC</p>
                  <p className="text-sm font-black text-slate-700 font-mono">15 / 20</p>
                </div>
                <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                  <p className="text-[9px] text-slate-400 font-bold">對角線 BD</p>
                  <p className="text-sm font-black text-slate-700 font-mono">25</p>
                </div>
                <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                  <p className="text-[9px] text-slate-400 font-bold">斜邊高 h</p>
                  <p className="text-sm font-black text-slate-700 font-mono">12</p>
                </div>
                <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                  <p className="text-[9px] text-blue-500 font-bold">HA-HC</p>
                  <p className="text-sm font-black text-blue-700 font-mono">7</p>
                </div>
              </div>
            </div>

            <div className="flex-[1.8] flex flex-col justify-between md:pl-2">
              <div className={`flex-1 p-3 rounded-2xl border transition-all duration-700 mb-4 flex flex-col justify-center ${isFinished ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50/50 border-slate-100 opacity-80'}`}>
                <div className="flex justify-between items-center mb-2">
                   <p className="font-bold text-slate-800 text-xs">空間距離 AC 公式</p>
                   {isFinished && <span className="text-[8px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">垂直達成</span>}
                </div>
                <div className="bg-white/60 p-2 rounded-xl border border-slate-100 font-mono text-[10px] leading-tight text-slate-600">
                  <p className="text-emerald-700 font-black mb-1">AC² = AH_A² + CH_C² + H_AH_C²</p>
                  <div className="flex justify-between items-baseline">
                    <p>AC² = 12² + 12² + 7²</p>
                    <p className="text-slate-800 font-black text-sm">AC = √337</p>
                  </div>
                </div>
              </div>
              
              <div className="px-1">
                <div className="flex justify-between text-[9px] font-black text-slate-400 mb-1.5 uppercase tracking-tighter">
                  <span>Folding Progress</span>
                  <span className={isFinished ? 'text-emerald-500' : 'text-indigo-500'}>
                    {(( (startAngle - theta) / (startAngle - targetAngle) ) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/30">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${isFinished ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]'}`} 
                    style={{ width: `${((startAngle - theta) / (startAngle - targetAngle)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            
          </div>
        </Html>
      </Group>
    </Group>
  );
};

export default FoldingRectangleVisualizer;