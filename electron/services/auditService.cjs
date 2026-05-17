'use strict'
const { getDb } = require('../database/db.cjs')

function rowToLog(row) {
  if (!row) return null
  return {
    id:        row.id,
    caseId:    row.case_id,
    actor:     row.actor,
    action:    row.action,
    timestamp: row.timestamp,
    details:   row.details,
    type:      row.type,
  }
}

function getByCaseId(caseId) {
  return getDb()
    .prepare('SELECT * FROM audit_logs WHERE case_id = ? ORDER BY timestamp ASC')
    .all(caseId)
    .map(rowToLog)
}

function create(log) {
  const db = getDb()
  db.prepare(`
    INSERT INTO audit_logs (id, case_id, actor, action, timestamp, details, type)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(log.id, log.caseId, log.actor, log.action, log.timestamp, log.details, log.type)
  return rowToLog(db.prepare('SELECT * FROM audit_logs WHERE id = ?').get(log.id))
}

module.exports = { getByCaseId, create }
