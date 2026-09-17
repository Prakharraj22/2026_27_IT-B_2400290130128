import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Bookmark, Check, Circle, Building2 } from 'lucide-react';
import { Card, Badge, Button, Skeleton, ErrorState } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import { getJobDetails, toggleSaveJob } from '../../services/api/jobsApi';
import type { Job } from '../../types';
import { cn } from '../../utils/cn';

function compatColor(pct: number) {
  if (pct >= 75) return 'text-success-600 dark:text-success-500';
  if (pct >= 50) return 'text-warning-600 dark:text-warning-500';
  return 'text-danger-600 dark:text-danger-500';
}

export function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null | undefined>(undefined);
  const { showToast } = useToast();

  const load = () => {
    if (!id) return;
    setJob(undefined);
    getJobDetails(id).then((j) => setJob(j ?? null));
  };

  useEffect(load, [id]);

  const handleSave = async () => {
    if (!id) return;
    const updated = await toggleSaveJob(id);
    const updatedJob = updated.find((j) => j.id === id) ?? null;
    setJob(updatedJob);
    showToast(updatedJob?.saved ? 'Job saved.' : 'Removed from saved jobs.', 'success');
  };

  if (job === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (job === null) {
    return <ErrorState message="Job not found." onRetry={load} />;
  }

  return (
    <div>
      <button onClick={() => navigate(-1)} className="mb-5 flex items-center gap-1.5 text-sm font-medium text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">{job.company}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-light dark:text-muted-dark">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.remote ? 'Remote' : job.location}</span>
            <span>{job.salary}</span>
            <span>{job.experience}</span>
            <Badge variant="neutral">{job.type}</Badge>
          </div>
        </div>
        <div className="text-right">
          <p className={cn('text-3xl font-bold tabular font-display', compatColor(job.compatibility))}>{job.compatibility}%</p>
          <p className="text-xs text-muted-light dark:text-muted-dark">Your Match</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <h2 className="mb-3 text-sm font-semibold">Matching Skills</h2>
              <div className="space-y-2">
                {job.matchingSkills.map((s) => (
                  <div key={s} className="flex items-center gap-2 text-sm text-ink-light dark:text-ink-dark"><Check className="h-4 w-4 text-success-500" /> {s}</div>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <h2 className="mb-3 text-sm font-semibold">Missing Skills</h2>
              <div className="space-y-2">
                {job.missingSkills.length === 0 ? (
                  <p className="text-sm text-muted-light dark:text-muted-dark">None — you meet every required skill.</p>
                ) : job.missingSkills.map((s) => (
                  <div key={s} className="flex items-center gap-2 text-sm text-ink-light dark:text-ink-dark"><Circle className="h-3.5 w-3.5 text-muted-light dark:text-muted-dark" /> {s}</div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="mb-3 text-base font-semibold">Job Description</h2>
            <p className="text-sm leading-relaxed text-muted-light dark:text-muted-dark">{job.description}</p>
          </Card>

          <Card className="p-6">
            <h2 className="mb-3 text-base font-semibold">Requirements</h2>
            <ul className="space-y-1.5 text-sm text-ink-light dark:text-ink-dark">
              {job.requirements.map((r) => <li key={r}>• {r}</li>)}
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="mb-3 text-base font-semibold">Responsibilities</h2>
            <ul className="space-y-1.5 text-sm text-ink-light dark:text-ink-dark">
              {job.responsibilities.map((r) => <li key={r}>• {r}</li>)}
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="mb-3 text-base font-semibold">Benefits</h2>
            <div className="flex flex-wrap gap-1.5">
              {job.benefits.map((b) => <Badge key={b} variant="primary">{b}</Badge>)}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-3 p-5">
            <Button fullWidth onClick={() => showToast('Application submitted (demo).', 'success')}>Apply Now</Button>
            <Button
              fullWidth
              variant="outline"
              icon={<Bookmark className={cn('h-4 w-4', job.saved && 'fill-primary-600 text-primary-600')} />}
              onClick={handleSave}
            >
              {job.saved ? 'Saved' : 'Save Job'}
            </Button>
          </Card>
          <Card className="p-5">
            <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold"><Building2 className="h-4 w-4" /> Company Information</h2>
            <p className="text-sm leading-relaxed text-muted-light dark:text-muted-dark">{job.companyInfo}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
