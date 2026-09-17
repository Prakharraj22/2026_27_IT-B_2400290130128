import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import { StepPersonal } from './StepPersonal';
import { StepSkills } from './StepSkills';
import { StepInterests } from './StepInterests';
import { StepCareerGoal } from './StepCareerGoal';
import { StepResume } from './StepResume';
import { updateProfile } from '../../services/api/profileApi';
import type { UserSkill } from '../../types';

export interface OnboardingData {
  name: string;
  location: string;
  education: string;
  graduationYear: string;
  experienceLevel: string;
  skills: UserSkill[];
  interests: string[];
  careerGoal: string;
}

const stepLabels = ['Personal', 'Skills', 'Interests', 'Career Goal', 'Resume'];

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    name: '', location: '', education: '', graduationYear: '', experienceLevel: '',
    skills: [], interests: [], careerGoal: '',
  });
  const navigate = useNavigate();
  const { showToast } = useToast();

  const update = (updates: Partial<OnboardingData>) => setData((d) => ({ ...d, ...updates }));

  const next = () => setStep((s) => Math.min(s + 1, stepLabels.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const experienceLevels = ['Student', 'Fresher', '1-3 years', '3-5 years', '5+ years'] as const;

  // Persists everything collected in the wizard except `skills` — the
  // backend explicitly rejects writing skills through this endpoint because
  // that field is owned by the (not-yet-built) Resume Module. Best-effort:
  // a save failure shouldn't trap the user mid-onboarding.
  const finishOnboarding = async () => {
    try {
      await updateProfile({
        name: data.name || undefined,
        location: data.location || undefined,
        education: data.education || undefined,
        graduationYear: data.graduationYear ? Number(data.graduationYear) : undefined,
        experienceLevel: experienceLevels.includes(data.experienceLevel as (typeof experienceLevels)[number])
          ? (data.experienceLevel as (typeof experienceLevels)[number])
          : undefined,
        targetCareer: data.careerGoal || undefined,
      });
    } catch {
      showToast('Some profile details could not be saved — you can edit them later.', 'error');
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark">
      <header className="border-b border-border-light dark:border-border-dark px-5 py-4">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <span className="font-display text-lg font-bold">CareerAI</span>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-5 py-10">
        {/* Stepper */}
        <div className="mb-10 flex items-center">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    i < step
                      ? 'bg-success-500 text-white'
                      : i === step
                      ? 'bg-primary-600 text-white'
                      : 'bg-canvas-light dark:bg-white/5 text-muted-light dark:text-muted-dark border border-border-light dark:border-border-dark'
                  }`}
                >
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className="hidden text-[11px] text-muted-light dark:text-muted-dark sm:block">{label}</span>
              </div>
              {i < stepLabels.length - 1 && (
                <div className={`mx-2 h-0.5 flex-1 ${i < step ? 'bg-success-500' : 'bg-border-light dark:bg-border-dark'}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 && <StepPersonal data={data} update={update} />}
            {step === 1 && <StepSkills data={data} update={update} />}
            {step === 2 && <StepInterests data={data} update={update} />}
            {step === 3 && <StepCareerGoal data={data} update={update} />}
            {step === 4 && <StepResume onDone={finishOnboarding} />}
          </motion.div>
        </AnimatePresence>

        {step < 4 && (
          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={back} disabled={step === 0} icon={<ArrowLeft className="h-4 w-4" />}>
              Back
            </Button>
            <Button onClick={next} icon={<ArrowRight className="h-4 w-4" />} className="flex-row-reverse">
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
