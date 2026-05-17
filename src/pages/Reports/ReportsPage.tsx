import { useState } from 'react';
import {
  FileText, Download, FileSpreadsheet, Braces, Lock, Stamp,
  Paperclip, Shield, CheckCircle2, Clock, User, AlertTriangle,
  ChevronDown, ChevronUp, Eye,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { SeverityBadge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockReport, mockAuditLogs } from '@/data/mockData';
import { formatDateTime, formatDate } from '@/lib/utils';

const REPORT_TEMPLATES = [
  { id: 'full', label: 'Relatório de Incidente Completo', active: true },
  { id: 'executive', label: 'Resumo para Executivos', active: false },
  { id: 'lgpd', label: 'Relatório para Jurídico / LGPD', active: false },
  { id: 'technical', label: 'Relatório Técnico Detalhado', active: false },
];

type SectionKey = 'summary' | 'evidence' | 'data' | 'actions' | 'status' | 'decision';

export function ReportsPage() {
  const { selectedCase, cases } = useAppStore();
  const activeCase = selectedCase || cases[0];
  const report = mockReport;
  const [expandedSections, setExpandedSections] = useState<Set<SectionKey>>(
    new Set(['summary', 'evidence', 'data', 'actions', 'status', 'decision'])
  );
  const [selectedTemplate, setSelectedTemplate] = useState('full');
  const [options, setOptions] = useState({
    coverPage: true,
    attachments: true,
    digitalSign: false,
    encrypt: false,
  });

  const toggleSection = (s: SectionKey) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: template selector */}
      <div className="w-52 flex-shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-panel)] flex flex-col overflow-y-auto">
        <div className="px-4 py-3 border-b border-[var(--color-border)]">
          <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Modelos de Relatório</p>
        </div>
        <div className="flex-1 py-1">
          {REPORT_TEMPLATES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setSelectedTemplate(id)}
              className={`w-full text-left px-4 py-3 text-[10px] border-b border-[var(--color-border-subtle)] transition-colors hover:bg-[var(--color-bg-hover)] ${
                selectedTemplate === id
                  ? 'bg-[var(--color-bg-selected)] text-[var(--color-text-primary)] border-l-2 border-l-[var(--color-accent)]'
                  : 'text-[var(--color-text-secondary)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Audit timeline */}
        <div className="border-t border-[var(--color-border)] p-4">
          <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Trilha de Auditoria</p>
          <div className="space-y-0">
            {mockAuditLogs.slice(0, 4).map((log, i) => (
              <div key={log.id} className="flex gap-2">
                <div className="flex flex-col items-center">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1 ${
                    log.type === 'system' ? 'bg-[var(--color-accent-bright)]' : 'bg-[var(--color-lavender)]'
                  }`} />
                  {i < 3 && <div className="w-px flex-1 bg-[var(--color-border)] my-0.5" />}
                </div>
                <div className="pb-3 min-w-0">
                  <p className="text-[9px] font-medium text-[var(--color-text-secondary)] leading-snug">{log.action}</p>
                  <p className="text-[8px] text-[var(--color-text-muted)] font-mono">{formatDateTime(log.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center: report document */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="max-w-3xl mx-auto">
          {/* Document */}
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden">
            {/* Document header */}
            <div className="px-8 py-6 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--color-text-primary)]">LeakGuard</p>
                    <p className="text-[9px] text-[var(--color-text-muted)]">CaseDesk — Sistema DLP</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-[var(--color-lavender)]">RELATÓRIO DE INCIDENTE</p>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{formatDate(report.generatedAt)}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-[10px]">
                <div>
                  <p className="text-[var(--color-text-muted)]">ID do Incidente</p>
                  <p className="font-mono font-semibold text-[var(--color-lavender)]">{report.id}</p>
                </div>
                <div>
                  <p className="text-[var(--color-text-muted)]">Gerado por</p>
                  <p className="font-medium text-[var(--color-text-primary)]">{report.generatedBy}</p>
                  <p className="text-[var(--color-text-muted)]">{report.role}</p>
                </div>
                <div>
                  <p className="text-[var(--color-text-muted)]">Classificação</p>
                  <p className="font-semibold text-[var(--color-critical)] uppercase tracking-wide text-[9px]">
                    {report.classification}
                  </p>
                </div>
              </div>

              {activeCase && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--color-border)]">
                  <SeverityBadge severity={activeCase.severity} size="md" />
                  <StatusBadge status={activeCase.status} size="md" />
                  <span className="text-[10px] text-[var(--color-text-secondary)]">{activeCase.title}</span>
                </div>
              )}
            </div>

            {/* Report sections */}
            <div className="divide-y divide-[var(--color-border)]">
              {([
                {
                  key: 'summary' as SectionKey,
                  num: '1',
                  title: 'Resumo Executivo',
                  icon: <FileText className="w-3.5 h-3.5" />,
                  content: (
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{report.executiveSummary}</p>
                  ),
                },
                {
                  key: 'evidence' as SectionKey,
                  num: '2',
                  title: 'Evidências',
                  icon: <Paperclip className="w-3.5 h-3.5" />,
                  content: (
                    <ul className="space-y-2">
                      {report.evidences.map((ev, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]">
                          <span className="text-[var(--color-accent-bright)] font-mono text-[10px] mt-0.5">{i + 1}.</span>
                          <span className="leading-relaxed">{ev}</span>
                        </li>
                      ))}
                    </ul>
                  ),
                },
                {
                  key: 'data' as SectionKey,
                  num: '3',
                  title: 'Dados Envolvidos',
                  icon: <AlertTriangle className="w-3.5 h-3.5" />,
                  content: (
                    <ul className="space-y-1.5">
                      {report.dataInvolved.map((d, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-high)] flex-shrink-0" />
                          <span className="text-xs text-[var(--color-text-secondary)]">{d}</span>
                        </li>
                      ))}
                    </ul>
                  ),
                },
                {
                  key: 'actions' as SectionKey,
                  num: '4',
                  title: 'Ações Recomendadas',
                  icon: <CheckCircle2 className="w-3.5 h-3.5" />,
                  content: (
                    <ol className="space-y-2.5">
                      {report.recommendedActions.map((a, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-5 h-5 rounded-full bg-[var(--color-accent-muted)] border border-[var(--color-accent-border)] flex items-center justify-center flex-shrink-0 text-[9px] font-bold text-[var(--color-lavender)]">
                            {i + 1}
                          </span>
                          <span className="text-xs text-[var(--color-text-secondary)] leading-relaxed pt-0.5">{a}</span>
                        </li>
                      ))}
                    </ol>
                  ),
                },
                {
                  key: 'status' as SectionKey,
                  num: '5',
                  title: 'Status e Tratamento',
                  icon: <Clock className="w-3.5 h-3.5" />,
                  content: (
                    <div className="space-y-3">
                      <div>
                        <p className="text-[9px] text-[var(--color-text-muted)] mb-1">Status atual</p>
                        <p className="text-xs text-[var(--color-text-secondary)]">{report.status}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-[var(--color-text-muted)] mb-1">Medidas de contenção</p>
                        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{report.treatment}</p>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'decision' as SectionKey,
                  num: '6',
                  title: 'Decisão Final',
                  icon: <Stamp className="w-3.5 h-3.5" />,
                  content: (
                    <div className="px-3 py-2.5 rounded-lg bg-[var(--color-bg-elevated)] border-l-2 border-[var(--color-accent)]">
                      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{report.finalDecision}</p>
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[var(--color-border)]">
                        <User className="w-3 h-3 text-[var(--color-text-muted)]" />
                        <span className="text-[9px] text-[var(--color-text-muted)]">{report.generatedBy} — {formatDateTime(report.generatedAt)}</span>
                      </div>
                    </div>
                  ),
                },
              ]).map(({ key, num, title, icon, content }) => (
                <div key={key}>
                  <button
                    onClick={() => toggleSection(key)}
                    className="w-full flex items-center justify-between px-6 py-3 hover:bg-[var(--color-bg-hover)] transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-mono font-bold text-[var(--color-accent-bright)]">{num}.</span>
                      <span className="text-[var(--color-text-muted)]">{icon}</span>
                      <span className="text-xs font-semibold text-[var(--color-text-primary)] uppercase tracking-wide">{title}</span>
                    </div>
                    {expandedSections.has(key)
                      ? <ChevronUp className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                      : <ChevronDown className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                    }
                  </button>
                  {expandedSections.has(key) && (
                    <div className="px-6 pb-5 animate-fade-in">
                      {content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - export */}
      <div className="w-60 flex-shrink-0 border-l border-[var(--color-border)] bg-[var(--color-bg-panel)] flex flex-col overflow-y-auto">
        <div className="px-4 py-3 border-b border-[var(--color-border)]">
          <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Exportar Relatório</p>
          <div className="space-y-2">
            {[
              { icon: <FileText className="w-3.5 h-3.5 text-[var(--color-critical)]" />, label: 'Exportar PDF', sublabel: 'Alta qualidade, formatado' },
              { icon: <FileText className="w-3.5 h-3.5 text-[var(--color-low)]" />, label: 'Exportar DOCX', sublabel: 'Editável, Word' },
              { icon: <FileSpreadsheet className="w-3.5 h-3.5 text-[var(--color-success)]" />, label: 'Exportar XLSX', sublabel: 'Dados estruturados' },
              { icon: <Braces className="w-3.5 h-3.5 text-[var(--color-medium)]" />, label: 'Exportar JSON', sublabel: 'Integração / API' },
            ].map(({ icon, label, sublabel }) => (
              <button
                key={label}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[var(--color-bg-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent-border)] hover:bg-[var(--color-bg-hover)] transition-all group"
              >
                {icon}
                <div className="text-left">
                  <p className="text-[10px] font-medium text-[var(--color-text-primary)]">{label}</p>
                  <p className="text-[9px] text-[var(--color-text-muted)]">{sublabel}</p>
                </div>
                <Download className="w-3 h-3 text-[var(--color-text-muted)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-3 border-b border-[var(--color-border)]">
          <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Opções de exportação</p>
          <div className="space-y-2.5">
            {([
              { key: 'coverPage', label: 'Incluir capa e metadados' },
              { key: 'attachments', label: 'Incluir anexos como apêndice' },
              { key: 'digitalSign', label: 'Assinar digitalmente' },
              { key: 'encrypt', label: 'Criptografar arquivo' },
            ] as const).map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() => setOptions((prev) => ({ ...prev, [key]: !prev[key] }))}
                  className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                    options[key]
                      ? 'bg-[var(--color-accent)] border-[var(--color-accent)]'
                      : 'bg-[var(--color-bg-surface)] border-[var(--color-border-strong)]'
                  }`}
                >
                  {options[key] && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <span className="text-[10px] text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="px-4 py-3 border-b border-[var(--color-border)]">
          <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Ações rápidas</p>
          <div className="space-y-2">
            <Button variant="primary" size="sm" className="w-full">
              <Eye className="w-3 h-3" />
              Pré-visualizar
            </Button>
            <Button variant="secondary" size="sm" className="w-full">
              <Stamp className="w-3 h-3" />
              Assinar e Finalizar
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              <Lock className="w-3 h-3" />
              Enviar ao DPO
            </Button>
          </div>
        </div>

        <div className="px-4 py-3">
          <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Versão do relatório</p>
          <div className="space-y-1">
            {[
              { v: 'v1.3', date: '17/05 10:30', active: true },
              { v: 'v1.2', date: '17/05 09:45', active: false },
              { v: 'v1.1', date: '17/05 09:20', active: false },
            ].map(({ v, date, active }) => (
              <div key={v} className={`flex items-center justify-between px-2 py-1.5 rounded ${active ? 'bg-[var(--color-accent-muted)] border border-[var(--color-accent-border)]' : ''}`}>
                <span className={`text-[10px] font-mono font-medium ${active ? 'text-[var(--color-lavender)]' : 'text-[var(--color-text-muted)]'}`}>{v}</span>
                <span className="text-[9px] text-[var(--color-text-muted)]">{date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
