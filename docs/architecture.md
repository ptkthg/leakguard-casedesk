# Architecture — LeakGuard CaseDesk

## Estrutura de pastas

```
leakguard-casedesk/
├── src/
│   ├── routes/          # Definição central de rotas e navegação
│   │   └── index.tsx    # PageId type, routes[], navRoutes, getRoute()
│   ├── types/           # Interfaces TypeScript globais
│   │   └── index.ts     # Case, Evidence, Policy, AIAnalysis, AuditLog...
│   ├── data/            # Mock data realista (substituir por API em prod)
│   │   └── mockData.ts
│   ├── store/           # Estado global com Zustand
│   │   └── useAppStore.ts
│   ├── lib/             # Utilitários puros
│   │   └── utils.ts     # cn(), formatDate(), formatDateTime()...
│   ├── styles/          # Design system
│   │   └── globals.css  # @theme tokens + reset + animações
│   ├── components/
│   │   ├── layout/      # Shell da aplicação
│   │   │   ├── AppShell.tsx   # Container principal, router de páginas
│   │   │   ├── TopBar.tsx     # Barra superior, breadcrumb, busca
│   │   │   └── SideNav.tsx    # Sidebar de ícones (driven by routes/)
│   │   └── ui/          # Componentes reutilizáveis
│   │       ├── Badge.tsx      # SeverityBadge, StatusBadge, ChannelBadge
│   │       └── Button.tsx     # primary | secondary | ghost | danger | outline
│   └── pages/           # Uma pasta por tela
│       ├── Login/
│       ├── CaseInbox/
│       ├── CaseWorkbench/
│       ├── Evidence/
│       ├── Copilot/
│       ├── Reports/
│       └── Policies/
├── electron/            # Processo principal Electron
│   ├── main.cjs         # BrowserWindow, menu, deep link
│   └── icon.png         # Ícone do app
├── public/
│   └── logo.png         # Logo 512×512 para portfólio
├── docs/                # Documentação do projeto
├── src-tauri/           # Backend Rust (Tauri v2 — requer rustc)
├── tailwind.config.ts   # Referência de tokens (config real está em globals.css)
└── vite.config.ts
```

---

## Fluxo de dados

```
mockData.ts  →  useAppStore (Zustand)  →  componentes via hooks
                     ↑
              actions (login, navigate,
              selectCase, updateCaseStatus...)
```

## Estado global (Zustand)

```ts
{
  isAuthenticated: boolean
  currentPage: PageId          // 'inbox' | 'workbench' | 'evidence' | ...
  selectedCase: Case | null
  selectedPolicy: Policy | null
  cases: Case[]
  policies: Policy[]
  commandPaletteOpen: boolean
}
```

## Roteamento

Sem React Router — navegação por estado (`currentPage`). `AppShell` faz o switch entre páginas. `routes/index.tsx` é a fonte única de verdade para IDs, labels e ícones de cada rota.

## Design system

Tailwind CSS v4 com tokens em `@theme` (CSS nativo). Sem `tailwind.config.js` funcional — configuração via `src/styles/globals.css`. O arquivo `tailwind.config.ts` na raiz serve como referência TypeScript da paleta.

## Desktop

| Target | Ferramenta | Requisito |
|--------|-----------|-----------|
| Windows .exe | Electron 42 + electron-builder | Node.js |
| Windows .exe (menor) | Tauri v2 | Node.js + Rust |

Electron: `npm run electron:build` → `release/`

Tauri: `npm run tauri:build` → `src-tauri/target/release/bundle/`

---

## Adicionando uma nova página

1. Criar `src/pages/NovaPagina/NovaPaginaPage.tsx`
2. Adicionar rota em `src/routes/index.tsx`
3. Mapear em `src/components/layout/AppShell.tsx`
4. O `SideNav` aparece automaticamente se `inNav: true`
