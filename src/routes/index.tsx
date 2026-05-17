import { Inbox, Briefcase, FileSearch, Bot, FileText, Shield } from 'lucide-react';
import type { ReactNode } from 'react';

export type PageId =
  | 'login'
  | 'inbox'
  | 'workbench'
  | 'evidence'
  | 'copilot'
  | 'reports'
  | 'policies';

export interface Route {
  id: PageId;
  label: string;
  icon: ReactNode;
  inNav: boolean;
}

export const routes: Route[] = [
  { id: 'login',     label: 'Login',              icon: null,                                  inNav: false },
  { id: 'inbox',     label: 'Casos Recebidos',     icon: <Inbox size={18} />,                  inNav: true  },
  { id: 'workbench', label: 'Mesa de Trabalho',    icon: <Briefcase size={18} />,              inNav: true  },
  { id: 'evidence',  label: 'Evidências',          icon: <FileSearch size={18} />,             inNav: true  },
  { id: 'copilot',   label: 'Copilot IA',          icon: <Bot size={18} />,                    inNav: true  },
  { id: 'reports',   label: 'Relatórios',          icon: <FileText size={18} />,               inNav: true  },
  { id: 'policies',  label: 'Políticas DLP',       icon: <Shield size={18} />,                 inNav: true  },
];

export const navRoutes = routes.filter((r) => r.inNav);

export function getRoute(id: PageId): Route {
  return routes.find((r) => r.id === id) ?? routes[0];
}
