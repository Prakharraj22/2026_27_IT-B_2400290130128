import { useState } from 'react';
import { RefreshCw, TrendingUp, AlertTriangle, Lightbulb, FileText } from 'lucide-react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, Badge, Button } from '../../components/ui';
import { ResumeUploader } from '../../components/resume/ResumeUploader';
import { uploadResume } from '../../services/api/resumeApi';
import { useToast } from '../../components/ui/Toast';
import type { ResumeAnalysis } from '../../types';

type Phase = 'idle' | 'uploading' | 'processing' | 'extracting' | 'analyzing' | 'complete';

const phaseSteps: { key: Phase; label: string }[] = [
  { key: 'uploading', label: 'Uploading' },
  { key: 'processing', label: 'Processing' },
  { key: 'extracting', label: 'Extracting information' },
  { key: 'analyzing', label: 'Analyzing' },
];

export function Resume() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const { showToast } = useToast();

  const runAnalysis = async (file: File) => {
    setPhase('uploading');
    setTimeout(() => setPhase('processing'), 500);
    setTimeout(() => setPhase('extracting'), 1000);
    setTimeout(() => setPhase('analyzing'), 1500);
    const result = await uploadResume(file);
    setAnalysis(result);
    setPhase('complete');
    showToast('Resume analyzed successfully.', 'success');
  };

  const currentStepIndex = phaseSteps.findIndex((s) => s.key === phase);

  return (
    <div>
      <Topbar title="Resume Intelligence" subtitle="Upload your resume and let AI extract the details." />
      <h1 className="mb-6 text-xl font-bold lg:hidden">Resume Intelligence</h1>

      {phase === 'idle' && (
        <Card className="p-6">
          <ResumeUploader onFileSelected={runAnalysis} />
        </Card>
      )}

      {phase !== 'idle' && phase !== 'complete' && (
        <Card className="p-10">
          <div className="mx-auto max-w-sm text-center">
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
            <div className="space-y-2">
              {phaseSteps.map((s, i) => (
                <div key={s.key} className="flex items-center justify-between text-sm">
                  <span className={i <= currentStepIndex ? 'text-ink-light dark:text-ink-dark font-medium' : 'text-muted-light dark:text-muted-dark'}>
                    {s.label}
                  </span>
                  {i < currentStepIndex && <Badge variant="success">Done</Badge>}
                  {i === currentStepIndex && <Badge variant="primary">In progress</Badge>}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {phase === 'complete' && analysis && (
        <div className="space-y-6">
          <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-light dark:text-ink-dark">{analysis.fileName}</p>
                <p className="text-xs text-muted-light dark:text-muted-dark">{analysis.fileSize} · Uploaded {analysis.uploadDate}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCw className="h-3.5 w-3.5" />}
              onClick={() => {
                setPhase('idle');
                setAnalysis(null);
              }}
            >
              Re-analyze Resume
            </Button>
          </Card>

          <div>
            <h2 className="mb-4 text-base font-semibold">Resume Overview</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="p-5">
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark">Skills Detected</p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.skillsDetected.map((s) => <Badge key={s} variant="success">{s}</Badge>)}
                </div>
              </Card>
              <Card className="p-5">
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark">Projects Detected</p>
                <ul className="space-y-1 text-sm text-ink-light dark:text-ink-dark">
                  {analysis.projectsDetected.map((p) => <li key={p}>• {p}</li>)}
                </ul>
              </Card>
              <Card className="p-5">
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark">Education Detected</p>
                <ul className="space-y-1 text-sm text-ink-light dark:text-ink-dark">
                  {analysis.educationDetected.map((e) => <li key={e}>• {e}</li>)}
                </ul>
              </Card>
              <Card className="p-5">
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark">Experience Detected</p>
                <ul className="space-y-1 text-sm text-ink-light dark:text-ink-dark">
                  {analysis.experienceDetected.map((e) => <li key={e}>• {e}</li>)}
                </ul>
              </Card>
              <Card className="p-5 sm:col-span-2">
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark">Certifications Detected</p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.certificationsDetected.map((c) => <Badge key={c} variant="neutral">{c}</Badge>)}
                </div>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-base font-semibold">AI Resume Insights</h2>
            <div className="grid gap-4 lg:grid-cols-3">
              <Card accent="success" className="p-5">
                <div className="mb-3 flex items-center gap-2 text-success-600 dark:text-success-500">
                  <TrendingUp className="h-4 w-4" />
                  <p className="text-sm font-semibold">Strengths</p>
                </div>
                <ul className="space-y-2 text-sm text-ink-light dark:text-ink-dark">
                  {analysis.strengths.map((s) => <li key={s}>• {s}</li>)}
                </ul>
              </Card>
              <Card accent="warning" className="p-5">
                <div className="mb-3 flex items-center gap-2 text-warning-600 dark:text-warning-500">
                  <AlertTriangle className="h-4 w-4" />
                  <p className="text-sm font-semibold">Weak Areas</p>
                </div>
                <ul className="space-y-2 text-sm text-ink-light dark:text-ink-dark">
                  {analysis.weakAreas.map((s) => <li key={s}>• {s}</li>)}
                </ul>
              </Card>
              <Card accent="ai" className="p-5">
                <div className="mb-3 flex items-center gap-2 text-ai-light dark:text-ai-dark">
                  <Lightbulb className="h-4 w-4" />
                  <p className="text-sm font-semibold">Suggestions</p>
                </div>
                <ul className="space-y-2 text-sm text-ink-light dark:text-ink-dark">
                  {analysis.suggestions.map((s) => <li key={s}>• {s}</li>)}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
