import type { Case, Evidence, Policy, AuditLog } from '@/types'
import { mockCases, mockEvidences, mockPolicies, mockAuditLogs } from '@/data/mockData'

// True when running inside Electron (contextBridge injected window.electronAPI)
const isElectron = typeof window !== 'undefined' && typeof window.electronAPI !== 'undefined'

export const api = {
  cases: {
    getAll: (): Promise<Case[]> =>
      isElectron
        ? window.electronAPI!.cases.getAll()
        : Promise.resolve([...mockCases]),

    getById: (id: string): Promise<Case | null> =>
      isElectron
        ? window.electronAPI!.cases.getById(id)
        : Promise.resolve(mockCases.find((c) => c.id === id) ?? null),

    updateStatus: (id: string, status: Case['status'], actor?: string): Promise<Case | null> =>
      isElectron
        ? window.electronAPI!.cases.updateStatus(id, status, actor)
        : Promise.resolve(mockCases.find((c) => c.id === id) ?? null),
  },

  evidences: {
    getAll: (): Promise<Evidence[]> =>
      isElectron
        ? window.electronAPI!.evidences.getAll()
        : Promise.resolve([...mockEvidences]),

    getByCaseId: (caseId: string): Promise<Evidence[]> =>
      isElectron
        ? window.electronAPI!.evidences.getByCaseId(caseId)
        : Promise.resolve(mockEvidences.filter((e) => e.caseId === caseId)),
  },

  policies: {
    getAll: (): Promise<Policy[]> =>
      isElectron
        ? window.electronAPI!.policies.getAll()
        : Promise.resolve([...mockPolicies]),
  },

  auditLogs: {
    getByCaseId: (caseId: string): Promise<AuditLog[]> =>
      isElectron
        ? window.electronAPI!.auditLogs.getByCaseId(caseId)
        : Promise.resolve(mockAuditLogs.filter((l) => l.caseId === caseId)),

    create: (log: AuditLog): Promise<AuditLog> =>
      isElectron
        ? window.electronAPI!.auditLogs.create(log)
        : Promise.resolve(log),
  },
}
