import { Link } from 'react-router-dom';
import { MapPin, Bookmark, Check, Circle } from 'lucide-react';
import type { Job } from '../../types';
import { Card, Badge, Button } from '../ui';
import { cn } from '../../utils/cn';

interface JobCardProps {
  job: Job;
  onToggleSave: (id: string) => void;
}

function compatColor(pct: number) {
  if (pct >= 75) return 'text-success-600 dark:text-success-500';
  if (pct >= 50) return 'text-warning-600 dark:text-warning-500';
  return 'text-danger-600 dark:text-danger-500';
}

export function JobCard({ job, onToggleSave }: JobCardProps) {
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <Link to={`/jobs/${job.id}`} className="text-base font-semibold text-ink-light hover:text-primary-600 dark:text-ink-dark dark:hover:text-primary-300">
            {job.title}
          </Link>
          <p className="mt-0.5 text-sm text-muted-light dark:text-muted-dark">{job.company}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-light dark:text-muted-dark">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {job.remote ? 'Remote' : job.location}
            </span>
            <span>{job.salary}</span>
            <span>{job.experience}</span>
            <Badge variant="neutral">{job.type}</Badge>
          </div>
        </div>
        <div className="text-right">
          <p className={cn('text-xl font-bold tabular font-display', compatColor(job.compatibility))}>{job.compatibility}%</p>
          <p className="text-[10px] text-muted-light dark:text-muted-dark">match</p>
        </div>
      </div>

      <div className="mb-4 space-y-1.5">
        <p className="text-xs font-medium text-muted-light dark:text-muted-dark">Why this matches you</p>
        <div className="flex flex-wrap gap-1.5">
          {job.matchingSkills.slice(0, 4).map((s) => (
            <Badge key={s} variant="success">
              <Check className="h-3 w-3" /> {s}
            </Badge>
          ))}
          {job.missingSkills.slice(0, 3).map((s) => (
            <Badge key={s} variant="neutral">
              <Circle className="h-2.5 w-2.5" /> {s}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to={`/jobs/${job.id}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          View Job
        </Link>
        <Button size="sm" variant="outline" icon={<Bookmark className={cn('h-3.5 w-3.5', job.saved && 'fill-primary-600 text-primary-600')} />} onClick={() => onToggleSave(job.id)}>
          {job.saved ? 'Saved' : 'Save'}
        </Button>
      </div>
    </Card>
  );
}
