# Security — LeakGuard CaseDesk

## Práticas implementadas

### Mascaramento de dados sensíveis
Dados pessoais (CPF, e-mail, telefone) são exibidos mascarados por padrão (`blur-sensitive`). O analista precisa clicar em "Revelar" explicitamente. Nunca armazenado em texto puro no estado.

### Autenticação simulada
Login valida formato de e-mail + comprimento mínimo de senha. Em produção, substituir por OAuth 2.0 / SAML / SSO corporativo. O token de sessão nunca deve ser armazenado em `localStorage` — usar `httpOnly` cookie ou memória.

### Electron: `contextIsolation: true`
`nodeIntegration` desativado. `contextIsolation` ativo. `webSecurity: false` está habilitado apenas para permitir `file://` — em produção com servidor remoto, remover esta flag.

### Sem secrets no frontend
Nenhuma chave de API, token ou credencial no código-fonte. Dados mockados não contêm informações reais.

### Trilha de auditoria
Todas as ações do analista geram entradas em `AuditLog` com actor, action, timestamp e details. Em produção, persistir em backend imutável.

### Cadeia de custódia de evidências
Evidências registram `hash SHA-256`, `origin`, `capturedAt` e `destination`. A integridade é verificada antes de qualquer exportação.

---

## Considerações para produção

| Item | Recomendação |
|------|-------------|
| Autenticação | OAuth 2.0 + MFA obrigatório |
| Sessão | JWT com expiração curta + refresh token em httpOnly cookie |
| Transport | TLS 1.3 mínimo |
| Dados sensíveis | Criptografia em repouso (AES-256) |
| Logs de auditoria | Imutáveis, assinados digitalmente, backup externo |
| Electron | `contextBridge` para IPC, `sandbox: true` |
| CSP | Content Security Policy restritiva no BrowserWindow |
| Updates | Auto-update com assinatura de código (code signing) |

---

## LGPD — Referências implementadas

- Art. 6º — Princípio da finalidade, adequação e necessidade
- Art. 46 — Segurança no tratamento de dados pessoais
- Art. 48 — Comunicação de incidentes à ANPD (72h)
- Base legal exibida no parecer de IA de cada incidente
- Checklist de conformidade no módulo Copilot → Análise LGPD
