import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({ message = 'Something went wrong.', onRetry }: { message?: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border-light dark:border-border-dark px-6 py-14 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-50 text-danger-500 dark:bg-danger-500/10">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <h3 className="mb-1.5 text-base font-semibold text-ink-light dark:text-ink-dark">{message}</h3>
      <p className="mb-5 max-w-sm text-sm text-muted-light dark:text-muted-dark">
        That request didn\u2019t go through. Check your connection and try again.
      </p>
      <Button onClick={onRetry} variant="outline" size="sm">
        Try Again
      </Button>
    </div>
  );
}
