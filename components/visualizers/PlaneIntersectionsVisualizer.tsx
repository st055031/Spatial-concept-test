import React, { useMemo } from 'react';
import { Html, Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const Group = 'group' as any;
const Mesh = 'mesh' as any;
const BufferGeometry = 'bufferGeometry' as any;
const BufferAttribute = 'bufferAttribute' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const MeshBasicMaterial = 'meshBasicMaterial' as any;

const PlaneIntersectionsVisualizer: React.FC = () => {
  // 使用者定義映射：藍=X, 紅=Y, 綠=Z
  const userX_int = 3;   
  const userY_int = 4;   
  const userZ_int = 2.5; 

  // Points on axes based on mapping: 
  // UserX -> Blue (Three Z)
  // UserY -> Red (Three X)
  // UserZ -> Green (Three Y)
  const pA: [number, number, number] = [userY_int, 0, 0]; // Red axis (User Y)
  const pB: [number, number, number] = [0, userZ_int, 0]; // Green axis (User Z)
  const pC: [number, number, number] = [0, 0, userX_int]; // Blue axis (User X)

  const positions = useMemo(() => {
    return new Float32Array([...pA, ...pB, ...pC]);
  }, [pA, pB, pC]);

  const Fraction = ({ numerator, denominator, color = "text-slate-800" }: { numerator: React.ReactNode, denominator: React.ReactNode, color?: string }) => (
    <div className={`inline-flex flex-col items-center align-middle mx-1 ${color}`}>
      <span className="border-b border-current px-2 leading-none pb-1 text-[0.9em]">{numerator}</span>
      <span className="leading-none pt-1 text-[0.9em]">{denominator}</span>
    </div>
  );

  return (
    <Group>
      {/* Axes */}
      <Line points={[[-1, 0, 0], [6, 0, 0]]} color="#ef4444" lineWidth={2} opacity={0.3} transparent />
      <Line points={[[0, -1, 0], [0, 6, 0]]} color="#22c55e" lineWidth={2} opacity={0.3} transparent />
      <Line points={[[0, 0, -1], [0, 0, 6]]} color="#3b82f6" lineWidth={2} opacity={0.3} transparent />

      {/* Intercept Points with Labels */}
      <Group>
        <Sphere position={pA} args={[0.12]}><MeshBasicMaterial color="#ef4444" /></Sphere>
        <Html position={pA} distanceFactor={10} center>
          <div className="bg-red-500/90 text-white px-2.5 py-1 rounded shadow-lg text-[10px] font-black border border-white/20 -translate-y-8 whitespace-nowrap">
            (0, {userY_int}, 0)
          </div>
        </Html>
      </Group>

      <Group>
        <Sphere position={pB} args={[0.12]}><MeshBasicMaterial color="#22c55e" /></Sphere>
        <Html position={pB} distanceFactor={10} center>
          <div className="bg-green-600/90 text-white px-2.5 py-1 rounded shadow-lg text-[10px] font-black border border-white/20 translate-x-12 whitespace-nowrap">
            (0, 0, {userZ_int})
          </div>
        </Html>
      </Group>

      <Group>
        <Sphere position={pC} args={[0.12]}><MeshBasicMaterial color="#3b82f6" /></Sphere>
        <Html position={pC} distanceFactor={10} center>
          <div className="bg-blue-600/90 text-white px-2.5 py-1 rounded shadow-lg text-[10px] font-black border border-white/20 translate-y-8 whitespace-nowrap">
            ({userX_int}, 0, 0)
          </div>
        </Html>
      </Group>

      <Mesh shadow>
        <BufferGeometry>
          <BufferAttribute attach="attributes-position" array={positions} count={3} itemSize={3} />
        </BufferGeometry>
        <MeshStandardMaterial color="#8b5cf6" transparent opacity={0.3} side={THREE.DoubleSide} />
      </Mesh>

      <Line points={[pA, pB, pC, pA]} color="#7c3aed" lineWidth={3} />

      {/* Redesigned Horizontal Info Panel */}
      <Group position={[0, 4.5, 0]}>
        <Html center>
          <div className="bg-white/90 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/50 shadow-[0_30px_60px_rgba(0,0,0,0.12)] w-[720px] max-w-[95vw] select-none flex flex-col md:flex-row gap-6 items-stretch overflow-hidden">
            
            {/* Section 1: Title */}
            <div className="flex-1 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <h4 className="font-black text-slate-800 text-lg tracking-tight">平面截距式</h4>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em]">Intercept Form</p>
            </div>

            {/* Section 2: Data */}
            <div className="flex-[1.2] flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:px-2">
              <p className="text-[9px] text-slate-400 font-black mb-2 uppercase tracking-widest">軸截距參數 (藍X, 紅Y, 綠Z)</p>
              <div className="flex gap-2">
                <div className="flex-1 bg-blue-50 p-2 rounded-xl border border-blue-100 text-center">
                  <span className="text-[9px] text-blue-400 font-bold block">X-Int</span>
                  <span className="text-xs font-black text-blue-700">{userX_int}</span>
                </div>
                <div className="flex-1 bg-red-50 p-2 rounded-xl border border-red-100 text-center">
                  <span className="text-[9px] text-red-400 font-bold block">Y-Int</span>
                  <span className="text-xs font-black text-red-700">{userY_int}</span>
                </div>
                <div className="flex-1 bg-green-50 p-2 rounded-xl border border-green-100 text-center">
                  <span className="text-[9px] text-green-400 font-bold block">Z-Int</span>
                  <span className="text-xs font-black text-green-700">{userZ_int}</span>
                </div>
              </div>
            </div>

            {/* Section 3: Equation */}
            <div className="flex-[1.8] flex flex-col justify-center md:pl-2">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-center">
                <div className="text-xl font-serif whitespace-nowrap">
                  <Fraction numerator={<span className="text-blue-500 italic">x</span>} denominator={userX_int} color="text-blue-600" />
                  <span className="text-slate-300 mx-1">+</span>
                  <Fraction numerator={<span className="text-red-500 italic">y</span>} denominator={userY_int} color="text-red-600" />
                  <span className="text-slate-300 mx-1">+</span>
                  <Fraction numerator={<span className="text-green-600 italic">z</span>} denominator={userZ_int} color="text-green-600" />
                  <span className="text-slate-600 ml-2 font-bold">= 1</span>
                </div>
              </div>
            </div>
          </div>
        </Html>
      </Group>
    </Group>
  );
};

export default PlaneIntersectionsVisualizer;