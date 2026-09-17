import { Link } from 'react-router-dom';
import { Bell, Moon, Sun, Monitor, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useColorTheme, COLOR_THEMES } from '../../context/ColorThemeContext';
import { Dropdown, DropdownItem } from '../ui/Dropdown';

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { unreadCount } = useApp();
  const { theme, setTheme } = useTheme();
  const { colorTheme, setColorTheme } = useColorTheme();

  const themeIcons = { light: Sun, dark: Moon, system: Monitor };
  const ThemeIcon = themeIcons[theme];

  return (
    <div className="mb-6 hidden items-center justify-between lg:flex">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <Dropdown
          align="right"
          trigger={
            <button
              aria-label="Change theme and color"
              className="rounded-xl border border-border-light dark:border-border-dark p-2.5 text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark hover:bg-canvas-light dark:hover:bg-white/5"
            >
              <ThemeIcon className="h-4 w-4" />
            </button>
          }
        >
          <DropdownItem onClick={() => setTheme('light')}>
            <Sun className="h-4 w-4" /> Light {theme === 'light' && <Check className="ml-auto h-3.5 w-3.5" />}
          </DropdownItem>
          <DropdownItem onClick={() => setTheme('dark')}>
            <Moon className="h-4 w-4" /> Dark {theme === 'dark' && <Check className="ml-auto h-3.5 w-3.5" />}
          </DropdownItem>
          <DropdownItem onClick={() => setTheme('system')}>
            <Monitor className="h-4 w-4" /> System {theme === 'system' && <Check className="ml-auto h-3.5 w-3.5" />}
          </DropdownItem>

          <div className="my-1.5 border-t border-border-light dark:border-border-dark" />
          <p className="px-3 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark">Color Theme</p>
          <div className="flex flex-wrap gap-1.5 px-3 pb-2">
            {COLOR_THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setColorTheme(t.id)}
                aria-label={t.label}
                aria-pressed={colorTheme === t.id}
                title={t.label}
                className="h-6 w-6 shrink-0 rounded-full border-2 border-surface-light dark:border-surface-dark"
                style={{ backgroundColor: t.swatch, boxShadow: colorTheme === t.id ? `0 0 0 2px ${t.swatch}` : 'none' }}
              />
            ))}
          </div>
        </Dropdown>

        <Link
          to="/notifications"
          aria-label="Notifications"
          className="relative rounded-xl border border-border-light dark:border-border-dark p-2.5 text-muted-light dark:text-muted-dark hover:text-ink-light dark:hover:text-ink-dark hover:bg-canvas-light dark:hover:bg-white/5"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger-500 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}
