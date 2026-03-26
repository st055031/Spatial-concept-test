import React, { useMemo } from 'react';
import { Html, Line, Sphere } from '@react-three/drei';

const CoordinateSystemVisualizer: React.FC = () => {
  // 使用者定義映射：藍=X, 紅=Y, 綠=Z
  // 在 Three.js 中：紅=X軸, 綠=Y軸, 藍=Z軸
  // 因此：Three.X = User.Y, Three.Y = User.Z, Three.Z = User.X
  
  const userX = 3;
  const userY = 4;
  const userZ = 2;
  
  // 轉換為 Three.js 空間座標 [ThreeX, ThreeY, ThreeZ]
  const point: [number, number, number] = [userY, userZ, userX];

  // 產生刻度數據
  const ticks = useMemo(() => {
    const t = [];
    for (let i = 1; i <= 5; i++) t.push(i);
    return t;
  }, []);

  return (
    <group>
      {/* 座標軸基礎線 */}
      <Line points={[[-1, 0, 0], [6, 0, 0]]} color="#ef4444" lineWidth={3} /> {/* User Y (Red) */}
      <Line points={[[0, -1, 0], [0, 6, 0]]} color="#22c55e" lineWidth={3} /> {/* User Z (Green) */}
      <Line points={[[0, 0, -1], [0, 0, 6]]} color="#3b82f6" lineWidth={3} /> {/* User X (Blue) */}

      {/* 單位刻度與數字標籤 */}
      {ticks.map((val) => (
        <group key={`ticks-${val}`}>
          {/* User X (Blue) - Along Three Z */}
          <Line points={[[-0.1, 0, val], [0.1, 0, val]]} color="#3b82f6" lineWidth={2} />
          <Html position={[0.3, 0, val]} center>
            <span className="text-[10px] font-black text-blue-600 bg-white/50 px-1 rounded whitespace-nowrap">{val}</span>
          </Html>

          {/* User Y (Red) - Along Three X */}
          <Line points={[[val, -0.1, 0], [val, 0.1, 0]]} color="#ef4444" lineWidth={2} />
          <Html position={[val, 0.3, 0]} center>
            <span className="text-[10px] font-black text-red-600 bg-white/50 px-1 rounded whitespace-nowrap">{val}</span>
          </Html>

          {/* User Z (Green) - Along Three Y */}
          <Line points={[[-0.1, val, 0], [0.1, val, 0]]} color="#22c55e" lineWidth={2} />
          <Html position={[0.3, val, 0]} center>
            <span className="text-[10px] font-black text-green-600 bg-white/50 px-1 rounded whitespace-nowrap">{val}</span>
          </Html>
        </group>
      ))}

      {/* 座標原點標籤 */}
      <Html position={[0.2, -0.2, 0.2]} center>
        <span className="text-[10px] font-black text-slate-400 italic whitespace-nowrap">O (0,0,0)</span>
      </Html>

      {/* 目標點 P */}
      <group position={point}>
        <Sphere args={[0.15]}><meshStandardMaterial color="#1e293b" /></Sphere>
        <Html distanceFactor={10} center>
          <div className="bg-slate-900/90 text-white px-2 py-1 rounded shadow-lg text-[10px] font-mono font-black border border-white/20 translate-y-6 whitespace-nowrap">
            P ({userX}, {userY}, {userZ})
          </div>
        </Html>
      </group>
      
      {/* 投影線 */}
      <Line points={[point, [userY, userZ, 0]]} color="#94a3b8" lineWidth={1} dashed dashScale={15} opacity={0.5} transparent /> 
      <Line points={[point, [userY, 0, userX]]} color="#94a3b8" lineWidth={1} dashed dashScale={15} opacity={0.5} transparent /> 
      <Line points={[point, [0, userZ, userX]]} color="#94a3b8" lineWidth={1} dashed dashScale={15} opacity={0.5} transparent /> 

      {/* 投影到軸的輔助線 */}
      <Line points={[[userY, 0, 0], [userY, 0, userX], [0, 0, userX]]} color="#94a3b8" lineWidth={1} dashed dashScale={15} opacity={0.3} transparent />
      <Line points={[[0, userZ, 0], [userY, userZ, 0], [userY, 0, 0]]} color="#94a3b8" lineWidth={1} dashed dashScale={15} opacity={0.3} transparent />

      <mesh position={[userY/2, userZ/2, userX/2]}>
        <boxGeometry args={[userY, userZ, userX]} />
        <meshStandardMaterial color="#6366f1" transparent opacity={0.05} />
      </mesh>

      {/* 資訊面板 */}
      <group position={[0, 4.5, 0]}>
        <Html center>
          <div className="bg-white/90 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/50 shadow-[0_30px_60px_rgba(0,0,0,0.12)] w-[640px] max-w-[95vw] select-none flex flex-col md:flex-row gap-6 items-stretch overflow-hidden">
            
            <div className="flex-1 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <h4 className="font-black text-slate-800 text-lg tracking-tight">空間坐標刻度</h4>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em]">Coordinate Ticks</p>
            </div>

            <div className="flex-[2] flex items-center justify-around gap-4 md:pl-4">
              <div className="text-center">
                <span className="block text-[10px] font-black text-blue-400 mb-1">X-軸 (藍)</span>
                <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 text-blue-700 font-mono font-black whitespace-nowrap">{userX}</div>
              </div>
              <div className="text-center">
                <span className="block text-[10px] font-black text-red-400 mb-1">Y-軸 (紅)</span>
                <div className="bg-red-50 px-4 py-2 rounded-xl border border-red-100 text-red-700 font-mono font-black whitespace-nowrap">{userY}</div>
              </div>
              <div className="text-center">
                <span className="block text-[10px] font-black text-green-400 mb-1">Z-軸 (綠)</span>
                <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-100 text-green-700 font-mono font-black whitespace-nowrap">{userZ}</div>
              </div>
              <div className="h-12 w-[1px] bg-slate-100" />
              <div className="text-center">
                <span className="block text-[10px] font-black text-slate-400 mb-1 whitespace-nowrap">P (x, y, z)</span>
                <div className="bg-slate-800 px-4 py-2 rounded-xl text-white font-mono font-black shadow-lg whitespace-nowrap">({userX}, {userY}, {userZ})</div>
              </div>
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
};

export default CoordinateSystemVisualizer;
