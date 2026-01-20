
import React from 'react';
import { Power } from 'lucide-react';

interface AboutAppProps {
  onStart: () => void;
}

export const AboutApp: React.FC<AboutAppProps> = ({ onStart }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6 bg-gradient-to-br from-[#0033cc] to-[#000d33] relative">
      <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
        <Power className="w-12 h-12 text-cyan-400" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-4xl font-bold font-orbitron tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-200">
          XPFuture OS
        </h1>
        <p className="text-blue-300 text-sm italic">"Nostalgia Meets Intelligence"</p>
      </div>

      <div className="max-w-md bg-white/5 p-4 rounded-xl border border-white/10 text-xs text-blue-100/70 leading-relaxed">
        This is a fusion environment inspired by the peak era of computing (2001) enhanced with the neural capabilities of 2050. 
        Powered by Google Gemini, featuring holographic taskbars, neural image synthesis, and the ghost of Clippy.
      </div>

      <div className="flex flex-col gap-4 items-center">
        <button
          onClick={onStart}
          className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-900/50"
        >
          INITIALIZE SESSION
        </button>
        
        <a 
          href="https://mr-alperen.github.io" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group hover:bg-white/5 p-2 rounded-lg transition-all"
        >
          <span className="text-[11px] text-cyan-400 font-orbitron group-hover:underline">Developer BY: Alperen Erkan</span>
          <p className="text-[9px] text-blue-300/50 mt-1">mr-alperen.github.io</p>
        </a>
      </div>

      <div className="text-[10px] text-blue-400 absolute bottom-4 w-full px-8 flex justify-between">
        <span>&copy; 2050 Consortium</span>
        <span className="font-mono opacity-50">V 2.5.0</span>
      </div>
    </div>
  );
};
