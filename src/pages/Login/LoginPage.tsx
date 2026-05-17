import { useState } from 'react';
import { Shield, Eye, EyeOff, AlertCircle, Building2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAppStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const ok = login(email, password);
    if (!ok) setError('Credenciais inválidas. Verifique e-mail e senha.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-[var(--color-bg-primary)]">
      {/* Left panel - branding */}
      <div className="hidden lg:flex flex-col justify-between w-[440px] flex-shrink-0 p-10 border-r border-[var(--color-border)] bg-[var(--color-bg-panel)] relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-[var(--color-accent)]/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[var(--color-accent)]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)] flex items-center justify-center shadow-lg shadow-[var(--color-accent)]/30">
              <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[var(--color-text-primary)] font-semibold text-sm leading-tight">LeakGuard</p>
              <p className="text-[var(--color-text-muted)] text-xs leading-tight">CaseDesk</p>
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] leading-tight mb-3">
            Plataforma de Investigação<br />de Incidentes DLP
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Triagem, investigação e resposta a eventos de possível vazamento de dados — com parecer IA integrado e gestão de políticas.
          </p>
        </div>

        {/* Feature list */}
        <div className="relative z-10 space-y-3">
          {[
            'Mesa de investigação de incidentes DLP',
            'Análise automática por IA com recomendações LGPD',
            'Gestão de políticas e resposta a incidentes',
            'Relatórios formais e trilha de auditoria',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-bright)] flex-shrink-0" />
              <span className="text-xs text-[var(--color-text-secondary)]">{item}</span>
            </div>
          ))}
        </div>

        <div className="relative z-10">
          <p className="text-[10px] text-[var(--color-text-muted)]">
            v2.4.1 — Classificação: USO INTERNO RESTRITO
          </p>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">LeakGuard CaseDesk</span>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">Acesso Seguro</h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              Autentique-se com suas credenciais corporativas
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                E-mail corporativo
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analista@empresa.com"
                required
                className="w-full h-9 px-3 rounded-lg bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-border)] focus:ring-1 focus:ring-[var(--color-accent)]/30 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-9 px-3 pr-10 rounded-lg bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-border)] focus:ring-1 focus:ring-[var(--color-accent)]/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-critical-muted)] border border-[var(--color-critical-border)]">
                <AlertCircle className="w-3.5 h-3.5 text-[var(--color-critical)] flex-shrink-0" />
                <span className="text-xs text-[var(--color-critical)]">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-9 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-medium transition-all duration-150 shadow-lg shadow-[var(--color-accent)]/25 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Autenticando...
                </span>
              ) : 'Entrar'}
            </button>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-[var(--color-border)]" />
              <span className="text-[10px] text-[var(--color-text-muted)]">ou</span>
              <div className="flex-1 h-px bg-[var(--color-border)]" />
            </div>

            <button
              type="button"
              className="w-full h-9 rounded-lg bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm hover:border-[var(--color-accent-border)] hover:text-[var(--color-lavender)] transition-all duration-150 flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              Autenticação Corporativa (SSO)
            </button>
          </form>

          <p className="mt-6 text-[10px] text-center text-[var(--color-text-muted)]">
            Acesso monitorado. Todas as ações são registradas em trilha de auditoria.
          </p>
        </div>
      </div>
    </div>
  );
}
