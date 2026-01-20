
import React, { useState, useRef, useEffect } from 'react';
import { AppId, DesktopIcon, FSItem } from '../types';
import { Bot, Image, Terminal, Settings, Info, Folder, FileText, Search } from 'lucide-react';

const APP_ICONS: DesktopIcon[] = [
  { id: 'ai_chat', label: 'AI Assistant', icon: 'Bot' },
  { id: 'image_gen', label: 'Neural Lab', icon: 'Image' },
  { id: 'terminal', label: 'Command Hub', icon: 'Terminal' },
  { id: 'settings', label: 'Control Panel', icon: 'Settings' },
  { id: 'searchter', label: 'SearchTer', icon: 'Search' },
];

interface DesktopProps {
  onOpenApp: (id: string, title?: string) => void;
  fileSystem: FSItem[];
  onUpdateItem: (id: string, updates: Partial<FSItem>) => void;
}

export const Desktop: React.FC<DesktopProps> = ({ 
  onOpenApp, 
  fileSystem = [], 
  onUpdateItem
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleDragStart = (e: React.MouseEvent, id: string, initialX: number, initialY: number) => {
    e.stopPropagation();
    setDraggedId(id);
    dragOffset.current = {
      x: e.clientX - initialX,
      y: e.clientY - initialY
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggedId) return;
      onUpdateItem(draggedId, { x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    };
    const handleMouseUp = () => setDraggedId(null);

    if (draggedId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedId]);

  const renderIconGraphic = (type: string) => {
    const props = { className: "w-8 h-8 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" };
    switch(type) {
      case 'Bot': return <Bot {...props} />;
      case 'Image': return <Image {...props} />;
      case 'Terminal': return <Terminal {...props} />;
      case 'Settings': return <Settings {...props} />;
      case 'Search': return <Search {...props} className="w-8 h-8 text-blue-400 drop-shadow-md" />;
      case 'folder': return <Folder {...props} className="w-8 h-8 text-yellow-400 drop-shadow-md" />;
      case 'file': return <FileText {...props} className="w-8 h-8 text-blue-200 drop-shadow-md" />;
      default: return <Info {...props} />;
    }
  };

  const IconWrapper = ({ id, label, type, x, y, isApp }: any) => {
    const [name, setName] = useState(label);
    
    return (
      <div
        className="absolute w-24 flex flex-col items-center justify-center cursor-pointer pointer-events-auto hover:bg-white/10 rounded-xl group transition-all z-10 p-2"
        style={{ left: x, top: y }}
        onMouseDown={(e) => handleDragStart(e, id, x, y)}
        onDoubleClick={(e) => { e.stopPropagation(); onOpenApp(id, label); }}
      >
        <div className="group-active:scale-95 transition-transform w-14 h-14 bg-gradient-to-br from-blue-500/40 to-cyan-500/20 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center shadow-lg group-hover:border-white/40 group-hover:from-blue-500/60 transition-all">
          {renderIconGraphic(type)}
        </div>
        
        {editingId === id ? (
          <input
            autoFocus
            className="mt-2 text-black text-[11px] text-center w-full rounded outline-none border-none px-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => { setEditingId(null); onUpdateItem(id, { name }); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { setEditingId(null); onUpdateItem(id, { name }); }
              if (e.key === 'Escape') { setEditingId(null); setName(label); }
            }}
          />
        ) : (
          <span 
            className="mt-2 text-white text-[11px] text-center drop-shadow-[0_1px_2px_rgba(0,0,0,1)] font-bold px-1 rounded truncate w-full"
            onClick={(e) => {
              if (e.detail === 1 && !isApp) {
                setTimeout(() => setEditingId(id), 500);
              }
            }}
          >
            {label}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="absolute inset-0 p-4 pointer-events-none">
      {/* Fixed App Icons */}
      {APP_ICONS.map((app, idx) => (
        <IconWrapper 
          key={app.id} 
          id={app.id} 
          label={app.label} 
          type={app.icon} 
          x={20} 
          y={20 + idx * 100}
          isApp={true}
        />
      ))}

      {/* Dynamic Desktop Items */}
      {fileSystem.map((item) => (
        <IconWrapper 
          key={item.id} 
          id={item.id} 
          label={item.name} 
          type={item.type} 
          x={item.x} 
          y={item.y} 
          isApp={false}
        />
      ))}
      
      {/* Developer Credit */}
      <div className="absolute bottom-14 right-6 pointer-events-auto">
        <a 
          href="https://mr-alperen.github.io" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex flex-col items-end opacity-40 hover:opacity-100 transition-all"
        >
          <span className="text-[10px] text-blue-100 font-orbitron tracking-widest uppercase">Developer BY: Alperen Erkan</span>
          <span className="text-[8px] text-cyan-400 scale-0 group-hover:scale-100 transition-transform origin-right">mr-alperen.github.io</span>
        </a>
      </div>
    </div>
  );
};
