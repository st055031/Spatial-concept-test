
import React from 'react';
import { Topic, TopicInfo } from '../types';
import { Box, Triangle, Grid3X3, Layers, Ruler, Compass, GraduationCap } from 'lucide-react';

interface SidebarProps {
  topics: TopicInfo[];
  activeTopic: Topic;
  onSelect: (topic: Topic) => void;
}

const TopicIcon = ({ topic }: { topic: Topic }) => {
  switch (topic) {
    case Topic.Tetrahedron: return <Triangle size={20} />;
    case Topic.Pyramid: return <Box size={20} />;
    case Topic.DihedralAngle: return <Compass size={20} />;
    case Topic.ThreePerpendiculars: return <Ruler size={20} />;
    case Topic.CoordinateSystem: return <Grid3X3 size={20} />;
    case Topic.PlaneIntersections: return <Layers size={20} />;
    default: return <GraduationCap size={20} />;
  }
};

const Sidebar: React.FC<SidebarProps> = ({ topics, activeTopic, onSelect }) => {
  return (
    <nav className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full p-4 shrink-0">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
          <GraduationCap size={20} />
        </div>
        <span className="font-bold text-slate-800 tracking-tight">空間幾何教室</span>
      </div>
      
      <div className="space-y-1">
        {topics.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTopic === t.id 
                ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <TopicIcon topic={t.id} />
            {t.title}
          </button>
        ))}
      </div>

      <div className="mt-auto p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
        <p>互動式 3D 學習工具</p>
        <p className="mt-1 opacity-70">點擊並拖曳以旋轉視角</p>
      </div>
    </nav>
  );
};

export default Sidebar;
