import { cn } from '@/lib/utils';
import type { Severity, CaseStatus } from '@/types';

interface SeverityBadgeProps {
  severity: Severity;
  size?: 'sm' | 'md';
}

const severityConfig: Record<Severity, { label: string; className: string }> = {
  critical: { label: 'Crítico', className: 'bg-[var(--color-critical-muted)] text-[var(--color-critical)] border border-[var(--color-critical-border)]' },
  high: { label: 'Alto', className: 'bg-[var(--color-high-muted)] text-[var(--color-high)] border border-[var(--color-high-border)]' },
  medium: { label: 'Médio', className: 'bg-[var(--color-medium-muted)] text-[var(--color-medium)] border border-[var(--color-medium-border)]' },
  low: { label: 'Baixo', className: 'bg-[var(--color-low-muted)] text-[var(--color-low)] border border-[var(--color-low-border)]' },
};

export function SeverityBadge({ severity, size = 'sm' }: SeverityBadgeProps) {
  const config = severityConfig[severity];
  return (
    <span className={cn(
      'inline-flex items-center rounded font-medium',
      size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs',
      config.className
    )}>
      {config.label}
    </span>
  );
}

interface StatusBadgeProps {
  status: CaseStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<CaseStatus, { label: string; dot: string; className: string }> = {
  new: {
    label: 'Novo',
    dot: 'bg-[var(--color-accent-bright)]',
    className: 'bg-[var(--color-accent-muted)] text-[var(--color-lavender)] border border-[var(--color-accent-border)]',
  },
  analyzing: {
    label: 'Em Análise',
    dot: 'bg-[var(--color-medium)]',
    className: 'bg-[var(--color-medium-muted)] text-[var(--color-medium)] border border-[var(--color-medium-border)]',
  },
  pending_action: {
    label: 'Ag. Ação',
    dot: 'bg-[var(--color-high)]',
    className: 'bg-[var(--color-high-muted)] text-[var(--color-high)] border border-[var(--color-high-border)]',
  },
  contained: {
    label: 'Contido',
    dot: 'bg-[var(--color-success)]',
    className: 'bg-[var(--color-success-muted)] text-[var(--color-success)] border border-[var(--color-success-border)]',
  },
  closed: {
    label: 'Encerrado',
    dot: 'bg-[var(--color-text-muted)]',
    className: 'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border-strong)]',
  },
  false_positive: {
    label: 'Falso Positivo',
    dot: 'bg-[var(--color-low)]',
    className: 'bg-[var(--color-low-muted)] text-[var(--color-low)] border border-[var(--color-low-border)]',
  },
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded font-medium',
      size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs',
      config.className
    )}>
      <span className={cn('w-1 h-1 rounded-full flex-shrink-0', config.dot)} />
      {config.label}
    </span>
  );
}

interface ChannelBadgeProps {
  channel: string;
}

export function ChannelBadge({ channel }: ChannelBadgeProps) {
  const labels: Record<string, string> = {
    email: 'Email',
    cloud: 'Cloud',
    web: 'Web',
    usb: 'USB',
    print: 'Print',
  };
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border-strong)]">
      {labels[channel] || channel}
    </span>
  );
}
