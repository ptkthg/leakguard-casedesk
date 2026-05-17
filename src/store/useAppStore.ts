import { create } from 'zustand'
import type { Case, Evidence, Policy, AuditLog } from '@/types'
import type { PageId } from '@/routes'
import { api } from '@/lib/api'

interface AppState {
  isAuthenticated: boolean
  isLoading: boolean
  currentPage: PageId
  selectedCase: Case | null
  selectedPolicy: Policy | null
  cases: Case[]
  policies: Policy[]
  evidences: Evidence[]
  auditLogs: AuditLog[]
  commandPaletteOpen: boolean

  initialize: () => Promise<void>
  login: (email: string, password: string) => boolean
  logout: () => void
  navigate: (page: PageId) => void
  selectCase: (c: Case | null) => void
  openCaseWorkbench: (c: Case) => Promise<void>
  selectPolicy: (p: Policy | null) => void
  toggleCommandPalette: () => void
  updateCaseStatus: (id: string, status: Case['status']) => Promise<void>
  loadAuditLogs: (caseId: string) => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated: true,
  isLoading: true,
  currentPage: 'inbox',
  selectedCase: null,
  selectedPolicy: null,
  cases: [],
  policies: [],
  evidences: [],
  auditLogs: [],
  commandPaletteOpen: false,

  // ─── Bootstrap ────────────────────────────────────────────────────────────

  initialize: async () => {
    try {
      const [cases, policies, evidences] = await Promise.all([
        api.cases.getAll(),
        api.policies.getAll(),
        api.evidences.getAll(),
      ])
      set({ cases, policies, evidences, isLoading: false })
    } catch (err) {
      console.error('[store] initialize failed:', err)
      set({ isLoading: false })
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

  logout: () => set({
    isAuthenticated: false,
    currentPage: 'login',
    selectedCase: null,
    auditLogs: [],
  }),

  // ─── Navigation ───────────────────────────────────────────────────────────

  navigate: (page) => set({ currentPage: page }),

  selectCase: (c) => set({ selectedCase: c }),

  openCaseWorkbench: async (c) => {
    set({ selectedCase: c, currentPage: 'workbench' })
    const logs = await api.auditLogs.getByCaseId(c.id)
    set({ auditLogs: logs })
  },

  selectPolicy: (p) => set({ selectedPolicy: p }),

  toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),

  // ─── Case actions ─────────────────────────────────────────────────────────

  updateCaseStatus: async (id, status) => {
    // Optimistic update — UI responds immediately
    set((state) => ({
      cases: state.cases.map((c) => (c.id === id ? { ...c, status } : c)),
      selectedCase: state.selectedCase?.id === id
        ? { ...state.selectedCase, status }
        : state.selectedCase,
    }))

    // Persist + auto-creates audit_log in the IPC handler (Requirement 7)
    const actor = get().selectedCase?.assignedTo ?? 'Analista'
    await api.cases.updateStatus(id, status, actor)

    // Refresh audit log list for the currently open case
    if (get().selectedCase?.id === id) {
      await get().loadAuditLogs(id)
    }
  },

  loadAuditLogs: async (caseId) => {
    const logs = await api.auditLogs.getByCaseId(caseId)
    set({ auditLogs: logs })
  },
}))
