import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import type { SkillGapItem } from '../../types';
import { Card, Badge, Modal } from '../ui';

const priorityVariant = { High: 'danger', Medium: 'warning', Low: 'neutral' } as const;

export function SkillGapCard({ item }: { item: SkillGapItem }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="flex items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-3">
          <Badge variant={priorityVariant[item.priority]}>{item.priority} priority</Badge>
          <p className="text-sm font-medium text-ink-light dark:text-ink-dark">{item.name}</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300"
        >
          <HelpCircle className="h-3.5 w-3.5" /> Why do I need this?
        </button>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title={item.name}>
        <p className="text-sm leading-relaxed text-ink-light dark:text-ink-dark">{item.reason}</p>
      </Modal>
    </>
  );
}
