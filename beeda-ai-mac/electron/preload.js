const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  
  // Menu events
  onMenuAction: (callback) => ipcRenderer.on('menu-action', callback),
  
  // Notifications
  showNotification: (title, body) => {
    new Notification(title, { body })
  }
})

// Legacy support for non-context-isolated mode
window.electron = {
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(event, ...args)),
    once: (channel, func) => ipcRenderer.once(channel, (event, ...args) => func(event, ...args)),
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
  }
}
