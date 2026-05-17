'use strict'
const { getDb } = require('../database/db.cjs')

function rowToPolicy(row) {
  if (!row) return null
  return {
    id:                  row.id,
    code:                row.code,
    name:                row.name,
    description:         row.description,
    category:            row.category,
    severity:            row.severity,
    status:              row.status,
    channels:            JSON.parse(row.channels || '[]'),
    action:              row.action,
    owner:               row.owner,
    lastUpdated:         row.last_updated,
    triggerCount:        row.trigger_count,
    notifyUser:          Boolean(row.notify_user),
    logIncident:         Boolean(row.log_incident),
    sendForReview:       Boolean(row.send_for_review),
    notificationChannel: row.notification_channel,
    includeAttachments:  Boolean(row.include_attachments),
  }
}

function getAll() {
  return getDb()
    .prepare('SELECT * FROM policies ORDER BY code')
    .all()
    .map(rowToPolicy)
}

function getById(id) {
  return rowToPolicy(
    getDb().prepare('SELECT * FROM policies WHERE id = ?').get(id)
  )
}

module.exports = { getAll, getById }
