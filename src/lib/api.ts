import type { Case, Evidence, Policy, AuditLog, AlertPayload, ImportAlertResult, Severity, Channel } from '@/types'
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

  ingestion: {
    importAlert: (payload: AlertPayload): Promise<ImportAlertResult> => {
      if (isElectron) return window.electronAPI!.ingestion.importAlert(payload)

      const VALID_SEV = ['critical', 'high', 'medium', 'low']
      const REQUIRED  = ['source', 'title', 'severity', 'channel', 'user', 'destination', 'policy']
      const errors = REQUIRED
        .filter((f) => !payload[f as keyof AlertPayload])
        .map((f) => `Campo obrigatório ausente: "${f}"`)
      if (payload.severity && !VALID_SEV.includes(payload.severity))
        errors.push(`severity inválido: "${payload.severity}"`)
      if (errors.length > 0) return Promise.resolve({ ok: false, errors })

      const severity = VALID_SEV.includes(payload.severity) ? payload.severity as Severity : 'high'
      const validChannels: Channel[] = ['email', 'cloud', 'web', 'usb', 'print']
      const sourceChannel = validChannels.includes(payload.channel as Channel)
        ? payload.channel as Channel
        : 'email'

      const mockCase: Case = {
        id:             'INC-DEMO',
        title:          payload.title,
        description:    payload.rawText ?? '',
        severity,
        status:         'new',
        origin:         payload.source,
        receivedAt:     new Date().toISOString(),
        assignedTo:     'Não atribuído',
        policyViolated: payload.policy,
        summary:        `Alerta importado de ${payload.source}.`,
        sourceChannel,
        destination:    payload.destination,
        user:           payload.user,
        device:         payload.device ?? '',
        department:     payload.department ?? '',
      }
      return Promise.resolve({ ok: true, case: mockCase })
    },
  },
}
