'use strict'
const { getDb } = require('../database/db.cjs')

function rowToCase(row) {
  if (!row) return null
  return {
    id:             row.id,
    title:          row.title,
    description:    row.description,
    severity:       row.severity,
    status:         row.status,
    origin:         row.origin,
    receivedAt:     row.received_at,
    assignedTo:     row.assigned_to,
    policyViolated: row.policy_violated,
    summary:        row.summary,
    sourceChannel:  row.source_channel,
    destination:    row.destination,
    user:           row.user_email,
    device:         row.device,
    department:     row.department,
  }
}

function getAll() {
  return getDb()
    .prepare('SELECT * FROM cases ORDER BY received_at DESC')
    .all()
    .map(rowToCase)
}

function getById(id) {
  return rowToCase(
    getDb().prepare('SELECT * FROM cases WHERE id = ?').get(id)
  )
}

function updateStatus(id, status) {
  const now = new Date().toISOString()
  getDb()
    .prepare('UPDATE cases SET status = ?, updated_at = ? WHERE id = ?')
    .run(status, now, id)
  return getById(id)
}

module.exports = { getAll, getById, updateStatus }
