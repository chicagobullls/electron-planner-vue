import { contextBridge, ipcRenderer } from 'electron'

// Экспортируем API для рендерера
contextBridge.exposeInMainWorld('electronAPI', {
  // Управление окном
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  
  // Платформа
  platform: process.platform,
  
  // Версии
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  }
})
