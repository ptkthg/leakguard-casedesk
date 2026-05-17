import { LogOut, Shield } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { navRoutes } from '@/routes';
import { cn } from '@/lib/utils';

export function SideNav() {
  const { currentPage, navigate, logout } = useAppStore();

  return (
    <nav className="w-14 flex flex-col items-center py-3 border-r border-[var(--color-border)] bg-[var(--color-bg-panel)] flex-shrink-0">
      {/* Logo */}
      <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center mb-4 shadow-lg shadow-[var(--color-accent)]/30">
        <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>

      <div className="w-8 h-px bg-[var(--color-border)] mb-3" />

      {/* Nav items driven by routes */}
      <div className="flex flex-col gap-1 flex-1">
        {navRoutes.map(({ id, label, icon }) => {
          const isActive = currentPage === id;
          return (
            <button
              key={id}
              onClick={() => navigate(id)}
              title={label}
              className={cn(
                'relative w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150 group',
                isActive
                  ? 'bg-[var(--color-accent-muted)] text-[var(--color-lavender)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-r bg-[var(--color-accent)]" />
              )}
              {icon}
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 rounded bg-[var(--color-bg-elevated)] border border-[var(--color-border-strong)] text-[var(--color-text-primary)] text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-xl z-50">
                {label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <div className="w-8 h-px bg-[var(--color-border)] mb-2" />
      <button
        onClick={logout}
        title="Sair"
        className="relative w-10 h-10 flex items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-critical)] hover:bg-[var(--color-critical-muted)] transition-all duration-150 group"
      >
        <LogOut style={{ width: 18, height: 18 }} />
        <div className="absolute left-full ml-2 px-2 py-1 rounded bg-[var(--color-bg-elevated)] border border-[var(--color-border-strong)] text-[var(--color-text-primary)] text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-xl z-50">
          Sair
        </div>
      </button>
    </nav>
  );
}
