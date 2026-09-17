import { X } from 'lucide-react';
import type { UserSkill } from '../../types';
import { ProgressBar } from '../ui';

const proficiencyPct: Record<UserSkill['proficiency'], number> = {
  Beginner: 35,
  Intermediate: 65,
  Advanced: 90,
};

export function SkillCard({ skill, onRemove }: { skill: UserSkill; onRemove?: (name: string) => void }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border-light dark:border-border-dark px-4 py-3">
      <div className="min-w-[110px]">
        <p className="text-sm font-medium text-ink-light dark:text-ink-dark">{skill.name}</p>
      </div>
      <ProgressBar value={proficiencyPct[skill.proficiency]} className="flex-1" size="sm" />
      <span className="w-24 shrink-0 text-right text-xs text-muted-light dark:text-muted-dark">{skill.proficiency}</span>
      {onRemove && (
        <button
          onClick={() => onRemove(skill.name)}
          aria-label={`Remove ${skill.name}`}
          className="shrink-0 rounded-lg p-1 text-muted-light hover:bg-danger-50 hover:text-danger-500 dark:text-muted-dark dark:hover:bg-danger-500/10"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
