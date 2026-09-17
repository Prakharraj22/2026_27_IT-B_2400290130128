import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '../ui';

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border-light dark:border-border-dark bg-canvas-light/85 dark:bg-canvas-dark/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <span className="font-display text-lg font-bold">CareerAI</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="ghost" size="sm">Log In</Button>
          </Link>
          <Link to="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
