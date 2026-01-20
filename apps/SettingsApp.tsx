
import React, { useState } from 'react';
import { OSTheme } from '../types';

interface SettingsAppProps {
  currentTheme: OSTheme;
  onSetTheme: (theme: OSTheme) => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({ currentTheme, onSetTheme }) => {
  const [brightness, setBrightness] = useState(80);
  const [volume, setVolume] = useState(50);

  const themes: { id: OSTheme; label: string; color: string }[] = [
    { id: 'classic-blue', label: 'Classic Blue', color: 'bg-[#245edb]' },
    { id: 'cyber-pink', label: 'Cyber Pink', color: 'bg-[#ff00ff]' },
    { id: 'dark-mode', label: 'Dark Mode', color: 'bg-[#111111]' },
    { id: 'glass', label: 'Glass', color: 'bg-white/20' },
  ];

  return (
    <div className="p-6 space-y-8 bg-slate-900/40 h-full backdrop-blur-md">
      <h2 className="text-xl font-orbitron text-cyan-400 border-b border-white/10 pb-2">System Parameters</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs text-slate-400 uppercase tracking-widest">Temporal Brightness</label>
          <input 
            type="range" 
            value={brightness} 
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Dim</span>
            <span>{brightness}%</span>
            <span>Hyper</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-slate-400 uppercase tracking-widest">Neural Volume</label>
          <input 
            type="range" 
            value={volume} 
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Silent</span>
            <span>{volume}%</span>
            <span>Max</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs text-slate-400 uppercase tracking-widest">Visual Style (Themes)</label>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => onSetTheme(t.id)}
                className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 group ${
                  currentTheme === t.id 
                    ? 'border-cyan-400 bg-white/10 shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
                    : 'border-white/5 bg-black/20 hover:bg-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${t.color} border border-white/20`} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
