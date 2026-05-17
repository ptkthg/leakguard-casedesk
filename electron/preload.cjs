'use strict'
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  cases: {
    getAll:       ()                          => ipcRenderer.invoke('db:cases:getAll'),
    getById:      (id)                        => ipcRenderer.invoke('db:cases:getById', id),
    updateStatus: (id, status, actor)         => ipcRenderer.invoke('db:cases:updateStatus', id, status, actor),
  },
  evidences: {
    getAll:      ()         => ipcRenderer.invoke('db:evidences:getAll'),
    getByCaseId: (caseId)   => ipcRenderer.invoke('db:evidences:getByCaseId', caseId),
  },
  policies: {
    getAll: () => ipcRenderer.invoke('db:policies:getAll'),
  },
  auditLogs: {
    getByCaseId: (caseId) => ipcRenderer.invoke('db:auditLogs:getByCaseId', caseId),
    create:      (log)    => ipcRenderer.invoke('db:auditLogs:create', log),
  },
})
