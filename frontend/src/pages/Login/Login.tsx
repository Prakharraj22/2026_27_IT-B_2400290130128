import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, LogIn } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import { useApp } from '../../context/AppContext';
import { login as apiLogin } from '../../services/api/authApi';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useApp();
  const { showToast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Enter a valid email address.';
    if (!password) newErrors.password = 'Password is required.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setLoading(true);
    try {
      const { user } = await apiLogin(email, password);
      login(user);
      showToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch {
      showToast('Login failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-xl font-bold">Log in to your account</h1>
          <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">Continue building your career intelligence.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
            <div>
              <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
              <Link to="/forgot-password" className="mt-1.5 inline-block text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" fullWidth loading={loading} icon={<LogIn className="h-4 w-4" />}>
              Log In
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-light dark:text-muted-dark">
            Don\u2019t have an account?{' '}
            <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300">
              Sign up
            </Link>
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-muted-light dark:text-muted-dark">Demo mode — any email and password will work.</p>
      </div>
    </div>
  );
}
