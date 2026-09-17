import { Card, Input, Select } from '../../components/ui';
import type { OnboardingData } from './Onboarding';

export function StepPersonal({ data, update }: { data: OnboardingData; update: (u: Partial<OnboardingData>) => void }) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold">Personal Information</h2>
      <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">Let\u2019s start with the basics.</p>
      <div className="mt-6 space-y-4">
        <Input label="Name" placeholder="Your full name" value={data.name} onChange={(e) => update({ name: e.target.value })} />
        <Input label="Location" placeholder="City, Country" value={data.location} onChange={(e) => update({ location: e.target.value })} />
        <Input label="Education" placeholder="e.g. B.Tech, Computer Science" value={data.education} onChange={(e) => update({ education: e.target.value })} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Graduation Year" type="number" placeholder="2026" value={data.graduationYear} onChange={(e) => update({ graduationYear: e.target.value })} />
          <Select label="Experience Level" value={data.experienceLevel} onChange={(e) => update({ experienceLevel: e.target.value })}>
            <option value="">Select</option>
            <option>Student</option>
            <option>Fresher</option>
            <option>1-3 years</option>
            <option>3-5 years</option>
            <option>5+ years</option>
          </Select>
        </div>
      </div>
    </Card>
  );
}
