# Checklist de Testes — LeakGuard CaseDesk

## Pré-requisito

```bash
npm run build           # gera dist/
npx electron-builder --win   # gera release/*.exe   OU
npm run electron:dev    # modo dev com Electron (sem hot-reload)
```

---

## 1. Bootstrap (initialize)

| # | Ação | Resultado esperado |
|---|------|--------------------|
| 1.1 | Abrir o app | Tela de loading ("Carregando banco de dados local...") aparece brevemente |
| 1.2 | Loading completa | Caixa de Entrada exibe os 6 casos do seed (INC-2043 a INC-2048) |
| 1.3 | Console do processo principal | `[LeakGuard] Database seeded successfully.` **apenas** na 1ª execução |
| 1.4 | Abrir o app pela 2ª vez | Loading **não** mostra "seeded" — dados já existem no DB |
| 1.5 | Simular falha de DB | Renomear `leakguard.db` para `.bak`, abrir app → tela de **Erro** aparece com botão "Tentar novamente" |
| 1.6 | Clicar "Tentar novamente" | initialize() é chamada de novo; se o DB estiver acessível, carrega normalmente |

**Onde fica o DB:** `%APPDATA%\leakguard-casedesk\leakguard.db` (Windows)

---

## 2. Fallback para mockData (browser)

| # | Ação | Resultado esperado |
|---|------|--------------------|
| 2.1 | `npm run dev` → abrir `http://localhost:5173` | App carrega **sem** Electron; `window.electronAPI` é `undefined` |
| 2.2 | Console do browser | **Nenhum** erro de IPC |
| 2.3 | Casos exibidos | Os mesmos 6 casos do `mockData.ts` |
| 2.4 | Alterar status de um caso | UI atualiza; **não** persiste (esperado em modo browser) |

---

## 3. Persistência de status (SQLite)

| # | Ação | Resultado esperado |
|---|------|--------------------|
| 3.1 | Abrir INC-2047 ("Upload suspeito") — status: **Novo** | Status badge exibe "Novo" |
| 3.2 | Na Mesa de Trabalho → Ações → clicar **"Marcar como Contido"** | Badge muda para "Contido" imediatamente (atualização otimista) |
| 3.3 | Fechar o app completamente | — |
| 3.4 | Reabrir o app | INC-2047 exibe status **"Contido"** na Caixa de Entrada |
| 3.5 | Repetir com INC-2048 → "Encerrado" | Persiste da mesma forma |

---

## 4. Criação automática de audit_log

| # | Ação | Resultado esperado |
|---|------|--------------------|
| 4.1 | Abrir qualquer caso na Mesa de Trabalho | Aba "Linha do Tempo" exibe os logs do seed |
| 4.2 | Alterar o status do caso (ex: INC-2047 → "Contido") | — |
| 4.3 | Abrir aba "Linha do Tempo" | Nova entrada aparece: `"Status atualizado → Contido"` com actor, timestamp e details |
| 4.4 | Fechar e reabrir o app, abrir o mesmo caso | O audit_log criado na etapa 4.3 **ainda está lá** |
| 4.5 | Alterar status 3 vezes seguidas | 3 entradas novas no log, uma por mudança |

---

## 5. Reconciliação do estado com o DB

| # | Ação | Resultado esperado |
|---|------|--------------------|
| 5.1 | Alterar status de INC-2046 → "Encerrado" | `cases[].status` e `selectedCase.status` no store refletem "Encerrado" |
| 5.2 | Abrir DevTools → Console → `useAppStore.getState().selectedCase.status` | Retorna `"closed"` (valor do DB, não apenas otimista) |
| 5.3 | `useAppStore.getState().cases.find(c => c.id === 'INC-2046').status` | Retorna `"closed"` |

---

## 6. Segurança do Electron

| # | Verificação | Resultado esperado |
|---|-------------|--------------------|
| 6.1 | `webSecurity` não está presente em main.cjs | Padrão Electron: `true` |
| 6.2 | `nodeIntegration` em main.cjs | `false` |
| 6.3 | `contextIsolation` em main.cjs | `true` |
| 6.4 | `window.electronAPI` no renderer | Expõe apenas: `cases`, `evidences`, `policies`, `auditLogs` |
| 6.5 | `window.require` no renderer | `undefined` (Node não acessível) |
| 6.6 | Tentar `window.electronAPI.db` ou acesso direto ao DB | `undefined` — não exposto |
| 6.7 | Abrir app com `webSecurity: true` | Fontes (Google Fonts) carregam normalmente via `<link>` |

---

## 7. Teste de integridade do DB após múltiplas sessões

```bash
# Verificar o banco diretamente com qualquer cliente SQLite
# ex: DB Browser for SQLite ou sqlite3 CLI

sqlite3 "%APPDATA%\leakguard-casedesk\leakguard.db"

SELECT id, status, updated_at FROM cases ORDER BY updated_at DESC;
SELECT id, case_id, actor, action, timestamp FROM audit_logs ORDER BY timestamp DESC LIMIT 10;
SELECT value FROM settings WHERE key = 'seeded';
```

Resultado esperado após os testes acima:
- `cases` com `status` e `updated_at` atualizados
- `audit_logs` com entradas do tipo `analyst` para cada mudança de status
- `settings.seeded = 'true'`
