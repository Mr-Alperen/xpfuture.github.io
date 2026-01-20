
import React, { useState, useCallback, useEffect } from 'react';
import { Desktop } from './components/Desktop';
import { Taskbar } from './components/Taskbar';
import { WindowFrame } from './components/WindowFrame';
import { AIChatApp } from './apps/AIChatApp';
import { ImageGenApp } from './apps/ImageGenApp';
import { TerminalApp } from './apps/TerminalApp';
import { SettingsApp } from './apps/SettingsApp';
import { AboutApp } from './apps/AboutApp';
import { StartMenu } from './components/StartMenu';
import { ContextMenu } from './components/ContextMenu';
import { FolderViewApp } from './apps/FolderViewApp';
import { SearchTerApp } from './apps/SearchTerApp';
import { FileViewerApp } from './apps/FileViewerApp';
import { AppId, WindowState, OSTheme, FSItem, ContextMenuState } from './types';

const INITIAL_WINDOWS: Record<string, WindowState> = {
  ai_chat: { id: 'ai_chat', title: 'Future Clippy AI', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10, type: 'app' },
  image_gen: { id: 'image_gen', title: 'Neural Canvas', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10, type: 'app' },
  terminal: { id: 'terminal', title: 'System Kernel', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10, type: 'app' },
  settings: { id: 'settings', title: 'OS Parameters', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10, type: 'app' },
  searchter: { id: 'searchter', title: 'SearchTer Explorer', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10, type: 'searchter' },
  about: { id: 'about', title: 'About XPFuture', isOpen: true, isMaximized: false, isMinimized: false, zIndex: 11, type: 'app' },
};

const WALLPAPERS = [
  'https://picsum.photos/id/10/1920/1080',
  'https://picsum.photos/id/15/1920/1080',
  'https://picsum.photos/id/28/1920/1080',
  'https://picsum.photos/id/48/1920/1080',
  'https://picsum.photos/id/54/1920/1080'
];

