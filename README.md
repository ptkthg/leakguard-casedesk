<div align="center">

# LeakGuard CaseDesk

**Plataforma de Investigação de Incidentes DLP para Times de SOC**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Electron](https://img.shields.io/badge/Electron-42-47848F?style=flat-square&logo=electron)](https://electronjs.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)

</div>

---

## Sobre o projeto

LeakGuard CaseDesk é uma aplicação **desktop** de investigação e triagem de incidentes DLP (Data Loss Prevention) construída para times de Segurança da Informação e SOC.

O produto simula uma ferramenta operacional real — com fluxo de trabalho completo de analista, parecer técnico por IA, gestão de políticas DLP e relatórios formais de incidente com trilha de auditoria.

> Projeto de portfólio demonstrando domínio de produto, UX/UI sofisticado, arquitetura React moderna e empacotamento como app desktop com Electron.

---

## Telas do produto

### Login corporativo
Autenticação com suporte a SSO. Visual premium escuro com identidade da marca LeakGuard.

### Caixa de Entrada de Casos
Lista de incidentes DLP com indicadores operacionais em tempo real — casos recebidos hoje, em análise, aguardando ação e SLA crítico. Filtros por severidade e status, busca, paginação e painel lateral de preview do caso selecionado.

### Mesa de Trabalho do Caso
Ambiente de investigação completo com abas e 4 áreas integradas:
- **Evidência bruta** — remetente, destinatário, assunto, anexo, ID da mensagem, corpo do e-mail
- **Dados sensíveis detectados** — CPF, e-mail, telefone, nome, contrato com mascaramento dinâmico
- **Fluxo do evento** — `Usuário → Arquivo → Canal → Destino → Política violada → Risco`
- **Parecer da IA** — análise técnica estruturada com severidade, base legal LGPD e recomendação

### Evidências e Artefatos
Pré-visualização de planilha XLSX com dados mascarados, tabela de artefatos com hash SHA-256, cadeia de custódia, classificação automática de dados e verificação de integridade.

### LeakGuard Copilot
Assistente de operações de segurança com 6 tarefas rápidas: resumir incidente, gerar plano de resposta, explicar política, comparar casos similares, relatório executivo e análise LGPD com checklist de obrigações. Saída estruturada em seções — não um chatbot genérico.

### Relatório e Auditoria
Documento formal de incidente gerado dentro do app com 6 seções colapsáveis (Resumo Executivo, Evidências, Dados Envolvidos, Ações Recomendadas, Status e Decisão Final). Exportação PDF/DOCX/XLSX/JSON, assinatura digital e trilha de auditoria com timeline.

### Políticas DLP
Gestão completa de políticas com tabela de 8 políticas, painel de edição inline com 4 abas (Detalhes, Canais, Ações, Histórico), toggles de cobertura por canal e controle de modo ativo/simulação.

---

## Stack técnica

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Estilo | Tailwind CSS v4 (`@theme` directive, sem config file) |
| Estado | Zustand |
| Ícones | Lucide React |
| Desktop | Electron 42 + electron-builder |
| Tipografia | Inter + JetBrains Mono |

---

## Arquitetura

```
src/
├── types/          # Interfaces TypeScript (Case, Evidence, Policy, AIAnalysis...)
├── data/           # Mock data realista (casos, políticas, IA, auditoria, relatórios)
├── store/          # Estado global com Zustand
├── lib/            # Utilitários (cn, formatadores de data)
├── components/
│   ├── layout/     # AppShell, TopBar, SideNav
│   └── ui/         # Badge (Severity, Status, Channel), Button
└── pages/
    ├── Login/
    ├── CaseInbox/
    ├── CaseWorkbench/
    ├── Evidence/
    ├── Copilot/
    ├── Reports/
    └── Policies/
```

---

## Rodando o projeto

### Pré-requisitos
- Node.js 18+

### Modo web (desenvolvimento)
```bash
npm install
npm run dev
```
Acesse `http://localhost:5173`

**Login:** qualquer e-mail + senha com 6+ caracteres (ex: `analista@empresa.com` / `123456`)

### Build do app desktop (.exe para Windows)
```bash
npm install
npm run build
npx electron-builder --win
```

Saída em `release/`:
- `LeakGuard-CaseDesk-Portable.exe` — portátil, sem instalação
- `LeakGuard CaseDesk Setup 1.0.0.exe` — instalador completo

---

## Design

### Paleta de cores
| Token | Valor | Uso |
|-------|-------|-----|
| `bg-primary` | `#08080E` | Fundo principal |
| `bg-panel` | `#0E0E18` | Painéis e sidebar |
| `accent` | `#7C3AED` | Roxo — destaque principal |
| `lavender` | `#A78BFA` | Texto em destaque, estados ativos |
| `critical` | `#DC2626` | Severidade crítica |
| `high` | `#EA580C` | Severidade alta |
| `medium` | `#CA8A04` | Severidade média |
| `low` | `#3B82F6` | Severidade baixa |
| `success` | `#16A34A` | Contido / resolvido |

### Referências visuais
Obsidian · Linear · ferramentas forenses corporativas · software desktop premium

---

## Licença

MIT
