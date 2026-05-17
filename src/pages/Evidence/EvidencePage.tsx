import { useState } from 'react';
import {
  FileSpreadsheet, FileText, Search, Download, Eye, EyeOff,
  Hash, Shield, AlertTriangle, ArrowRight, Tag, Info,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { SeverityBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDateTime } from '@/lib/utils';

const fileTypeIcon = (type: string) => {
  switch (type) {
    case 'XLSX': return <FileSpreadsheet className="w-4 h-4 text-[#22C55E]" />;
    default: return <FileText className="w-4 h-4 text-[var(--color-text-muted)]" />;
  }
};

const classificationColor: Record<string, string> = {
  restricted: 'text-[var(--color-critical)] bg-[var(--color-critical-muted)] border-[var(--color-critical-border)]',
  confidential: 'text-[var(--color-high)] bg-[var(--color-high-muted)] border-[var(--color-high-border)]',
  internal: 'text-[var(--color-medium)] bg-[var(--color-medium-muted)] border-[var(--color-medium-border)]',
  public: 'text-[var(--color-success)] bg-[var(--color-success-muted)] border-[var(--color-success-border)]',
};

const classificationLabel: Record<string, string> = {
  restricted: 'RESTRITO',
  confidential: 'CONFIDENCIAL',
  internal: 'INTERNO',
  public: 'PÚBLICO',
};

export function EvidencePage() {
  const { selectedCase, cases, evidences } = useAppStore();
  const activeCase = selectedCase || cases[0];
  const [masked, setMasked] = useState(true);
  const [selectedEvidence, setSelectedEvidence] = useState(evidences[0] ?? null);
  const [search, setSearch] = useState('');

  const allEvidence = search
    ? evidences.filter((e) =>
        e.fileName.toLowerCase().includes(search.toLowerCase()) ||
        e.hash.toLowerCase().includes(search.toLowerCase())
      )
    : evidences;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg-panel)]">
          <div>
            <h1 className="text-sm font-semibold text-[var(--color-text-primary)]">Evidências e Artefatos</h1>
            {activeCase && (
              <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                {activeCase.id} — {activeCase.title}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMasked(!masked)}
              className="flex items-center gap-1.5 h-7 px-3 rounded bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
            >
              {masked ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              {masked ? 'Revelar dados' : 'Mascarar dados'}
            </button>
            <Button variant="primary" size="sm">
              <Download className="w-3.5 h-3.5" />
              Exportar evidências
            </Button>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex-shrink-0 flex items-center gap-2 px-5 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg-panel)]">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar artefatos por nome, hash, origem..."
              className="w-full h-7 pl-8 pr-3 rounded bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-border)] transition-colors"
            />
          </div>
        </div>

        {/* File table */}
        <div className="flex-shrink-0">
          <div className="grid grid-cols-[32px_1fr_80px_80px_80px_90px_80px] gap-3 px-5 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg-panel)]">
            {['', 'Arquivo', 'Tipo', 'Tamanho', 'Classificação', 'Risco', 'Capturado em'].map((h) => (
              <span key={h} className="text-[9px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">{h}</span>
            ))}
          </div>
          {allEvidence.map((ev) => (
            <button
              key={ev.id}
              onClick={() => setSelectedEvidence(ev)}
              className={`w-full grid grid-cols-[32px_1fr_80px_80px_80px_90px_80px] gap-3 px-5 py-3 border-b border-[var(--color-border-subtle)] text-left transition-colors hover:bg-[var(--color-bg-hover)] ${
                selectedEvidence.id === ev.id ? 'bg-[var(--color-bg-selected)] border-l-2 border-l-[var(--color-accent)]' : ''
              }`}
            >
              <div className="flex items-center">{fileTypeIcon(ev.fileType)}</div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-[var(--color-text-primary)] truncate">{ev.fileName}</p>
                <p className="text-[9px] font-mono text-[var(--color-text-muted)] truncate mt-0.5">{ev.hash.slice(0, 24)}...</p>
              </div>
              <div className="flex items-center">
                <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">{ev.fileType}</span>
              </div>
              <div className="flex items-center">
                <span className="text-[10px] text-[var(--color-text-secondary)]">{ev.fileSize}</span>
              </div>
              <div className="flex items-center">
                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${classificationColor[ev.classification]}`}>
                  {classificationLabel[ev.classification]}
                </span>
              </div>
              <div className="flex items-center">
                <SeverityBadge severity={ev.risk} />
              </div>
              <div className="flex items-center">
                <span className="text-[9px] text-[var(--color-text-muted)]">{formatDateTime(ev.capturedAt).split(' ')[1]}</span>
              </div>
            </button>
          ))}
        </div>

        {/* XLSX preview */}
        {selectedEvidence.fileType === 'XLSX' && (
          <div className="flex-1 overflow-y-auto p-5">
            <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span className="text-xs font-medium text-[var(--color-text-primary)]">
                    Pré-visualização — {selectedEvidence.fileName}
                  </span>
                </div>
                <span className="text-[10px] text-[var(--color-high)] flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Dados sensíveis detectados
                </span>
              </div>

              {/* Sheet tabs */}
              <div className="flex items-center gap-0 px-4 pt-2 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
                {['clientes', 'resumo', 'contratos'].map((sheet, i) => (
                  <button
                    key={sheet}
                    className={`px-3 py-1.5 text-[10px] font-medium border-b-2 transition-colors ${
                      i === 0
                        ? 'border-[var(--color-accent)] text-[var(--color-lavender)]'
                        : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                    }`}
                  >
                    {sheet}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[var(--color-bg-elevated)]">
                      {['ID', 'Nome Completo', 'CPF', 'E-mail', 'Telefone', 'Contrato', 'Valor', 'Data'].map((h) => (
                        <th key={h} className="px-3 py-2 text-left text-[9px] font-medium text-[var(--color-text-muted)] border-b border-r border-[var(--color-border)] last:border-r-0 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-elevated)] transition-colors">
                        <td className="px-3 py-1.5 text-[10px] font-mono text-[var(--color-text-muted)] border-r border-[var(--color-border-subtle)]">{String(i + 1).padStart(4, '0')}</td>
                        <td className={`px-3 py-1.5 text-[10px] border-r border-[var(--color-border-subtle)] ${masked ? 'blur-[3px] select-none' : ''} text-[var(--color-text-secondary)]`}>
                          {['Ana Lima Silva', 'Carlos Eduardo Rocha', 'Maria Aparecida Santos', 'João Pedro Silva', 'Beatriz Costa Alves', 'Roberto Ferreira Alves', 'Fernanda Lima', 'Paulo Rodrigues'][i]}
                        </td>
                        <td className={`px-3 py-1.5 text-[10px] font-mono border-r border-[var(--color-border-subtle)] ${masked ? 'blur-[3px] select-none text-[var(--color-text-secondary)]' : 'text-[var(--color-high)]'}`}>
                          {['321.456.789-09', '987.654.321-00', '123.456.789-01', '456.789.012-03', '789.012.345-06', '012.345.678-09', '345.678.901-02', '678.901.234-05'][i]}
                        </td>
                        <td className={`px-3 py-1.5 text-[10px] border-r border-[var(--color-border-subtle)] ${masked ? 'blur-[3px] select-none' : ''} text-[var(--color-text-secondary)]`}>
                          {['ana@gmail.com', 'carlos@hotmail.com', 'maria@uol.com.br', 'joao@yahoo.com', 'bia@gmail.com', 'rob@outlook.com', 'fer@gmail.com', 'paulo@yahoo.com'][i]}
                        </td>
                        <td className={`px-3 py-1.5 text-[10px] font-mono border-r border-[var(--color-border-subtle)] ${masked ? 'blur-[3px] select-none' : ''} text-[var(--color-text-secondary)]`}>
                          {['(11) 98765-4321', '(21) 91234-5678', '(31) 97654-3210', '(41) 96543-2109', '(51) 95432-1098', '(61) 94321-0987', '(71) 93210-9876', '(81) 92109-8765'][i]}
                        </td>
                        <td className="px-3 py-1.5 text-[10px] font-mono text-[var(--color-text-secondary)] border-r border-[var(--color-border-subtle)]">CTR-2024-{String(i + 1).padStart(3, '0')}</td>
                        <td className={`px-3 py-1.5 text-[10px] font-mono border-r border-[var(--color-border-subtle)] ${masked ? 'blur-[3px] select-none' : ''} text-[var(--color-text-secondary)]`}>
                          R$ {[1200, 3450, 890, 5670, 2340, 7890, 1560, 4230][i].toLocaleString('pt-BR')}
                        </td>
                        <td className="px-3 py-1.5 text-[10px] text-[var(--color-text-muted)]">
                          {['12/01/2025', '15/01/2025', '18/01/2025', '22/01/2025', '25/01/2025', '28/01/2025', '30/01/2025', '03/02/2025'][i]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-4 py-2 bg-[var(--color-bg-elevated)] text-[9px] text-[var(--color-text-muted)] border-t border-[var(--color-border)]">
                  Exibindo 8 de 847 registros — dados {masked ? 'mascarados' : 'revelados'} pelo analista
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right panel - classification */}
      <div className="w-64 flex-shrink-0 border-l border-[var(--color-border)] bg-[var(--color-bg-panel)] flex flex-col overflow-y-auto">
        <div className="px-4 py-3 border-b border-[var(--color-border)]">
          <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Classificação do Dado</p>
          <div className={`px-2 py-1.5 rounded border text-center mb-3 ${classificationColor[selectedEvidence.classification]}`}>
            <p className="text-xs font-bold tracking-widest">{classificationLabel[selectedEvidence.classification]}</p>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-[var(--color-border)]">
          <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Categorias aplicáveis</p>
          <div className="space-y-1.5">
            {['Dados Pessoais (LGPD)', 'Dados Financeiros', 'PII — Identificação', 'Dados Contratuais'].map((cat) => (
              <div key={cat} className="flex items-center gap-2">
                <Tag className="w-3 h-3 text-[var(--color-lavender)]" />
                <span className="text-[10px] text-[var(--color-text-secondary)]">{cat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-3 border-b border-[var(--color-border)]">
          <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Impacto estimado</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[10px] text-[var(--color-text-muted)]">Titulares afetados</span>
              <span className="text-[10px] font-semibold text-[var(--color-high)]">847</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-[var(--color-text-muted)]">Tipos de dado</span>
              <span className="text-[10px] font-semibold text-[var(--color-text-primary)]">5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-[var(--color-text-muted)]">Risco LGPD</span>
              <span className="text-[10px] font-semibold text-[var(--color-critical)]">Alto</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-[var(--color-border)]">
          <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Cadeia de evidência</p>
          <div className="space-y-2">
            {[
              { label: 'Origem', value: 'CRM Salesforce' },
              { label: 'Transporte', value: 'SMTP / Email Gateway' },
              { label: 'Interceptação', value: 'DLP Policy DLP-003' },
              { label: 'Destino', value: 'fornecedor@contabilidade-exata.com.br' },
            ].map(({ label, value }, i, arr) => (
              <div key={label} className="flex gap-2">
                <div className="flex flex-col items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-bright)] mt-1 flex-shrink-0" />
                  {i < arr.length - 1 && <div className="w-px flex-1 bg-[var(--color-border)] my-0.5" />}
                </div>
                <div className="pb-2">
                  <p className="text-[9px] text-[var(--color-text-muted)]">{label}</p>
                  <p className="text-[10px] text-[var(--color-text-secondary)]">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-3">
          <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Integridade</p>
          <div className="space-y-1.5">
            {[
              { label: 'Hash verificado', ok: true },
              { label: 'Metadados preservados', ok: true },
              { label: 'Cadeia de custódia', ok: true },
              { label: 'Assinatura digital', ok: false },
            ].map(({ label, ok }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-[10px] text-[var(--color-text-muted)]">{label}</span>
                <span className={`text-[10px] font-medium ${ok ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'}`}>
                  {ok ? '✓ OK' : '— N/A'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
