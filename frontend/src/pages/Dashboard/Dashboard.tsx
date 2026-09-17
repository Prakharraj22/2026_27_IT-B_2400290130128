import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Check, Circle, ArrowRight } from 'lucide-react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, Badge, CircularProgress, ProgressBar, Button, SkeletonCard } from '../../components/ui';
import { AIInsight } from '../../components/dashboard/AIInsight';
import { CareerCard } from '../../components/careers/CareerCard';
import { JobCard } from '../../components/jobs/JobCard';
import { RecentActivityList } from '../../components/dashboard/RecentActivityList';
import { useApp } from '../../context/AppContext';
import { getCareerRecommendations } from '../../services/api/careerApi';
import { getRoadmap } from '../../services/api/roadmapApi';
import { getRecommendedJobs, getRecommendedJobsHint, toggleSaveJob } from '../../services/api/jobsApi';
import { getSkills } from '../../services/api/profileApi';
import { recentActivity } from '../../data/notifications';
import type { Career, RoadmapStep, Job, UserSkill } from '../../types';

export function Dashboard() {
  const { user } = useApp();
  const [careers, setCareers] = useState<Career[] | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapStep[] | null>(null);
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [jobsHint, setJobsHint] = useState<string | null>(null);
  const [skills, setSkills] = useState<UserSkill[] | null>(null);

  useEffect(() => {
    getCareerRecommendations().then(setCareers);
    getRoadmap().then(setRoadmap);
    getRecommendedJobs().then((result) => {
      setJobs(result);
      setJobsHint(getRecommendedJobsHint());
    });
    getSkills().then(setSkills);
  }, []);

  const handleToggleSave = (id: string) => toggleSaveJob(id).then(setJobs);

  const topCareer = careers?.[0];
  const nextRoadmapSteps = roadmap?.slice(2, 5) ?? [];
  const skillsHave = skills?.slice(0, 3) ?? [];
  const skillsGap = topCareer?.missingSkills.slice(0, 3) ?? [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  // Avoids "Good morning,  👋" (with an orphaned double space) for users
  // who haven't set a name yet.
  const firstName = user?.name?.trim().split(' ')[0];
  const greetingLine = firstName ? `${greeting}, ${firstName} 👋` : `${greeting} 👋`;

  return (
    <div>
      <Topbar title={greetingLine} subtitle="Here's your career intelligence." />
      <div className="mb-6 flex items-center justify-between lg:hidden">
        <div>
          <h1 className="text-xl font-bold">{greetingLine}</h1>
          <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">Here's your career intelligence.</p>
        </div>
      </div>

      <div className="mb-6 flex justify-end">
        <Link to="/careers">
          <Button icon={<Sparkles className="h-4 w-4" />}>Analyze My Career</Button>
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* A. Profile progress + B. Target career */}
        <Card className="p-5 lg:col-span-1">
          <h3 className="mb-4 text-sm font-semibold text-ink-light dark:text-ink-dark">Profile Progress</h3>
          <div className="flex items-center gap-4">
            <CircularProgress value={user?.profileCompleteness ?? 0} label="complete" />
            <div>
              <p className="text-sm text-muted-light dark:text-muted-dark">Add your certifications and one more project to reach 100%.</p>
              <Link to="/profile" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-300">
                Complete profile <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-light dark:text-muted-dark">Target Career</p>
              <h3 className="text-base font-semibold text-ink-light dark:text-ink-dark">{user?.targetCareer}</h3>
            </div>
            {topCareer && <Badge variant="primary">{topCareer.alignment}% alignment</Badge>}
          </div>
          {topCareer && <ProgressBar value={topCareer.alignment} showLabel />}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {skillsHave.map((s) => (
              <Badge key={s.name} variant="success"><Check className="h-3 w-3" /> {s.name}</Badge>
            ))}
            {skillsGap.slice(0, 1).map((s) => (
              <Badge key={s} variant="neutral">Next: {s}</Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* C. Career Recommendations */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Career Recommendations</h2>
          <Link to="/careers" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300">
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {careers ? careers.slice(0, 3).map((c) => <CareerCard key={c.id} career={c} />) : [1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {/* D. Skill Gap Preview */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-light dark:text-ink-dark">Skill Gap Preview</h3>
            <Link to="/skill-gap" className="text-xs font-medium text-primary-600 dark:text-primary-300">View all</Link>
          </div>
          <p className="mb-2 text-xs font-medium text-muted-light dark:text-muted-dark">Skills you have</p>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {skillsHave.map((s) => (
              <Badge key={s.name} variant="success"><Check className="h-3 w-3" /> {s.name}</Badge>
            ))}
          </div>
          <p className="mb-2 text-xs font-medium text-muted-light dark:text-muted-dark">Skills to develop</p>
          <div className="flex flex-wrap gap-1.5">
            {skillsGap.map((s) => (
              <Badge key={s} variant="neutral"><Circle className="h-2.5 w-2.5" /> {s}</Badge>
            ))}
          </div>
        </Card>

        {/* E. Roadmap Preview */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-light dark:text-ink-dark">Roadmap Preview</h3>
            <Link to="/roadmap" className="text-xs font-medium text-primary-600 dark:text-primary-300">View full roadmap</Link>
          </div>
          <div className="space-y-3">
            {nextRoadmapSteps.map((step) => (
              <div key={step.id} className="flex items-center gap-3">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  step.status === 'In Progress' ? 'bg-primary-500 text-white' : 'bg-canvas-light dark:bg-white/5 text-muted-light dark:text-muted-dark border border-border-light dark:border-border-dark'
                }`}>
                  <Circle className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-ink-light dark:text-ink-dark">{step.skill}</p>
                </div>
                {step.status === 'In Progress' && <Badge variant="primary">In Progress</Badge>}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* F. Recommended Jobs */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Recommended Jobs</h2>
          <Link to="/jobs" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300">View all</Link>
        </div>
        {jobs && jobs.length === 0 && jobsHint ? (
          <Card className="p-5 text-sm text-muted-light dark:text-muted-dark">
            {jobsHint}{' '}
            <Link to="/profile" className="font-medium text-primary-600 dark:text-primary-300">
              Update your profile
            </Link>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {jobs ? jobs.slice(0, 4).map((j) => <JobCard key={j.id} job={j} onToggleSave={handleToggleSave} />) : [1, 2].map((i) => <SkeletonCard key={i} />)}
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {/* G. AI Insight */}
        {topCareer && <AIInsight text={topCareer.aiExplanation} />}
        {/* H. Recent Activity */}
        <RecentActivityList items={recentActivity} />
      </div>
    </div>
  );
}
