/**
 * LeakGuard CaseDesk — Tailwind CSS v4 Reference
 *
 * Tailwind v4 configures tokens via @theme in CSS (src/styles/globals.css).
 * This file documents the design system for reference and tooling support.
 *
 * Full token definitions: src/styles/globals.css
 */

export const theme = {
  colors: {
    bg: {
      primary:  '#08080E',
      panel:    '#0E0E18',
      surface:  '#13131F',
      elevated: '#191928',
      hover:    '#1E1E30',
      selected: '#1A1A2E',
    },
    accent: {
      DEFAULT: '#7C3AED',
      bright:  '#8B5CF6',
      hover:   '#9061F9',
    },
    lavender: '#A78BFA',
    text: {
      primary:   '#EEEEF5',
      secondary: '#8B8BA8',
      muted:     '#55556A',
    },
    border: {
      DEFAULT: '#1F1F2E',
      subtle:  '#191927',
      strong:  '#2A2A3E',
    },
    severity: {
      critical: '#DC2626',
      high:     '#EA580C',
      medium:   '#CA8A04',
      low:      '#3B82F6',
      success:  '#16A34A',
    },
  },
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
  },
} as const;

export type Theme = typeof theme;
