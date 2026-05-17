import { useState } from 'react';
import {
  Search, Plus, Filter, Shield, CheckCircle2, AlertCircle,
  Mail, Cloud, Globe, HardDrive, Printer, Edit2, Power,
  ChevronDown,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { SeverityBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import type { Policy, Channel, Severity } from '@/types';

const channelIcon = (ch: Channel) => ({
  email: <Mail className="w-3 h-3" />,
  cloud: <Cloud className="w-3 h-3" />,
  web: <Globe className="w-3 h-3" />,
  usb: <HardDrive className="w-3 h-3" />,
  print: <Printer className="w-3 h-3" />,
}[ch]);

const actionLabel: Record<string, string> = {
  block: 'Bloquear',
  quarantine: 'Quarentena',
  alert: 'Alertar',
  log: 'Registrar',
};

const actionColor: Record<string, string> = {
  block: 'text-[var(--color-critical)] bg-[var(--color-critical-muted)] border-[var(--color-critical-border)]',
  quarantine: 'text-[var(--color-high)] bg-[var(--color-high-muted)] border-[var(--color-high-border)]',
  alert: 'text-[var(--color-medium)] bg-[var(--color-medium-muted)] border-[var(--color-medium-border)]',
  log: 'text-[var(--color-text-secondary)] bg-[var(--color-bg-elevated)] border-[var(--color-border-strong)]',
};

const statusLabel: Record<string, string> = {
  active: 'Ativa',
  simulation: 'Simulação',
  disabled: 'Desativada',
};

const statusColor: Record<string, string> = {
  active: 'text-[var(--color-success)] bg-[var(--color-success-muted)] border-[var(--color-success-border)]',
  simulation: 'text-[var(--color-medium)] bg-[var(--color-medium-muted)] border-[var(--color-medium-border)]',
  disabled: 'text-[var(--color-text-muted)] bg-[var(--color-bg-elevated)] border-[var(--color-border-strong)]',
};

export function PoliciesPage() {
  const { policies, selectedPolicy, selectPolicy } = useAppStore();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'channels' | 'actions' | 'history'>('details');

  const filtered = policies.filter((p) =>
    !search ||
    p.code.toLowerCase().includes(search.toLowerCase()) ||
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const activePol = selectedPolicy || policies[0];

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg-panel)]">
          <div>
            <h1 className="text-sm font-semibold text-[var(--color-text-primary)]">Políticas DLP</h1>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
              Gerencie e configure as políticas de prevenção de perda de dados
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Filter className="w-3.5 h-3.5" />
              Filtros
            </Button>
            <Button variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5" />
              Nova Política
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="flex-shrink-0 flex items-center gap-2 px-5 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg-panel)]">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por código, nome ou categoria..."
              className="w-full h-7 pl-8 pr-3 rounded bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-border)] transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-muted)]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
              {policies.filter((p) => p.status === 'active').length} ativas
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-medium)]" />
              {policies.filter((p) => p.status === 'simulation').length} simulação
            </span>
          </div>
        </div>

        {/* Table header */}
        <div className="flex-shrink-0 grid grid-cols-[80px_1fr_90px_80px_80px_80px_90px_100px] gap-3 px-5 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg-panel)]">
          {['Código', 'Nome / Categoria', 'Cobertura', 'Ação', 'Severidade', 'Status', 'Última alt.', 'Responsável'].map((h) => (
            <span key={h} className="text-[9px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">{h}</span>
          ))}
        </div>

        {/* Policy rows */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map((policy) => (
            <PolicyRow
              key={policy.id}
              policy={policy}
              isSelected={activePol?.id === policy.id}
              onClick={() => selectPolicy(policy)}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-2 border-t border-[var(--color-border)] bg-[var(--color-bg-panel)]">
          <span className="text-[10px] text-[var(--color-text-muted)]">
            {filtered.length} políticas — {policies.filter((p) => p.status === 'active').length} ativas
          </span>
          <div className="flex items-center gap-1">
            {[1, 2].map((p) => (
              <button
                key={p}
                className={`w-6 h-6 rounded text-[10px] font-medium transition-colors ${
                  p === 1
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - policy editor */}
      {activePol && (
        <PolicyEditPanel
          policy={activePol}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
}

function PolicyRow({ policy, isSelected, onClick }: {
  policy: Policy;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`grid grid-cols-[80px_1fr_90px_80px_80px_80px_90px_100px] gap-3 px-5 py-3 cursor-pointer border-b border-[var(--color-border-subtle)] transition-colors hover:bg-[var(--color-bg-hover)] ${
        isSelected ? 'bg-[var(--color-bg-selected)] border-l-2 border-l-[var(--color-accent)]' : ''
      }`}
    >
      <div>
        <span className="text-[10px] font-mono font-medium text-[var(--color-lavender)]">{policy.code}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-[var(--color-text-primary)] truncate">{policy.name}</p>
        <p className="text-[9px] text-[var(--color-text-muted)] truncate mt-0.5">{policy.category}</p>
      </div>
      <div className="flex items-center gap-1 flex-wrap">
        {policy.channels.slice(0, 3).map((ch) => (
          <span key={ch} className="flex items-center text-[var(--color-text-muted)]">
            {channelIcon(ch)}
          </span>
        ))}
        {policy.channels.length > 3 && (
          <span className="text-[9px] text-[var(--color-text-muted)]">+{policy.channels.length - 3}</span>
        )}
      </div>
      <div className="flex items-start">
        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${actionColor[policy.action]}`}>
          {actionLabel[policy.action]}
        </span>
      </div>
      <div className="flex items-start">
        <SeverityBadge severity={policy.severity} />
      </div>
      <div className="flex items-start">
        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${statusColor[policy.status]}`}>
          {statusLabel[policy.status]}
        </span>
      </div>
      <div>
        <span className="text-[9px] text-[var(--color-text-muted)]">{policy.lastUpdated}</span>
      </div>
      <div className="min-w-0">
        <span className="text-[9px] text-[var(--color-text-muted)] truncate block">{policy.owner.split('—')[1]?.trim() || policy.owner}</span>
      </div>
    </div>
  );
}

function PolicyEditPanel({ policy, activeTab, setActiveTab }: {
  policy: Policy;
  activeTab: string;
  setActiveTab: (t: any) => void;
}) {
  const [status, setStatus] = useState(policy.status);
  const [notify, setNotify] = useState(policy.notifyUser);
  const [log, setLog] = useState(policy.logIncident);
  const [review, setReview] = useState(policy.sendForReview);

  const allChannels: Channel[] = ['email', 'cloud', 'web', 'usb', 'print'];
  const channelLabels: Record<Channel, string> = {
    email: 'E-mail',
    cloud: 'Nuvem',
    web: 'Web',
    usb: 'USB',
    print: 'Impressão',
  };

  return (
    <div className="w-72 flex-shrink-0 border-l border-[var(--color-border)] bg-[var(--color-bg-panel)] flex flex-col overflow-hidden animate-slide-in-right">
      {/* Policy header */}
      <div className="px-4 py-3 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono font-medium text-[var(--color-lavender)]">{policy.code}</span>
          <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${statusColor[policy.status]}`}>
            {statusLabel[policy.status]}
          </span>
        </div>
        <h3 className="text-xs font-semibold text-[var(--color-text-primary)]">{policy.name}</h3>
        <p className="text-[9px] text-[var(--color-text-muted)] mt-0.5">{policy.category}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--color-border)]">
        {([
          { key: 'details', label: 'Detalhes' },
          { key: 'channels', label: 'Canais' },
          { key: 'actions', label: 'Ações' },
          { key: 'history', label: 'Histórico' },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-2 text-[9px] font-medium border-b-2 transition-colors ${
              activeTab === key
                ? 'border-[var(--color-accent)] text-[var(--color-lavender)]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'details' && (
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-[9px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Nome</label>
              <input
                defaultValue={policy.name}
                className="w-full h-7 px-2.5 rounded bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-border)]"
              />
            </div>
            <div>
              <label className="block text-[9px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Descrição</label>
              <textarea
                defaultValue={policy.description}
                rows={3}
                className="w-full px-2.5 py-2 rounded bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[10px] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-border)] resize-none"
              />
            </div>
            <div>
              <label className="block text-[9px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Categoria</label>
              <input
                defaultValue={policy.category}
                className="w-full h-7 px-2.5 rounded bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-border)]"
              />
            </div>
            <div>
              <label className="block text-[9px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Severidade</label>
              <select
                defaultValue={policy.severity}
                className="w-full h-7 px-2.5 rounded bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-border)]"
              >
                {(['critical', 'high', 'medium', 'low'] as Severity[]).map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Modo</label>
              <div className="flex rounded overflow-hidden border border-[var(--color-border)]">
                {(['active', 'simulation', 'disabled'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`flex-1 py-1.5 text-[9px] font-medium transition-colors ${
                      status === s
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                    }`}
                  >
                    {statusLabel[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'channels' && (
          <div className="p-4 space-y-3">
            <p className="text-[9px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Cobertura por canal</p>
            {allChannels.map((ch) => {
              const isActive = policy.channels.includes(ch);
              return (
                <div key={ch} className={`flex items-center justify-between px-3 py-2.5 rounded-lg border transition-colors ${
                  isActive
                    ? 'bg-[var(--color-accent-muted)] border-[var(--color-accent-border)]'
                    : 'bg-[var(--color-bg-surface)] border-[var(--color-border)]'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={isActive ? 'text-[var(--color-lavender)]' : 'text-[var(--color-text-muted)]'}>
                      {channelIcon(ch)}
                    </span>
                    <span className={`text-xs font-medium ${isActive ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
                      {channelLabels[ch]}
                    </span>
                  </div>
                  <div className={`w-7 h-4 rounded-full transition-colors cursor-pointer flex items-center px-0.5 ${
                    isActive ? 'bg-[var(--color-accent)] justify-end' : 'bg-[var(--color-bg-elevated)] justify-start'
                  }`}>
                    <div className="w-3 h-3 rounded-full bg-white" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="p-4 space-y-4">
            <div>
              <p className="text-[9px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Ação principal</p>
              <div className="grid grid-cols-2 gap-2">
                {(['block', 'quarantine', 'alert', 'log'] as const).map((a) => (
                  <button
                    key={a}
                    className={`py-2 rounded-lg border text-[10px] font-medium transition-colors ${
                      policy.action === a
                        ? actionColor[a]
                        : 'bg-[var(--color-bg-surface)] border-[var(--color-border)] text-[var(--color-text-muted)]'
                    }`}
                  >
                    {actionLabel[a]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[9px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Configurações</p>
              {[
                { key: 'notify', label: 'Notificar usuário', value: notify, set: setNotify },
                { key: 'log', label: 'Registrar incidente', value: log, set: setLog },
                { key: 'review', label: 'Enviar para revisão', value: review, set: setReview },
              ].map(({ key, label, value, set }) => (
                <label key={key} className="flex items-center justify-between cursor-pointer">
                  <span className="text-[10px] text-[var(--color-text-secondary)]">{label}</span>
                  <div
                    onClick={() => set(!value)}
                    className={`w-8 h-4 rounded-full transition-colors cursor-pointer flex items-center px-0.5 ${
                      value ? 'bg-[var(--color-accent)] justify-end' : 'bg-[var(--color-bg-elevated)] border border-[var(--color-border-strong)] justify-start'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-white" />
                  </div>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-[9px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">
                Canal de notificação
              </label>
              <input
                defaultValue={policy.notificationChannel}
                className="w-full h-7 px-2.5 rounded bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-border)]"
              />
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-4 space-y-2">
            <p className="text-[9px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Histórico de alterações</p>
            {[
              { date: '12/04/2025', action: 'Política atualizada', user: 'Carlos Mendes' },
              { date: '01/03/2025', action: 'Ação alterada para Quarentena', user: 'Ana Ferreira' },
              { date: '15/01/2025', action: 'Canal Web adicionado', user: 'Carlos Mendes' },
              { date: '10/12/2024', action: 'Política criada', user: 'CISO' },
            ].map((item, i) => (
              <div key={i} className="flex gap-2">
                <div className="flex flex-col items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-bright)] mt-1 flex-shrink-0" />
                  {i < 3 && <div className="w-px flex-1 bg-[var(--color-border)] my-0.5" />}
                </div>
                <div className="pb-3">
                  <p className="text-[10px] font-medium text-[var(--color-text-secondary)]">{item.action}</p>
                  <p className="text-[9px] text-[var(--color-text-muted)]">{item.user} · {item.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save button */}
      <div className="p-4 border-t border-[var(--color-border)] flex gap-2">
        <Button variant="primary" size="sm" className="flex-1">
          <Edit2 className="w-3 h-3" />
          Salvar alterações
        </Button>
        <Button variant="secondary" size="sm">
          <Power className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
