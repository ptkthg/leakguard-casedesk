'use strict'
const { ipcMain } = require('electron')
const caseService         = require('../services/caseService.cjs')
const evidenceService     = require('../services/evidenceService.cjs')
const policyService       = require('../services/policyService.cjs')
const auditService        = require('../services/auditService.cjs')
const alertImportService  = require('../services/alertImportService.cjs')

const STATUS_LABELS = {
  new:            'Novo',
  analyzing:      'Em Análise',
  pending_action: 'Aguardando Ação',
  contained:      'Contido',
  closed:         'Encerrado',
  false_positive: 'Falso Positivo',
}

function uid() {
  return `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function registerHandlers() {
  // ─── Cases ───────────────────────────────────────────────────────────────
  ipcMain.handle('db:cases:getAll', () => caseService.getAll())

  ipcMain.handle('db:cases:getById', (_, id) => caseService.getById(id))

  ipcMain.handle('db:cases:updateStatus', (_, id, status, actor = 'Analista') => {
    const updated = caseService.updateStatus(id, status)

    // Requirement 7: auto-create audit log on every status change
    auditService.create({
      id:        uid(),
      caseId:    id,
      actor,
      action:    `Status atualizado → ${STATUS_LABELS[status] || status}`,
      timestamp: new Date().toISOString(),
      details:   `Caso ${id} movido para "${STATUS_LABELS[status] || status}" por ${actor}.`,
      type:      'analyst',
    })

    return updated
  })

  // ─── Evidences ────────────────────────────────────────────────────────────
  ipcMain.handle('db:evidences:getAll', () => evidenceService.getAll())

  ipcMain.handle('db:evidences:getByCaseId', (_, caseId) =>
    evidenceService.getByCaseId(caseId)
  )

  // ─── Policies ─────────────────────────────────────────────────────────────
  ipcMain.handle('db:policies:getAll', () => policyService.getAll())

  // ─── Audit Logs ───────────────────────────────────────────────────────────
  ipcMain.handle('db:auditLogs:getByCaseId', (_, caseId) =>
    auditService.getByCaseId(caseId)
  )

  ipcMain.handle('db:auditLogs:create', (_, log) => auditService.create(log))

  // ─── Ingestion ────────────────────────────────────────────────────────────
  ipcMain.handle('db:ingestion:importAlert', (_, payload) =>
    alertImportService.importAlert(payload)
  )
}

module.exports = { registerHandlers }
