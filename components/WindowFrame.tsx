
import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Square } from 'lucide-react';

interface WindowFrameProps {
  title: string;
  id: string;
  children: React.ReactNode;
  isMaximized: boolean;
  zIndex: number;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  title,
  children,
  isMaximized,
  zIndex,
  isActive,
  onClose,
  onMinimize,
  onMaximize,
  onFocus
}) => {
  const [pos, setPos] = useState({ x: 100 + Math.random() * 50, y: 50 + Math.random() * 50 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    onFocus();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: pos.x,
      initialY: pos.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPos({
        x: dragRef.current.initialX + dx,
        y: dragRef.current.initialY + dy
      });
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const windowStyle: React.CSSProperties = isMaximized 
    ? { top: 0, left: 0, right: 0, bottom: '40px', zIndex }
    : { top: pos.y, left: pos.x, width: '600px', height: '450px', zIndex };

  return (
    <div
      onMouseDown={onFocus}
      className={`absolute flex flex-col futuristic-glass overflow-hidden transition-shadow ${isActive ? 'shadow-2xl ring-1 ring-cyan-400' : 'shadow-lg opacity-90'}`}
      style={windowStyle}
    >
      {/* Title Bar - Classic XP Blue but Glassy */}
      <div
        onMouseDown={handleMouseDown}
        className={`h-8 flex items-center justify-between px-2 cursor-default select-none ${isActive ? 'xp-blue-gradient text-white' : 'bg-gray-400 text-gray-200'}`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-4 h-4 bg-white/20 rounded-sm flex items-center justify-center">
             <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
          <span className="text-sm font-bold truncate tracking-tight font-orbitron text-[10px] uppercase">{title}</span>
        </div>
        <div className="flex gap-1">
          <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className="w-6 h-5 bg-[#245edb] hover:bg-blue-400 border border-white/30 rounded-sm flex items-center justify-center">
            <Minus size={14} strokeWidth={3} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onMaximize(); }} className="w-6 h-5 bg-[#245edb] hover:bg-blue-400 border border-white/30 rounded-sm flex items-center justify-center">
            <Square size={10} strokeWidth={3} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="w-10 h-5 bg-[#e81123] hover:bg-red-400 border border-white/30 rounded-sm flex items-center justify-center">
            <X size={14} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-black/40 text-white relative">
        {children}
      </div>
    </div>
  );
};
