import { simulateLatency } from './client';
import { notifications as initialNotifications } from '../../data/notifications';
import type { NotificationItem } from '../../types';

let store: NotificationItem[] = [...initialNotifications];

// GET /v1/notifications
export async function getNotifications(): Promise<NotificationItem[]> {
  return simulateLatency(store, 300);
}

// PATCH /v1/notifications/:id/read
export async function markAsRead(id: string): Promise<NotificationItem[]> {
  store = store.map((n) => (n.id === id ? { ...n, read: true } : n));
  return simulateLatency(store, 200);
}

// PATCH /v1/notifications/read-all
export async function markAllAsRead(): Promise<NotificationItem[]> {
  store = store.map((n) => ({ ...n, read: true }));
  return simulateLatency(store, 200);
}
