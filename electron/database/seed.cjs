'use strict'

// ─── Seed data (mirrors src/data/mockData.ts) ────────────────────────────────

const CASES = [
  {
    id: 'INC-2048', title: 'Envio externo de planilha com CPF',
    description: 'Planilha contendo 847 registros de CPF, e-mails e telefones de clientes enviada para domínio externo não autorizado via e-mail corporativo.',
    severity: 'high', status: 'analyzing', origin: 'Email Security Gateway',
    received_at: '2026-05-17T08:42:00Z', assigned_to: 'Carlos Mendes',
    policy_violated: 'DLP-003',
    summary: 'mariana.silva@empresa.com enviou clientes_maio_2026.xlsx (847 CPFs, 412 e-mails, 389 telefones) para fornecedor@contabilidade-exata.com.br — domínio externo não homologado.',
    source_channel: 'email', destination: 'fornecedor@contabilidade-exata.com.br',
    user_email: 'mariana.silva@empresa.com', device: 'WKS-MKT-042', department: 'Marketing',
  },
  {
    id: 'INC-2047', title: 'Upload suspeito para nuvem pessoal',
    description: 'Transferência de relatórios financeiros internos para conta Google Drive pessoal — dados incluem valores de contratos e CNPJs de parceiros.',
    severity: 'high', status: 'new', origin: 'Cloud DLP',
    received_at: '2026-05-17T07:15:00Z', assigned_to: 'Ana Ferreira',
    policy_violated: 'DLP-003',
    summary: 'rafael.costa@empresa.com fez upload de 14 arquivos para Google Drive pessoal, incluindo relatorio_financeiro_Q1_2026.xlsx com 142 valores financeiros e 18 CNPJs.',
    source_channel: 'cloud', destination: 'drive.google.com (conta pessoal)',
    user_email: 'rafael.costa@empresa.com', device: 'NTB-FIN-019', department: 'Financeiro',
  },
  {
    id: 'INC-2046', title: 'Token de API detectado em anexo',
    description: 'Arquivo de configuração com tokens AWS IAM, chave de API de produção e credencial de banco de dados enviado para e-mail externo.',
    severity: 'critical', status: 'pending_action', origin: 'Email Security Gateway',
    received_at: '2026-05-17T06:30:00Z', assigned_to: 'Carlos Mendes',
    policy_violated: 'DLP-012',
    summary: 'pedro.alves@empresa.com enviou config_prod.txt com 3 API keys, 2 tokens JWT e 1 credencial de banco de dados para dev.externo@freelancer.io.',
    source_channel: 'email', destination: 'dev.externo@freelancer.io',
    user_email: 'pedro.alves@empresa.com', device: 'WKS-TI-007', department: 'TI',
  },
  {
    id: 'INC-2045', title: 'Contrato enviado para domínio externo',
    description: 'Contrato de prestação de serviços com valores, CNPJs e cláusulas confidenciais enviado para parceiro não listado na whitelist.',
    severity: 'medium', status: 'analyzing', origin: 'Email Security Gateway',
    received_at: '2026-05-16T17:22:00Z', assigned_to: 'Ana Ferreira',
    policy_violated: 'DLP-007',
    summary: 'lucia.santos@empresa.com enviou contrato_servico_2026_rev3.pdf (R$ 2.4M, 2 CNPJs) para juridico@parceiro-novo.com — domínio não homologado.',
    source_channel: 'email', destination: 'juridico@parceiro-novo.com',
    user_email: 'lucia.santos@empresa.com', device: 'WKS-JUR-003', department: 'Jurídico',
  },
  {
    id: 'INC-2044', title: 'Compartilhamento público de documento interno',
    description: 'Apresentação com roadmap estratégico, metas financeiras e dados de parceiros compartilhada publicamente via SharePoint por 4 horas.',
    severity: 'high', status: 'contained', origin: 'Cloud DLP',
    received_at: '2026-05-16T14:10:00Z', assigned_to: 'Carlos Mendes',
    policy_violated: 'DLP-007',
    summary: 'joao.lima@empresa.com marcou roadmap_produto_2026.pptx como "qualquer pessoa com link" por 4h07min — 12 metas financeiras e e-mails de parceiros expostos.',
    source_channel: 'cloud', destination: 'sharepoint.com (link público)',
    user_email: 'joao.lima@empresa.com', device: 'NTB-PRD-011', department: 'Produto',
  },
  {
    id: 'INC-2043', title: 'Base de clientes copiada para dispositivo não gerenciado',
    description: 'Exportação completa da base de clientes — 14.320 registros com CPF, e-mail, telefone e CNPJ — copiada para notebook pessoal sem MDM.',
    severity: 'critical', status: 'new', origin: 'Endpoint DLP',
    received_at: '2026-05-16T11:45:00Z', assigned_to: 'Ana Ferreira',
    policy_violated: 'DLP-009',
    summary: 'fernanda.rocha@empresa.com copiou base_clientes_completa.csv para notebook pessoal (S/N: DEV-UNK-9921) não registrado no MDM — 14.320 titulares expostos.',
    source_channel: 'usb', destination: 'Dispositivo pessoal — S/N: DEV-UNK-9921 (sem MDM)',
    user_email: 'fernanda.rocha@empresa.com', device: 'Não gerenciado', department: 'Vendas',
  },
]

