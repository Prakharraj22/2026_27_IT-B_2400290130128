import { useEffect, useState } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { CareerCard } from '../../components/careers/CareerCard';
import { SkeletonCard } from '../../components/ui';
import { getCareerRecommendations } from '../../services/api/careerApi';
import type { Career } from '../../types';

export function Careers() {
  const [careers, setCareers] = useState<Career[] | null>(null);

  useEffect(() => {
    getCareerRecommendations().then(setCareers);
  }, []);

  return (
    <div>
      <Topbar title="Explore Your Career Paths" subtitle="Ranked by how well they fit your current profile." />
      <h1 className="mb-6 text-xl font-bold lg:hidden">Explore Your Career Paths</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {careers ? careers.map((c) => <CareerCard key={c.id} career={c} />) : [1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}
