import React, { useState } from 'react';
import { Topic, TopicInfo } from './types';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import MainViewer from './components/MainViewer';
import { Box, Triangle, Grid3X3, Layers, Ruler, Compass, Package } from 'lucide-react';

const TOPICS: TopicInfo[] = [
  { id: Topic.StellaOctangula, title: '正方體與對偶四面體', description: '觀察正方體中交錯頂點構成的兩個正四面體' },
  { id: Topic.OctahedronInCube, title: '立方體與正八面體', description: '觀察立方體面中心構成的八面體' },
  { id: Topic.CoordinateSystem, title: '空間坐標系', description: '基礎三軸與點投影' },
  { id: Topic.FoldingRectangle, title: '矩形摺疊問題', description: '矩形沿對角線摺疊至平面垂直' },
  { id: Topic.FoldingSquare, title: '正方形摺疊問題', description: '正方形摺疊與二面角計算' },
  { id: Topic.ThreePerpendiculars, title: '三垂線定理', description: '空間中的垂直關係判定' },
  { id: Topic.Tetrahedron, title: '正四面體', description: '觀察高、兩面角與歪斜線距離' },
  { id: Topic.PlaneIntersections, title: '平面截距式', description: '空間平面與三軸相交點' },
  { id: Topic.Pyramid, title: '金字塔', description: '觀察高與底面對角線交點' },
  { id: Topic.DihedralAngle, title: '兩面角', description: '兩個平面相交形成的夾角' },
];

const App: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<Topic>(Topic.StellaOctangula);

  const currentTopicInfo = TOPICS.find(t => t.id === activeTopic)!;

  return (
    <div className="flex h-screen w-full flex-col md:flex-row overflow-hidden bg-slate-50 font-sans relative">
      {/* Desktop Sidebar */}
      <Sidebar 
        topics={TOPICS} 
        activeTopic={activeTopic} 
        onSelect={setActiveTopic} 
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        {/* Header (Mobile-ish) */}
        <header className="bg-white border-b border-slate-200 p-4 md:p-6 shadow-sm z-10">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">{currentTopicInfo.title}</h1>
          <p className="text-sm text-slate-500 mt-1">{currentTopicInfo.description}</p>
        </header>

        {/* 3D Viewer Area */}
        <div className="flex-1 relative overflow-hidden bg-slate-900">
           <MainViewer topic={activeTopic} />
        </div>
      </main>

      {/* Mobile Navigation - Moved to root level for absolute top stacking */}
      <MobileNav 
        topics={TOPICS} 
        activeTopic={activeTopic} 
        onSelect={setActiveTopic} 
      />
    </div>
  );
};

export default App;