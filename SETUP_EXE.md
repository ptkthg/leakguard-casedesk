# Como gerar o LeakGuard CaseDesk.exe

## Pré-requisitos

### 1. Instalar Rust (se ainda não tiver)
```
winget install Rustlang.Rustup
```
Ou baixe em: https://rustup.rs

Após instalar, feche e reabra o terminal e confirme:
```
rustc --version
cargo --version
```

### 2. Instalar dependências do sistema Windows (WebView2)
O Tauri usa o WebView2 do Windows (já incluso no Windows 10/11).
Se precisar: https://developer.microsoft.com/pt-br/microsoft-edge/webview2/

---

## Gerar o .exe

```bash
cd "D:\LeakGuard SOC\leakguard-casedesk"

# 1. Instalar dependências (já feito)
npm install

# 2. Gerar ícones reais a partir do SVG (opcional, recomendado)
npm run tauri:icons

# 3. Build completo — gera o instalador .msi e o .exe
npm run tauri:build
```

O executável e o instalador serão gerados em:
```
src-tauri/target/release/leakguard-casedesk.exe   ← app portátil
src-tauri/target/release/bundle/msi/               ← instalador .msi
src-tauri/target/release/bundle/nsis/              ← instalador .exe (NSIS)
```

---

## Desenvolvimento (modo dev com hot-reload)

```bash
npm run tauri:dev
```

Abre o app nativo com hot-reload do React.

---

## Observações

- Primeiro build pode demorar 5-15 min (compilação Rust)
- Builds subsequentes são muito mais rápidos (~30s)
- O app final tem ~10-15MB (muito menor que Electron)
- Funciona offline 100%
