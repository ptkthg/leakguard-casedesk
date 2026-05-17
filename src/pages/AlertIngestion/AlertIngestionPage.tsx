import { useState } from 'react';
import {
  Upload, CheckCircle2, XCircle, Loader2,
  FileJson, Trash2, AlertTriangle, AlertCircle,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { SeverityBadge, ChannelBadge } from '@/components/ui/Badge';
import type { AlertPayload, Severity } from '@/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const VALID_SEVERITIES = ['critical', 'high', 'medium', 'low'];
const REQUIRED_FIELDS  = ['source', 'title', 'severity', 'channel', 'user', 'destination', 'policy'];

const EXAMPLE_JSON = JSON.stringify(
  {
    source: 'Microsoft Purview DLP',
    eventId: 'purview-88921',
    title: 'Envio externo de arquivo com dados pessoais',
    severity: 'high',
    channel: 'email',
    user: 'mariana.silva@empresa.com',
    device: 'WKS-MKT-042',
    department: 'Marketing',
    destination: 'fornecedor@externo.com',
    fileName: 'clientes_maio_2026.xlsx',
    fileType: 'XLSX',
    fileSize: '2.4 MB',
    policy: 'DLP-003',
    detectedFields: [
      { type: 'CPF', count: 847 },
      { type: 'E-mail', count: 412 },
      { type: 'Telefone', count: 389 },
    ],
    rawText:
      'Arquivo clientes_maio_2026.xlsx enviado para domínio externo contendo CPF, e-mail e telefone.',
  },
  null,
  2
);

// ─── Types ────────────────────────────────────────────────────────────────────

type ParseState =
  | { tag: 'idle' }
  | { tag: 'parse_error'; message: string }
  | { tag: 'valid'; payload: AlertPayload };

type ImportState =
  | { tag: 'idle' }
  | { tag: 'loading' }
  | { tag: 'error'; errors: string[] };

// ─── Sub-components ───────────────────────────────────────────────────────────

function EmptyPreview() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-16">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
        style={{ background: 'var(--color-bg-elevated)' }}
      >
        <FileJson className="w-6 h-6" style={{ color: 'var(--color-text-muted)' }} />
      </div>
      <p className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
        Pré-visualização
      </p>
      <p className="text-[10px] mt-1 max-w-[200px] leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
        Cole o JSON e clique em "Validar JSON" para extrair os campos
      </p>
    </div>
  );
}

function ParseErrorPanel({ message }: { message: string }) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ background: 'var(--color-critical-muted)', borderColor: 'var(--color-critical-border)' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <XCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-critical)' }} />
        <span className="text-xs font-semibold" style={{ color: 'var(--color-critical)' }}>
          JSON inválido
        </span>
      </div>
      <p className="text-[11px] font-mono break-all leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
        {message}
      </p>
    </div>
  );
}

