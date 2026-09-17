import { type ReactNode } from 'react';
import { cn } from '../../utils/cn';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'ai';

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200',
  success: 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500',
  warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500',
  danger: 'bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-500',
  neutral: 'bg-canvas-light dark:bg-white/5 text-muted-light dark:text-muted-dark border border-border-light dark:border-border-dark',
  ai: 'bg-ai-light/10 text-ai-light dark:text-ai-dark dark:bg-ai-dark/10',
};

export function Badge({ variant = 'neutral', children, className }: { variant?: BadgeVariant; children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium', variantClasses[variant], className)}>
      {children}
    </span>
  );
}
