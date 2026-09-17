import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Circle, Sparkles, Briefcase, BookOpen, FolderKanban, TrendingUp } from 'lucide-react';
import { Card, Badge, Skeleton, ErrorState } from '../../components/ui';
import { AIInsight } from '../../components/dashboard/AIInsight';
import { getCareerDetails } from '../../services/api/careerApi';
import type { Career } from '../../types';

export function CareerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [career, setCareer] = useState<Career | null | undefined>(undefined);

  const load = () => {
    if (!id) return;
    setCareer(undefined);
    getCareerDetails(id).then((c) => setCareer(c ?? null));
  };

  useEffect(load, [id]);

  if (career === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (career === null) {
    return <ErrorState message="Career not found." onRetry={load} />;
  }

  return (
    <div>
      <button onClick={() => navigate(-1)} className="mb-5 flex items-center gap-1.5 text-sm font-medium text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{career.title}</h1>
          <p className="mt-1 max-w-lg text-sm text-muted-light dark:text-muted-dark">{career.description}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="primary">{career.alignment}% alignment</Badge>
          <Badge variant={career.demand === 'High' ? 'success' : 'warning'}>{career.demand} demand</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <h2 className="mb-3 text-base font-semibold">Overview</h2>
            <p className="text-sm leading-relaxed text-muted-light dark:text-muted-dark">
              A {career.title.toLowerCase()} typically works on {career.requiredSkills.slice(0, 3).join(', ')} and related tools to
              deliver production-ready systems. Median compensation for this role is around {career.medianSalary}, with {career.demand.toLowerCase()} hiring demand.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="mb-3 text-base font-semibold">Required Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {career.requiredSkills.map((s) => <Badge key={s} variant="neutral">{s}</Badge>)}
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-6">
              <h2 className="mb-3 text-base font-semibold">Your Skills</h2>
              <div className="space-y-2">
                {career.matchingSkills.map((s) => (
                  <div key={s} className="flex items-center gap-2 text-sm text-ink-light dark:text-ink-dark">
                    <Check className="h-4 w-4 text-success-500" /> {s}
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <h2 className="mb-3 text-base font-semibold">Skill Gaps</h2>
              <div className="space-y-2">
                {career.missingSkills.map((s) => (
                  <div key={s} className="flex items-center gap-2 text-sm text-ink-light dark:text-ink-dark">
                    <Circle className="h-3.5 w-3.5 text-muted-light dark:text-muted-dark" /> {s}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold"><TrendingUp className="h-4 w-4" /> Career Roadmap</h2>
            <div className="flex flex-wrap items-center gap-2">
              {[...career.matchingSkills, ...career.missingSkills].map((s, i, arr) => (
                <div key={s} className="flex items-center gap-2">
                  <Badge variant={career.matchingSkills.includes(s) ? 'success' : 'neutral'}>{s}</Badge>
                  {i < arr.length - 1 && <div className="h-px w-4 bg-border-light dark:bg-border-dark" />}
                </div>
              ))}
            </div>
            <Link to="/roadmap" className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300">
              View your personalized roadmap →
            </Link>
          </Card>

          <Card className="p-6">
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold"><FolderKanban className="h-4 w-4" /> Recommended Projects</h2>
            <ul className="space-y-1.5 text-sm text-ink-light dark:text-ink-dark">
              {career.recommendedProjects.map((p) => <li key={p}>• {p}</li>)}
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold"><BookOpen className="h-4 w-4" /> Learning Suggestions</h2>
            <ul className="space-y-1.5 text-sm text-ink-light dark:text-ink-dark">
              {career.learningSuggestions.map((l) => <li key={l}>• {l}</li>)}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <AIInsight text={`Why this career fits your profile: ${career.aiExplanation}`} />
          <Card className="p-6">
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold"><Briefcase className="h-4 w-4" /> Potential Job Roles</h2>
            <div className="space-y-2">
              {career.potentialRoles.map((r) => (
                <div key={r} className="rounded-lg border border-border-light dark:border-border-dark px-3 py-2 text-sm text-ink-light dark:text-ink-dark">
                  {r}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-light dark:text-muted-dark">Median salary: <span className="font-medium text-ink-light dark:text-ink-dark">{career.medianSalary}</span></p>
          </Card>
          <Link to="/jobs" className="flex items-center justify-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700">
            <Sparkles className="h-4 w-4" /> Browse matching jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
