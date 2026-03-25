import React from 'react';
import { Topic, TopicInfo } from '../types';
import { Menu, X, ChevronRight } from 'lucide-react';

interface MobileNavProps {
  topics: TopicInfo[];
  activeTopic: Topic;
  onSelect: (topic: Topic) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ topics, activeTopic, onSelect }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="md:hidden">
      {/* Bottom Floating Bar - Extremely high z-index to stay above 3D labels */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex bg-white/95 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-slate-200/50 px-5 py-3 items-center gap-4 z-[1000] ring-1 ring-black/5">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 bg-indigo-600 text-white rounded-full shadow-lg active:scale-90 transition-all duration-200"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={20} strokeWidth={3} /> : <Menu size={20} strokeWidth={3} />}
        </button>
        <div className="h-5 w-[1px] bg-slate-200"></div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter leading-none mb-1">正在閱讀</span>
          <span className="text-xs font-black text-slate-800 truncate max-w-[120px] leading-none">
            {topics.find(t => t.id === activeTopic)?.title}
          </span>
        </div>
      </div>

      {/* Fullscreen Overlay Drawer - Highest possible z-index */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[2000] flex flex-col justify-end transition-all duration-300"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white rounded-t-[2.5rem] p-8 space-y-4 animate-in slide-in-from-bottom duration-500 shadow-[0_-20px_60px_rgba(0,0,0,0.4)] max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Handle Bar */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />
            
            <div className="flex justify-between items-center mb-4 px-2">
              <div>
                <h3 className="font-black text-2xl text-slate-900 tracking-tight">幾何主題選單</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Spatial Explorer Menu</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 active:scale-90 transition-transform"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pb-12 pr-1">
              {topics.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    onSelect(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-6 py-4 rounded-2xl text-base font-bold transition-all flex items-center justify-between border-2 ${
                    activeTopic === t.id 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-200 translate-x-1' 
                      : 'text-slate-600 bg-slate-50 border-transparent hover:bg-slate-100 active:bg-slate-200'
                  }`}
                >
                  <span className="truncate">{t.title}</span>
                  {activeTopic === t.id ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_white] animate-pulse" />
                  ) : (
                    <ChevronRight size={18} className="text-slate-300" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;