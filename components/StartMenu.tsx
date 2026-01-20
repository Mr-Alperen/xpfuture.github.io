
import React, { useState, useEffect } from 'react';
import { AppId } from '../types';
import { Bot, Image, Terminal, Settings, LogOut, Globe, Newspaper, Zap, Search } from 'lucide-react';
import { getFutureNews } from '../services/gemini';

interface StartMenuProps {
  isOpen: boolean;
  onOpenApp: (id: AppId) => void;
  onClose: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onOpenApp, onClose }) => {
  const [news, setNews] = useState<string>("Initializing Neural Feed...");

  useEffect(() => {
    if (isOpen) {
      const fetchNews = async () => {
        try {
          const result = await getFutureNews();
          setNews(result || "Signal lost in the ionosphere.");
        } catch (e) {
          setNews("Connection timed out in the future.");
        }
      };
      fetchNews();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAppClick = (id: AppId) => {
    onOpenApp(id);
    onClose();
  };

  const renderIconBox = (IconComp: any, colorClass: string) => (
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-white/20 transition-all ${colorClass}`}>
      <IconComp size={20} />
    </div>
  );

  return (
    <div className="absolute bottom-10 left-0 w-[420px] rounded-t-xl overflow-hidden futuristic-glass z-[2000] border-2 border-cyan-500/30 flex flex-col animate-in slide-in-from-bottom-4 duration-200">
      {/* Header */}
      <div className="h-16 xp-blue-gradient flex items-center px-4 gap-3 border-b border-white/20">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center ring-2 ring-white/50">
          <Zap className="text-blue-600 fill-blue-600" size={24} />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-lg drop-shadow-md">Admin User</span>
          <span className="text-blue-100 text-[10px] uppercase tracking-widest font-orbitron">Authorization Level: Prime</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex h-[320px] bg-white/5 backdrop-blur-3xl">
        {/* Left: Apps */}
        <div className="flex-1 p-2 space-y-1 bg-white/10 overflow-y-auto">
          <button onClick={() => handleAppClick('ai_chat')} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-blue-600/40 text-blue-50 group transition-colors">
            {renderIconBox(Bot, "text-cyan-400")}
            <div className="text-left">
              <div className="text-sm font-bold">AI Assistant</div>
              <div className="text-[10px] text-blue-300">Interact with Clippy 9.0</div>
            </div>
          </button>
          <button onClick={() => handleAppClick('image_gen')} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-blue-600/40 text-blue-50 group transition-colors">
            {renderIconBox(Image, "text-purple-400")}
            <div className="text-left">
              <div className="text-sm font-bold">Neural Lab</div>
              <div className="text-[10px] text-blue-300">Generate synthetic reality</div>
            </div>
          </button>
          <button onClick={() => handleAppClick('searchter')} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-blue-600/40 text-blue-50 group transition-colors">
            {renderIconBox(Search, "text-blue-400")}
            <div className="text-left">
              <div className="text-sm font-bold">SearchTer</div>
              <div className="text-[10px] text-blue-300">System file explorer</div>
            </div>
          </button>
          <button onClick={() => handleAppClick('terminal')} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-blue-600/40 text-blue-50 group transition-colors">
            {renderIconBox(Terminal, "text-green-400")}
            <div className="text-left">
              <div className="text-sm font-bold">Command Hub</div>
              <div className="text-[10px] text-blue-300">Kernel access</div>
            </div>
          </button>
          <div className="h-[1px] bg-white/10 my-1" />
          <button onClick={() => handleAppClick('settings')} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-blue-600/40 text-blue-50 group transition-colors">
            {renderIconBox(Settings, "text-slate-400")}
            <div className="text-left">
              <div className="text-sm font-bold">Parameters</div>
              <div className="text-[10px] text-blue-300">System configuration</div>
            </div>
          </button>
        </div>

        {/* Right: Info/News */}
        <div className="w-[180px] bg-[#0051e0]/20 p-3 space-y-4 border-l border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400">
              <Globe size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider font-orbitron">Internet Feed</span>
            </div>
            <div className="text-[11px] text-blue-100/80 leading-tight italic">
              Quantum uplink stable. Connected to the 2050 Datastream.
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-orange-400">
              <Newspaper size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider font-orbitron">Future News</span>
            </div>
            <div className="text-[10px] text-blue-100 whitespace-pre-wrap leading-relaxed animate-pulse">
              {news}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="h-10 xp-taskbar flex items-center justify-between px-3 border-t border-white/20">
        <a 
          href="https://mr-alperen.github.io" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex flex-col"
        >
          <span className="text-[9px] text-blue-200 group-hover:text-cyan-400 transition-colors uppercase font-bold tracking-tight">Developer BY: Alperen Erkan</span>
          <span className="text-[7px] text-blue-300/60 font-mono">mr-alperen.github.io</span>
        </a>
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-xs font-bold text-white transition-colors"
        >
          <LogOut size={14} />
          LOG OUT
        </button>
      </div>
    </div>
  );
};
