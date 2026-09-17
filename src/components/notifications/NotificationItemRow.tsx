import { FileText, Compass, Map, Briefcase, Target, User } from 'lucide-react';
import type { NotificationItem } from '../../types';
import { cn } from '../../utils/cn';

const iconMap = {
  career: Compass,
  resume: FileText,
  job: Briefcase,
  roadmap: Map,
  skill: Target,
  profile: User,
};

export function NotificationItemRow({ item, onRead }: { item: NotificationItem; onRead: (id: string) => void }) {
  const Icon = iconMap[item.type];

  return (
    <button
      onClick={() => !item.read && onRead(item.id)}
      className={cn(
        'flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors',
        item.read
          ? 'border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark'
          : 'border-primary-200 dark:border-primary-800 bg-primary-50/60 dark:bg-primary-900/20'
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-ink-light dark:text-ink-dark">{item.title}</p>
          {!item.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600" />}
        </div>
        <p className="mt-0.5 text-sm text-muted-light dark:text-muted-dark">{item.message}</p>
        <p className="mt-1 text-xs text-muted-light dark:text-muted-dark">{item.timestamp}</p>
      </div>
    </button>
  );
}
