import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { LoginPage } from '@/pages/Login/LoginPage'
import { AppShell } from '@/components/layout/AppShell'

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-[var(--color-bg-primary)]">
      <div className="text-center">
        <div className="w-7 h-7 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-[var(--color-text-muted)]">Inicializando...</p>
      </div>
    </div>
  )
}

function App() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const isLoading       = useAppStore((s) => s.isLoading)

  useEffect(() => {
    useAppStore.getState().initialize()
  }, [])

  if (isLoading)        return <LoadingScreen />
  if (!isAuthenticated) return <LoginPage />
  return <AppShell />
}

export default App
