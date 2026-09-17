import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, NotificationItem } from '../types';
import { getProfile } from '../services/api/profileApi';
import { getNotifications, markAsRead as apiMarkAsRead, markAllAsRead as apiMarkAllAsRead } from '../services/api/notificationApi';

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('careerai-auth') === 'true');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      getProfile().then(setUser);
      refreshNotifications();
    }
  }, [isAuthenticated]);

  const refreshNotifications = () => {
    getNotifications().then(setNotifications);
  };

  const login = (u: User) => {
    setUser(u);
    setIsAuthenticated(true);
    localStorage.setItem('careerai-auth', 'true');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('careerai-auth');
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
