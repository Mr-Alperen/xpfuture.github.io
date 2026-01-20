
import React, { useState, useMemo } from 'react';
import { Search, Folder, FileText, ChevronRight, HardDrive, User, Clock, Trash2, Edit3 } from 'lucide-react';
import { FSItem } from '../types';

interface SearchTerAppProps {
  fileSystem: FSItem[];
  onOpenItem: (id: string, name: string) => void;
  onUpdateItem: (id: string, updates: Partial<FSItem>) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (type: 'folder' | 'file', parentId: string) => void;
}

export const SearchTerApp: React.FC<SearchTerAppProps> = ({ 
  fileSystem, 
  onOpenItem, 
  onUpdateItem, 
  onDeleteItem,
  onAddItem
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'folders' | 'files'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return fileSystem.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'all' 
        ? true 
        : activeFilter === 'folders' ? item.type === 'folder' : item.type === 'file';
      return matchesSearch && matchesFilter;
    });
  }, [fileSystem, searchTerm, activeFilter]);

  const selectedItem = useMemo(() => fileSystem.find(i => i.id === selectedId), [fileSystem, selectedId]);

  const handleRename = (id: string, newName: string) => {
    if (newName.trim()) {
      onUpdateItem(id, { name: newName });
    }
    setEditingId(null);
  };

  return (
    <div className="flex h-full bg-white text-black font-sans">
      {/* Sidebar */}
      <div className="w-48 bg-[#f6f6f6] border-r border-gray-200 flex flex-col p-2 gap-4">
        <div className="space-y-1">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Favorites</h3>
          <button onClick={() => setActiveFilter('all')} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs ${activeFilter === 'all' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}>
            <HardDrive size={14} /> System Root
          </button>
          <button onClick={() => setActiveFilter('folders')} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs ${activeFilter === 'folders' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}>
            <Folder size={14} /> All Folders
          </button>
          <button onClick={() => setActiveFilter('files')} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs ${activeFilter === 'files' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}>
            <FileText size={14} /> All Files
          </button>
        </div>
        
        <div className="space-y-1">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Locations</h3>
          <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-600 opacity-60">
            <User size={14} /> Desktop
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-600 opacity-60">
            <Clock size={14} /> Recent
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Header / Search */}
        <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Dosya veya klasör ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => onAddItem('folder', 'desktop')} className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-500 transition-all shadow-sm active:scale-95">NEW FOLDER</button>
            <button onClick={() => onAddItem('file', 'desktop')} className="px-3 py-1.5 border border-blue-600 text-blue-600 rounded text-xs font-bold hover:bg-blue-50 transition-all active:scale-95">NEW FILE</button>
          </div>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-gray-100 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 font-semibold">Adı</th>
                <th className="px-4 py-2 font-semibold">Türü</th>
                <th className="px-4 py-2 font-semibold">Güncelleme</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr 
                  key={item.id} 
                  onClick={() => setSelectedId(item.id)}
                  onDoubleClick={() => onOpenItem(item.id, item.name)}
                  className={`border-b border-gray-50 cursor-pointer group ${selectedId === item.id ? 'bg-blue-50 text-blue-800' : 'hover:bg-gray-50'}`}
                >
                  <td className="px-4 py-2 flex items-center gap-2">
                    {item.type === 'folder' ? <Folder size={14} className="text-yellow-500" /> : <FileText size={14} className="text-blue-400" />}
                    {editingId === item.id ? (
                      <input
                        autoFocus
                        defaultValue={item.name}
                        className="bg-white border border-blue-400 px-1 outline-none text-xs w-full"
                        onBlur={(e) => handleRename(item.id, e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRename(item.id, (e.target as any).value)}
                      />
                    ) : (
                      <span className="truncate">{item.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-500 capitalize">{item.type}</td>
                  <td className="px-4 py-2 text-gray-400">{new Date(item.updatedAt).toLocaleTimeString()}</td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-gray-400 italic">No items found match your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Info Footer */}
        {selectedItem && (
          <div className="h-14 bg-white border-t border-gray-200 px-4 flex items-center justify-between shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-4">
               <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                  {selectedItem.type === 'folder' ? <Folder size={16} className="text-yellow-500"/> : <FileText size={16} className="text-blue-400"/>}
               </div>
               <div className="flex flex-col">
                  <span className="text-xs font-bold leading-none">{selectedItem.name}</span>
                  <span className="text-[9px] text-gray-400 mt-1 uppercase">Modified: {new Date(selectedItem.updatedAt).toLocaleString()}</span>
               </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setEditingId(selectedItem.id)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded border border-gray-200 transition-colors"
              >
                <Edit3 size={14} /> ADINI DEĞİŞTİR
              </button>
              <button 
                onClick={() => onDeleteItem(selectedItem.id)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded border border-red-100 transition-colors"
              >
                <Trash2 size={14} /> SİL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
