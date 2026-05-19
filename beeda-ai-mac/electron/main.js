const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron')
const path = require('path')
const fs = require('fs')

// Keep a global reference of the window object
let mainWindow

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development'

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    show: false,
    icon: path.join(__dirname, '../build/icon.png')
  })

  // Load the app
  const indexPath = path.join(__dirname, '../dist/index.html')
  
  if (fs.existsSync(indexPath)) {
    mainWindow.loadFile(indexPath)
  } else {
    console.error('Could not find index.html at:', indexPath)
    mainWindow.loadURL('https://opdpapfrx4yxi.ok.kimi.link')
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    
    // Open DevTools in development
    if (isDev) {
      mainWindow.webContents.openDevTools()
    }
  })

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // Create application menu
  createMenu()
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Task',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-task')
          }
        },
        { type: 'separator' },
        {
          label: 'Settings',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            mainWindow.webContents.send('menu-settings')
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Dashboard',
          accelerator: 'CmdOrCtrl+D',
          click: () => {
            mainWindow.webContents.send('menu-dashboard')
          }
        },
        {
          label: 'Chats',
          accelerator: 'CmdOrCtrl+M',
          click: () => {
            mainWindow.webContents.send('menu-chats')
          }
        },
        {
          label: 'Email',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            mainWindow.webContents.send('menu-email')
          }
        },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'AI Tools',
      submenu: [
        {
          label: 'Jarvis Voice',
          accelerator: 'CmdOrCtrl+J',
          click: () => {
            mainWindow.webContents.send('menu-jarvis')
          }
        },
        {
          label: 'Image Generator',
          accelerator: 'CmdOrCtrl+I',
          click: () => {
            mainWindow.webContents.send('menu-generator')
          }
        },
        {
          label: 'AI Writer',
          accelerator: 'CmdOrCtrl+W',
          click: () => {
            mainWindow.webContents.send('menu-writer')
          }
        },
        {
          label: 'AI Coder',
          accelerator: 'CmdOrCtrl+Shift+C',
          click: () => {
            mainWindow.webContents.send('menu-coder')
          }
        }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => {
            shell.openExternal('https://docs.kira.ai')
          }
        },
        {
          label: 'Report Issue',
          click: () => {
            shell.openExternal('https://github.com/kira-ai/issues')
          }
        },
        { type: 'separator' },
        {
          label: 'About Kira AI',
          click: () => {
            mainWindow.webContents.send('menu-about')
          }
        }
      ]
    }
  ]

  // macOS specific menu adjustments
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// App event handlers
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// IPC handlers for communication between main and renderer
ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})

ipcMain.handle('get-platform', () => {
  return process.platform
})

ipcMain.handle('minimize-window', () => {
  if (mainWindow) {
    mainWindow.minimize()
  }
})

ipcMain.handle('maximize-window', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  }
})

ipcMain.handle('close-window', () => {
  if (mainWindow) {
    mainWindow.close()
  }
})

// Auto-updater (optional - can be enabled later)
// const { autoUpdater } = require('electron-updater')
// app.on('ready', () => {
//   autoUpdater.checkForUpdatesAndNotify()
// })
