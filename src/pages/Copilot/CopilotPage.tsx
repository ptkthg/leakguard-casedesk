import { useState } from 'react';
import {
  Bot, Send, FileText, AlertTriangle, Shield, BarChart2,
  CheckCircle2, Lightbulb, Zap, MessageSquare, RefreshCw,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { SeverityBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockAIAnalysis } from '@/data/mockData';

const QUICK_TASKS = [
  { id: 'summarize', icon: FileText, label: 'Resumir incidente', desc: 'Resumo técnico e executivo do caso' },
  { id: 'response', icon: Zap, label: 'Gerar plano de resposta', desc: 'Etapas detalhadas de contenção e remediação' },
  { id: 'policy', icon: Shield, label: 'Explicar política', desc: 'Detalha a política violada e seu contexto' },
  { id: 'compare', icon: BarChart2, label: 'Comparar casos', desc: 'Compara com incidentes similares anteriores' },
  { id: 'report', icon: MessageSquare, label: 'Relatório executivo', desc: 'Prepara sumário para C-Level e DPO' },
  { id: 'lgpd', icon: AlertTriangle, label: 'Análise LGPD', desc: 'Avalia obrigações legais e prazo ANPD' },
];

const ai = mockAIAnalysis;

type TaskId = typeof QUICK_TASKS[number]['id'];

const TASK_RESPONSES: Record<TaskId, React.ReactNode> = {
  summarize: <SummarizeResponse />,
  response: <ResponsePlanResponse />,
  policy: <PolicyExplainResponse />,
  compare: <CompareResponse />,
  report: <ExecutiveReportResponse />,
  lgpd: <LGPDResponse />,
};

export function CopilotPage() {
  const { selectedCase, cases } = useAppStore();
  const activeCase = selectedCase || cases[0];
  const [activeTask, setActiveTask] = useState<TaskId>('response');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTask = (id: TaskId) => {
    setLoading(true);
    setTimeout(() => {
      setActiveTask(id);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left panel - tasks + input */}
      <div className="w-56 flex-shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-panel)] flex flex-col">
        <div className="px-4 py-3 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2 mb-1">
            <Bot className="w-4 h-4 text-[var(--color-lavender)]" />
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">LeakGuard Copilot</h2>
          </div>
          <p className="text-[10px] text-[var(--color-text-muted)] leading-snug">
            Seu assistente de operações de segurança DLP
          </p>
        </div>

        {/* Context case */}
        {activeCase && (
          <div className="px-4 py-3 border-b border-[var(--color-border)]">
            <p className="text-[9px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Contexto ativo</p>
            <div className="px-2.5 py-2 rounded-lg bg-[var(--color-accent-muted)] border border-[var(--color-accent-border)]">
              <p className="text-[10px] font-mono font-medium text-[var(--color-lavender)]">{activeCase.id}</p>
              <p className="text-[9px] text-[var(--color-text-secondary)] mt-0.5 line-clamp-2">{activeCase.title}</p>
              <div className="mt-1.5">
                <SeverityBadge severity={activeCase.severity} />
              </div>
            </div>
          </div>
        )}

        {/* Quick tasks */}
        <div className="flex-1 overflow-y-auto py-2">
          <p className="px-4 py-2 text-[9px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Tarefas rápidas</p>
          {QUICK_TASKS.map(({ id, icon: Icon, label, desc }) => (
            <button
              key={id}
              onClick={() => handleTask(id as TaskId)}
              className={`w-full text-left px-4 py-2.5 transition-colors hover:bg-[var(--color-bg-hover)] ${
                activeTask === id ? 'bg-[var(--color-bg-selected)] border-l-2 border-l-[var(--color-accent)]' : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <Icon className={`w-3 h-3 flex-shrink-0 ${activeTask === id ? 'text-[var(--color-lavender)]' : 'text-[var(--color-text-muted)]'}`} />
                <span className={`text-[10px] font-medium ${activeTask === id ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
                  {label}
                </span>
              </div>
              <p className="text-[9px] text-[var(--color-text-muted)] pl-5 leading-snug">{desc}</p>
            </button>
          ))}
        </div>

        {/* Custom input */}
        <div className="p-3 border-t border-[var(--color-border)]">
          <div className="relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite uma pergunta específica..."
              rows={3}
              className="w-full px-2.5 py-2 pr-8 rounded bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[10px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-border)] resize-none"
            />
            <button className="absolute right-2 bottom-2 text-[var(--color-text-muted)] hover:text-[var(--color-lavender)] transition-colors">
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Center - Response */}
      <div className="flex-1 overflow-y-auto p-5">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-xs">Gerando análise...</span>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Response header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--color-text-primary)]">
                    {QUICK_TASKS.find((t) => t.id === activeTask)?.label}
                  </p>
                  <p className="text-[9px] text-[var(--color-text-muted)]">
                    Análise gerada para {activeCase?.id || 'INC-2048'} — agora mesmo
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <RefreshCw className="w-3 h-3" />
                Regenerar
              </Button>
            </div>

            {TASK_RESPONSES[activeTask]}
          </div>
        )}
      </div>

      {/* Right panel - context */}
      <div className="w-60 flex-shrink-0 border-l border-[var(--color-border)] bg-[var(--color-bg-panel)] flex flex-col overflow-y-auto">
        <div className="px-4 py-3 border-b border-[var(--color-border)]">
          <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Contexto do caso</p>
          {activeCase && (
            <div className="space-y-2">
              {[
                { label: 'ID', value: activeCase.id },
                { label: 'Usuário', value: activeCase.user },
                { label: 'Política', value: activeCase.policyViolated },
                { label: 'Destino', value: activeCase.destination },
                { label: 'Canal', value: activeCase.sourceChannel },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[9px] text-[var(--color-text-muted)]">{label}</p>
                  <p className="text-[10px] font-medium text-[var(--color-text-secondary)] truncate">{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-b border-[var(--color-border)]">
          <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Artefatos referenciados</p>
          <div className="space-y-1.5">
            {['clientes_maio_2025.xlsx', 'email_raw.eml', 'Logs SMTP Gateway'].map((a) => (
              <div key={a} className="flex items-center gap-2 px-2 py-1.5 rounded bg-[var(--color-bg-surface)] border border-[var(--color-border)]">
                <FileText className="w-3 h-3 text-[var(--color-text-muted)] flex-shrink-0" />
                <span className="text-[9px] text-[var(--color-text-secondary)] truncate">{a}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-3">
          <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Políticas aplicadas</p>
          <div className="space-y-1.5">
            {['DLP-003', 'DLP-009'].map((p) => (
              <div key={p} className="px-2 py-1.5 rounded bg-[var(--color-accent-muted)] border border-[var(--color-accent-border)]">
                <p className="text-[10px] font-mono font-medium text-[var(--color-lavender)]">{p}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-3 border-t border-[var(--color-border)] mt-auto">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] text-[var(--color-text-muted)]">Confiança da análise</span>
            <span className="text-[9px] font-semibold text-[var(--color-success)]">{ai.confidenceLevel}%</span>
          </div>
          <div className="w-full h-1 rounded-full bg-[var(--color-bg-elevated)]">
            <div
              className="h-1 rounded-full bg-[var(--color-success)]"
              style={{ width: `${ai.confidenceLevel}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children, accentColor }: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  accentColor?: string;
}) {
  return (
    <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden mb-4">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--color-border)]">
        <span style={{ color: accentColor || 'var(--color-lavender)' }}>{icon}</span>
        <span className="text-xs font-semibold text-[var(--color-text-primary)]">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function BulletList({ items, color }: { items: string[]; color?: string }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: color || 'var(--color-accent-bright)' }} />
          <span className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ResponsePlanResponse() {
  return (
    <>
      <Section title="Resumo" icon={<FileText className="w-3.5 h-3.5" />}>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
          Plano de resposta para o <span className="text-[var(--color-lavender)] font-medium">INC-2048</span>.
          Plano de resposta gerado com base no conteúdo do caso INC-2048. O incidente envolve possível exfiltração de dados pessoais via e-mail.
        </p>
      </Section>

      <Section title="Risco de Negócio" icon={<AlertTriangle className="w-3.5 h-3.5" />} accentColor="var(--color-high)">
        <BulletList
          color="var(--color-high)"
          items={ai.businessRisk}
        />
      </Section>

      <Section title="Plano de Resposta" icon={<Zap className="w-3.5 h-3.5" />} accentColor="var(--color-accent-bright)">
        <ol className="space-y-3">
          {ai.responsePlan.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[var(--color-accent-muted)] border border-[var(--color-accent-border)] flex items-center justify-center flex-shrink-0 text-[9px] font-bold text-[var(--color-lavender)]">
                {i + 1}
              </span>
              <span className="text-xs text-[var(--color-text-secondary)] leading-relaxed pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Melhorias de Controle" icon={<Shield className="w-3.5 h-3.5" />} accentColor="var(--color-success)">
        <BulletList
          color="var(--color-success)"
          items={ai.controlImprovements}
        />
      </Section>

      <Section title="Possível Falso Positivo" icon={<CheckCircle2 className="w-3.5 h-3.5" />} accentColor="var(--color-text-muted)">
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{ai.falsePositiveAssessment}</p>
      </Section>
    </>
  );
}

function SummarizeResponse() {
  return (
    <>
      <Section title="Resumo Técnico" icon={<FileText className="w-3.5 h-3.5" />}>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">{ai.technicalSummary}</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Política violada', value: ai.policyViolated },
            { label: 'Destino', value: ai.destination },
            { label: 'Risco', value: ai.risk },
            { label: 'Impacto', value: ai.impact },
          ].map(({ label, value }) => (
            <div key={label} className="px-3 py-2 rounded bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">
              <p className="text-[9px] text-[var(--color-text-muted)] mb-0.5">{label}</p>
              <p className="text-[10px] text-[var(--color-text-secondary)]">{value}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Base Legal" icon={<Shield className="w-3.5 h-3.5" />} accentColor="var(--color-lavender)">
        <p className="text-xs text-[var(--color-lavender)] leading-relaxed">{ai.lgpdBasis}</p>
      </Section>
    </>
  );
}

function PolicyExplainResponse() {
  return (
    <Section title="Política DLP-003 — Proteção de Dados Pessoais" icon={<Shield className="w-3.5 h-3.5" />}>
      <div className="space-y-4">
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
          A política DLP-003 tem como objetivo detectar e prevenir o envio não autorizado de dados pessoais identificáveis (CPF, RG, e-mail, telefone) para destinatários externos não autorizados, garantindo conformidade com a LGPD.
        </p>
        <div>
          <p className="text-[10px] font-medium text-[var(--color-text-muted)] mb-2">Ação configurada: Quarentena</p>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            O e-mail e seus anexos são retidos automaticamente, impedindo a entrega ao destinatário. O analista pode liberar ou bloquear definitivamente após análise.
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-[var(--color-text-muted)] mb-2">Canais cobertos</p>
          <div className="flex gap-2">
            {['E-mail', 'Cloud', 'Web'].map((ch) => (
              <span key={ch} className="px-2 py-0.5 rounded text-[10px] bg-[var(--color-accent-muted)] border border-[var(--color-accent-border)] text-[var(--color-lavender)]">
                {ch}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function CompareResponse() {
  return (
    <Section title="Comparação com casos similares" icon={<BarChart2 className="w-3.5 h-3.5" />}>
      <div className="space-y-3">
        {[
          { id: 'INC-2031', title: 'Envio de planilha financeira', severity: 'high' as const, outcome: 'Falso positivo', sim: '72%' },
          { id: 'INC-2019', title: 'Exportação de base de CRM', severity: 'critical' as const, outcome: 'Violação confirmada', sim: '89%' },
          { id: 'INC-1998', title: 'Dados de RH para externo', severity: 'high' as const, outcome: 'Violação confirmada', sim: '81%' },
        ].map(({ id, title, severity, outcome, sim }) => (
          <div key={id} className="flex items-center gap-3 px-3 py-2.5 rounded bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-mono text-[var(--color-lavender)]">{id}</span>
                <SeverityBadge severity={severity} />
              </div>
              <p className="text-[10px] text-[var(--color-text-secondary)] truncate">{title}</p>
              <p className="text-[9px] text-[var(--color-text-muted)] mt-0.5">{outcome}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-[var(--color-accent-bright)]">{sim}</p>
              <p className="text-[9px] text-[var(--color-text-muted)]">similaridade</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ExecutiveReportResponse() {
  return (
    <>
      <Section title="Sumário Executivo" icon={<FileText className="w-3.5 h-3.5" />}>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
          Em 17/05/2025, o sistema DLP identificou e bloqueou o envio de dados pessoais de 847 clientes para destinatário externo não autorizado. O incidente foi classificado como risco alto e está em fase de tratamento. Recomendamos notificação ao DPO para avaliação de comunicação à ANPD dentro do prazo legal de 72 horas.
        </p>
      </Section>
      <Section title="Risco de Negócio" icon={<AlertTriangle className="w-3.5 h-3.5" />} accentColor="var(--color-high)">
        <BulletList color="var(--color-high)" items={[
          'Possível obrigação de notificação à ANPD (prazo: 72h)',
          'Risco regulatório: multa de até R$50M ou 2% do faturamento',
          'Dano reputacional com clientes e parceiros',
        ]} />
      </Section>
      <Section title="Recomendação para C-Level" icon={<Lightbulb className="w-3.5 h-3.5" />} accentColor="var(--color-medium)">
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
          Ativar protocolo de resposta a incidentes LGPD. Notificar DPO e Jurídico. Suspender temporariamente exportação de dados pelo Marketing. Avaliar necessidade de notificação à ANPD com assessoria jurídica.
        </p>
      </Section>
    </>
  );
}

function LGPDResponse() {
  return (
    <>
      <Section title="Análise de Obrigações LGPD" icon={<Shield className="w-3.5 h-3.5" />} accentColor="var(--color-critical)">
        <div className="space-y-3">
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{ai.lgpdBasis}</p>
          <div className="px-3 py-2.5 rounded bg-[var(--color-critical-muted)] border border-[var(--color-critical-border)]">
            <p className="text-[10px] font-semibold text-[var(--color-critical)] mb-1">⚠ Possível obrigação de notificação</p>
            <p className="text-[10px] text-[var(--color-text-secondary)] leading-relaxed">
              Art. 48 da LGPD determina notificação à ANPD em prazo razoável quando houver risco relevante. Prazo recomendado pelo guia ANPD: 72 horas.
            </p>
          </div>
        </div>
      </Section>
      <Section title="Checklist de Conformidade" icon={<CheckCircle2 className="w-3.5 h-3.5" />} accentColor="var(--color-success)">
        <ul className="space-y-2">
          {[
            { item: 'Registrar incidente no log LGPD', done: true },
            { item: 'Notificar DPO', done: true },
            { item: 'Avaliar notificação à ANPD', done: false },
            { item: 'Notificar titulares afetados (se necessário)', done: false },
            { item: 'Documentar medidas de contenção', done: false },
            { item: 'Revisar política DLP-003', done: false },
          ].map(({ item, done }) => (
            <li key={item} className="flex items-center gap-2">
              <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${done ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'}`} />
              <span className={`text-xs ${done ? 'text-[var(--color-text-secondary)]' : 'text-[var(--color-text-muted)]'}`}>{item}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
