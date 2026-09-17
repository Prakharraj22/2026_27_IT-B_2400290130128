import { simulateLatency } from './client';
import { notifications as initialNotifications } from '../../data/notifications';
import type { NotificationItem } from '../../types';

// Kept mocked: the Notifications module (owned by another engineer) doesn't
// exist as a backend service yet — it's designed to listen for domain events
// like `user.profile.updated` (see Backend/ASSUMPTIONS.md §10), not to be
// polled via REST, so there's no `/v1/notifications` endpoint to call here.

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
