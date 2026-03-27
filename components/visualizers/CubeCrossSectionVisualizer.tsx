import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Edges, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Layers, Info, Rotate3d, CheckCircle2 } from 'lucide-react';

const Group = 'group' as any;
const Mesh = 'mesh' as any;
const BoxGeometry = 'boxGeometry' as any;
const SphereGeometry = 'sphereGeometry' as any;
const PlaneGeometry = 'planeGeometry' as any;
const MeshBasicMaterial = 'meshBasicMaterial' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const AmbientLight = 'ambientLight' as any;
const DirectionalLight = 'directionalLight' as any;
const PointLight = 'pointLight' as any;

// --- 3D 場景組件 ---
const CubeScene: React.FC<{ showPlane: boolean; showSection: boolean; autoRotate: boolean }> = ({ showPlane, showSection, autoRotate }) => {
  const hexVertices = useMemo(() => [
    new THREE.Vector3(-1.5, 1.5, 0),
    new THREE.Vector3(0, 1.5, -1.5),
    new THREE.Vector3(1.5, 0, -1.5),
    new THREE.Vector3(1.5, -1.5, 0),
    new THREE.Vector3(0, -1.5, 1.5),
    new THREE.Vector3(-1.5, 0, 1.5),
  ], []);

  const hexLinePoints = useMemo(() => {
    return [...hexVertices, hexVertices[0]].map(v => [v.x, v.y, v.z] as [number, number, number]);
  }, [hexVertices]);

  const faceGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const vertices = [0, 0, 0];
    hexVertices.forEach(v => vertices.push(v.x, v.y, v.z));
    const indices = [
      0, 1, 2,  0, 2, 3,  0, 3, 4,
      0, 4, 5,  0, 5, 6,  0, 6, 1
    ];
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [hexVertices]);

  const planeQuaternion = useMemo(() => {
    const v1 = new THREE.Vector3().subVectors(hexVertices[1], hexVertices[0]);
    const v2 = new THREE.Vector3().subVectors(hexVertices[4], hexVertices[0]);
    const normal = new THREE.Vector3().crossVectors(v1, v2).normalize();
    const dummy = new THREE.Object3D();
    dummy.lookAt(normal);
    return dummy.quaternion;
  }, [hexVertices]);

  const labels = [
    { text: 'A', pos: [-1.8, 1.8, 1.8] }, { text: 'B', pos: [1.8, 1.8, 1.8] },
    { text: 'C', pos: [-1.8, -1.8, 1.8] }, { text: 'D', pos: [1.8, -1.8, 1.8] },
    { text: 'E', pos: [-1.8, 1.8, -1.8] }, { text: 'F', pos: [1.8, 1.8, -1.8] },
    { text: 'G', pos: [-1.8, -1.8, -1.8] }, { text: 'H', pos: [1.8, -1.8, -1.8] }
  ];

  return (
    <Group>
      <AmbientLight intensity={1.2} />
      <DirectionalLight position={[10, 10, 10]} intensity={1} castShadow />
      <PointLight position={[-10, 5, -10]} intensity={0.5} />
      
      <OrbitControls autoRotate={autoRotate} autoRotateSpeed={1.0} enableDamping dampingFactor={0.05} />

      <Mesh>
        <BoxGeometry args={[3, 3, 3]} />
        <MeshBasicMaterial transparent opacity={0} depthWrite={false} />
        <Edges scale={1} color="#334155" />
      </Mesh>

      {labels.map((lbl, idx) => (
         <Html key={idx} position={lbl.pos as [number,number,number]} center>
           <span className="font-bold text-xl text-slate-500 select-none">{lbl.text}</span>
         </Html>
      ))}

      <Mesh position={[-1.5, 1.5, 0]}>
        <SphereGeometry args={[0.15, 32, 32]} />
        <MeshStandardMaterial color="#991b1b" roughness={0.3} metalness={0.2} />
      </Mesh>
      <Mesh position={[0, 1.5, -1.5]}>
        <SphereGeometry args={[0.15, 32, 32]} />
        <MeshStandardMaterial color="#991b1b" roughness={0.3} metalness={0.2} />
      </Mesh>
      <Mesh position={[0, -1.5, 1.5]}>
        <SphereGeometry args={[0.15, 32, 32]} />
        <MeshStandardMaterial color="#991b1b" roughness={0.3} metalness={0.2} />
      </Mesh>

      {showSection && (
        <Group>
          <Line points={hexLinePoints} color="#047857" lineWidth={3} />
          <Mesh geometry={faceGeometry}>
            <MeshBasicMaterial color="#10b981" transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} />
          </Mesh>
        </Group>
      )}

      {showPlane && (
        <Mesh quaternion={planeQuaternion}>
          <PlaneGeometry args={[15, 15]} />
          <MeshBasicMaterial color="#3b82f6" transparent opacity={0.1} side={THREE.DoubleSide} depthWrite={false} />
        </Mesh>
      )}
    </Group>
  );
};

