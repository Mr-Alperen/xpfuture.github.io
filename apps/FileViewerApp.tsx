
import React, { useState, useEffect } from 'react';
import { FSItem } from '../types';
import { Save, FileText, ChevronRight } from 'lucide-react';

interface FileViewerAppProps {
  file: FSItem;
  onSave: (content: string) => void;
}

export const FileViewerApp: React.FC<FileViewerAppProps> = ({ file, onSave }) => {
  const [content, setContent] = useState(file.content || '');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(content !== (file.content || ''));
  }, [content, file.content]);

  const handleSave = () => {
    onSave(content);
    setHasChanges(false);
  };

  return (
    <div className="flex flex-col h-full bg-white text-black font-sans select-text">
      {/* Ribbon Bar */}
      <div className="bg-[#f0f0f0] border-b border-gray-300 p-1 flex items-center gap-2">
        <button 
          onClick={handleSave}
          disabled={!hasChanges}
          className={`flex items-center gap-2 px-3 py-1 rounded text-[11px] font-bold transition-all ${
            hasChanges 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'text-gray-400 cursor-default'
          }`}
        >
          <Save size={14} /> SAVE
        </button>
        <div className="h-4 w-[1px] bg-gray-400 mx-1" />
        <div className="flex items-center gap-1 text-[10px] text-gray-500 italic">
          <FileText size={12} />
          <span>{file.name}</span>
          <ChevronRight size={10} />
          <span>System Root</span>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative group">
        <textarea
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full p-6 text-sm font-mono leading-relaxed outline-none resize-none bg-transparent"
          placeholder="Start typing..."
        />
        <div className="absolute top-0 left-0 w-12 h-full bg-gray-50 border-r border-gray-100 flex flex-col items-center pt-6 text-[10px] text-gray-300 pointer-events-none select-none">
          {Array.from({ length: 20 }).map((_, i) => <span key={i} className="h-6 leading-relaxed">{i + 1}</span>)}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-[#f0f0f0] border-t border-gray-300 px-3 py-1 text-[10px] text-gray-500 flex justify-between items-center font-mono">
        <div>Ln 1, Col 1</div>
        <div className="flex gap-4">
          <span>UTF-8</span>
          <span className={hasChanges ? 'text-blue-600 font-bold' : ''}>
            {hasChanges ? '* UNSAVED CHANGES' : 'SYNCHRONIZED'}
          </span>
        </div>
      </div>
    </div>
  );
};
