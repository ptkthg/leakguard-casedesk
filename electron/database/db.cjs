'use strict'
const path = require('path')
const { app } = require('electron')

let db = null

function getDb() {
  if (!db) throw new Error('Database not initialized — call initDb() first.')
  return db
}

function runSchema(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key        TEXT PRIMARY KEY,
      value      TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS cases (
      id              TEXT PRIMARY KEY,
      title           TEXT NOT NULL,
      description     TEXT,
      severity        TEXT NOT NULL,
      status          TEXT NOT NULL,
      origin          TEXT,
      received_at     TEXT NOT NULL,
      assigned_to     TEXT,
      policy_violated TEXT,
      summary         TEXT,
      source_channel  TEXT,
      destination     TEXT,
      user_email      TEXT,
      device          TEXT,
      department      TEXT,
      created_at      TEXT DEFAULT (datetime('now')),
      updated_at      TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS evidences (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      ev_id             TEXT NOT NULL UNIQUE,
      case_id           TEXT NOT NULL,
      file_name         TEXT,
      file_type         TEXT,
      file_size         TEXT,
      hash              TEXT,
      source            TEXT,
      classification    TEXT,
      risk              TEXT,
      preview_available INTEGER DEFAULT 0,
      captured_at       TEXT,
      origin            TEXT,
      destination       TEXT,
      FOREIGN KEY (case_id) REFERENCES cases(id)
    );

    CREATE TABLE IF NOT EXISTS detected_fields (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      evidence_id TEXT NOT NULL,
      type        TEXT NOT NULL,
      count       INTEGER DEFAULT 0,
      samples     TEXT DEFAULT '[]',
      masked      INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS policies (
      id                   TEXT PRIMARY KEY,
      code                 TEXT NOT NULL UNIQUE,
      name                 TEXT NOT NULL,
      description          TEXT,
      category             TEXT,
      severity             TEXT,
      status               TEXT DEFAULT 'active',
      channels             TEXT DEFAULT '[]',
      action               TEXT,
      owner                TEXT,
      last_updated         TEXT,
      trigger_count        INTEGER DEFAULT 0,
      notify_user          INTEGER DEFAULT 0,
      log_incident         INTEGER DEFAULT 1,
      send_for_review      INTEGER DEFAULT 0,
      notification_channel TEXT,
      include_attachments  INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS ai_analyses (
      id                        TEXT PRIMARY KEY,
      case_id                   TEXT NOT NULL,
      technical_summary         TEXT,
      severity                  TEXT,
      policy_violated           TEXT,
      destination               TEXT,
      risk                      TEXT,
      impact                    TEXT,
      lgpd_basis                TEXT,
      recommendation            TEXT,
      business_risk             TEXT DEFAULT '[]',
      response_plan             TEXT DEFAULT '[]',
      control_improvements      TEXT DEFAULT '[]',
      false_positive_assessment TEXT,
      confidence_level          INTEGER DEFAULT 0,
      generated_at              TEXT,
      FOREIGN KEY (case_id) REFERENCES cases(id)
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id        TEXT PRIMARY KEY,
      case_id   TEXT,
      actor     TEXT NOT NULL,
      action    TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      details   TEXT,
      type      TEXT DEFAULT 'system'
    );
  `)
}

function initDb() {
  const { DatabaseSync } = require('node:sqlite')
  const dbPath = path.join(app.getPath('userData'), 'leakguard.db')

  db = new DatabaseSync(dbPath)
  db.exec("PRAGMA journal_mode = WAL")
  db.exec("PRAGMA foreign_keys = ON")

  runSchema(db)

  const { seedIfEmpty } = require('./seed.cjs')
  seedIfEmpty(db)

  return db
}

function setDb(database) { db = database }

module.exports = { initDb, getDb, setDb, runSchema }
