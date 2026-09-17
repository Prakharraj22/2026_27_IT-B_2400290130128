import { useId, useState, type ReactNode } from 'react';

export function Tooltip({ content, children }: { content: string; children: ReactNode }) {
  const [show, setShow] = useState(false);
  const id = useId();
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      // onFocus/onBlur (not just mouse events) so a keyboard user tabbing
      // to the trigger sees the same tooltip a mouse user would.
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      aria-describedby={show ? id : undefined}
    >
      {children}
      {show && (
        <span
          role="tooltip"
          id={id}
          className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink-light dark:bg-white px-2.5 py-1.5 text-xs font-medium text-white dark:text-ink-light shadow-lg z-50"
        >
          {content}
        </span>
      )}
    </span>
  );
}
