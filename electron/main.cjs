'use strict'
const { app, BrowserWindow, nativeTheme, Menu } = require('electron')
const path = require('path')
const { pathToFileURL } = require('url')
const { initDb }          = require('./database/db.cjs')
const { registerHandlers } = require('./ipc/handlers.cjs')

nativeTheme.themeSource = 'dark'

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    backgroundColor: '#08080E',
    title: 'LeakGuard CaseDesk',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
    show: false,
  })

  Menu.setApplicationMenu(null)

  win.once('ready-to-show', () => {
    win.maximize()
    win.show()
  })

  const indexPath = path.join(__dirname, '..', 'dist', 'index.html')
  win.loadURL(pathToFileURL(indexPath).href)
}

app.whenReady().then(() => {
  initDb()
  registerHandlers()
  createWindow()
})

app.on('window-all-closed', () => { app.quit() })

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
