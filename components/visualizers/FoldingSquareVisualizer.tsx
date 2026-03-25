import React, { useMemo, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line, Sphere, Ring } from '@react-three/drei';
import * as THREE from 'three';

const Group = 'group' as any;
const Mesh = 'mesh' as any;
const BufferGeometry = 'bufferGeometry' as any;
const BufferAttribute = 'bufferAttribute' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const MeshBasicMaterial = 'meshBasicMaterial' as any;

const FoldingSquareVisualizer: React.FC = () => {
  const h = Math.sqrt(2);
  const startAngle = Math.PI; 
  const targetAngle = Math.acos(0.75); 
  
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
    const M = new THREE.Vector3(0, 0, 0);
    const A = new THREE.Vector3(0, 0, -h);
    const C = new THREE.Vector3(0, 0, h);
    const B = new THREE.Vector3(h, 0, 0);
    const D = new THREE.Vector3(
      h * Math.cos(theta),
      h * Math.sin(theta),
      0
    );
    const bdDist = B.distanceTo(D);
    return { A, B, C, D, M, bdDist };
  }, [theta, h]);

  return (
    <Group rotation={[0, Math.PI / 6, 0]}>
      {['A', 'B', 'C', 'D', 'M'].map((label) => (
        <Html key={label} position={pts[label as keyof typeof pts] as THREE.Vector3} center>
          <div className="bg-slate-800/80 text-white px-1.5 py-0.5 rounded text-[10px] font-bold select-none border border-white/20">
            {label}
          </div>
        </Html>
      ))}

      <Mesh>
        <BufferGeometry>
          <BufferAttribute attach="attributes-position" count={3} array={new Float32Array([...pts.A.toArray(), ...pts.B.toArray(), ...pts.C.toArray()])} itemSize={3} />
        </BufferGeometry>
        <MeshStandardMaterial transparent opacity={0} side={THREE.DoubleSide} />
      </Mesh>
      <Mesh>
        <BufferGeometry>
          <BufferAttribute attach="attributes-position" count={3} array={new Float32Array([...pts.A.toArray(), ...pts.D.toArray(), ...pts.C.toArray()])} itemSize={3} />
        </BufferGeometry>
        <MeshStandardMaterial color="#10b981" transparent opacity={0.05} side={THREE.DoubleSide} />
      </Mesh>

      <Line points={[pts.A, pts.B, pts.C]} color="#1e293b" lineWidth={2} opacity={0.3} transparent />
      <Line points={[pts.A, pts.D, pts.C]} color="#1e293b" lineWidth={2} />
      <Line points={[pts.A, pts.C]} color="#f59e0b" lineWidth={4} />

      <Group>
        <Line points={[pts.B, pts.M]} color="#3b82f6" lineWidth={5} />
        <Line points={[pts.D, pts.M]} color="#10b981" lineWidth={5} />
        <Line points={[pts.B, pts.D]} color={isFinished ? "#ef4444" : "#94a3b8"} lineWidth={6} dashed={!isFinished} dashScale={10} />
        
        {/* BD Distance Label - Styled to match Rectangle */}
        <Html position={pts.B.clone().lerp(pts.D, 0.5).add(new THREE.Vector3(0.5, 0.5, 0))} center>
          <div className={`whitespace-nowrap px-4 py-2 rounded-2xl backdrop-blur-md border transition-all duration-700 select-none ${
            isFinished 
              ? 'bg-red-500/20 border-red-300 text-red-800 shadow-[0_10px_25px_rgba(239,68,68,0.2)]' 
              : 'bg-white/10 border-white/20 text-slate-500 shadow-sm opacity-80'
          }`}>
            <span className="font-bold text-[10px] uppercase tracking-wider mr-2 opacity-60 italic">BD =</span>
            <span className="font-black text-lg">
              {isFinished ? "1" : pts.bdDist.toFixed(2)}
            </span>
          </div>
        </Html>
      </Group>

      <Group rotation={[0, 0, 0]}>
        <Mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <Ring args={[0.4, 0.45, 32, 1, 0, theta]} />
          <MeshBasicMaterial color="#ef4444" side={THREE.DoubleSide} transparent opacity={0.8} />
        </Mesh>
        <Html position={[0.6 * Math.cos(theta/2), 0.6 * Math.sin(theta/2), 0]} center>
          <div className="text-red-600 font-black text-lg italic bg-white/60 rounded-full px-1">θ</div>
        </Html>
      </Group>

      <Sphere position={pts.M} args={[0.08]}><MeshStandardMaterial color="#000" /></Sphere>

      {/* Horizontal UI Info Panel */}
      <Group position={[0, 4, 0]}>
        <Html center>
          <div className="bg-white/90 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/50 shadow-[0_30px_60px_rgba(0,0,0,0.12)] w-[720px] max-w-[95vw] select-none flex flex-col md:flex-row gap-6 items-stretch overflow-hidden">
            
            <div className="flex-1 min-w-[180px] flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${isFinished ? 'bg-red-500 animate-pulse' : 'bg-indigo-500'}`} />
                  <h4 className="font-black text-slate-800 text-lg tracking-tight">正方形摺疊與餘弦</h4>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] mb-4">Cos Theorem Study</p>
              </div>
              <button 
                onClick={resetAnimation}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 hover:bg-red-50 rounded-xl transition-all text-slate-500 hover:text-red-600 border border-slate-200 group active:scale-95 text-xs font-bold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-active:rotate-180 transition-transform duration-500">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
                </svg>
                重置動畫
              </button>
            </div>

            <div className="flex-[1.2] flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:px-2">
              <p className="text-[9px] text-slate-400 font-black mb-3 uppercase tracking-widest">核心幾何 Data</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/50">
                  <p className="text-[9px] text-blue-500 font-bold">邊長 AB</p>
                  <p className="text-sm font-black text-blue-900 font-mono">2</p>
                </div>
                <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/50">
                  <p className="text-[9px] text-emerald-500 font-bold">半對角線 BM</p>
                  <p className="text-sm font-black text-emerald-900 font-mono">√2</p>
                </div>
              </div>
            </div>

            <div className="flex-[1.8] flex flex-col justify-between md:pl-2">
              <div className={`flex-1 p-3 rounded-2xl border transition-all duration-700 mb-4 flex flex-col justify-center ${isFinished ? 'bg-red-50 border-red-100 ring-4 ring-red-500/5' : 'bg-slate-50/50 border-slate-100 opacity-80'}`}>
                <div className="flex justify-between items-center mb-2">
                   <p className="font-bold text-slate-800 text-xs">目標狀況：BD = 1</p>
                   {isFinished && <span className="text-[8px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">條件達成</span>}
                </div>
                <div className="bg-white/60 p-2 rounded-xl border border-slate-100 font-mono text-[10px] leading-tight text-slate-600">
                  <p className="text-red-600 font-black mb-1 italic">1² = (√2)² + (√2)² - 2·√2·√2·cos θ</p>
                  <div className="flex justify-between items-baseline">
                    <p>1 = 4 - 4 cos θ</p>
                    <p className="text-red-700 font-black text-sm">cos θ = 0.75</p>
                  </div>
                </div>
              </div>
              
              <div className="px-1">
                <div className="flex justify-between text-[9px] font-black text-slate-400 mb-1.5 uppercase tracking-tighter">
                  <span>Folding Sequence</span>
                  <span className={isFinished ? 'text-red-500' : 'text-indigo-500'}>
                    {(( (startAngle - theta) / (startAngle - targetAngle) ) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/30">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${isFinished ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]'}`} 
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

export default FoldingSquareVisualizer;