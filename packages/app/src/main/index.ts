import { app, shell, BrowserWindow, ipcMain, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { spawn } from 'child_process'
const server = spawn('node', ['src/main/server.ts'])

server.stdout.on('data', (data) => {
  console.log(`data from server : ${data}`);
});


function createWindow(): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })

  // Window personalization
  mainWindow.center()

  // DEV
  mainWindow.webContents.openDevTools()
  // END DEV

  // kiosk: true, might be useful for visualisation on screens

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    // mainWindow.webContents.send('module:communication', 100)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  // if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
  //   mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  // } else {
  //   mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  // }

  mainWindow.loadURL("http://localhost:3000")

  return mainWindow
}

// let interval = null

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Register IPC handlers
  // ipcMain.handle('test:test', test)

  // ipcMain.handle('module:getRender', (event, ...args) => {
  //   return getModuleRender()
  // })

  const win = createWindow()
  const manager = new Manager(join(__dirname, '../../modules'))

  manager.start()

  manager.loadModulesFromPath().then(() => {
    manager.start()
  })

  // Data sent from a module
  manager.on('event', (data) => {
    win.webContents.send('update-counter', data)
  })

  // interval = setInterval(() => {
  //   let test = 0
  //   win.webContents.send('update-counter', ++test)
  //   console.log(test)
  // }, 1000)

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

import { Server } from '@yalk/server'
import { Manager } from '@yalk/module-manager'
// import { test12 } from './test'

new Server(3000).start()

// const test = () => {
//   return manager.getModules()
// }

const getModuleRender = async (/*id: string */) => {
  // const app = await import(join(__dirname, '../../modules', manager.getModules()[0].name, 'app.js'))
  // const Render = app.default.default
  // console.log(await test12())
  // return await test12()
  return 'test'
}

app.on('window-all-closed', () => {
  // clearInterval(interval)
  // manager.stop()

  if (process.platform !== 'darwin') {
    app.quit()
  }
})
