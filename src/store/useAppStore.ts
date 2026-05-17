import { create } from 'zustand'
import type { Case, Evidence, Policy, AuditLog, AlertPayload } from '@/types'
import type { PageId } from '@/routes'
import { api } from '@/lib/api'

interface AppState {
  isAuthenticated:  boolean
  isLoading:        boolean
  initError:        string | null
  currentPage:      PageId
  selectedCase:     Case | null
  selectedPolicy:   Policy | null
  cases:            Case[]
  policies:         Policy[]
  evidences:        Evidence[]
  auditLogs:        AuditLog[]
  commandPaletteOpen: boolean

  initialize:          () => Promise<void>
  login:               (email: string, password: string) => boolean
  logout:              () => void
  navigate:            (page: PageId) => void
  selectCase:          (c: Case | null) => void
  openCaseWorkbench:   (c: Case) => Promise<void>
  selectPolicy:        (p: Policy | null) => void
  toggleCommandPalette: () => void
  updateCaseStatus:    (id: string, status: Case['status']) => Promise<void>
  loadAuditLogs:       (caseId: string) => Promise<void>
  importAlert:         (payload: AlertPayload) => Promise<Case>
}

export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated:    true,
  isLoading:          true,
  initError:          null,
  currentPage:        'inbox',
  selectedCase:       null,
  selectedPolicy:     null,
  cases:              [],
  policies:           [],
  evidences:          [],
  auditLogs:          [],
  commandPaletteOpen: false,

  // ─── Bootstrap ────────────────────────────────────────────────────────────
  //
  // initialize() é chamada uma vez em App.tsx (useEffect vazio).
  // No Electron usa IPC → SQLite; no browser usa mockData (api.ts fallback).
  // Definir initError permite que App.tsx exiba tela de erro + botão de retry.

  initialize: async () => {
    set({ isLoading: true, initError: null })
    try {
      const [cases, policies, evidences] = await Promise.all([
        api.cases.getAll(),
        api.policies.getAll(),
        api.evidences.getAll(),
      ])
      set({ cases, policies, evidences, isLoading: false })
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Falha ao carregar dados do banco. Verifique o arquivo de log.'
      console.error('[store] initialize failed:', err)
      set({ isLoading: false, initError: message })
    }
  },

  // ─── Auth ─────────────────────────────────────────────────────────────────

  login: (email, password) => {
    if (email && password.length >= 6) {
      set({ isAuthenticated: true, currentPage: 'inbox' })
      return true
    }
    return false
  },

  logout: () =>
    set({
      isAuthenticated: false,
      currentPage:     'login',
      selectedCase:    null,
      auditLogs:       [],
    }),

  // ─── Navigation ───────────────────────────────────────────────────────────

  navigate: (page) => set({ currentPage: page }),

  selectCase: (c) => set({ selectedCase: c }),

  openCaseWorkbench: async (c) => {
    set({ selectedCase: c, currentPage: 'workbench' })
    // Carrega logs do caso antes de exibir a mesa de trabalho
    const logs = await api.auditLogs.getByCaseId(c.id)
    set({ auditLogs: logs })
  },

  selectPolicy:         (p) => set({ selectedPolicy: p }),
  toggleCommandPalette: ()  => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),

  // ─── Case actions ─────────────────────────────────────────────────────────
  //
  // Fluxo de updateCaseStatus:
  //   1. Atualização otimista → UI responde instantaneamente
  //   2. Persiste no SQLite via IPC — o handler cria audit_log automaticamente
  //   3. Reconcilia a lista de casos com o valor real retornado do DB
  //   4. Recarrega os audit_logs do caso para exibir a entrada recém-criada

  updateCaseStatus: async (id, status) => {
    // 1. Atualização otimista
    set((state) => ({
      cases: state.cases.map((c) => (c.id === id ? { ...c, status } : c)),
      selectedCase:
        state.selectedCase?.id === id
          ? { ...state.selectedCase, status }
          : state.selectedCase,
    }))

    // 2. Persiste (SQLite) + cria audit_log no handler IPC
    const actor     = get().selectedCase?.assignedTo ?? 'Analista'
    const persisted = await api.cases.updateStatus(id, status, actor)

    // 3. Reconcilia: garante que o estado React reflita exatamente o DB
    if (persisted) {
      set((state) => ({
        cases: state.cases.map((c) => (c.id === id ? persisted : c)),
        selectedCase:
          state.selectedCase?.id === id ? persisted : state.selectedCase,
      }))
    }

    // 4. Atualiza auditLogs se o caso estiver aberto na Mesa de Trabalho
    if (get().selectedCase?.id === id) {
      await get().loadAuditLogs(id)
    }
  },

  loadAuditLogs: async (caseId) => {
    const logs = await api.auditLogs.getByCaseId(caseId)
    set({ auditLogs: logs })
  },

  importAlert: async (payload) => {
    const result = await api.ingestion.importAlert(payload)
    if (!result.ok || !result.case) {
      throw new Error(result.errors?.join(', ') ?? 'Falha ao importar alerta')
    }
    // Full reload — evidence created in the same DB transaction must be visible in state
    const [cases, evidences] = await Promise.all([
      api.cases.getAll(),
      api.evidences.getAll(),
    ])
    set({ cases, evidences })
    // openCaseWorkbench sets selectedCase, navigates to workbench, and loads auditLogs
    await get().openCaseWorkbench(result.case!)
    return result.case!
  },
}))
