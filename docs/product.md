# Product — LeakGuard CaseDesk

## Problema que resolve

Times de SOC recebem alertas DLP de múltiplas ferramentas (gateway de e-mail, CASB, endpoint) sem um ambiente centralizado para investigar, documentar e responder. O analista precisa alternar entre 4-6 ferramentas para fechar um único incidente.

## Solução

Uma "mesa de trabalho" digital onde o analista recebe o caso, vê as evidências, obtém parecer de IA, toma ações e gera o relatório — sem sair da aplicação.

---

## Fluxo principal

```
Alerta DLP disparado
       ↓
Caso criado na Caixa de Entrada
       ↓
Analista seleciona → abre na Mesa de Trabalho
       ↓
Revisa evidência bruta + dados sensíveis detectados
       ↓
Consulta Copilot IA → plano de resposta gerado
       ↓
Toma ação (conter, exportar, escalar)
       ↓
Gera relatório formal → exporta PDF / notifica DPO
       ↓
Caso encerrado → trilha de auditoria registrada
```

---

## Módulos

| Módulo | Função |
|--------|--------|
| **Caixa de Entrada** | Triagem de incidentes com KPIs operacionais |
| **Mesa de Trabalho** | Investigação: evidência, dados, fluxo, IA |
| **Evidências** | Artefatos, preview mascarado, cadeia de custódia |
| **Copilot IA** | Plano de resposta, análise LGPD, relatório executivo |
| **Relatórios** | Documento formal com exportação multi-formato |
| **Políticas DLP** | Gestão de regras, canais, ações e histórico |

---

## Personas

**Analista de SOC** — usa diariamente para triagem e investigação de incidentes.

**CISO / DPO** — acessa relatórios executivos e decide sobre notificação à ANPD.

**Compliance** — revisa trilha de auditoria e status de conformidade LGPD.

---

## Dados mockados (demo)

6 casos de exemplo cobrindo os cenários DLP mais comuns:

- Envio de planilha com CPF por e-mail (INC-2048)
- Upload para nuvem pessoal (INC-2047)
- Token de API em anexo (INC-2046)
- Contrato para domínio externo (INC-2045)
- Compartilhamento público no SharePoint (INC-2044)
- Base de clientes em dispositivo não gerenciado (INC-2043)
