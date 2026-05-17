'use strict'
const { app, BrowserWindow, nativeTheme, Menu } = require('electron')
const path = require('path')
const { pathToFileURL } = require('url')
const { initDb }           = require('./database/db.cjs')
const { registerHandlers } = require('./ipc/handlers.cjs')

nativeTheme.themeSource = 'dark'

function createWindow() {
  const win = new BrowserWindow({
    width:     1440,
    height:    900,
    minWidth:  1200,
    minHeight: 700,
    backgroundColor: '#08080E',
    title: 'LeakGuard CaseDesk',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload:          path.join(__dirname, 'preload.cjs'),
      nodeIntegration:  false,   // nunca habilitar — expõe Node ao renderer
      contextIsolation: true,    // obrigatório para contextBridge funcionar
      // webSecurity omitido → usa o padrão Electron (true).
      //
      // Por que não precisamos de webSecurity: false:
      //   • Todo o conteúdo é local (file://). Não há fetch() cross-origin.
      //   • Fontes externas (Google Fonts) são carregadas via <link> stylesheet,
      //     não via XHR/fetch — CORS não se aplica a esse tipo de requisição.
      //   • IPC não usa HTTP e não é afetado por webSecurity.
      //   • base: './' no Vite garante paths relativos corretos em file://.
      //
      // Se um futuro recurso exigir conteúdo remoto autenticado, usar
      // session.webRequest para injetar headers CORS, não webSecurity: false.
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
  initDb()            // inicializa SQLite e seed na 1ª execução
  registerHandlers()  // registra todos os ipcMain.handle('db:*')
  createWindow()
})

app.on('window-all-closed', () => { app.quit() })

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
