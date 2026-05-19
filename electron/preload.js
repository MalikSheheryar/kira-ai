const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods to the renderer process via contextBridge.
// contextIsolation must be TRUE in main.js for this to work.
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),

  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),

  // Menu events — listen for menu actions sent from main process
  onMenuAction: (callback) => ipcRenderer.on('menu-action', callback),

  // Notifications
  showNotification: (title, body) => {
    new Notification(title, { body })
  },
})
