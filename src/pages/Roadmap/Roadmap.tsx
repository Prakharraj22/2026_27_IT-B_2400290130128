import { useEffect, useState } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, ProgressBar, Skeleton } from '../../components/ui';
import { RoadmapStepItem } from '../../components/roadmap/RoadmapStepItem';
import { getRoadmap, markStepComplete } from '../../services/api/roadmapApi';
import { useToast } from '../../components/ui/Toast';
import type { RoadmapStep } from '../../types';

export function Roadmap() {
  const [steps, setSteps] = useState<RoadmapStep[] | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    getRoadmap().then(setSteps);
  }, []);

  const handleComplete = async (id: string) => {
    const updated = await markStepComplete(id);
    setSteps(updated);
    showToast('Step marked complete!', 'success');
  };

  const overallProgress = steps
    ? Math.round(steps.reduce((sum, s) => sum + s.progress, 0) / steps.length)
    : 0;

  return (
    <div>
      <Topbar title="Your Personalized Roadmap" subtitle="Your path from current skills to your target career." />
      <div className="mb-6 lg:hidden">
        <h1 className="text-xl font-bold">Your Personalized Roadmap</h1>
        <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">Your path from current skills to your target career.</p>
      </div>

      <Card className="mb-8 p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-ink-light dark:text-ink-dark">Overall Progress</p>
          <p className="text-sm tabular text-muted-light dark:text-muted-dark">{overallProgress}%</p>
        </div>
        <ProgressBar value={overallProgress} />
      </Card>

      {!steps ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : (
        <div>
          {steps.map((step, i) => (
            <RoadmapStepItem key={step.id} step={step} isLast={i === steps.length - 1} onMarkComplete={handleComplete} />
          ))}
        </div>
      )}
    </div>
  );
}
