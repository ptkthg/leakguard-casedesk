'use strict'
const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const { DatabaseSync } = require('node:sqlite')
const { runSchema, setDb } = require('../database/db.cjs')
const caseService  = require('../services/caseService.cjs')
const auditService = require('../services/auditService.cjs')

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
