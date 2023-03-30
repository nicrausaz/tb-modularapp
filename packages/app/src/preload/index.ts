import { contextBridge, ipcRenderer } from 'electron'
import { ElectronAPI, electronAPI } from '@electron-toolkit/preload'
import { API } from './API'

// TODO: prevent duplicate definition
declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}

// Custom APIs for renderer
const api = {
  test: () => ipcRenderer.invoke('test:test'),
  getModuleRender: (id: string) => ipcRenderer.invoke('module:getRender', id)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}