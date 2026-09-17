import { Check } from 'lucide-react';
import { Card } from '../../components/ui';
import type { OnboardingData } from './Onboarding';
import { cn } from '../../utils/cn';

const interestOptions = [
  'Software Development', 'Web Development', 'AI/ML', 'Data Science',
  'Cybersecurity', 'Cloud', 'Data Analytics', 'Product',
];

export function StepInterests({ data, update }: { data: OnboardingData; update: (u: Partial<OnboardingData>) => void }) {
  const toggle = (interest: string) => {
    const has = data.interests.includes(interest);
    update({ interests: has ? data.interests.filter((i) => i !== interest) : [...data.interests, interest] });
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold">Your Interests</h2>
      <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">Pick the areas you\u2019d like to explore or grow in.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {interestOptions.map((interest) => {
          const active = data.interests.includes(interest);
          return (
            <button
              key={interest}
              onClick={() => toggle(interest)}
              aria-pressed={active}
              className={cn(
                'flex items-center justify-between gap-2 rounded-xl border px-3.5 py-3 text-left text-sm font-medium transition-colors',
                active
                  ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-200'
                  : 'border-border-light dark:border-border-dark text-ink-light dark:text-ink-dark hover:border-primary-300'
              )}
            >
              {interest}
              {active && <Check className="h-4 w-4 shrink-0" />}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
