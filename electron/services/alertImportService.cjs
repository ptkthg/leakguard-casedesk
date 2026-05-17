'use strict'
const { getDb } = require('../database/db.cjs')

const VALID_SEVERITIES = new Set(['critical', 'high', 'medium', 'low'])
const REQUIRED = ['source', 'title', 'severity', 'channel', 'user', 'destination', 'policy']

function validate(payload) {
  const errors = []
  for (const field of REQUIRED) {
    if (!payload[field] || String(payload[field]).trim() === '') {
      errors.push(`Campo obrigatório ausente: "${field}"`)
    }
  }
  if (payload.severity && !VALID_SEVERITIES.has(payload.severity)) {
    errors.push(`severity inválido: "${payload.severity}". Aceitos: critical, high, medium, low`)
  }
  return errors
}

function nextIncId(db) {
  const row = db
    .prepare("SELECT MAX(CAST(SUBSTR(id, 5) AS INTEGER)) AS maxNum FROM cases WHERE id LIKE 'INC-%'")
    .get()
  return `INC-${(row?.maxNum ?? 2048) + 1}`
}

function importAlert(payload) {
  const errors = validate(payload)
  if (errors.length > 0) return { ok: false, errors }

  const db  = getDb()
  const now = new Date().toISOString()
  const caseId = nextIncId(db)
  const evId   = `EV-${caseId}-001`

  db.exec('BEGIN')
  try {
    db.prepare(`
      INSERT INTO cases
        (id, title, description, severity, status, origin,
         received_at, assigned_to, policy_violated, summary,
         source_channel, destination, user_email, device, department,
         created_at, updated_at)
      VALUES (?,?,?,?,'new',?,?,?,?,?,?,?,?,?,?,?,?)
    `).run(
      caseId,
      payload.title,
      payload.rawText ?? '',
      payload.severity,
      payload.source,
      now,
      'Não atribuído',
      payload.policy,
      `Alerta importado de ${payload.source}. Arquivo: ${payload.fileName ?? 'N/A'}. Destino: ${payload.destination}.`,
      payload.channel,
      payload.destination,
      payload.user,
      payload.device ?? '',
      payload.department ?? '',
      now,
      now
    )

    db.prepare(`
      INSERT INTO evidences
        (ev_id, case_id, file_name, file_type, file_size, hash,
         source, classification, risk, preview_available,
         captured_at, origin, destination)
      VALUES (?,?,?,?,?,?,?,'confidential',?,0,?,?,?)
    `).run(
      evId, caseId,
      payload.fileName ?? 'N/A',
      payload.fileType ?? 'N/A',
      payload.fileSize ?? 'N/A',
      '',
      payload.source,
      payload.severity,
      now,
      payload.source,
      payload.destination
    )

    const fields = Array.isArray(payload.detectedFields) ? payload.detectedFields : []
    const insertField = db.prepare(
      "INSERT INTO detected_fields (evidence_id, type, count, samples, masked) VALUES (?,?,?,'[]',1)"
    )
    for (const f of fields) {
      insertField.run(evId, f.type, f.count ?? 0)
    }

    db.prepare(`
      INSERT INTO audit_logs (id, case_id, actor, action, timestamp, details, type)
      VALUES (?,?,?,?,?,?,'system')
    `).run(
      `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}-import`,
      caseId,
      'Sistema — Ingestão',
      'Caso criado via importação',
      now,
      `Alerta de ${payload.source} (${payload.eventId ?? 'sem eventId'}). Política: ${payload.policy}. Severidade: ${payload.severity}.`
    )

    db.exec('COMMIT')
  } catch (err) {
    db.exec('ROLLBACK')
    return { ok: false, errors: [`Falha ao persistir: ${err.message}`] }
  }

  const { getById } = require('./caseService.cjs')
  return { ok: true, case: getById(caseId) }
}

module.exports = { importAlert, validate }
