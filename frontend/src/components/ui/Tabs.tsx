import { useId, useState, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

export function Tabs({ tabs, defaultTab }: { tabs: Tab[]; defaultTab?: string }) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id);
  const activeTab = tabs.find((t) => t.id === active);
  const uid = useId();

  const move = (delta: number) => {
    const i = tabs.findIndex((t) => t.id === active);
    const next = tabs[(i + delta + tabs.length) % tabs.length];
    if (next) setActive(next.id);
  };

  return (
    <div>
      <div role="tablist" className="no-scrollbar flex gap-1 overflow-x-auto border-b border-border-light dark:border-border-dark">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`${uid}-tab-${tab.id}`}
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`${uid}-panel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => setActive(tab.id)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') move(1);
              if (e.key === 'ArrowLeft') move(-1);
            }}
            className={cn(
              'relative shrink-0 px-4 py-2.5 text-sm font-medium transition-colors',
              active === tab.id
                ? 'text-primary-600 dark:text-primary-300'
                : 'text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark'
            )}
          >
            {tab.label}
            {active === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary-600 dark:bg-primary-400" />}
          </button>
        ))}
      </div>
      {activeTab && (
        <div id={`${uid}-panel-${activeTab.id}`} role="tabpanel" aria-labelledby={`${uid}-tab-${activeTab.id}`} className="pt-5">
          {activeTab.content}
        </div>
      )}
    </div>
  );
}
