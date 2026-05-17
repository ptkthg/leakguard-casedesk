import { cn } from '@/lib/utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'secondary',
  size = 'md',
  className,
  children,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-1 focus:ring-offset-[var(--color-bg-panel)] disabled:opacity-40 disabled:cursor-not-allowed',
        {
          'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white shadow-lg shadow-[var(--color-accent)]/20': variant === 'primary',
          'bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-primary)] border border-[var(--color-border-strong)]': variant === 'secondary',
          'hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]': variant === 'ghost',
          'bg-[var(--color-critical-muted)] hover:bg-[rgba(220,38,38,0.2)] text-[var(--color-critical)] border border-[var(--color-critical-border)]': variant === 'danger',
          'border border-[var(--color-border-strong)] hover:border-[var(--color-accent-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-lavender)] hover:bg-[var(--color-accent-muted)]': variant === 'outline',
        },
        {
          'px-2 py-1 text-xs': size === 'sm',
          'px-3 py-1.5 text-sm': size === 'md',
          'px-4 py-2 text-sm': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
