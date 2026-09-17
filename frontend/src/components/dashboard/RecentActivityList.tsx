import { FileText, Compass, Map, Briefcase } from 'lucide-react';
import type { ActivityItem } from '../../types';
import { Card } from '../ui';

const iconMap = { resume: FileText, career: Compass, roadmap: Map, job: Briefcase };

export function RecentActivityList({ items }: { items: ActivityItem[] }) {
  return (
    <Card className="p-5">
      <h3 className="mb-4 text-sm font-semibold text-ink-light dark:text-ink-dark">Recent Activity</h3>
      <div className="space-y-4">
        {items.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <div key={item.id} className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-canvas-light dark:bg-white/5 text-muted-light dark:text-muted-dark">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-sm text-ink-light dark:text-ink-dark">{item.label}</p>
                <p className="text-xs text-muted-light dark:text-muted-dark">{item.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
