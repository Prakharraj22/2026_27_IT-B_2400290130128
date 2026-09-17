import { Card } from '../../components/ui';
import type { OnboardingData } from './Onboarding';
import { careers } from '../../data/careers';
import { cn } from '../../utils/cn';

export function StepCareerGoal({ data, update }: { data: OnboardingData; update: (u: Partial<OnboardingData>) => void }) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold">Career Goal</h2>
      <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">I want to become a...</p>
      <div className="mt-6 space-y-2.5">
        {careers.map((c) => (
          <button
            key={c.id}
            onClick={() => update({ careerGoal: c.title })}
            className={cn(
              'flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors',
              data.careerGoal === c.title
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                : 'border-border-light dark:border-border-dark hover:border-primary-300'
            )}
          >
            <div>
              <p className="text-sm font-semibold text-ink-light dark:text-ink-dark">{c.title}</p>
              <p className="mt-0.5 text-xs text-muted-light dark:text-muted-dark">{c.description}</p>
            </div>
            <div
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                data.careerGoal === c.title ? 'border-primary-600 bg-primary-600' : 'border-border-light dark:border-border-dark'
              )}
            >
              {data.careerGoal === c.title && <div className="h-2 w-2 rounded-full bg-white" />}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