const EVIDENCES = [
  {
    ev_id: 'EV-001', case_id: 'INC-2048', file_name: 'clientes_maio_2026.xlsx',
    file_type: 'XLSX', file_size: '2.4 MB',
    hash: 'sha256:a3f8c2e91b7d45f0e6a8b3c7d9e2f1a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0',
    source: 'Interceptação SMTP — Email Security Gateway', classification: 'restricted',
    risk: 'high', preview_available: 1, captured_at: '2026-05-17T08:42:17Z',
    origin: 'mariana.silva@empresa.com', destination: 'fornecedor@contabilidade-exata.com.br',
    detectedFields: [
      { type: 'CPF',      count: 847,  samples: ['***.456.789-**', '***.123.456-**'], masked: 1 },
      { type: 'E-mail',   count: 412,  samples: ['cl***@gmail.com', 'us***@hotmail.com'], masked: 1 },
      { type: 'Telefone', count: 389,  samples: ['(11) 9****-****', '(21) 9****-****'], masked: 1 },
      { type: 'Contrato', count: 23,   samples: ['CTR-2025-***', 'CTR-2026-***'], masked: 1 },
      { type: 'CNPJ',     count: 4,    samples: ['**.***.***/0001-**'], masked: 1 },
    ],
  },
  {
    ev_id: 'EV-002', case_id: 'INC-2048', file_name: 'email_raw.eml',
    file_type: 'EML', file_size: '3.1 MB',
    hash: 'sha256:b4g9d3f02c8e56a1f7b9c4d8e3f2b5c6d7e8f9a1b2c3d4e5f6a7b8c9d0e1f2b3',
    source: 'Email Security Gateway — SMTP Capture', classification: 'restricted',
    risk: 'high', preview_available: 0, captured_at: '2026-05-17T08:42:17Z',
    origin: 'mariana.silva@empresa.com', destination: 'fornecedor@contabilidade-exata.com.br',
    detectedFields: [],
  },
  {
    ev_id: 'EV-003', case_id: 'INC-2047', file_name: 'relatorio_financeiro_Q1_2026.xlsx',
    file_type: 'XLSX', file_size: '1.8 MB',
    hash: 'sha256:c7d4e8f13a2b56c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
    source: 'Cloud DLP — Google Drive Intercept', classification: 'confidential',
    risk: 'high', preview_available: 1, captured_at: '2026-05-17T07:15:44Z',
    origin: 'rafael.costa@empresa.com', destination: 'drive.google.com (conta pessoal)',
    detectedFields: [
      { type: 'Valor financeiro', count: 142, samples: ['R$ ***.***.***,**', 'USD ***,***.**'], masked: 1 },
      { type: 'CNPJ',            count: 18,  samples: ['**.***.***/0001-**'], masked: 1 },
      { type: 'Contrato',        count: 11,  samples: ['CTR-FIN-2026-***'], masked: 1 },
      { type: 'E-mail',          count: 34,  samples: ['dir***@empresa.com'], masked: 1 },
    ],
  },
  {
    ev_id: 'EV-004', case_id: 'INC-2046', file_name: 'config_prod.txt',
    file_type: 'TXT', file_size: '14 KB',
    hash: 'sha256:d8e5f9a04b3c67d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
    source: 'Interceptação SMTP — Email Security Gateway', classification: 'restricted',
    risk: 'critical', preview_available: 0, captured_at: '2026-05-17T06:30:22Z',
    origin: 'pedro.alves@empresa.com', destination: 'dev.externo@freelancer.io',
    detectedFields: [
      { type: 'API Key',    count: 3, samples: ['AKIA********************', 'sk-prod-********************'], masked: 1 },
      { type: 'Token',      count: 2, samples: ['eyJhbGc***...'], masked: 1 },
      { type: 'Credencial', count: 1, samples: ['postgres://***:***@prod-db.empresa.com:5432/clientes'], masked: 1 },
    ],
  },
  {
    ev_id: 'EV-005', case_id: 'INC-2045', file_name: 'contrato_servico_2026_rev3.pdf',
    file_type: 'PDF', file_size: '892 KB',
    hash: 'sha256:e9f6a0b15c4d78e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
    source: 'Interceptação SMTP — Email Security Gateway', classification: 'confidential',
    risk: 'medium', preview_available: 0, captured_at: '2026-05-16T17:22:33Z',
    origin: 'lucia.santos@empresa.com', destination: 'juridico@parceiro-novo.com',
    detectedFields: [
      { type: 'Contrato',        count: 1, samples: ['CONTR-2026-JUR-0142'], masked: 0 },
      { type: 'Valor financeiro', count: 8, samples: ['R$ 2.400.000,00'], masked: 1 },
      { type: 'CNPJ',            count: 2, samples: ['12.***.***/0001-**'], masked: 1 },
      { type: 'E-mail',          count: 3, samples: ['ceo@empresa.com'], masked: 1 },
    ],
  },
  {
    ev_id: 'EV-006', case_id: 'INC-2044', file_name: 'roadmap_produto_2026.pptx',
    file_type: 'PPTX', file_size: '5.7 MB',
    hash: 'sha256:f0a7b1c26d5e89f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
    source: 'Cloud DLP — SharePoint Online', classification: 'confidential',
    risk: 'high', preview_available: 0, captured_at: '2026-05-16T14:10:07Z',
    origin: 'joao.lima@empresa.com', destination: 'sharepoint.com (link público)',
    detectedFields: [
      { type: 'Valor financeiro', count: 12, samples: ['R$ ***M ARR'], masked: 1 },
      { type: 'E-mail',           count: 5,  samples: ['partner@***corp.com'], masked: 1 },
      { type: 'Contrato',         count: 2,  samples: ['PART-2026-***'], masked: 1 },
    ],
  },
  {
    ev_id: 'EV-007', case_id: 'INC-2043', file_name: 'base_clientes_completa.csv',
    file_type: 'CSV', file_size: '18.3 MB',
    hash: 'sha256:a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    source: 'Endpoint DLP — Agente Forcepoint', classification: 'restricted',
    risk: 'critical', preview_available: 1, captured_at: '2026-05-16T11:45:31Z',
    origin: 'fernanda.rocha@empresa.com', destination: 'USB / Dispositivo pessoal — S/N: DEV-UNK-9921',
    detectedFields: [
      { type: 'CPF',      count: 14320, samples: ['***.456.789-**', '***.321.654-**'], masked: 1 },
      { type: 'E-mail',   count: 14320, samples: ['cl***@gmail.com'], masked: 1 },
      { type: 'Telefone', count: 12847, samples: ['(11) 9****-****'], masked: 1 },
      { type: 'CNPJ',     count: 142,   samples: ['**.***.***/0001-**'], masked: 1 },
    ],
  },
]