function FieldRow({ label, value, mono = false }: { label: string; value?: string; mono?: boolean }) {
  return (
    <div
      className="flex items-start px-3 py-2 gap-3 border-b last:border-b-0"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <span
        className="text-[10px] w-24 flex-shrink-0 pt-0.5 uppercase tracking-wide"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {label}
      </span>
      <span
        className={`text-[11px] break-all leading-relaxed ${mono ? 'font-mono' : ''}`}
        style={{ color: value ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}
      >
        {value || '—'}
      </span>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div
      className="px-3 py-2 border-b"
      style={{ background: 'var(--color-bg-panel)', borderColor: 'var(--color-border)' }}
    >
      <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
        {title}
      </span>
    </div>
  );
}

function PayloadPreview({
  payload,
  importState,
}: {
  payload: AlertPayload;
  importState: ImportState;
}) {
  const missingRequired = REQUIRED_FIELDS.filter((f) => !payload[f as keyof AlertPayload]);
  const invalidSeverity = payload.severity && !VALID_SEVERITIES.includes(payload.severity);
  const warnings = [
    ...missingRequired.map((f) => `Campo obrigatório ausente: "${f}"`),
    ...(invalidSeverity ? [`severity inválido: "${payload.severity}". Aceitos: critical, high, medium, low`] : []),
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Main-process import error */}
      {importState.tag === 'error' && (
        <div
          className="rounded-xl border p-3"
          style={{ background: 'var(--color-critical-muted)', borderColor: 'var(--color-critical-border)' }}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-critical)' }} />
            <span className="text-[10px] font-semibold" style={{ color: 'var(--color-critical)' }}>
              Falha na importação
            </span>
          </div>
          {importState.errors.map((e, i) => (
            <p key={i} className="text-[10px] font-mono leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              • {e}
            </p>
          ))}
        </div>
      )}

      {/* Client-side field warnings */}
      {warnings.length > 0 && (
        <div
          className="rounded-xl border p-3"
          style={{ background: 'var(--color-high-muted)', borderColor: 'var(--color-high-border)' }}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-high)' }} />
            <span className="text-[10px] font-semibold" style={{ color: 'var(--color-high)' }}>
              {warnings.length} problema{warnings.length > 1 ? 's' : ''} detectado{warnings.length > 1 ? 's' : ''}
            </span>
          </div>
          {warnings.map((w, i) => (
            <p key={i} className="text-[10px] leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              • {w}
            </p>
          ))}
        </div>
      )}

      {/* Case fields */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
        <SectionHeader title="Caso" />
        <FieldRow label="Título"      value={payload.title} />
        <FieldRow label="Fonte"       value={payload.source} />
        <FieldRow label="Usuário"     value={payload.user} mono />
        <FieldRow label="Destino"     value={payload.destination} mono />
        <FieldRow label="Departamento" value={payload.department} />
        <FieldRow label="Dispositivo" value={payload.device} mono />
        <FieldRow label="Política"    value={payload.policy} />
        <FieldRow label="Event ID"    value={payload.eventId} mono />

        {/* Severity badge row */}
        <div
          className="flex items-center px-3 py-2 gap-3 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <span className="text-[10px] w-24 flex-shrink-0 uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
            Severidade
          </span>
          {payload.severity && VALID_SEVERITIES.includes(payload.severity) ? (
            <SeverityBadge severity={payload.severity as Severity} />
          ) : (
            <span
              className="text-[11px]"
              style={{ color: payload.severity ? 'var(--color-critical)' : 'var(--color-text-muted)' }}
            >
              {payload.severity || '—'}
            </span>
          )}
        </div>

        {/* Channel badge row */}
        <div className="flex items-center px-3 py-2 gap-3" style={{ borderColor: 'var(--color-border)' }}>
          <span className="text-[10px] w-24 flex-shrink-0 uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
            Canal
          </span>
          {payload.channel ? (
            <ChannelBadge channel={payload.channel} />
          ) : (
            <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>—</span>
          )}
        </div>
      </div>

      {/* Evidence */}
      {(payload.fileName || payload.fileType) && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
          <SectionHeader title="Evidência" />
          <FieldRow label="Arquivo"  value={payload.fileName} mono />
          <FieldRow label="Tipo"     value={payload.fileType} />
          <FieldRow label="Tamanho"  value={payload.fileSize} />
        </div>
      )}

      {/* Detected fields */}
      {Array.isArray(payload.detectedFields) && payload.detectedFields.length > 0 && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
          <SectionHeader title={`Dados Detectados (${payload.detectedFields.length})`} />
          {payload.detectedFields.map((field, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-2 border-b last:border-b-0"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <span className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
                {field.type}
              </span>
              <span
                className="text-[11px] font-mono font-medium tabular-nums"
                style={{ color: 'var(--color-lavender)' }}
              >
                {(field.count ?? 0).toLocaleString('pt-BR')}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Raw text */}
      {payload.rawText && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
          <SectionHeader title="Texto Bruto" />
          <p className="px-3 py-2 text-[11px] leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            {payload.rawText}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AlertIngestionPage() {
  const importAlert = useAppStore((s) => s.importAlert);

  const [raw,         setRaw]         = useState('');
  const [parseState,  setParseState]  = useState<ParseState>({ tag: 'idle' });
  const [importState, setImportState] = useState<ImportState>({ tag: 'idle' });

  function handleValidate() {
    if (!raw.trim()) { setParseState({ tag: 'idle' }); return; }
    try {
      const parsed = JSON.parse(raw);
      setParseState({ tag: 'valid', payload: parsed as AlertPayload });
      setImportState({ tag: 'idle' });
    } catch (e) {
      setParseState({ tag: 'parse_error', message: (e as Error).message });
    }
  }

  async function handleImport() {
    if (parseState.tag !== 'valid') return;
    setImportState({ tag: 'loading' });
    try {
      await importAlert(parseState.payload);
      // openCaseWorkbench inside importAlert navigates away — page unmounts
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      setImportState({ tag: 'error', errors: msg.split(', ') });
    }
  }

  function handleClear() {
    setRaw('');
    setParseState({ tag: 'idle' });
    setImportState({ tag: 'idle' });
  }

  const canImport = parseState.tag === 'valid' && importState.tag !== 'loading';
  const isLoading = importState.tag === 'loading';

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Header ── */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Ingestão de Alertas
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              Cole um alerta JSON externo para criar um caso automaticamente no banco de dados local
            </p>
          </div>
          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded border text-[10px]"
            style={{
              background: 'var(--color-bg-elevated)',
              borderColor: 'var(--color-border-strong)',
              color: 'var(--color-text-muted)',
            }}
          >
            <FileJson className="w-3 h-3" />
            JSON — v1
          </div>
        </div>
      </div>

      {/* ── Two-column body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: JSON input */}
        <div
          className="flex flex-col border-r overflow-hidden"
          style={{ width: '55%', borderColor: 'var(--color-border)' }}
        >
          {/* Toolbar */}
          <div
            className="flex items-center justify-between flex-shrink-0 px-4 py-2 border-b"
            style={{ background: 'var(--color-bg-panel)', borderColor: 'var(--color-border)' }}
          >
            <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
              Payload JSON
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setRaw(EXAMPLE_JSON); setParseState({ tag: 'idle' }); setImportState({ tag: 'idle' }); }}
                className="text-[10px] transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-lavender)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
              >
                Carregar exemplo
              </button>
              <button
                onClick={handleClear}
                className="flex items-center gap-1 text-[10px] transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-critical)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
              >
                <Trash2 className="w-3 h-3" />
                Limpar
              </button>
            </div>
          </div>

          {/* Textarea */}
          <div className="relative flex-1 overflow-hidden">
            <textarea
              value={raw}
              onChange={(e) => {
                setRaw(e.target.value);
                if (parseState.tag !== 'idle') setParseState({ tag: 'idle' });
                if (importState.tag !== 'idle') setImportState({ tag: 'idle' });
              }}
              spellCheck={false}
              placeholder={'Cole o JSON aqui...\n\nExemplo:\n{\n  "source": "Microsoft Purview DLP",\n  "title": "Envio externo de dados pessoais",\n  "severity": "high",\n  ...\n}'}
              className="w-full h-full resize-none p-4 font-mono text-xs leading-relaxed outline-none"
              style={{
                background:  'var(--color-bg-primary)',
                color:       'var(--color-text-primary)',
                caretColor:  'var(--color-lavender)',
              }}
            />
          </div>

          {/* Status bar */}
          <div
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border-t"
            style={{ background: 'var(--color-bg-panel)', borderColor: 'var(--color-border)' }}
          >
            {parseState.tag === 'idle' && (
              <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                {raw.length > 0
                  ? `${raw.length} caracteres — clique em "Validar JSON" para continuar`
                  : 'Aguardando JSON...'}
              </span>
            )}
            {parseState.tag === 'parse_error' && (
              <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--color-critical)' }}>
                <XCircle className="w-3 h-3 flex-shrink-0" />
                JSON inválido
              </span>
            )}
            {parseState.tag === 'valid' && (
              <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--color-success)' }}>
                <CheckCircle2 className="w-3 h-3" />
                JSON válido — pronto para importar
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div
            className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-t"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <button
              onClick={handleValidate}
              disabled={!raw.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background:  'var(--color-bg-elevated)',
                borderColor: 'var(--color-border-strong)',
                color:       'var(--color-text-secondary)',
              }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Validar JSON
            </button>

            <button
              onClick={handleImport}
              disabled={!canImport}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={
                canImport
                  ? { background: 'var(--color-accent)', color: '#fff', border: 'none' }
                  : {
                      background:  'transparent',
                      color:       'var(--color-text-muted)',
                      border:      '1px solid var(--color-border)',
                    }
              }
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              {isLoading ? 'Importando...' : 'Importar'}
            </button>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="flex flex-col overflow-hidden" style={{ width: '45%' }}>
          <div
            className="flex-shrink-0 flex items-center px-4 py-2 border-b"
            style={{ background: 'var(--color-bg-panel)', borderColor: 'var(--color-border)' }}
          >
            <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
              Pré-visualização
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {parseState.tag === 'idle'        && <EmptyPreview />}
            {parseState.tag === 'parse_error' && <ParseErrorPanel message={parseState.message} />}
            {parseState.tag === 'valid'       && (
              <PayloadPreview payload={parseState.payload} importState={importState} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
