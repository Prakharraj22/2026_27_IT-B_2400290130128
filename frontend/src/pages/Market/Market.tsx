import { useEffect, useState } from 'react';
import { TrendingUp, MapPin, IndianRupee, Sparkles } from 'lucide-react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, Badge, Skeleton } from '../../components/ui';
import {
  getTrendingSkills, getEmergingTechnologies, getDemandByLocation, getSalaryTrends,
} from '../../services/api/marketApi';
import type { TrendingSkill } from '../../types';

export function Market() {
  const [trending, setTrending] = useState<TrendingSkill[] | null>(null);
  const [emerging, setEmerging] = useState<string[] | null>(null);
  const [locations, setLocations] = useState<{ location: string; demand: number }[] | null>(null);
  const [salaries, setSalaries] = useState<{ role: string; range: string; median: string }[] | null>(null);

  useEffect(() => {
    getTrendingSkills().then(setTrending);
    getEmergingTechnologies().then(setEmerging);
    getDemandByLocation().then(setLocations);
    getSalaryTrends().then(setSalaries);
  }, []);

  const maxDemand = trending ? Math.max(...trending.map((t) => t.demandChange)) : 1;

  return (
    <div>
      <Topbar title="Market Intelligence" subtitle="Demo data to guide your learning priorities." />
      <h1 className="mb-6 text-xl font-bold lg:hidden">Market Intelligence</h1>

      <div className="mb-2 flex items-center gap-1.5">
        <Badge variant="neutral">Demo data — for illustration only</Badge>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold"><TrendingUp className="h-4 w-4" /> Trending Skills</h2>
          {!trending ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <div className="space-y-3">
              {trending.map((s) => (
                <div key={s.name} className="flex items-center gap-3">
                  <div className="w-28 shrink-0 text-sm text-ink-light dark:text-ink-dark">{s.name}</div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-canvas-light dark:bg-white/5">
                    <div className="h-full rounded-full bg-primary-500" style={{ width: `${(s.demandChange / maxDemand) * 100}%` }} />
                  </div>
                  <span className="w-20 shrink-0 text-right text-xs font-medium tabular text-success-600 dark:text-success-500">{s.demandChange} postings</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Sparkles className="h-4 w-4" /> Emerging Technologies</h2>
          {!emerging ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {emerging.map((e) => <Badge key={e} variant="ai">{e}</Badge>)}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4" /> Location Trends</h2>
          {!locations ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <div className="space-y-3">
              {locations.map((l) => (
                <div key={l.location}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-ink-light dark:text-ink-dark">{l.location}</span>
                    <span className="tabular text-muted-light dark:text-muted-dark">{l.demand}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-canvas-light dark:bg-white/5">
                    <div className="h-full rounded-full bg-primary-500" style={{ width: `${l.demand}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold"><IndianRupee className="h-4 w-4" /> Salary Information</h2>
          {!salaries ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-light dark:border-border-dark text-left text-xs uppercase tracking-wide text-muted-light dark:text-muted-dark">
                    <th className="py-2 pr-4 font-medium">Role</th>
                    <th className="py-2 pr-4 font-medium">Range</th>
                    <th className="py-2 font-medium">Median</th>
                  </tr>
                </thead>
                <tbody>
                  {salaries.map((s) => (
                    <tr key={s.role} className="border-b border-border-light dark:border-border-dark last:border-0">
                      <td className="py-2.5 pr-4 text-ink-light dark:text-ink-dark">{s.role}</td>
                      <td className="py-2.5 pr-4 text-muted-light dark:text-muted-dark">{s.range}</td>
                      <td className="py-2.5 font-medium text-ink-light dark:text-ink-dark">{s.median}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
