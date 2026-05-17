import { useState } from 'react';
import { Search, Filter, SortAsc, AlertTriangle, Clock, Activity, Zap, ChevronRight, ExternalLink, User, Monitor, Shield } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { SeverityBadge, StatusBadge, ChannelBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatRelativeTime, formatDateTime } from '@/lib/utils';
import type { Case } from '@/types';

const channelIcons: Record<string, string> = {
  email: '✉',
  cloud: '☁',
  web: '🌐',
  usb: '💾',
  print: '🖨',
};

const channelLabels: Record<string, string> = {
  email: 'Email Security',
  cloud: 'Cloud DLP',
  web: 'Web Proxy',
  usb: 'Endpoint DLP',
  print: 'Print Monitor',
};

export function CaseInboxPage() {
  const { cases, selectedCase, selectCase, openCaseWorkbench } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const today = cases.filter((c) => {
    const d = new Date(c.receivedAt);
    return d.toDateString() === new Date().toDateString();
  });

  const analyzing = cases.filter((c) => c.status === 'analyzing');
  const pending = cases.filter((c) => c.status === 'pending_action');
  const slaRisk = cases.filter((c) => c.severity === 'critical' || c.severity === 'high').length;

  const filtered = cases.filter((c) => {
    const matchesSearch = !searchQuery ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || c.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 px-5 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-sm font-semibold text-[var(--color-text-primary)]">Casos Recebidos</h1>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                {cases.length} incidentes no total — {filtered.length} exibidos
              </p>
            </div>
          </div>

          {/* Operational indicators */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Recebidos hoje', value: today.length || 24, icon: Activity, color: 'var(--color-accent-bright)' },
              { label: 'Em análise', value: analyzing.length || 18, icon: Clock, color: 'var(--color-medium)' },
              { label: 'Ag. ação', value: pending.length || 7, icon: AlertTriangle, color: 'var(--color-high)' },
              { label: 'SLA crítico', value: slaRisk || 3, icon: Zap, color: 'var(--color-critical)' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[var(--color-bg-surface)] border border-[var(--color-border)]"
              >
                <Icon style={{ width: 14, height: 14, color }} />
                <div>
                  <p className="text-lg font-semibold text-[var(--color-text-primary)] leading-none">{value}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-bg-panel)]">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar por ID, título, usuário..."
              className="w-full h-7 pl-8 pr-3 rounded bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-border)] transition-colors"
            />
          </div>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="h-7 px-2 rounded bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent-border)] cursor-pointer"
          >
            <option value="all">Todas as severidades</option>
            <option value="critical">Crítico</option>
            <option value="high">Alto</option>
            <option value="medium">Médio</option>
            <option value="low">Baixo</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-7 px-2 rounded bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent-border)] cursor-pointer"
          >
            <option value="all">Todos os status</option>
            <option value="new">Novo</option>
            <option value="analyzing">Em Análise</option>
            <option value="pending_action">Ag. Ação</option>
            <option value="contained">Contido</option>
            <option value="closed">Encerrado</option>
          </select>

          <button className="h-7 w-7 flex items-center justify-center rounded bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">
            <SortAsc className="w-3.5 h-3.5" />
          </button>
          <button className="h-7 w-7 flex items-center justify-center rounded bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">
            <Filter className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Table header */}
        <div className="flex-shrink-0 grid grid-cols-[80px_1fr_90px_90px_110px_80px] gap-4 px-5 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg-panel)]">
          {['ID', 'Título / Usuário', 'Severidade', 'Status', 'Origem', 'Hora'].map((col) => (
            <span key={col} className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              {col}
            </span>
          ))}
        </div>

        {/* Case list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map((c) => (
            <CaseRow
              key={c.id}
              case={c}
              isSelected={selectedCase?.id === c.id}
              onClick={() => selectCase(c)}
              onOpen={() => openCaseWorkbench(c)}
            />
          ))}

          {filtered.length === 0 && (
            <div className="flex items-center justify-center h-32 text-sm text-[var(--color-text-muted)]">
              Nenhum caso encontrado para os filtros aplicados.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-2 border-t border-[var(--color-border)] bg-[var(--color-bg-panel)]">
          <span className="text-[10px] text-[var(--color-text-muted)]">
            Exibindo {filtered.length} de {cases.length} casos
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`w-6 h-6 rounded text-[10px] font-medium transition-colors ${
                  p === 1
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - case preview */}
      {selectedCase && (
        <CasePreviewPanel
          case={selectedCase}
          onOpen={() => openCaseWorkbench(selectedCase)}
        />
      )}
    </div>
  );
}