const POLICIES = [
  {
    id: 'pol-001', code: 'DLP-003', name: 'Proteção de Dados Pessoais',
    description: 'Detecta e previne o envio de dados pessoais identificáveis (CPF, CNPJ, e-mail, telefone) para destinatários externos não autorizados, conforme Art. 46 da LGPD.',
    category: 'Dados Pessoais (LGPD)', severity: 'high', status: 'active',
    channels: ['email', 'cloud', 'web'], action: 'quarantine',
    owner: 'CISO — Carlos Mendes', last_updated: '2026-04-12', trigger_count: 127,
    notify_user: 1, log_incident: 1, send_for_review: 1, notification_channel: '#dlp-alerts', include_attachments: 1,
  },
  {
    id: 'pol-002', code: 'DLP-007', name: 'Envio Externo de Contratos',
    description: 'Monitora o envio de documentos contratuais, acordos de NDA e documentos com valores financeiros para domínios não presentes na whitelist de parceiros homologados.',
    category: 'Documentos Confidenciais', severity: 'medium', status: 'active',
    channels: ['email', 'cloud'], action: 'alert',
    owner: 'Jurídico — Lucia Santos', last_updated: '2026-02-15', trigger_count: 58,
    notify_user: 1, log_incident: 1, send_for_review: 0, notification_channel: '#dlp-juridico', include_attachments: 0,
  },
  {
    id: 'pol-003', code: 'DLP-012', name: 'Bloqueio de Chaves de API',
    description: 'Detecta padrões de tokens de API (AWS, GCP, Azure, GitHub), chaves de acesso, credenciais de banco de dados e tokens JWT em qualquer canal de saída.',
    category: 'Segredos e Credenciais', severity: 'critical', status: 'active',
    channels: ['email', 'cloud', 'web', 'usb'], action: 'block',
    owner: 'Security Eng — Pedro Alves', last_updated: '2026-03-28', trigger_count: 34,
    notify_user: 0, log_incident: 1, send_for_review: 1, notification_channel: '#security-critical', include_attachments: 1,
  },
  {
    id: 'pol-004', code: 'DLP-009', name: 'Dispositivos não Gerenciados',
    description: 'Bloqueia transferência de arquivos classificados como Confidencial ou Restrito para dispositivos sem certificado MDM registrado na organização.',
    category: 'Endpoint & Dispositivos', severity: 'critical', status: 'active',
    channels: ['usb'], action: 'block',
    owner: 'CISO — Carlos Mendes', last_updated: '2026-05-01', trigger_count: 12,
    notify_user: 0, log_incident: 1, send_for_review: 1, notification_channel: '#security-critical', include_attachments: 1,
  },
  {
    id: 'pol-005', code: 'DLP-010', name: 'Impressão de Dados Sensíveis',
    description: 'Detecta e registra impressão de documentos com dados pessoais ou financeiros em impressoras não seguras ou fora da rede corporativa.',
    category: 'Dados Pessoais (LGPD)', severity: 'medium', status: 'simulation',
    channels: ['print'], action: 'log',
    owner: 'Compliance — Ana Ferreira', last_updated: '2026-04-30', trigger_count: 89,
    notify_user: 1, log_incident: 1, send_for_review: 0, notification_channel: '#dlp-compliance', include_attachments: 0,
  },
  {
    id: 'pol-006', code: 'DLP-011', name: 'Informações Financeiras',
    description: 'Detecta padrões de dados financeiros (valores, IBAN, dados de cartão, projeções de receita) em canais externos não autorizados.',
    category: 'Dados Financeiros', severity: 'critical', status: 'simulation',
    channels: ['email', 'cloud', 'web'], action: 'quarantine',
    owner: 'Financeiro — João Lima', last_updated: '2026-05-05', trigger_count: 19,
    notify_user: 1, log_incident: 1, send_for_review: 1, notification_channel: '#dlp-financeiro', include_attachments: 1,
  },
]

