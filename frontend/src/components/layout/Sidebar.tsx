import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, User, FileText, Compass, Target, Map, Briefcase, TrendingUp,
  Bell, Settings, ChevronsLeft, ChevronsRight, Sparkles,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../ui/Avatar';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/profile', label: 'My Profile', icon: User },
  { to: '/resume', label: 'Resume', icon: FileText },
  { to: '/careers', label: 'Career Explorer', icon: Compass },
  { to: '/skill-gap', label: 'Skill Gap', icon: Target },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
  { to: '/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/market', label: 'Market Insights', icon: TrendingUp },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, unreadCount } = useApp();

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark transition-all duration-200 lg:flex',
        collapsed ? 'w-[76px]' : 'w-64'
      )}
    >
      <div className={cn('flex items-center gap-2.5 px-5 py-6', collapsed && 'justify-center px-0')}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white">
          <Sparkles className="h-4.5 w-4.5" />
        </div>
        {!collapsed && <span className="font-display text-lg font-bold text-ink-light dark:text-ink-dark">CareerAI</span>}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200'
                  : 'text-muted-light dark:text-muted-dark hover:bg-canvas-light dark:hover:bg-white/5 hover:text-ink-light dark:hover:text-ink-dark'
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-border-light dark:border-border-dark px-3 py-3">
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors relative',
              collapsed && 'justify-center px-0',
              isActive
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200'
                : 'text-muted-light dark:text-muted-dark hover:bg-canvas-light dark:hover:bg-white/5 hover:text-ink-light dark:hover:text-ink-dark'
            )
          }
          title={collapsed ? 'Notifications' : undefined}
        >
          <span className="relative">
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-danger-500 text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </span>
          {!collapsed && <span>Notifications</span>}
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              collapsed && 'justify-center px-0',
              isActive
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200'
                : 'text-muted-light dark:text-muted-dark hover:bg-canvas-light dark:hover:bg-white/5 hover:text-ink-light dark:hover:text-ink-dark'
            )
          }
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings className="h-[18px] w-[18px]" />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        {user && (
          <NavLink
            to="/profile"
            className={cn('mt-2 flex items-center gap-2.5 rounded-xl px-3 py-2 hover:bg-canvas-light dark:hover:bg-white/5', collapsed && 'justify-center px-0')}
          >
            <Avatar name={user.name} color={user.avatarColor} size={32} />
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink-light dark:text-ink-dark">{user.name}</p>
                <p className="truncate text-xs text-muted-light dark:text-muted-dark">{user.targetCareer}</p>
              </div>
            )}
          </NavLink>
        )}

        <button
          onClick={onToggle}
          className={cn(
            'mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-muted-light dark:text-muted-dark hover:bg-canvas-light dark:hover:bg-white/5',
            collapsed && 'justify-center px-0'
          )}
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
