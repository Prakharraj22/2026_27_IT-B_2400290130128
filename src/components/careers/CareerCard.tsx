import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import type { Career } from '../../types';
import { Card, Badge, CircularProgress } from '../ui';

export function CareerCard({ career }: { career: Career }) {
  return (
    <Card interactive className="p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-ink-light dark:text-ink-dark">{career.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-light dark:text-muted-dark">{career.description}</p>
        </div>
        <CircularProgress value={career.alignment} size={56} strokeWidth={5} />
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {career.matchingSkills.slice(0, 3).map((s) => (
          <Badge key={s} variant="success">
            <Check className="h-3 w-3" /> {s}
          </Badge>
        ))}
        {career.missingSkills.slice(0, 2).map((s) => (
          <Badge key={s} variant="neutral">
            {s}
          </Badge>
        ))}
      </div>

      <Link
        to={`/careers/${career.id}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300"
      >
        View Details <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </Card>
  );
}
