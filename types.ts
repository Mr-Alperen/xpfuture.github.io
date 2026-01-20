
export type AppId = 'ai_chat' | 'image_gen' | 'terminal' | 'settings' | 'about' | 'searchter' | string;
export type OSTheme = 'classic-blue' | 'cyber-pink' | 'dark-mode' | 'glass';

export interface WindowState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMaximized: boolean;
  isMinimized: boolean;
  zIndex: number;
  type?: 'app' | 'folder' | 'searchter' | 'file_viewer';
}

export interface DesktopIcon {
  id: AppId;
  label: string;
  icon: string;
}

export type FSItemType = 'folder' | 'file';

export interface FSItem {
  id: string;
  name: string;
  type: FSItemType;
  parentId: string; // 'desktop', 'documents', or a folder's ID
  x?: number; // for desktop placement
  y?: number;
  content?: string; // for text files
  updatedAt: number;
}

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
}