const AI_ANALYSIS = {
  id: 'ai-001', case_id: 'INC-2048',
  technical_summary: 'Violação confirmada da política DLP-003. A planilha anexada contém 847 registros de CPF com dígito verificador válido, 412 endereços de e-mail e 389 telefones — todos classificados como dados pessoais sob a LGPD. O destinatário (contabilidade-exata.com.br) não consta na whitelist de parceiros homologados e o envio ocorreu sem criptografia de transporte adicional. Padrão atípico para o perfil histórico de acesso do usuário.',
  severity: 'high',
  policy_violated: 'DLP-003 — Proteção de Dados Pessoais',
  destination: 'fornecedor@contabilidade-exata.com.br (domínio não homologado)',
  risk: 'Alto — 847 titulares de dados pessoais expostos para terceiro não autorizado',
  impact: 'Potencial vazamento de dados pessoais de clientes. Risco de sanção administrativa pela ANPD. Dano reputacional e rescisão contratual com clientes afetados.',
  lgpd_basis: 'Art. 6º (finalidade, adequação e necessidade), Art. 46 (segurança no tratamento) e Art. 48 (comunicação de incidentes — prazo 72h) — LGPD Lei 13.709/2018',
  recommendation: 'Suspender acesso de exportação do usuário imediatamente, notificar DPO em até 4h, avaliar comunicação à ANPD. Contactar destinatário para confirmação de exclusão dos dados.',
  business_risk: JSON.stringify([
    '847 titulares de dados pessoais expostos a destinatário não autorizado',
    'Notificação obrigatória à ANPD se confirmado vazamento (prazo: 72h — Art. 48 LGPD)',
    'Multa administrativa potencial: até 2% do faturamento, limitado a R$ 50 milhões por infração',
    'Risco de rescisão contratual com clientes por violação de cláusula de confidencialidade',
    'Dano reputacional público em caso de divulgação do incidente',
  ]),
  response_plan: JSON.stringify([
    'Suspender imediatamente permissões de exportação de mariana.silva nos sistemas de CRM e BI',
    'Notificar DPO (Data Protection Officer) sobre o incidente em até 4 horas',
    'Contactar fornecedor@contabilidade-exata.com.br e solicitar confirmação de exclusão e não utilização dos dados',
    'Avaliar critérios de notificação à ANPD conforme Resolução CD/ANPD nº 15/2024',
    'Registrar todas as ações no registro de incidentes LGPD com timestamps e responsáveis',
    'Rever políticas de permissão de exportação do departamento de Marketing',
  ]),
  control_improvements: JSON.stringify([
    'Implementar fluxo de aprovação obrigatória para exportações com mais de 100 registros pessoais',
    'Adicionar contabilidade-exata.com.br à lista de análise para avaliação de homologação',
    'Implementar DLP na camada de e-mail com bloqueio automático para CPF em quantidade > 10',
    'Treinamento obrigatório de LGPD e manuseio seguro de dados para Marketing — trimestral',
  ]),
  false_positive_assessment: 'Probabilidade de falso positivo muito baixa (< 5%). Padrões de CPF validados com algoritmo de dígito verificador. Destinatário é domínio externo sem histórico de comunicação autorizada.',
  confidence_level: 94,
  generated_at: '2026-05-17T08:45:33Z',
}