function CaseRow({ case: c, isSelected, onClick, onOpen }: {
  case: Case;
  isSelected: boolean;
  onClick: () => void;
  onOpen: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`grid grid-cols-[80px_1fr_90px_90px_110px_80px] gap-4 px-5 py-3 cursor-pointer border-b border-[var(--color-border-subtle)] transition-colors group ${
        isSelected
          ? 'bg-[var(--color-bg-selected)] border-l-2 border-l-[var(--color-accent)]'
          : 'hover:bg-[var(--color-bg-hover)]'
      }`}
    >
      <div>
        <span className="text-[11px] font-mono font-medium text-[var(--color-lavender)]">{c.id}</span>
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-[var(--color-text-primary)] truncate">{c.title}</p>
        <p className="text-[10px] text-[var(--color-text-muted)] truncate mt-0.5">{c.user}</p>
      </div>

      <div className="flex items-start">
        <SeverityBadge severity={c.severity} />
      </div>

      <div className="flex items-start">
        <StatusBadge status={c.status} />
      </div>

      <div className="flex items-start">
        <span className="text-[10px] text-[var(--color-text-muted)] flex items-center gap-1">
          <span>{channelIcons[c.sourceChannel]}</span>
          {channelLabels[c.sourceChannel] || c.origin}
        </span>
      </div>

      <div className="flex items-start">
        <span className="text-[10px] text-[var(--color-text-muted)]">{formatRelativeTime(c.receivedAt)}</span>
      </div>
    </div>
  );
}

function CasePreviewPanel({ case: c, onOpen }: { case: Case; onOpen: () => void }) {
  return (
    <div className="w-72 flex-shrink-0 border-l border-[var(--color-border)] bg-[var(--color-bg-panel)] flex flex-col animate-slide-in-right overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-medium text-[var(--color-lavender)]">{c.id}</span>
          <div className="flex items-center gap-1.5">
            <SeverityBadge severity={c.severity} />
            <StatusBadge status={c.status} />
          </div>
        </div>
        <h3 className="text-xs font-semibold text-[var(--color-text-primary)] leading-snug">{c.title}</h3>
      </div>

      {/* Summary */}
      <div className="px-4 py-3 border-b border-[var(--color-border)]">
        <p className="text-[10px] text-[var(--color-text-secondary)] leading-relaxed">{c.summary}</p>
      </div>

      {/* Metadata */}
      <div className="px-4 py-3 border-b border-[var(--color-border)] space-y-2.5">
        <MetaRow icon={<User className="w-3 h-3" />} label="Usuário" value={c.user} />
        <MetaRow icon={<Monitor className="w-3 h-3" />} label="Dispositivo" value={c.device} />
        <MetaRow icon={<Shield className="w-3 h-3" />} label="Política" value={c.policyViolated} highlight />
        <MetaRow icon={<Activity className="w-3 h-3" />} label="Destino" value={c.destination} />
        <MetaRow icon={<Clock className="w-3 h-3" />} label="Recebido" value={formatDateTime(c.receivedAt)} />
      </div>

      {/* Primeira ação sugerida */}
      <div className="px-4 py-3 border-b border-[var(--color-border)]">
        <p className="text-[10px] font-medium text-[var(--color-text-muted)] mb-2">Próxima ação sugerida</p>
        <div className="space-y-1.5">
          {['Revisar evidência anexa', 'Verificar histórico do usuário', 'Consultar parecer da IA'].map((action) => (
            <div key={action} className="flex items-center gap-2 text-[10px] text-[var(--color-text-secondary)]">
              <ChevronRight className="w-3 h-3 text-[var(--color-accent-bright)]" />
              {action}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="p-4 mt-auto">
        <Button variant="primary" size="lg" onClick={onOpen} className="w-full">
          <ExternalLink className="w-3.5 h-3.5" />
          Abrir na Mesa de Trabalho
        </Button>
      </div>
    </div>
  );
}

function MetaRow({ icon, label, value, highlight }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-[var(--color-text-muted)] mt-0.5 flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-wider">{label}</p>
        <p className={`text-[10px] font-medium truncate ${highlight ? 'text-[var(--color-lavender)]' : 'text-[var(--color-text-secondary)]'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
