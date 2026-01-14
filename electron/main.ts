import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'

// Отключаем аппаратное ускорение для лучшей совместимости с Windows
app.disableHardwareAcceleration()

let mainWindow: BrowserWindow | null = null

const isDev = process.env.NODE_ENV !== 'production'

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    frame: false, // Кастомный titlebar
    titleBarStyle: 'hidden',
    backgroundColor: '#0f0f23',
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false,
  })

  // Показываем окно когда оно готово
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  // Загружаем приложение
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// IPC обработчики для управления окном
ipcMain.handle('window:minimize', () => {
  mainWindow?.minimize()
})

ipcMain.handle('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})

ipcMain.handle('window:close', () => {
  mainWindow?.close()
})

ipcMain.handle('window:isMaximized', () => {
  return mainWindow?.isMaximized()
})

// Когда приложение готово
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Закрытие приложения на Windows/Linux
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
