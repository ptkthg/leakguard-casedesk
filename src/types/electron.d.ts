import type { Case, Evidence, Policy, AuditLog } from './index'

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
    getByCaseId: (caseId: string)                         => Promise<AuditLog[]>
    create:      (log: AuditLog)                          => Promise<AuditLog>
  }
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

export {}
