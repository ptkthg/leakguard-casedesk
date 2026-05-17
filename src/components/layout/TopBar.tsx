import { Search, Bell, Settings, ChevronRight, Shield } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

const pageTitles: Record<string, string[]> = {
  inbox: ['LeakGuard CaseDesk', 'Casos Recebidos'],
  workbench: ['LeakGuard CaseDesk', 'Mesa de Trabalho'],
  evidence: ['LeakGuard CaseDesk', 'Evidências e Artefatos'],
  copilot: ['LeakGuard CaseDesk', 'Copilot IA'],
  reports: ['LeakGuard CaseDesk', 'Relatório e Auditoria'],
  policies: ['LeakGuard CaseDesk', 'Políticas DLP'],
};

export function TopBar() {
  const { currentPage, selectedCase, toggleCommandPalette } = useAppStore();
  const crumbs = pageTitles[currentPage] || ['LeakGuard CaseDesk'];

  return (
    <header className="flex items-center justify-between h-11 px-4 border-b border-[var(--color-border)] bg-[var(--color-bg-panel)] flex-shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="w-3 h-3" />}
            <span className={cn(i === crumbs.length - 1 ? 'text-[var(--color-text-secondary)]' : '')}>
              {crumb}
            </span>
          </span>
        ))}
        {selectedCase && currentPage === 'workbench' && (
          <>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[var(--color-lavender)] font-medium">{selectedCase.id}</span>
          </>
        )}
      </div>

      {/* Search */}
      <button
        onClick={toggleCommandPalette}
        className="flex items-center gap-2 px-3 h-7 rounded bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] text-xs hover:border-[var(--color-accent-border)] hover:text-[var(--color-text-secondary)] transition-colors w-60"
      >
        <Search className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="flex-1 text-left">Buscar casos, eventos, artefatos...</span>
        <kbd className="text-[9px] font-mono bg-[var(--color-bg-elevated)] border border-[var(--color-border-strong)] px-1 py-0.5 rounded">
          CTRL+K
        </kbd>
      </button>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <button className="relative w-7 h-7 flex items-center justify-center rounded hover:bg-[var(--color-bg-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[var(--color-critical)]" />
        </button>
        <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[var(--color-bg-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">
          <Settings className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-5 bg-[var(--color-border)] mx-1" />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
            <Shield className="w-3 h-3 text-white" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-[10px] font-medium text-[var(--color-text-primary)] leading-tight">Carlos Mendes</span>
            <span className="text-[9px] text-[var(--color-text-muted)] leading-tight">Analista Sênior</span>
          </div>
        </div>
      </div>
    </header>
  );
}