const App: React.FC = () => {
  const [windows, setWindows] = useState<Record<string, WindowState>>(INITIAL_WINDOWS);
  const [activeApp, setActiveApp] = useState<string | null>('about');
  const [maxZ, setMaxZ] = useState(20);
  const [theme, setTheme] = useState<OSTheme>('classic-blue');
  const [fileSystem, setFileSystem] = useState<FSItem[]>([
    { id: 'docs_folder', name: 'My Documents', type: 'folder', parentId: 'desktop', x: 20, y: 420, updatedAt: Date.now() },
    { id: 'readme_file', name: 'System_Logs.txt', type: 'file', parentId: 'desktop', x: 20, y: 520, updatedAt: Date.now(), content: 'All systems operational. Future Link stable.\n\n[USER_AUTHORIZED]: Admin\n[TIMESTAMP]: 2050-05-12 14:22:01' }
  ]);
  const [wallpaperIdx, setWallpaperIdx] = useState(0);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ isOpen: false, x: 0, y: 0 });
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const openApp = useCallback((id: string, title?: string) => {
    setWindows(prev => {
      const existing = prev[id];
      if (existing) {
        return {
          ...prev,
          [id]: { ...existing, isOpen: true, isMinimized: false, zIndex: maxZ + 1 }
        };
      } else {
        const item = fileSystem.find(i => i.id === id);
        let type: WindowState['type'] = 'app';
        if (item) {
          type = item.type === 'folder' ? 'folder' : 'file_viewer';
        } else {
          if (id === 'searchter') type = 'searchter';
          else if (id.startsWith('item_')) type = 'folder';
        }

        return {
          ...prev,
          [id]: { id, title: title || item?.name || 'Folder', isOpen: true, isMaximized: false, isMinimized: false, zIndex: maxZ + 1, type }
        };
      }
    });
    setActiveApp(id);
    setMaxZ(prev => prev + 1);
    setIsStartMenuOpen(false); 
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  }, [maxZ, fileSystem]);

  const closeApp = useCallback((id: string) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false }
    }));
    if (activeApp === id) setActiveApp(null);
  }, [activeApp]);

  const minimizeApp = useCallback((id: string) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true }
    }));
    setActiveApp(null);
  }, []);

  const focusApp = useCallback((id: string) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: false, zIndex: maxZ + 1 }
    }));
    setActiveApp(id);
    setMaxZ(prev => prev + 1);
    setIsStartMenuOpen(false);
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  }, [maxZ]);

  const toggleMaximize = useCallback((id: string) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isMaximized: !prev[id].isMaximized }
    }));
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ isOpen: true, x: e.clientX, y: e.clientY });
  };

  const closeMenus = () => {
    setIsStartMenuOpen(false);
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  };

  const addFSItem = (type: 'folder' | 'file', parentId: string = 'desktop') => {
    const newItem: FSItem = {
      id: `item_${Math.random().toString(36).substr(2, 9)}`,
      name: type === 'folder' ? 'Yeni Klasör' : 'Yeni Metin Belgesi.txt',
      type,
      parentId,
      x: contextMenu.x,
      y: contextMenu.y,
      updatedAt: Date.now(),
      content: type === 'file' ? 'Type something here...' : undefined
    };
    setFileSystem(prev => [...prev, newItem]);
    closeMenus();
  };

  const updateFSItem = (id: string, updates: Partial<FSItem>) => {
    setFileSystem(prev => prev.map(item => item.id === id ? { ...item, ...updates, updatedAt: Date.now() } : item));
    if (updates.name) {
      setWindows(prev => {
        if (prev[id]) return { ...prev, [id]: { ...prev[id], title: updates.name! } };
        return prev;
      });
    }
  };

  const deleteFSItem = (id: string) => {
    setFileSystem(prev => prev.filter(item => item.id !== id));
    closeApp(id);
  };

  const changeWallpaper = () => {
    setWallpaperIdx(prev => (prev + 1) % WALLPAPERS.length);
    closeMenus();
  };

  return (
    <div 
      className="relative h-screen w-screen overflow-hidden bg-[#0051e0] select-none transition-colors duration-500"
      style={{ backgroundColor: 'var(--xp-primary)' }}
      onClick={closeMenus}
      onContextMenu={handleContextMenu}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ 
          backgroundImage: `url('${WALLPAPERS[wallpaperIdx]}')`,
          filter: 'var(--xp-bg-filter)' 
        }}
      />
      
      <div className="scanline" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 via-transparent to-cyan-500/20 pointer-events-none" />

      <Desktop 
        onOpenApp={openApp} 
        fileSystem={fileSystem.filter(i => i.parentId === 'desktop')} 
        onUpdateItem={updateFSItem}
      />

      {Object.values(windows).map((win) => (
        win.isOpen && !win.isMinimized && (
          <WindowFrame
            key={win.id}
            title={win.title}
            id={win.id}
            isMaximized={win.isMaximized}
            zIndex={win.zIndex}
            isActive={activeApp === win.id}
            onClose={() => closeApp(win.id)}
            onMinimize={() => minimizeApp(win.id)}
            onMaximize={() => toggleMaximize(win.id)}
            onFocus={() => focusApp(win.id)}
          >
            {win.id === 'ai_chat' && <AIChatApp />}
            {win.id === 'image_gen' && <ImageGenApp />}
            {win.id === 'terminal' && <TerminalApp />}
            {win.id === 'settings' && <SettingsApp currentTheme={theme} onSetTheme={setTheme} />}
            {win.id === 'searchter' && <SearchTerApp fileSystem={fileSystem} onOpenItem={openApp} onUpdateItem={updateFSItem} onDeleteItem={deleteFSItem} onAddItem={addFSItem} />}
            {win.id === 'about' && <AboutApp onStart={() => closeApp('about')} />}
            {win.type === 'folder' && (
              <FolderViewApp 
                folderId={win.id} 
                folderName={win.title} 
                contents={fileSystem.filter(i => i.parentId === win.id)} 
                onOpenItem={openApp}
                onUpdateItem={updateFSItem}
                onAddItem={addFSItem}
              />
            )}
            {win.type === 'file_viewer' && (
              <FileViewerApp 
                file={fileSystem.find(i => i.id === win.id)!}
                onSave={(content) => updateFSItem(win.id, { content })}
              />
            )}
          </WindowFrame>
        )
      ))}

      <StartMenu 
        isOpen={isStartMenuOpen} 
        onOpenApp={openApp} 
        onClose={() => setIsStartMenuOpen(false)} 
      />

      <ContextMenu 
        state={contextMenu} 
        onNewFolder={() => addFSItem('folder')}
        onNewFile={() => addFSItem('file')}
        onChangeWallpaper={changeWallpaper}
        onOpenSettings={() => openApp('settings')}
      />

      <Taskbar 
        windows={windows} 
        activeApp={activeApp} 
        onToggleWindow={(id) => {
          if (windows[id].isOpen && !windows[id].isMinimized && activeApp === id) {
            minimizeApp(id);
          } else {
            openApp(id);
          }
        }}
        onStartMenuClick={(e) => {
          e.stopPropagation();
          setIsStartMenuOpen(!isStartMenuOpen);
          setContextMenu(prev => ({ ...prev, isOpen: false }));
        }}
      />
    </div>
  );
};

export default App;
