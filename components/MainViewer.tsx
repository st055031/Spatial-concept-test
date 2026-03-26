import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, GizmoHelper, GizmoViewport, Environment } from '@react-three/drei';
import { Topic } from '../types';
import TetrahedronVisualizer from './visualizers/TetrahedronVisualizer';
import PyramidVisualizer from './visualizers/PyramidVisualizer';
import DihedralAngleVisualizer from './visualizers/DihedralAngleVisualizer';
import ThreePerpendicularsVisualizer from './visualizers/ThreePerpendicularsVisualizer';
import CoordinateSystemVisualizer from './visualizers/CoordinateSystemVisualizer';
import PlaneIntersectionsVisualizer from './visualizers/PlaneIntersectionsVisualizer';
import FoldingRectangleVisualizer from './visualizers/FoldingRectangleVisualizer';
import FoldingSquareVisualizer from './visualizers/FoldingSquareVisualizer';
import OctahedronInCubeVisualizer from './visualizers/OctahedronInCubeVisualizer';
import StellaOctangulaVisualizer from './visualizers/StellaOctangulaVisualizer';
import CubeCrossSectionVisualizer from './visualizers/CubeCrossSectionVisualizer';

// Fix: Define intrinsic elements as local constants to bypass JSX type checking issues
const AmbientLight = 'ambientLight' as any;
const DirectionalLight = 'directionalLight' as any;
const PointLight = 'pointLight' as any;
const GridHelper = 'gridHelper' as any;

interface MainViewerProps {
  topic: Topic;
}

const Scene: React.FC<{ topic: Topic }> = ({ topic }) => {
  switch (topic) {
    case Topic.Tetrahedron: return <TetrahedronVisualizer />;
    case Topic.Pyramid: return <PyramidVisualizer />;
    case Topic.DihedralAngle: return <DihedralAngleVisualizer />;
    case Topic.ThreePerpendiculars: return <ThreePerpendicularsVisualizer />;
    case Topic.CoordinateSystem: return <CoordinateSystemVisualizer />;
    case Topic.PlaneIntersections: return <PlaneIntersectionsVisualizer />;
    case Topic.FoldingRectangle: return <FoldingRectangleVisualizer />;
    case Topic.FoldingSquare: return <FoldingSquareVisualizer />;
    case Topic.OctahedronInCube: return <OctahedronInCubeVisualizer />;
    case Topic.StellaOctangula: return <StellaOctangulaVisualizer />;
    // 注意：這裡已經把 CubeCrossSection 拿掉了，改到下方獨立處理
    default: return null;
  }
};

const MainViewer: React.FC<MainViewerProps> = ({ topic }) => {
  // 💡 提早攔截：如果是正方體截面，直接回傳帶有 HTML 的獨立組件，不進入 Canvas
  if (topic === Topic.CubeCrossSection) {
    return (
      <div className="w-full h-full relative">
        <CubeCrossSectionVisualizer />
      </div>
    );
  }

  // 其他主題維持原本的 3D Canvas 渲染
  return (
    <div className="w-full h-full relative cursor-move">
      <Canvas shadows dpr={[1, 2]} className="bg-slate-50">
        <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
        <OrbitControls makeDefault minDistance={2} maxDistance={20} />
        
        <AmbientLight intensity={1.2} />
        <DirectionalLight position={[10, 10, 10]} intensity={1} castShadow />
        <PointLight position={[-10, 5, -10]} intensity={0.5} />

        <Suspense fallback={null}>
          <Scene topic={topic} />
        </Suspense>

        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport 
            axisColors={['#ef4444', '#22c55e', '#3b82f6']} 
            labelColor="#1e293b" 
            labels={['Y', 'Z', 'X']}
          />
        </GizmoHelper>

        <Environment preset="city" />
        <GridHelper args={[20, 20, 0x94a3b8, 0xd1d5db]} position={[0, -0.01, 0]} />
      </Canvas>

      <div className="absolute top-4 right-4 pointer-events-none text-right">
        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-slate-700 border border-slate-300 uppercase tracking-widest shadow-md font-bold">
          3D Interactive Model
        </div>
      </div>
    </div>
  );
};

export default MainViewer;
