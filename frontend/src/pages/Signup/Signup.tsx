import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, UserPlus } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import { useApp } from '../../context/AppContext';
import { signup as apiSignup } from '../../services/api/authApi';

export function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useApp();
  const { showToast } = useToast();

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.name) newErrors.name = 'Full name is required.';
    if (!form.email) newErrors.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Enter a valid email address.';
    if (!form.password) newErrors.password = 'Password is required.';
    else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
    if (form.confirmPassword !== form.password) newErrors.confirmPassword = 'Passwords do not match.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setLoading(true);
    try {
      const { user } = await apiSignup(form.name, form.email, form.password);
      login(user);
      showToast('Account created!', 'success');
      navigate('/onboarding');
    } catch {
      showToast('Signup failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas-light dark:bg-canvas-dark px-4 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <span className="font-display text-lg font-bold">CareerAI</span>
        </Link>

        <div className="rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-7 shadow-card dark:shadow-card-dark">
          <h1 className="text-xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">Start with a profile the AI can actually work with.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input label="Full Name" placeholder="Rahul Mehta" value={form.name} onChange={(e) => update('name', e.target.value)} error={errors.name} />
            <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} error={errors.email} />
            <Input label="Password" type="password" placeholder="At least 8 characters" value={form.password} onChange={(e) => update('password', e.target.value)} error={errors.password} />
            <Input label="Confirm Password" type="password" placeholder="Re-enter your password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} error={errors.confirmPassword} />
            <Button type="submit" fullWidth loading={loading} icon={<UserPlus className="h-4 w-4" />}>
              Create Account
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-light dark:text-muted-dark">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
