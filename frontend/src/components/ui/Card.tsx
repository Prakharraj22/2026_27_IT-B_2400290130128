import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  accent?: 'primary' | 'success' | 'warning' | 'danger' | 'ai' | 'none';
  interactive?: boolean;
}

const accentClasses: Record<NonNullable<CardProps['accent']>, string> = {
  primary: 'border-l-2 border-l-primary-500',
  success: 'border-l-2 border-l-success-500',
  warning: 'border-l-2 border-l-warning-500',
  danger: 'border-l-2 border-l-danger-500',
  ai: 'border-l-2 border-l-ai-light dark:border-l-ai-dark',
  none: '',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, accent = 'none', interactive, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-card dark:shadow-card-dark',
        accentClasses[accent],
        interactive && 'transition-shadow hover:shadow-md cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card';
