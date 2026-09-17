import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Menu, X, LayoutDashboard, User, FileText, Compass, Target, Map, Briefcase,
  TrendingUp, Bell, Settings, Sparkles,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useApp } from '../../context/AppContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/profile', label: 'My Profile', icon: User },
  { to: '/resume', label: 'Resume', icon: FileText },
  { to: '/careers', label: 'Career Explorer', icon: Compass },
  { to: '/skill-gap', label: 'Skill Gap', icon: Target },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
  { to: '/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/market', label: 'Market Insights', icon: TrendingUp },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { unreadCount } = useApp();

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border-light dark:border-border-dark bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-display text-base font-bold">CareerAI</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="relative rounded-lg p-2 text-ink-light dark:text-ink-dark hover:bg-canvas-light dark:hover:bg-white/5"
        >
          <Menu className="h-5 w-5" />
          {unreadCount > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-danger-500" />}
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-ink-light/40 dark:bg-black/60 lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed right-0 top-0 z-50 h-full w-72 overflow-y-auto bg-surface-light dark:bg-surface-dark p-4 lg:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display text-base font-bold">Menu</span>
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-lg p-2 hover:bg-canvas-light dark:hover:bg-white/5">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="space-y-1">
                {navItems.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
                        isActive
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200'
                          : 'text-muted-light dark:text-muted-dark hover:bg-canvas-light dark:hover:bg-white/5'
                      )
                    }
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    {label}
                    {label === 'Notifications' && unreadCount > 0 && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-danger-500 text-[10px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