const AUDIT_LOGS = [
  { id: 'log-001', case_id: 'INC-2048', actor: 'Sistema DLP',    action: 'Incidente criado automaticamente',  timestamp: '2026-05-17T08:42:17Z', details: 'Política DLP-003 disparada. E-mail interceptado e quarentenado pelo Email Security Gateway. 847 registros de CPF detectados na planilha anexa.',          type: 'system'   },
  { id: 'log-002', case_id: 'INC-2048', actor: 'LeakGuard AI',   action: 'Parecer técnico gerado',            timestamp: '2026-05-17T08:45:33Z', details: 'Análise automática concluída com 94% de confiança. Severidade: Alto. Violação confirmada de DLP-003. Plano de resposta gerado com 6 ações.',           type: 'system'   },
  { id: 'log-003', case_id: 'INC-2048', actor: 'Carlos Mendes',  action: 'Caso atribuído',                   timestamp: '2026-05-17T09:02:00Z', details: 'Caso atribuído ao Analista Sênior Carlos Mendes para investigação e tomada de decisão.',                                                                    type: 'analyst'  },
  { id: 'log-004', case_id: 'INC-2048', actor: 'Carlos Mendes',  action: 'Evidências revisadas',             timestamp: '2026-05-17T09:18:00Z', details: 'Analista revisou clientes_maio_2026.xlsx e confirmou presença de 847 CPFs, 412 e-mails e 389 telefones. Destinatário não consta na whitelist.',         type: 'analyst'  },
  { id: 'log-005', case_id: 'INC-2048', actor: 'Carlos Mendes',  action: 'Status atualizado → Em análise',   timestamp: '2026-05-17T09:20:00Z', details: 'Caso movido para "Em Análise". Analista iniciou coleta de informações adicionais e contato com DPO.',                                                      type: 'analyst'  },
  { id: 'log-006', case_id: 'INC-2048', actor: 'Sistema DLP',    action: 'Notificação enviada ao DPO',       timestamp: '2026-05-17T09:25:00Z', details: 'Alerta automático disparado para o DPO conforme SLA de incidentes críticos. Canal: #security-critical.',                                                   type: 'policy'   },
  { id: 'log-007', case_id: 'INC-2048', actor: 'Carlos Mendes',  action: 'Relatório exportado',              timestamp: '2026-05-17T10:30:00Z', details: 'Relatório formal INC-2048 gerado e exportado em PDF para registro oficial. Versão 1.0.',                                                                  type: 'export'   },
  { id: 'log-008', case_id: 'INC-2046', actor: 'Sistema DLP',    action: 'Incidente criado automaticamente',  timestamp: '2026-05-17T06:30:22Z', details: 'Política DLP-012 disparada. E-mail bloqueado. 3 API keys AWS detectadas no arquivo config_prod.txt.',                                                     type: 'system'   },
  { id: 'log-009', case_id: 'INC-2046', actor: 'Carlos Mendes',  action: 'Ação urgente: credenciais revogadas', timestamp: '2026-05-17T07:05:00Z', details: 'Analista revogou credenciais AWS IAM identificadas no arquivo antes de avançar com investigação.',                                                 type: 'analyst'  },
  { id: 'log-010', case_id: 'INC-2043', actor: 'Sistema DLP',    action: 'Incidente criado automaticamente',  timestamp: '2026-05-16T11:45:31Z', details: 'Política DLP-009 disparada. Cópia para dispositivo não gerenciado detectada pelo agente Endpoint DLP. 18.3 MB transferidos.',                         type: 'system'   },
]

