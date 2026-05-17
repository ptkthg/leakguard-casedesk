'use strict'
const { getDb } = require('../database/db.cjs')

function getDetectedFields(evidenceId) {
  return getDb()
    .prepare('SELECT * FROM detected_fields WHERE evidence_id = ? ORDER BY id')
    .all(evidenceId)
    .map(row => ({
      type:    row.type,
      count:   row.count,
      samples: JSON.parse(row.samples || '[]'),
      masked:  Boolean(row.masked),
    }))
}

function rowToEvidence(row) {
  if (!row) return null
  return {
    id:               row.ev_id,
    caseId:           row.case_id,
    fileName:         row.file_name,
    fileType:         row.file_type,
    fileSize:         row.file_size,
    hash:             row.hash,
    source:           row.source,
    classification:   row.classification,
    risk:             row.risk,
    previewAvailable: Boolean(row.preview_available),
    capturedAt:       row.captured_at,
    origin:           row.origin,
    destination:      row.destination,
    detectedFields:   getDetectedFields(row.ev_id),
  }
}

function getAll() {
  return getDb()
    .prepare('SELECT * FROM evidences ORDER BY captured_at DESC')
    .all()
    .map(rowToEvidence)
}

function getByCaseId(caseId) {
  return getDb()
    .prepare('SELECT * FROM evidences WHERE case_id = ? ORDER BY captured_at')
    .all(caseId)
    .map(rowToEvidence)
}

module.exports = { getAll, getByCaseId }
