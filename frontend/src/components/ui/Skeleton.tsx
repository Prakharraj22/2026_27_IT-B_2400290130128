import { cn } from '../../utils/cn';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-canvas-light dark:bg-white/5', className)} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-5">
      <Skeleton className="mb-3 h-5 w-1/3" />
      <Skeleton className="mb-2 h-3.5 w-full" />
      <Skeleton className="mb-4 h-3.5 w-2/3" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}
