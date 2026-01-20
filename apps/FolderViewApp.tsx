
import React, { useState } from 'react';
import { Search, FolderOpen, ChevronRight, ChevronLeft, MoreHorizontal, FileText, FolderPlus, FilePlus } from 'lucide-react';
import { FSItem } from '../types';

interface FolderViewAppProps {
  folderId: string;
  folderName: string;
  contents: FSItem[];
  onOpenItem: (id: string, name: string) => void;
  onUpdateItem: (id: string, updates: Partial<FSItem>) => void;
  onAddItem: (type: 'folder' | 'file', parentId: string) => void;
}

export const FolderViewApp: React.FC<FolderViewAppProps> = ({ 
  folderId, 
  folderName, 
  contents, 
  onOpenItem, 
  onUpdateItem,
  onAddItem
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full bg-[#f1f1f1] text-black font-sans">
      {/* Explorer Toolbar */}
      <div className="flex items-center gap-2 px-2 py-1 bg-white border-b border-gray-300 text-[11px]">
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button className="p-1 hover:bg-blue-100 rounded text-gray-400"><ChevronLeft size={14} /></button>
          <button className="p-1 hover:bg-blue-100 rounded text-gray-400"><ChevronRight size={14} /></button>
        </div>
        <div className="flex-1 flex items-center bg-white border border-gray-300 px-2 py-1 rounded gap-2">
          <FolderOpen size={12} className="text-yellow-600" />
          <span className="text-gray-600 truncate">C:\Users\Admin\Desktop\{folderName}</span>
        </div>
        <div className="flex gap-1 px-2 border-l border-gray-300">
          <button onClick={() => onAddItem('folder', folderId)} title="New Folder" className="p-1 hover:bg-blue-50 text-blue-600"><FolderPlus size={14} /></button>
          <button onClick={() => onAddItem('file', folderId)} title="New File" className="p-1 hover:bg-blue-50 text-blue-600"><FilePlus size={14} /></button>
        </div>
      </div>

      {/* Explorer Content */}
      <div className="flex-1 p-4 bg-white overflow-y-auto">
        {contents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-gray-400 italic">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
              <FolderOpen size={40} />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-gray-500">{folderName} is empty.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,100px)] gap-4 content-start">
            {contents.map(item => (
              <div 
                key={item.id} 
                className="flex flex-col items-center gap-1 group cursor-pointer"
                onDoubleClick={() => onOpenItem(item.id, item.name)}
              >
                <div className="w-12 h-12 flex items-center justify-center group-hover:bg-blue-50 rounded transition-colors">
                  {item.type === 'folder' ? <FolderOpen className="text-yellow-500" size={32} /> : <FileText className="text-blue-400" size={32} />}
                </div>
                
                {editingId === item.id ? (
                  <input
                    autoFocus
                    className="text-[10px] text-center w-full border border-blue-400 outline-none px-1"
                    defaultValue={item.name}
                    onBlur={(e) => { setEditingId(null); onUpdateItem(item.id, { name: e.target.value }); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { setEditingId(null); onUpdateItem(item.id, { name: (e.target as any).value }); } }}
                  />
                ) : (
                  <span 
                    className="text-[10px] text-center break-all px-1 rounded hover:bg-blue-600 hover:text-white"
                    onClick={() => setTimeout(() => setEditingId(item.id), 500)}
                  >
                    {item.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-[#f1f1f1] border-t border-gray-300 px-3 py-1 text-[10px] flex justify-between items-center text-gray-600">
        <div className="flex items-center gap-2">
          <span>{contents.length} items</span>
          <span className="opacity-30">|</span>
          <span className="flex items-center gap-1"><MoreHorizontal size={10}/> State: Local Storage</span>
        </div>
        <div className="font-bold text-blue-600 tracking-tighter">XPFUTURE EXPLORER</div>
      </div>
    </div>
  );
};
