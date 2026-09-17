import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { forgotPassword } from '../../services/api/authApi';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    await forgotPassword(email);
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas-light dark:bg-canvas-dark px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <span className="font-display text-lg font-bold">CareerAI</span>
        </Link>

        <div className="rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-7 shadow-card dark:shadow-card-dark">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-success-50 text-success-600 dark:bg-success-500/10">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h1 className="text-lg font-bold">Check your email</h1>
              <p className="mt-1.5 text-sm text-muted-light dark:text-muted-dark">
                If an account exists for {email}, we\u2019ve sent password reset instructions.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold">Reset your password</h1>
              <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">We\u2019ll send a reset link to your email.</p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
                <Button type="submit" fullWidth loading={loading} icon={<Mail className="h-4 w-4" />}>
                  Send Reset Link
                </Button>
              </form>
            </>
          )}
          <Link to="/login" className="mt-5 flex items-center justify-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
