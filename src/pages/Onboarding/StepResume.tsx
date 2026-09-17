import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Card, Button } from '../../components/ui';
import { ResumeUploader } from '../../components/resume/ResumeUploader';
import { uploadResume } from '../../services/api/resumeApi';

type Phase = 'idle' | 'uploading' | 'processing' | 'analyzing' | 'complete';

const phaseLabels: Record<Phase, string> = {
  idle: '',
  uploading: 'Uploading...',
  processing: 'Processing...',
  analyzing: 'Analyzing...',
  complete: 'Completed',
};

export function StepResume({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>('idle');

  const handleFile = async (file: File) => {
    setPhase('uploading');
    setTimeout(() => setPhase('processing'), 500);
    setTimeout(() => setPhase('analyzing'), 1100);
    await uploadResume(file);
    setPhase('complete');
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold">Resume Upload</h2>
      <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">This helps the AI extract skills and projects automatically.</p>

      <div className="mt-6">
        {phase === 'complete' ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-success-500/40 bg-success-50 dark:bg-success-500/10 px-6 py-12 text-center">
            <CheckCircle2 className="mb-3 h-10 w-10 text-success-600 dark:text-success-500" />
            <p className="text-base font-semibold text-ink-light dark:text-ink-dark">Your profile is ready.</p>
            <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">We\u2019ve analyzed your resume and set up your dashboard.</p>
            <Button className="mt-5" onClick={onDone}>
              Go to Dashboard
            </Button>
          </div>
        ) : phase === 'idle' ? (
          <ResumeUploader onFileSelected={handleFile} />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border-light dark:border-border-dark px-6 py-16 text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
            <p className="text-sm font-medium text-ink-light dark:text-ink-dark">{phaseLabels[phase]}</p>
          </div>
        )}
      </div>

      {phase !== 'idle' && phase !== 'complete' && (
        <button onClick={onDone} className="mt-5 text-xs text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark">
          Skip for now
        </button>
      )}
      {phase === 'idle' && (
        <button onClick={onDone} className="mt-5 text-xs text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark">
          Skip for now
        </button>
      )}
    </Card>
  );
}