// --- 主介面與 UI 組件 ---
export default function CubeCrossSectionVisualizer() {
  const [showPlane, setShowPlane] = useState(true);
  const [showSection, setShowSection] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className="flex w-full h-full bg-slate-50 overflow-hidden font-sans text-slate-800">
      <div className="w-80 bg-slate-50 border-r border-slate-200 h-full flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 shrink-0">
        <div className="p-6 overflow-y-auto flex-1 hide-scrollbar">
          <div className="flex items-center gap-2 mb-6">
            <Layers className="text-slate-400" size={18} />
            <span className="text-xs font-bold text-slate-500 tracking-wider">顯示控制</span>
          </div>

          <div className="space-y-4 mb-8">
            <button 
              onClick={() => setShowPlane(!showPlane)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                showPlane ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-500 hover:border-blue-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${showPlane ? 'bg-blue-500' : 'bg-slate-300'}`} />
                <span className="font-bold text-sm">切割平面</span>
              </div>
              <CheckCircle2 size={18} className={showPlane ? 'opacity-100' : 'opacity-0'} />
            </button>

            <button 
              onClick={() => setShowSection(!showSection)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                showSection ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${showSection ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <span className="font-bold text-sm">截面區域</span>
              </div>
              <CheckCircle2 size={18} className={showSection ? 'opacity-100' : 'opacity-0'} />
            </button>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -ml-10 -mb-10" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <Info className="text-blue-400" size={16} />
                <span className="text-xs font-bold text-slate-400 tracking-wider">幾何解析</span>
              </div>
              
              <div className="mb-6">
                <div className="text-sm font-medium text-slate-300 mb-4">通過稜邊中點：</div>
                <div className="space-y-3 pl-1">
                  <div className="flex items-center gap-3 text-sm font-bold tracking-wide">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    AE 中點
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold tracking-wide">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    EF 中點
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold tracking-wide">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    CD 中點
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-700/50">
                <div className="text-[10px] font-bold text-blue-400 tracking-widest mb-2">截面形狀</div>
                <div className="text-3xl font-black text-emerald-400 tracking-tight">正六邊形</div>
                <div className="text-[10px] text-slate-500 mt-1 font-mono uppercase">Regular Hexagon</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative bg-white">
        <Canvas camera={{ position: [5, 5, 8], fov: 45 }}>
          {/* 強制將 Canvas 內部背景設定為白色 */}
          <color attach="background" args={['#ffffff']} />
          <CubeScene showPlane={showPlane} showSection={showSection} autoRotate={autoRotate} />
        </Canvas>
        
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-md rounded-full text-sm font-bold text-slate-700 shadow-lg border border-slate-200/50 hover:bg-white hover:shadow-xl hover:-translate-y-0.5 transition-all active:translate-y-0"
          >
            <div className="relative flex items-center justify-center">
              {autoRotate ? (
                <>
                  <Rotate3d size={18} className="text-blue-600 animate-spin-slow" />
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur animate-pulse" />
                </>
              ) : (
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              )}
            </div>
            {autoRotate ? '停止旋轉' : '開始旋轉'}
          </button>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="bg-slate-200/50 backdrop-blur-sm px-6 py-2.5 rounded-full text-[10px] font-bold text-slate-500 tracking-[0.2em] shadow-sm border border-slate-300/30">
            拖 拽 旋 轉 • 滾 軸 縮 放
          </div>
        </div>
      </div>
    </div>
  );
}
