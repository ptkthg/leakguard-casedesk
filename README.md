<div align="center">
  <img src="public/logo.png" width="96" alt="LeakGuard CaseDesk" />
  <h1>LeakGuard CaseDesk</h1>
  <p>Plataforma de investigação e triagem de incidentes DLP para times de SOC e Segurança da Informação.</p>

  ![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
  ![Electron](https://img.shields.io/badge/Electron-42-47848F?style=flat-square&logo=electron&logoColor=white)
</div>

---

## Sobre

LeakGuard CaseDesk é uma aplicação **desktop** para investigação e triagem de incidentes DLP, criada para apoiar times de SOC e Segurança da Informação na análise de possíveis vazamentos de dados, classificação de risco, geração de parecer técnico com IA e produção de relatórios de incidente.

O produto foi desenhado como uma **ferramenta operacional real** — não um dashboard genérico. O analista recebe o caso, investiga as evidências, obtém um parecer estruturado da IA, toma ações e gera o relatório formal sem sair da aplicação.

---

## Telas

| Módulo | Descrição |
|--------|-----------|
| **Login** | Autenticação corporativa com suporte a SSO |
| **Caixa de Entrada** | Triagem de incidentes com KPIs operacionais em tempo real |
| **Mesa de Trabalho** | Investigação completa: evidência bruta, dados detectados, fluxo do evento e parecer de IA |
| **Evidências** | Pré-visualização de artefatos com mascaramento, hash SHA-256 e cadeia de custódia |
| **Copilot IA** | Assistente de operações com plano de resposta, análise LGPD e relatório executivo |
| **Relatórios** | Documento formal de incidente com exportação PDF / DOCX / XLSX / JSON |
| **Políticas DLP** | Gestão de políticas com edição inline, canais, ações e histórico |

---

## Stack

```
React 19 · TypeScript · Vite 8 · Tailwind CSS v4 · Zustand · Lucide React · Electron 42
```

---

## Estrutura

```
src/
├── routes/        # Definição central de rotas e PageId
├── types/         # Interfaces TypeScript (Case, Evidence, Policy, AIAnalysis...)
├── data/          # Mock data realista
├── store/         # Estado global com Zustand
├── lib/           # Utilitários (cn, formatadores)
├── styles/        # Design system (@theme tokens, reset, animações)
├── components/
│   ├── layout/    # AppShell, TopBar, SideNav
│   └── ui/        # Badge, Button
└── pages/         # Login, CaseInbox, CaseWorkbench, Evidence, Copilot, Reports, Policies
```

---

## Rodando

```bash
# Instalar dependências
npm install

# Modo web
npm run dev
# → http://localhost:5173
# Login: qualquer e-mail + senha com 6+ caracteres

# Build desktop (.exe Windows)
npm run build
npx electron-builder --win
# → release/LeakGuard-CaseDesk-Portable.exe
```

---

## Design

Paleta escura com roxo ametista como destaque principal. Tipografia Inter + JetBrains Mono. Visual inspirado em Obsidian, Linear e ferramentas forenses corporativas — longe do dashboard cyber genérico.

| Token | Valor |
|-------|-------|
| Background | `#08080E` |
| Painel | `#0E0E18` |
| Accent | `#7C3AED` |
| Lavender | `#A78BFA` |
| Crítico | `#DC2626` |
| Alto | `#EA580C` |
| Médio | `#CA8A04` |
| Baixo | `#3B82F6` |

---

## Documentação

- [Produto](docs/product.md) — fluxo, módulos e personas
- [Arquitetura](docs/architecture.md) — estrutura, estado e roteamento
- [Segurança](docs/security.md) — práticas, LGPD e recomendações para produção

---

## Licença

MIT
