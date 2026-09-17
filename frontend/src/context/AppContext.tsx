import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, NotificationItem } from '../types';
import { getProfile } from '../services/api/profileApi';
import { getNotifications, markAsRead as apiMarkAsRead, markAllAsRead as apiMarkAllAsRead } from '../services/api/notificationApi';
import { hasAuthTokens, setSessionExpiredHandler } from '../services/api/client';
import { logout as apiLogout } from '../services/api/authApi';

interface AppContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refreshNotifications: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => hasAuthTokens());
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    // Lets the API client force a logout when token refresh fails (e.g. the
    // refresh token was revoked or expired), without client.ts depending on
    // this context or the router.
    setSessionExpiredHandler(() => logout());
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getProfile().then(setUser).catch(() => logout());
      refreshNotifications();
    }
  }, [isAuthenticated]);

  const refreshNotifications = () => {
    getNotifications().then(setNotifications);
  };

  const login = (u: User) => {
    // Tokens are already stored by authApi.login/signup before this is called.
    setUser(u);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    apiLogout().catch(() => undefined);
  };

  const markAsRead = (id: string) => {
    apiMarkAsRead(id).then(setNotifications);
  };

  const markAllAsRead = () => {
    apiMarkAllAsRead().then(setNotifications);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{ user, isAuthenticated, login, logout, notifications, unreadCount, markAsRead, markAllAsRead, refreshNotifications }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
