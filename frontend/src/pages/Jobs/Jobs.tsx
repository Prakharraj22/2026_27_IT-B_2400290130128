import { useEffect, useMemo, useState } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { SearchBar, FilterGroup, FilterChip, SkeletonCard, EmptyState } from '../../components/ui';
import { JobCard } from '../../components/jobs/JobCard';
import { getRecommendedJobs, toggleSaveJob } from '../../services/api/jobsApi';
import type { Job } from '../../types';
import { Briefcase } from 'lucide-react';

const jobTypes = ['Full-time', 'Internship', 'Contract', 'Part-time'] as const;

export function Jobs() {
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [query, setQuery] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [activeType, setActiveType] = useState<string | null>(null);

  useEffect(() => {
    getRecommendedJobs().then(setJobs);
  }, []);

  const handleToggleSave = (id: string) => toggleSaveJob(id).then(setJobs);

  const filtered = useMemo(() => {
    if (!jobs) return [];
    return jobs
      .filter((j) => !query || j.title.toLowerCase().includes(query.toLowerCase()) || j.company.toLowerCase().includes(query.toLowerCase()) || j.requiredSkills.some((s) => s.toLowerCase().includes(query.toLowerCase())))
      .filter((j) => !remoteOnly || j.remote)
      .filter((j) => !activeType || j.type === activeType)
      .sort((a, b) => b.compatibility - a.compatibility);
  }, [jobs, query, remoteOnly, activeType]);

  return (
    <div>
      <Topbar title="Jobs For You" subtitle="Ranked by how well they match your profile." />
      <h1 className="mb-6 text-xl font-bold lg:hidden">Jobs For You</h1>

      <SearchBar value={query} onChange={setQuery} placeholder="Search jobs, companies or skills..." className="mb-5" />

      <div className="mb-6">
        <FilterGroup label="Job Type">
          <FilterChip label="All" active={activeType === null} onClick={() => setActiveType(null)} />
          {jobTypes.map((t) => (
            <FilterChip key={t} label={t} active={activeType === t} onClick={() => setActiveType(t)} />
          ))}
        </FilterGroup>
        <FilterGroup label="Location">
          <FilterChip label="Remote only" active={remoteOnly} onClick={() => setRemoteOnly((r) => !r)} />
        </FilterGroup>
      </div>

      {!jobs ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-5 w-5" />}
          title="No jobs match your filters"
          description="Try adjusting your search or clearing filters to see more results."
          actionLabel="Clear filters"
          onAction={() => {
            setQuery('');
            setRemoteOnly(false);
            setActiveType(null);
          }}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((j) => <JobCard key={j.id} job={j} onToggleSave={handleToggleSave} />)}
        </div>
      )}
    </div>
  );
}
