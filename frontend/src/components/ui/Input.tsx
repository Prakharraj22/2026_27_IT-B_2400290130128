import { type InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, type, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-light dark:text-ink-dark">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            className={cn(
              'w-full rounded-xl border bg-surface-light dark:bg-surface-dark px-3.5 py-2.5 text-sm text-ink-light dark:text-ink-dark placeholder:text-muted-light dark:placeholder:text-muted-dark transition-colors',
              'focus-visible:ring-2 focus-visible:ring-primary-500',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error ? 'border-danger-500' : 'border-border-light dark:border-border-dark',
              isPassword && 'pr-10',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-danger-500">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-muted-light dark:text-muted-dark">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
