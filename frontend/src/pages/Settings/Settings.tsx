import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor, User, Bell, Shield, LogOut } from 'lucide-react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, Input, Button } from '../../components/ui';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../../services/api/profileApi';
import { cn } from '../../utils/cn';

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', checked ? 'bg-primary-600' : 'bg-border-light dark:bg-border-dark')}
    >
      <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', checked ? 'translate-x-5' : 'translate-x-0.5')} />
    </button>
  );
}

export function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, login, logout } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [notifPrefs, setNotifPrefs] = useState({ jobAlerts: true, careerInsights: true, roadmapReminders: false });
  const [fullName, setFullName] = useState(user?.name ?? '');
  const [savingAccount, setSavingAccount] = useState(false);

  // `user` loads asynchronously after auth, so this component's first
  // render(s) can happen before it's available — sync local form state once
  // it (or a later profile update) actually arrives.
  useEffect(() => {
    setFullName(user?.name ?? '');
  }, [user?.name]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveAccount = async () => {
    setSavingAccount(true);
    try {
      const updated = await updateProfile({ name: fullName });
      login(updated);
      showToast('Account details updated.', 'success');
    } catch {
      showToast('Could not save your changes. Please try again.', 'error');
    } finally {
      setSavingAccount(false);
    }
  };

  if (!user) return null;

  return (
    <div>
      <Topbar title="Settings" subtitle="Manage your account and preferences." />
      <h1 className="mb-6 text-xl font-bold lg:hidden">Settings</h1>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold"><User className="h-4 w-4" /> Account</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Input label="Email" defaultValue={user.email} type="email" disabled hint="Email changes aren't supported yet." />
          </div>
          <Button size="sm" className="mt-4" loading={savingAccount} onClick={handleSaveAccount}>Save Changes</Button>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-sm font-semibold">Appearance</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'light', label: 'Light', icon: Sun },
              { value: 'dark', label: 'Dark', icon: Moon },
              { value: 'system', label: 'System', icon: Monitor },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value as 'light' | 'dark' | 'system')}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border px-4 py-4 text-sm font-medium transition-colors',
                  theme === opt.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-200'
                    : 'border-border-light dark:border-border-dark text-ink-light dark:text-ink-dark hover:border-primary-300'
                )}
              >
                <opt.icon className="h-4.5 w-4.5" />
                {opt.label}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Bell className="h-4 w-4" /> Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-light dark:text-ink-dark">Job alerts</p>
                <p className="text-xs text-muted-light dark:text-muted-dark">Get notified about new job matches</p>
              </div>
              <Toggle checked={notifPrefs.jobAlerts} onChange={(v) => setNotifPrefs((p) => ({ ...p, jobAlerts: v }))} label="Job alerts" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-light dark:text-ink-dark">Career insights</p>
                <p className="text-xs text-muted-light dark:text-muted-dark">AI-generated insights about your career path</p>
              </div>
              <Toggle checked={notifPrefs.careerInsights} onChange={(v) => setNotifPrefs((p) => ({ ...p, careerInsights: v }))} label="Career insights" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-light dark:text-ink-dark">Roadmap reminders</p>
                <p className="text-xs text-muted-light dark:text-muted-dark">Nudges to keep your roadmap moving</p>
              </div>
              <Toggle checked={notifPrefs.roadmapReminders} onChange={(v) => setNotifPrefs((p) => ({ ...p, roadmapReminders: v }))} label="Roadmap reminders" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Shield className="h-4 w-4" /> Privacy</h2>
          <p className="mb-4 text-sm text-muted-light dark:text-muted-dark">Control how your profile data is used for career and job matching.</p>
          <Button variant="outline" size="sm">Download my data</Button>
        </Card>

        <Card className="p-6">
          <Button variant="danger" size="sm" icon={<LogOut className="h-3.5 w-3.5" />} onClick={handleLogout}>
            Log Out
          </Button>
        </Card>
      </div>
    </div>
  );
}
