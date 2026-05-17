import type { Case, Evidence, Policy, AuditLog, AlertPayload, ImportAlertResult } from './index'

interface ElectronAPI {
  cases: {
    getAll:       ()                                           => Promise<Case[]>
    getById:      (id: string)                                 => Promise<Case | null>
    updateStatus: (id: string, status: Case['status'], actor?: string) => Promise<Case | null>
  }
  evidences: {
    getAll:      ()                => Promise<Evidence[]>
    getByCaseId: (caseId: string)  => Promise<Evidence[]>
  }
  policies: {
    getAll: () => Promise<Policy[]>
  }
  auditLogs: {
    getByCaseId: (caseId: string)  => Promise<AuditLog[]>
    create:      (log: AuditLog)   => Promise<AuditLog>
  }
  ingestion: {
    importAlert: (payload: AlertPayload) => Promise<ImportAlertResult>
  }
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

export {}
