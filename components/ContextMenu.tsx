
import React from 'react';
import { ContextMenuState } from '../types';
import { FolderPlus, FilePlus, Monitor, Settings, RefreshCw } from 'lucide-react';

interface ContextMenuProps {
  state: ContextMenuState;
  onNewFolder: () => void;
  onNewFile: () => void;
  onChangeWallpaper: () => void;
  onOpenSettings: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ 
  state, 
  onNewFolder, 
  onNewFile, 
  onChangeWallpaper,
  onOpenSettings 
}) => {
  if (!state.isOpen) return null;

  const style: React.CSSProperties = {
    top: state.y,
    left: state.x,
  };

  const MenuItem = ({ icon: Icon, label, onClick }: any) => (
    <button 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="w-full flex items-center gap-3 px-3 py-2 text-xs text-blue-50 hover:bg-blue-600/60 transition-colors text-left first:rounded-t-lg last:rounded-b-lg border-b border-white/5 last:border-b-0"
    >
      <Icon size={14} className="text-cyan-400" />
      <span>{label}</span>
    </button>
  );

  return (
    <div 
      className="fixed w-48 futuristic-glass z-[3000] border border-cyan-500/40 rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-100"
      style={style}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="flex flex-col">
        <MenuItem icon={FolderPlus} label="Yeni Klasör" onClick={onNewFolder} />
        <MenuItem icon={FilePlus} label="Yeni Metin Belgesi" onClick={onNewFile} />
        <div className="h-[1px] bg-white/10 mx-2 my-1" />
        <MenuItem icon={Monitor} label="Ekran Resmini Değiştir" onClick={onChangeWallpaper} />
        <MenuItem icon={Settings} label="Kişiselleştir" onClick={onOpenSettings} />
        <MenuItem icon={RefreshCw} label="Yenile" onClick={() => window.location.reload()} />
      </div>
    </div>
  );
};
