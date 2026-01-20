
import React, { useState, useEffect } from 'react';
import { AppId, WindowState } from '../types';
import { Cpu, Wifi, Volume2 } from 'lucide-react';

interface TaskbarProps {
  windows: Record<AppId, WindowState>;
  activeApp: AppId | null;
  onToggleWindow: (id: AppId) => void;
  onStartMenuClick: (e: React.MouseEvent) => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({ windows, activeApp, onToggleWindow, onStartMenuClick }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute bottom-0 w-full h-10 xp-taskbar flex items-center px-0 z-[1000] border-t border-white/20 shadow-[0_-2px_10px_rgba(0,0,0,0.5)]">
      {/* Start Button - Themed Accent */}
      <button 
        onClick={onStartMenuClick}
        style={{ background: 'var(--xp-accent)' }}
        className="h-full px-5 flex items-center gap-2 italic font-bold text-white shadow-[2px_0_5px_rgba(0,0,0,0.3)] brightness-100 rounded-r-xl transition-all hover:brightness-110 active:scale-95 z-[1001] bg-opacity-90"
      >
        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-inner">
           <Cpu className="text-black/70" size={16} />
        </div>
        <span className="text-xl tracking-tighter drop-shadow-md font-orbitron">CORE</span>
      </button>

      {/* Window Tabs */}
      <div className="flex-1 flex gap-1 h-full px-2 py-1 items-center overflow-hidden">
        {Object.values(windows).map((win) => (
          win.isOpen && (
            <button
              key={win.id}
              onClick={() => onToggleWindow(win.id)}
              className={`flex items-center gap-2 px-3 h-full rounded-lg text-xs transition-all max-w-[150px] border border-white/10 ${
                activeApp === win.id 
                ? 'bg-white/20 text-white ring-1 ring-white/30 shadow-inner' 
                : 'bg-black/20 text-blue-100 hover:bg-white/10'
              }`}
            >
              <span className="truncate">{win.title}</span>
            </button>
          )
        ))}
      </div>

      {/* Tray Area */}
      <div className="flex items-center gap-3 px-3 h-full bg-black/20 border-l border-white/5 shadow-inner text-blue-100">
        <a 
          href="https://mr-alperen.github.io" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden md:flex flex-col items-end group"
        >
          <span className="text-[7px] text-blue-200/50 group-hover:text-cyan-400 transition-colors uppercase font-bold leading-none">Developer BY: Alperen Erkan</span>
          <span className="text-[6px] text-white/20 scale-0 group-hover:scale-100 transition-all origin-right">mr-alperen.github.io</span>
        </a>
        <Wifi size={14} />
        <Volume2 size={14} />
        <div className="flex flex-col items-center justify-center px-1 min-w-[60px]">
          <span className="text-[10px] leading-tight uppercase font-bold text-cyan-300">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span className="text-[8px] leading-tight font-orbitron">{time.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
