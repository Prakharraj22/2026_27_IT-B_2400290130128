import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, Select, Badge, Skeleton } from '../../components/ui';
import { SkillGapCard } from '../../components/skills/SkillGapCard';
import { getSkillGap } from '../../services/api/careerApi';
import { getSkills } from '../../services/api/profileApi';
import { careers } from '../../data/careers';
import type { SkillGapItem, UserSkill } from '../../types';

export function SkillGap() {
  const [target, setTarget] = useState(careers[0].id);
  const [gap, setGap] = useState<SkillGapItem[] | null>(null);
  const [skills, setSkills] = useState<UserSkill[]>([]);

  useEffect(() => {
    setGap(null);
    getSkillGap(target).then(setGap);
  }, [target]);

  useEffect(() => {
    getSkills().then(setSkills);
  }, []);

  const grouped = {
    High: gap?.filter((g) => g.priority === 'High') ?? [],
    Medium: gap?.filter((g) => g.priority === 'Medium') ?? [],
    Low: gap?.filter((g) => g.priority === 'Low') ?? [],
  };

  return (
    <div>
      <Topbar title="Your Skill Gap" subtitle="What stands between you and your target career." />
      <div className="mb-6 flex items-center justify-between lg:hidden">
        <h1 className="text-xl font-bold">Your Skill Gap</h1>
      </div>

      <Card className="mb-6 p-4">
        <div className="max-w-xs">
          <Select label="Target career" value={target} onChange={(e) => setTarget(e.target.value)}>
            {careers.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </Select>
        </div>
      </Card>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Skills You Have</h3>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => <Badge key={s.name} variant="success"><Check className="h-3 w-3" /> {s.name}</Badge>)}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Skills You Need</h3>
          <div className="flex flex-wrap gap-1.5">
            {gap ? gap.map((g) => <Badge key={g.name} variant="neutral">{g.name}</Badge>) : <Skeleton className="h-6 w-40" />}
          </div>
        </Card>
      </div>

      <h2 className="mb-4 text-base font-semibold">Skill Priority</h2>
      {!gap ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : (
        <div className="space-y-6">
          {(['High', 'Medium', 'Low'] as const).map((priority) =>
            grouped[priority].length > 0 ? (
              <div key={priority}>
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark">{priority} priority</p>
                <div className="space-y-2.5">
                  {grouped[priority].map((item) => <SkillGapCard key={item.name} item={item} />)}
                </div>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
