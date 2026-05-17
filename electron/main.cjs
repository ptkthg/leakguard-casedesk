const { app, BrowserWindow, nativeTheme, Menu } = require('electron')
const path = require('path')
const { pathToFileURL } = require('url')

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
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
    show: false,
  })

  // Remove default menu for cleaner app feel
  Menu.setApplicationMenu(null)

  win.once('ready-to-show', () => {
    win.maximize()
    win.show()
  })

  const indexPath = path.join(__dirname, '..', 'dist', 'index.html')
  win.loadURL(pathToFileURL(indexPath).href)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
