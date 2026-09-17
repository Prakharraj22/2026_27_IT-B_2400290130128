import { Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';

export function AIInsight({ text }: { text: string }) {
  return (
    <Card className="relative overflow-hidden p-5">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-primary-400/20 to-ai-light/20 blur-2xl" />
      <div className="relative flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-ai-light text-white">
          <Sparkles className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-300">AI Insight</p>
          <p className="text-sm leading-relaxed text-ink-light dark:text-ink-dark">{text}</p>
        </div>
      </div>
    </Card>
  );
}