// ─── Seed function ────────────────────────────────────────────────────────────

function seedIfEmpty(db) {
  const check = db.prepare("SELECT value FROM settings WHERE key = 'seeded'").get()
  if (check) return

  db.exec('BEGIN')
  try {
    // Cases
    const insCase = db.prepare(`
      INSERT INTO cases (id, title, description, severity, status, origin, received_at,
        assigned_to, policy_violated, summary, source_channel, destination, user_email, device, department)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    for (const c of CASES) {
      insCase.run(c.id, c.title, c.description, c.severity, c.status, c.origin, c.received_at,
        c.assigned_to, c.policy_violated, c.summary, c.source_channel, c.destination,
        c.user_email, c.device, c.department)
    }

    // Evidences + detected_fields
    const insEv = db.prepare(`
      INSERT INTO evidences (ev_id, case_id, file_name, file_type, file_size, hash, source,
        classification, risk, preview_available, captured_at, origin, destination)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    const insField = db.prepare(`
      INSERT INTO detected_fields (evidence_id, type, count, samples, masked)
      VALUES (?, ?, ?, ?, ?)
    `)
    for (const e of EVIDENCES) {
      insEv.run(e.ev_id, e.case_id, e.file_name, e.file_type, e.file_size, e.hash, e.source,
        e.classification, e.risk, e.preview_available, e.captured_at, e.origin, e.destination)
      for (const f of e.detectedFields) {
        insField.run(e.ev_id, f.type, f.count, JSON.stringify(f.samples), f.masked)
      }
    }

    // Policies
    const insPol = db.prepare(`
      INSERT INTO policies (id, code, name, description, category, severity, status, channels,
        action, owner, last_updated, trigger_count, notify_user, log_incident, send_for_review,
        notification_channel, include_attachments)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    for (const p of POLICIES) {
      insPol.run(p.id, p.code, p.name, p.description, p.category, p.severity, p.status,
        JSON.stringify(p.channels), p.action, p.owner, p.last_updated, p.trigger_count,
        p.notify_user, p.log_incident, p.send_for_review, p.notification_channel, p.include_attachments)
    }

    // AI analysis
    const insAI = db.prepare(`
      INSERT INTO ai_analyses (id, case_id, technical_summary, severity, policy_violated, destination,
        risk, impact, lgpd_basis, recommendation, business_risk, response_plan, control_improvements,
        false_positive_assessment, confidence_level, generated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    const a = AI_ANALYSIS
    insAI.run(a.id, a.case_id, a.technical_summary, a.severity, a.policy_violated, a.destination,
      a.risk, a.impact, a.lgpd_basis, a.recommendation, a.business_risk, a.response_plan,
      a.control_improvements, a.false_positive_assessment, a.confidence_level, a.generated_at)

    // Audit logs
    const insLog = db.prepare(`
      INSERT INTO audit_logs (id, case_id, actor, action, timestamp, details, type)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    for (const l of AUDIT_LOGS) {
      insLog.run(l.id, l.case_id, l.actor, l.action, l.timestamp, l.details, l.type)
    }

    // Mark seeded
    db.prepare("INSERT INTO settings (key, value) VALUES ('seeded', 'true')").run()

    db.exec('COMMIT')
    console.log('[LeakGuard] Database seeded successfully.')
  } catch (err) {
    db.exec('ROLLBACK')
    console.error('[LeakGuard] Seed failed:', err)
    throw err
  }
}

module.exports = { seedIfEmpty }
