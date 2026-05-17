import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { LoginPage } from '@/pages/Login/LoginPage'
import { AppShell } from '@/components/layout/AppShell'

// ─── Bootstrap screens ────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-[var(--color-bg-primary)]">
      <div className="text-center">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
          style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}
        />
        <p className="text-xs font-medium text-[var(--color-text-secondary)]">
          LeakGuard CaseDesk
        </p>
        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
          Carregando banco de dados local...
        </p>
      </div>
    </div>
  )
}

function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex items-center justify-center h-screen bg-[var(--color-bg-primary)]">
      <div
        className="text-center max-w-sm mx-auto p-6 rounded-xl border"
        style={{
          background:   'var(--color-bg-surface)',
          borderColor:  'var(--color-critical-border)',
        }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'var(--color-critical-muted)' }}
        >
          <AlertTriangle
            className="w-5 h-5"
            style={{ color: 'var(--color-critical)' }}
          />
        </div>

        <h2
          className="text-sm font-semibold mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Falha ao inicializar
        </h2>

        <p
          className="text-xs leading-relaxed mb-5"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {message}
        </p>

        <button
          onClick={onRetry}
          className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg text-xs font-medium transition-opacity hover:opacity-90 active:scale-95"
          style={{ background: 'var(--color-accent)', color: '#fff' }}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Tentar novamente
        </button>

        <p
          className="text-[10px] mt-4"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Verifique os logs do processo principal para mais detalhes.
        </p>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

function App() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const isLoading       = useAppStore((s) => s.isLoading)
  const initError       = useAppStore((s) => s.initError)

  useEffect(() => {
    // initialize() detecta o ambiente:
    //   • Electron → carrega do SQLite via window.electronAPI (IPC)
    //   • Browser  → usa mockData diretamente (fallback em src/lib/api.ts)
    useAppStore.getState().initialize()
  }, [])

  if (isLoading) return <LoadingScreen />

  if (initError) {
    return (
      <ErrorScreen
        message={initError}
        onRetry={() => useAppStore.getState().initialize()}
      />
    )
  }

  if (!isAuthenticated) return <LoginPage />
  return <AppShell />
}

export default App
