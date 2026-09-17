import { useState, type ReactNode } from 'react';

export function Tooltip({ content, children }: { content: string; children: ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink-light dark:bg-white px-2.5 py-1.5 text-xs font-medium text-white dark:text-ink-light shadow-lg z-50">
          {content}
        </span>
      )}
    </span>
  );
}
