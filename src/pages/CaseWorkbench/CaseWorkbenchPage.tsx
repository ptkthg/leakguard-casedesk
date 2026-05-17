import { useState } from 'react';
import {
  Mail, Paperclip, User, Clock, Server, Hash,
  FileSpreadsheet, Eye, EyeOff, ArrowRight,
  Brain, AlertCircle, CheckCircle2, FileDown, Shield,
  MoreHorizontal,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { SeverityBadge, StatusBadge, ChannelBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockAIAnalysis } from '@/data/mockData';
import { formatDateTime } from '@/lib/utils';
import type { Severity } from '@/types';

export function CaseWorkbenchPage() {
  const { selectedCase, cases, evidences, auditLogs, openCaseWorkbench, updateCaseStatus, navigate } = useAppStore();
  const activeCase = selectedCase || cases[0];

  const [masked, setMasked] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'timeline' | 'actions'>('overview');

  if (!activeCase) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-sm text-[var(--color-text-muted)]">Nenhum caso selecionado.</p>
          <Button variant="outline" size="md" onClick={() => navigate('inbox')} className="mt-3">
            Ir para Casos Recebidos
          </Button>
        </div>
      </div>
    );
  }

  const evidence = evidences.find((e) => e.caseId === activeCase.id) || evidences[0];
  const ai = mockAIAnalysis;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: Case list mini */}
      <div className="w-52 flex-shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-panel)] flex flex-col overflow-hidden">
        <div className="px-3 py-3 border-b border-[var(--color-border)]">
          <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Casos abertos</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {cases.map((c) => (
            <button
              key={c.id}
              onClick={() => openCaseWorkbench(c)}
              className={`w-full text-left px-3 py-3 border-b border-[var(--color-border-subtle)] transition-colors hover:bg-[var(--color-bg-hover)] ${
                activeCase.id === c.id ? 'bg-[var(--color-bg-selected)] border-l-2 border-l-[var(--color-accent)]' : ''
              }`}
            >
              <p className="text-[10px] font-mono text-[var(--color-lavender)]">{c.id}</p>
              <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5 line-clamp-2 leading-snug">{c.title}</p>
              <div className="mt-1.5">
                <SeverityBadge severity={c.severity} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main workbench area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Case header */}
        <div className="flex-shrink-0 px-5 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg-panel)]">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-semibold text-[var(--color-lavender)]">{activeCase.id}</span>
              <SeverityBadge severity={activeCase.severity} size="md" />
              <StatusBadge status={activeCase.status} size="md" />
              <ChannelBadge channel={activeCase.sourceChannel} />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">{activeCase.title}</h2>
          <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
            {activeCase.user} • {activeCase.device} • {activeCase.department} • {formatDateTime(activeCase.receivedAt)}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 flex items-center gap-0 px-5 border-b border-[var(--color-border)] bg-[var(--color-bg-panel)]">
          {([
            { key: 'overview', label: 'Visão Geral' },
            { key: 'evidence', label: 'Evidência Bruta' },
            { key: 'timeline', label: 'Linha do Tempo' },
            { key: 'actions', label: 'Ações' },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                activeTab === key
                  ? 'border-[var(--color-accent)] text-[var(--color-lavender)]'
                  : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'overview' && (
            <>
              {/* Top row: Evidence + Detected data */}
              <div className="grid grid-cols-2 gap-4">
                {/* Evidence bruta */}
                <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                      <span className="text-xs font-medium text-[var(--color-text-primary)]">Evidência Bruta</span>
                    </div>
                    <span className="text-[10px] text-[var(--color-text-muted)]">E-mail interceptado</span>
                  </div>
                  <div className="p-4 space-y-2.5">
                    {[
                      { label: 'Remetente', value: activeCase.user, icon: User },
                      { label: 'Destinatário', value: activeCase.destination, icon: Server },
                      { label: 'Assunto', value: `Fwd: ${activeCase.title}`, icon: Mail },
                      { label: 'Anexo', value: evidence.fileName, icon: Paperclip },
                      { label: 'Data/Hora', value: formatDateTime(activeCase.receivedAt), icon: Clock },
                      { label: 'Message-ID', value: '<msg-2048@smtp.empresa.com>', icon: Hash },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="flex items-start gap-2">
                        <Icon className="w-3 h-3 text-[var(--color-text-muted)] mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-wider">{label}</p>
                          <p className="text-[10px] text-[var(--color-text-secondary)] font-medium truncate">{value}</p>
                        </div>
                      </div>
                    ))}
                    <div className="mt-3 p-2.5 rounded bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">
                      <p className="text-[9px] text-[var(--color-text-muted)] mb-1">Corpo do e-mail</p>
                      <p className="text-[10px] text-[var(--color-text-secondary)] leading-relaxed">
                        "Segue planilha com dados de clientes para o fechamento do mês de maio. Por favor confirmar recebimento."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sensitive data detected */}
                <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-[var(--color-high)]" />
                      <span className="text-xs font-medium text-[var(--color-text-primary)]">Dados Sensíveis Detectados</span>
                    </div>
                    <button
                      onClick={() => setMasked(!masked)}
                      className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
                    >
                      {masked ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {masked ? 'Revelar' : 'Mascarar'}
                    </button>
                  </div>
                  <div className="p-4 space-y-2">
                    {evidence.detectedFields.map((field) => (
                      <div
                        key={field.type}
                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)]"
                      >
                        <div>
                          <p className="text-xs font-medium text-[var(--color-text-primary)]">{field.type}</p>
                          <p className={`text-[10px] text-[var(--color-text-muted)] mt-0.5 font-mono ${masked ? 'blur-[3px]' : ''} transition-all`}>
                            {field.samples[0]}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[var(--color-high)]">{field.count}</p>
                          <p className="text-[9px] text-[var(--color-text-muted)]">registros</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Event flow */}
              <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--color-border)]">
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                  <span className="text-xs font-medium text-[var(--color-text-primary)]">Fluxo do Evento</span>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-0 overflow-x-auto">
                    {[
                      { label: 'Usuário', value: 'mariana.silva', icon: User, color: 'var(--color-accent-bright)' },
                      { label: 'Arquivo', value: 'clientes_maio_2025.xlsx', icon: FileSpreadsheet, color: 'var(--color-lavender)' },
                      { label: 'Canal', value: 'Email / SMTP', icon: Mail, color: 'var(--color-medium)' },
                      { label: 'Destino', value: 'fornecedor@contabilidade-exata.com.br', icon: Server, color: 'var(--color-high)' },
                      { label: 'Política', value: 'DLP-003', icon: Shield, color: 'var(--color-critical)' },
                      { label: 'Risco', value: 'Alto', icon: AlertCircle, color: 'var(--color-critical)' },
                    ].map(({ label, value, icon: Icon, color }, i, arr) => (
                      <div key={label} className="flex items-center">
                        <div className="flex flex-col items-center min-w-[110px]">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center border-2 mb-2"
                            style={{ borderColor: color, backgroundColor: `${color}15` }}
                          >
                            <Icon style={{ width: 14, height: 14, color }} />
                          </div>
                          <p className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-wider mb-0.5">{label}</p>
                          <p className="text-[10px] font-medium text-[var(--color-text-secondary)] text-center px-1 leading-tight">{value}</p>
                        </div>
                        {i < arr.length - 1 && (
                          <div className="flex items-center px-1 mb-8">
                            <div className="w-6 h-px bg-[var(--color-border-strong)]" />
                            <ArrowRight className="w-2.5 h-2.5 text-[var(--color-text-muted)] -ml-0.5" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Verdict */}
              <AIVerdictCard analysis={ai} />
            </>
          )}

          {activeTab === 'evidence' && <EvidenceTab evidence={evidence} masked={masked} setMasked={setMasked} />}

          {activeTab === 'timeline' && <TimelineTab logs={auditLogs} />}

          {activeTab === 'actions' && <ActionsTab caseId={activeCase.id} onContain={() => updateCaseStatus(activeCase.id, 'contained')} />}
        </div>
      </div>

      {/* Right panel - AI + actions */}
      <div className="w-64 flex-shrink-0 border-l border-[var(--color-border)] bg-[var(--color-bg-panel)] flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-[var(--color-border)]">
          <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Parecer da IA</p>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--color-high-muted)] border border-[var(--color-high-border)]">
              <AlertCircle className="w-3 h-3 text-[var(--color-high)]" />
              <span className="text-[10px] font-medium text-[var(--color-high)]">Risco Alto</span>
            </div>
            <span className="text-[10px] text-[var(--color-text-muted)]">{ai.confidenceLevel}% conf.</span>
          </div>
          <p className="text-[10px] text-[var(--color-text-secondary)] leading-relaxed line-clamp-4">
            {ai.technicalSummary}
          </p>
        </div>

        <div className="p-4 border-b border-[var(--color-border)]">
          <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Base Legal</p>
          <p className="text-[10px] text-[var(--color-lavender)] leading-relaxed">{ai.lgpdBasis}</p>
        </div>

        <div className="p-4 border-b border-[var(--color-border)]">
          <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Política violada</p>
          <div className="px-2 py-1.5 rounded bg-[var(--color-accent-muted)] border border-[var(--color-accent-border)]">
            <p className="text-[10px] font-mono font-medium text-[var(--color-lavender)]">{activeCase.policyViolated}</p>
          </div>
        </div>

        <div className="p-4 space-y-2 mt-auto">
          <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Ações do Analista</p>
          <Button variant="primary" size="sm" className="w-full" onClick={() => navigate('reports')}>
            <FileDown className="w-3 h-3" />
            Gerar Relatório
          </Button>
          <Button variant="secondary" size="sm" className="w-full" onClick={() => updateCaseStatus(activeCase.id, 'contained')}>
            <CheckCircle2 className="w-3 h-3" />
            Marcar como Contido
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            <FileDown className="w-3 h-3" />
            Exportar Evidências
          </Button>
        </div>
      </div>
    </div>
  );
}

function AIVerdictCard({ analysis }: { analysis: typeof mockAIAnalysis }) {
  return (
    <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <Brain className="w-3.5 h-3.5 text-[var(--color-lavender)]" />
          <span className="text-xs font-medium text-[var(--color-text-primary)]">Parecer Técnico — LeakGuard AI</span>
        </div>
        <span className="text-[10px] text-[var(--color-text-muted)]">{analysis.confidenceLevel}% confiança</span>
      </div>
      <div className="p-4 grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <p className="text-[10px] text-[var(--color-text-secondary)] leading-relaxed">{analysis.technicalSummary}</p>
        </div>
        <div>
          <p className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Severidade</p>
          <SeverityBadge severity={analysis.severity as Severity} size="md" />
        </div>
        <div>
          <p className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Política violada</p>
          <p className="text-[10px] font-mono text-[var(--color-lavender)]">{analysis.policyViolated}</p>
        </div>
        <div className="col-span-2">
          <p className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Base legal LGPD</p>
          <p className="text-[10px] text-[var(--color-text-secondary)]">{analysis.lgpdBasis}</p>
        </div>
        <div className="col-span-2">
          <p className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Recomendação</p>
          <p className="text-[10px] text-[var(--color-text-secondary)] leading-relaxed">{analysis.recommendation}</p>
        </div>
      </div>
    </div>
  );
}

import type { Evidence } from '@/types';

function EvidenceTab({ evidence, masked, setMasked }: {
  evidence: Evidence;
  masked: boolean;
  setMasked: (v: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[var(--color-success)]" />
            <span className="text-xs font-medium text-[var(--color-text-primary)]">{evidence.fileName}</span>
            <span className="text-[10px] text-[var(--color-text-muted)]">{evidence.fileSize}</span>
          </div>
          <button onClick={() => setMasked(!masked)} className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]">
            {masked ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            {masked ? 'Revelar dados' : 'Mascarar'}
          </button>
        </div>
        {/* Mock XLSX preview */}
        <div className="rounded border border-[var(--color-border)] overflow-hidden">
          <div className="flex bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)]">
            {['#', 'Nome', 'CPF', 'E-mail', 'Telefone', 'Contrato'].map((h) => (
              <div key={h} className="flex-1 px-2 py-1.5 text-[9px] font-medium text-[var(--color-text-muted)] border-r border-[var(--color-border)] last:border-r-0">
                {h}
              </div>
            ))}
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-elevated)] transition-colors">
              <div className="flex-1 px-2 py-1.5 text-[9px] text-[var(--color-text-muted)] border-r border-[var(--color-border-subtle)]">{i + 1}</div>
              {[
                `${masked ? '███████ ██████' : ['Ana Lima', 'Carlos Rocha', 'Maria Santos', 'João Silva', 'Beatriz Costa', 'Roberto Alves'][i]}`,
                masked ? '***.***.***-**' : ['321.456.789-09', '987.654.321-00', '123.456.789-01', '456.789.012-03', '789.012.345-06', '012.345.678-09'][i],
                masked ? 'u***@***.com' : ['ana@email.com', 'carlos@mail.com', 'maria@gmail.com', 'joao@hotmail.com', 'bia@uol.com.br', 'rob@gmail.com'][i],
                masked ? '(11) 9****-****' : ['(11) 98765-4321', '(21) 91234-5678', '(31) 97654-3210', '(41) 96543-2109', '(51) 95432-1098', '(61) 94321-0987'][i],
                `CTR-2024-${String(i + 1).padStart(3, '0')}`,
              ].map((cell, ci) => (
                <div
                  key={ci}
                  className={`flex-1 px-2 py-1.5 text-[9px] font-mono border-r border-[var(--color-border-subtle)] last:border-r-0 ${
                    ci === 1 ? 'text-[var(--color-high)]' : 'text-[var(--color-text-secondary)]'
                  } ${masked && ci !== 0 && ci !== 4 ? 'select-none' : ''}`}
                >
                  {cell}
                </div>
              ))}
            </div>
          ))}
          <div className="px-3 py-2 bg-[var(--color-bg-elevated)] text-[9px] text-[var(--color-text-muted)]">
            ... e mais 841 registros • Total: 847 linhas
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg p-4">
        <p className="text-[10px] font-medium text-[var(--color-text-muted)] mb-2">Metadados do arquivo</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Hash SHA-256', value: evidence.hash.slice(0, 40) + '...' },
            { label: 'Origem', value: evidence.source },
            { label: 'Classificação', value: 'RESTRITO' },
            { label: 'Capturado em', value: formatDateTime(evidence.capturedAt) },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-wider">{label}</p>
              <p className="text-[10px] font-mono text-[var(--color-text-secondary)] mt-0.5 break-all">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineTab({ logs }: { logs: { id: string; actor: string; action: string; details: string; timestamp: string; type: string }[] }) {
  return (
    <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg p-4">
      <p className="text-xs font-medium text-[var(--color-text-primary)] mb-4">Linha do tempo do incidente</p>
      <div className="space-y-0">
        {logs.map((log, i: number) => (
          <div key={log.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${
                log.type === 'system' ? 'bg-[var(--color-accent-bright)]' :
                log.type === 'analyst' ? 'bg-[var(--color-lavender)]' :
                'bg-[var(--color-medium)]'
              }`} />
              {i < logs.length - 1 && <div className="w-px flex-1 bg-[var(--color-border)] my-1" />}
            </div>
            <div className="pb-4 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-medium text-[var(--color-text-primary)]">{log.action}</span>
                <span className="text-[9px] text-[var(--color-text-muted)]">• {log.actor}</span>
              </div>
              <p className="text-[10px] text-[var(--color-text-muted)] leading-relaxed">{log.details}</p>
              <p className="text-[9px] text-[var(--color-text-muted)] mt-0.5 font-mono">{formatDateTime(log.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionsTab({ caseId, onContain }: { caseId: string; onContain: () => void }) {
  const navigate = useAppStore((s) => s.navigate);
  return (
    <div className="grid grid-cols-2 gap-4">
      {[
        {
          title: 'Gerar Relatório Formal',
          desc: 'Cria relatório PDF/DOCX com evidências e parecer IA para registro oficial.',
          action: () => navigate('reports'),
          variant: 'primary' as const,
          label: 'Gerar Relatório',
        },
        {
          title: 'Marcar como Contido',
          desc: 'Registra que o incidente foi tratado e os dados não foram comprometidos.',
          action: onContain,
          variant: 'secondary' as const,
          label: 'Marcar Contido',
        },
        {
          title: 'Exportar Evidências',
          desc: 'Exporta todos os artefatos com hash SHA-256 para cadeia de custódia.',
          action: () => {},
          variant: 'outline' as const,
          label: 'Exportar ZIP',
        },
        {
          title: 'Consultar Copilot IA',
          desc: 'Abre o Copilot para geração de plano de resposta, relatório executivo, etc.',
          action: () => navigate('copilot'),
          variant: 'outline' as const,
          label: 'Abrir Copilot',
        },
      ].map(({ title, desc, action, variant, label }) => (
        <div key={title} className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg p-4">
          <h3 className="text-xs font-semibold text-[var(--color-text-primary)] mb-1.5">{title}</h3>
          <p className="text-[10px] text-[var(--color-text-muted)] leading-relaxed mb-3">{desc}</p>
          <Button variant={variant} size="sm" onClick={action}>
            {label}
          </Button>
        </div>
      ))}
    </div>
  );
}
