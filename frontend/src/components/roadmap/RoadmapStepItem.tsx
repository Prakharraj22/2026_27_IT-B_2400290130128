import { useState } from 'react';
import { Check, Circle, Lock, Clock, BookOpen } from 'lucide-react';
import type { RoadmapStep } from '../../types';
import { Card, Badge, ProgressBar, Button } from '../ui';
import { cn } from '../../utils/cn';

const statusConfig = {
  Completed: { icon: Check, dot: 'bg-success-500 text-white', badge: 'success' as const },
  'In Progress': { icon: Circle, dot: 'bg-primary-500 text-white', badge: 'primary' as const },
  'Not Started': { icon: Circle, dot: 'bg-canvas-light dark:bg-white/10 text-muted-light dark:text-muted-dark border border-border-light dark:border-border-dark', badge: 'neutral' as const },
  Locked: { icon: Lock, dot: 'bg-canvas-light dark:bg-white/10 text-muted-light dark:text-muted-dark border border-border-light dark:border-border-dark', badge: 'neutral' as const },
};

interface RoadmapStepItemProps {
  step: RoadmapStep;
  isLast: boolean;
  onMarkComplete: (id: string) => void;
}

export function RoadmapStepItem({ step, isLast, onMarkComplete }: RoadmapStepItemProps) {
  const [expanded, setExpanded] = useState(step.status === 'In Progress');
  const config = statusConfig[step.status];
  const Icon = config.icon;

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', config.dot)}>
          <Icon className="h-4 w-4" />
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-border-light dark:bg-border-dark" />}
      </div>

      <Card
        interactive
        onClick={() => setExpanded((e) => !e)}
        className={cn('mb-5 flex-1 p-4', step.status === 'Locked' && 'opacity-60')}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-ink-light dark:text-ink-dark">{step.skill}</h4>
              {step.status === 'In Progress' && <Badge variant={config.badge}>In Progress</Badge>}
            </div>
            <p className="mt-1 text-xs text-muted-light dark:text-muted-dark">{step.description}</p>
          </div>
          <span className="shrink-0 text-xs tabular text-muted-light dark:text-muted-dark">{step.progress}%</span>
        </div>

        {step.status !== 'Not Started' && step.status !== 'Locked' && (
          <ProgressBar value={step.progress} className="mt-3" size="sm" color={step.status === 'Completed' ? 'success' : 'primary'} />
        )}

        {expanded && (
          <div className="mt-4 space-y-3 border-t border-border-light dark:border-border-dark pt-4">
            {step.prerequisites.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-light dark:text-muted-dark">
                <span className="font-medium">Prerequisites:</span>
                {step.prerequisites.map((p) => (
                  <Badge key={p} variant="neutral">{p}</Badge>
                ))}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-muted-light dark:text-muted-dark">
              <Clock className="h-3.5 w-3.5" /> Estimated time: {step.estimatedTime}
            </div>
            <div className="space-y-1">
              {step.resources.map((r) => (
                <div key={r.title} className="flex items-center gap-1.5 text-xs text-ink-light dark:text-ink-dark">
                  <BookOpen className="h-3.5 w-3.5 text-primary-500" /> {r.title}
                  <Badge variant="neutral" className="ml-1">{r.type}</Badge>
                </div>
              ))}
            </div>
            {step.status !== 'Completed' && step.status !== 'Locked' && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkComplete(step.id);
                }}
              >
                Mark Complete
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
