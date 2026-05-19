const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  shell,
  protocol,
} = require('electron')
const path = require('path')
const fs = require('fs')

// Keep a global reference of the window object
let mainWindow

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development'

// ── Fix absolute asset paths (e.g. /beeda-logo.png) when loading from file:// ──
// Without this, paths like src="/beeda-logo.png" resolve to the filesystem root
// instead of the dist folder, so all public-folder images go missing.
app.whenReady().then(() => {
  const distDir = path.join(__dirname, '../dist')

  protocol.interceptFileProtocol('file', (request, callback) => {
    let url = request.url

    // Strip the file:// prefix
    url = url.replace(/^file:\/\//, '')

    // On Windows, strip the leading slash before the drive letter: /C:/... → C:/...
    if (process.platform === 'win32') {
      url = url.replace(/^\/([A-Za-z]:)/, '$1')
    }

    // Decode percent-encoded characters (%20 etc.)
    url = decodeURIComponent(url)

    // If the path points somewhere OUTSIDE the dist folder (i.e. an absolute
    // public asset like /beeda-logo.png that landed at the filesystem root),
    // rewrite it to dist/<filename>.
    if (!url.startsWith(distDir)) {
      const basename = path.basename(url)
      const rewritten = path.join(distDir, basename)
      if (fs.existsSync(rewritten)) {
        return callback({ path: rewritten })
      }
      // Also try the full relative path under dist
      // e.g. /assets/index.js → dist/assets/index.js
      const relative = url.replace(/^.*dist/, '')
      const rewritten2 = path.join(distDir, relative)
      if (fs.existsSync(rewritten2)) {
        return callback({ path: rewritten2 })
      }
    }

    callback({ path: url })
  })

  createWindow()
})

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    show: false,
    title: 'Kira AI',

    icon: path.join(__dirname, '../build/icon.png'),
  })

  // Load the app
  const indexPath = path.join(__dirname, '../dist/index.html')

  if (fs.existsSync(indexPath)) {
    mainWindow.loadFile(indexPath)
  } else {
    // Fallback for development — run `npm run dev` first
    mainWindow.loadURL('http://localhost:5173')
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    if (isDev) {
      mainWindow.webContents.openDevTools()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

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
          },
        },
        { type: 'separator' },
        {
          label: 'Settings',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            mainWindow.webContents.send('menu-settings')
          },
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit()
          },
        },
      ],
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
        { role: 'selectall' },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Dashboard',
          accelerator: 'CmdOrCtrl+D',
          click: () => {
            mainWindow.webContents.send('menu-dashboard')
          },
        },
        {
          label: 'Chats',
          accelerator: 'CmdOrCtrl+M',
          click: () => {
            mainWindow.webContents.send('menu-chats')
          },
        },
        {
          label: 'Email',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            mainWindow.webContents.send('menu-email')
          },
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
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'AI Tools',
      submenu: [
        {
          label: 'Jarvis Voice',
          accelerator: 'CmdOrCtrl+J',
          click: () => {
            mainWindow.webContents.send('menu-jarvis')
          },
        },
        {
          label: 'Image Generator',
          accelerator: 'CmdOrCtrl+I',
          click: () => {
            mainWindow.webContents.send('menu-generator')
          },
        },
        {
          label: 'AI Writer',
          accelerator: 'CmdOrCtrl+W',
          click: () => {
            mainWindow.webContents.send('menu-writer')
          },
        },
        {
          label: 'AI Coder',
          accelerator: 'CmdOrCtrl+Shift+C',
          click: () => {
            mainWindow.webContents.send('menu-coder')
          },
        },
      ],
    },
    {
      label: 'Window',
      submenu: [{ role: 'minimize' }, { role: 'close' }],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => {
            shell.openExternal('https://docs.kira.ai')
          },
        },
        {
          label: 'Report Issue',
          click: () => {
            shell.openExternal('https://github.com/kira-ai/issues')
          },
        },
        { type: 'separator' },
        {
          label: 'About Kira AI',
          click: () => {
            mainWindow.webContents.send('menu-about')
          },
        },
      ],
    },
  ]

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
        { role: 'quit' },
      ],
    })
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

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

// IPC handlers
ipcMain.handle('get-app-version', () => app.getVersion())
ipcMain.handle('get-platform', () => process.platform)

ipcMain.handle('minimize-window', () => {
  if (mainWindow) mainWindow.minimize()
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
  if (mainWindow) mainWindow.close()
})
