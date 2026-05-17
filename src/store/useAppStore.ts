import { create } from 'zustand';
import type { Case, Policy } from '@/types';
import { mockCases, mockPolicies } from '@/data/mockData';
import type { PageId } from '@/routes';

interface AppState {
  isAuthenticated: boolean;
  currentPage: PageId;
  selectedCase: Case | null;
  selectedPolicy: Policy | null;
  cases: Case[];
  policies: Policy[];
  commandPaletteOpen: boolean;

  login: (email: string, password: string) => boolean;
  logout: () => void;
  navigate: (page: PageId) => void;
  selectCase: (c: Case | null) => void;
  openCaseWorkbench: (c: Case) => void;
  selectPolicy: (p: Policy | null) => void;
  toggleCommandPalette: () => void;
  updateCaseStatus: (id: string, status: Case['status']) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  currentPage: 'login',
  selectedCase: null,
  selectedPolicy: null,
  cases: mockCases,
  policies: mockPolicies,
  commandPaletteOpen: false,

  login: (email, password) => {
    if (email && password.length >= 6) {
      set({ isAuthenticated: true, currentPage: 'inbox' });
      return true;
    }
    return false;
  },

  logout: () => set({ isAuthenticated: false, currentPage: 'login', selectedCase: null }),

  navigate: (page) => set({ currentPage: page }),

  selectCase: (c) => set({ selectedCase: c }),

  openCaseWorkbench: (c) => set({ selectedCase: c, currentPage: 'workbench' }),

  selectPolicy: (p) => set({ selectedPolicy: p }),

  toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),

  updateCaseStatus: (id, status) =>
    set((state) => ({
      cases: state.cases.map((c) => (c.id === id ? { ...c, status } : c)),
      selectedCase: state.selectedCase?.id === id
        ? { ...state.selectedCase, status }
        : state.selectedCase,
    })),
}));
