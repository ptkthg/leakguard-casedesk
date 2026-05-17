'use strict'
const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const { DatabaseSync } = require('node:sqlite')
const { runSchema, setDb } = require('../database/db.cjs')
const caseService        = require('../services/caseService.cjs')
const auditService       = require('../services/auditService.cjs')
const alertImportService = require('../services/alertImportService.cjs')

// ── In-memory DB — no file I/O, no Electron dependency ───────────────────────
const db = new DatabaseSync(':memory:')
db.exec('PRAGMA foreign_keys = ON')
runSchema(db)
setDb(db)

db.prepare('INSERT INTO cases (id, title, severity, status, received_at) VALUES (?, ?, ?, ?, ?)')
  .run('TEST-001', 'Planilha com CPF detectada', 'high', 'new', '2025-01-10T09:00:00.000Z')

// ── caseService ───────────────────────────────────────────────────────────────

describe('caseService.getAll', () => {
  test('retorna os casos do banco', () => {
    const cases = caseService.getAll()
    assert.equal(cases.length, 1)
    assert.equal(cases[0].id, 'TEST-001')
    assert.equal(cases[0].status, 'new')
  })
})

describe('caseService.getById', () => {
  test('retorna o caso correto', () => {
    const c = caseService.getById('TEST-001')
    assert.equal(c.id, 'TEST-001')
    assert.equal(c.severity, 'high')
  })

  test('retorna null para id inexistente', () => {
    assert.equal(caseService.getById('GHOST-999'), null)
  })
})

describe('caseService.updateStatus', () => {
  test('persiste o novo status no banco', () => {
    const updated = caseService.updateStatus('TEST-001', 'contained')
    assert.equal(updated.status, 'contained')
  })

  test('valor persiste após nova leitura (sem cache)', () => {
    assert.equal(caseService.getById('TEST-001').status, 'contained')
  })

  test('retorna null para caso inexistente', () => {
    assert.equal(caseService.updateStatus('GHOST-999', 'closed'), null)
  })
})

// ── auditService ──────────────────────────────────────────────────────────────

describe('auditService.create', () => {
  test('insere log e retorna o registro', () => {
    const log = auditService.create({
      id:        'log-test-001',
      caseId:    'TEST-001',
      actor:     'Analista Teste',
      action:    'Status atualizado → Contido',
      timestamp: '2025-01-10T09:05:00.000Z',
      details:   'Teste automatizado de persistência.',
      type:      'analyst',
    })
    assert.equal(log.id, 'log-test-001')
    assert.equal(log.caseId, 'TEST-001')
    assert.equal(log.actor, 'Analista Teste')
    assert.equal(log.type, 'analyst')
  })
})

describe('auditService.getByCaseId', () => {
  test('retorna os logs do caso', () => {
    const logs = auditService.getByCaseId('TEST-001')
    assert.ok(logs.length >= 1)
    assert.ok(logs.some(l => l.id === 'log-test-001'))
  })

  test('logs estão em ordem crescente de timestamp', () => {
    auditService.create({
      id:        'log-test-000',
      caseId:    'TEST-001',
      actor:     'Sistema',
      action:    'Caso criado',
      timestamp: '2025-01-10T08:00:00.000Z',
      details:   '',
      type:      'system',
    })
    const logs = auditService.getByCaseId('TEST-001')
    const idx0 = logs.findIndex(l => l.id === 'log-test-000')
    const idx1 = logs.findIndex(l => l.id === 'log-test-001')
    assert.ok(idx0 < idx1, 'log-test-000 deve preceder log-test-001')
  })

  test('retorna array vazio para caso sem logs', () => {
    db.prepare('INSERT INTO cases (id, title, severity, status, received_at) VALUES (?, ?, ?, ?, ?)')
      .run('TEST-002', 'Caso sem logs', 'low', 'new', '2025-01-11T09:00:00.000Z')
    assert.deepEqual(auditService.getByCaseId('TEST-002'), [])
  })

  test('retorna array vazio para case_id inexistente', () => {
    assert.deepEqual(auditService.getByCaseId('GHOST-999'), [])
  })
})

// ── alertImportService ────────────────────────────────────────────────────────

const VALID_PAYLOAD = {
  source:      'Purview DLP',
  eventId:     'purview-99001',
  title:       'Teste de ingestão de alerta',
  severity:    'high',
  channel:     'email',
  user:        'usuario@empresa.com',
  device:      'WKS-TST-001',
  department:  'TI',
  destination: 'externo@fora.com',
  fileName:    'relatorio.xlsx',
  fileType:    'XLSX',
  fileSize:    '1.2 MB',
  policy:      'DLP-003',
  detectedFields: [
    { type: 'CPF',    count: 150 },
    { type: 'E-mail', count: 80  },
  ],
  rawText: 'Arquivo com dados pessoais enviado externamente.',
}

describe('alertImportService.validate', () => {
  test('payload válido retorna array vazio', () => {
    assert.deepEqual(alertImportService.validate(VALID_PAYLOAD), [])
  })

  test('campo obrigatório ausente gera erro', () => {
    const errors = alertImportService.validate({ ...VALID_PAYLOAD, source: '' })
    assert.ok(errors.some(e => e.includes('"source"')))
  })

  test('severity inválido gera erro', () => {
    const errors = alertImportService.validate({ ...VALID_PAYLOAD, severity: 'extreme' })
    assert.ok(errors.some(e => e.includes('severity inválido')))
  })

  test('múltiplos campos ausentes geram múltiplos erros', () => {
    const errors = alertImportService.validate({ ...VALID_PAYLOAD, user: '', destination: '' })
    assert.ok(errors.length >= 2)
  })
})

describe('alertImportService.importAlert', () => {
  test('payload inválido retorna ok: false com errors', () => {
    const result = alertImportService.importAlert({ ...VALID_PAYLOAD, severity: 'mega' })
    assert.equal(result.ok, false)
    assert.ok(Array.isArray(result.errors) && result.errors.length > 0)
  })

  test('payload válido cria caso e retorna ok: true', () => {
    const result = alertImportService.importAlert(VALID_PAYLOAD)
    assert.equal(result.ok, true)
    assert.ok(result.case, 'deve retornar o caso criado')
    assert.match(result.case.id, /^INC-\d+$/)
    assert.equal(result.case.status, 'new')
    assert.equal(result.case.severity, 'high')
  })

  test('caso importado persiste no banco', () => {
    const result = alertImportService.importAlert({ ...VALID_PAYLOAD, eventId: 'persist-check' })
    assert.equal(result.ok, true)
    const fetched = caseService.getById(result.case.id)
    assert.equal(fetched.id, result.case.id)
    assert.equal(fetched.status, 'new')
  })

  test('audit_log "Caso criado via importação" é criado', () => {
    const result = alertImportService.importAlert({ ...VALID_PAYLOAD, eventId: 'audit-check' })
    assert.equal(result.ok, true)
    const logs = auditService.getByCaseId(result.case.id)
    assert.ok(logs.some(l => l.action === 'Caso criado via importação'))
  })

  test('IDs incrementam corretamente a cada importação', () => {
    const r1 = alertImportService.importAlert({ ...VALID_PAYLOAD, eventId: 'id-check-1' })
    const r2 = alertImportService.importAlert({ ...VALID_PAYLOAD, eventId: 'id-check-2' })
    assert.equal(r1.ok, true)
    const n1 = parseInt(r1.case.id.replace('INC-', ''), 10)
    const n2 = parseInt(r2.case.id.replace('INC-', ''), 10)
    assert.equal(n2, n1 + 1)
  })
})
