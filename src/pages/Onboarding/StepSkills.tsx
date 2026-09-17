import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Card, SearchBar, Select, Badge } from '../../components/ui';
import { allSkillsCatalog } from '../../data/skills';
import type { OnboardingData } from './Onboarding';
import type { Proficiency } from '../../types';

export function StepSkills({ data, update }: { data: OnboardingData; update: (u: Partial<OnboardingData>) => void }) {
  const [query, setQuery] = useState('');
  const [proficiency, setProficiency] = useState<Proficiency>('Intermediate');

  const suggestions = allSkillsCatalog
    .filter((s) => s.toLowerCase().includes(query.toLowerCase()) && !data.skills.some((sk) => sk.name === s))
    .slice(0, 6);

  const addSkill = (name: string) => {
    update({ skills: [...data.skills, { name, proficiency }] });
    setQuery('');
  };

  const removeSkill = (name: string) => update({ skills: data.skills.filter((s) => s.name !== name) });

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold">Your Skills</h2>
      <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">Search and add the skills you already have.</p>

      <div className="mt-5 flex gap-2">
        <SearchBar value={query} onChange={setQuery} placeholder="Search skills, e.g. Java, React..." className="flex-1" />
        <Select value={proficiency} onChange={(e) => setProficiency(e.target.value as Proficiency)} className="w-36">
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </Select>
      </div>

      {query && suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => addSkill(s)}
              className="flex items-center gap-1 rounded-full border border-border-light dark:border-border-dark px-2.5 py-1 text-xs text-ink-light dark:text-ink-dark hover:border-primary-400"
            >
              <Plus className="h-3 w-3" /> {s}
            </button>
          ))}
        </div>
      )}

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark">
          Added skills ({data.skills.length})
        </p>
        {data.skills.length === 0 ? (
          <p className="text-sm text-muted-light dark:text-muted-dark">No skills added yet. Search above to get started.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s) => (
              <Badge key={s.name} variant="primary" className="py-1.5">
                {s.name} <span className="text-primary-500 dark:text-primary-300">· {s.proficiency}</span>
                <button onClick={() => removeSkill(s.name)} aria-label={`Remove ${s.name}`}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
