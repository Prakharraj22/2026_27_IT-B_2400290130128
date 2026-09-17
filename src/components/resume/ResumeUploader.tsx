import { useRef, useState, type DragEvent } from 'react';
import { UploadCloud, FileText } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ResumeUploaderProps {
  onFileSelected: (file: File) => void;
}

export function ResumeUploader({ onFileSelected }: ResumeUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-colors',
        dragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-border-light dark:border-border-dark hover:border-primary-300'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelected(file);
        }}
      />
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
        {dragging ? <FileText className="h-6 w-6" /> : <UploadCloud className="h-6 w-6" />}
      </div>
      <p className="mb-1 text-base font-semibold text-ink-light dark:text-ink-dark">Drop your resume here</p>
      <p className="text-sm text-muted-light dark:text-muted-dark">
        or <span className="font-medium text-primary-600 dark:text-primary-300">browse files</span>
      </p>
      <p className="mt-3 text-xs text-muted-light dark:text-muted-dark">Supported format: PDF</p>
    </div>
  );
}
