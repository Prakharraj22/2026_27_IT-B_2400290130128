import { CheckCheck, Bell } from 'lucide-react';
import { Topbar } from '../../components/layout/Topbar';
import { Button, EmptyState, Tabs } from '../../components/ui';
import { NotificationItemRow } from '../../components/notifications/NotificationItemRow';
import { useApp } from '../../context/AppContext';

export function Notifications() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useApp();

  const unread = notifications.filter((n) => !n.read);

  return (
    <div>
      <Topbar title="Notifications" subtitle="Stay on top of your career progress." />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold lg:hidden">Notifications</h1>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" icon={<CheckCheck className="h-3.5 w-3.5" />} onClick={markAllAsRead} className="ml-auto">
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs
        defaultTab="all"
        tabs={[
          {
            id: 'all',
            label: `All (${notifications.length})`,
            content: (
              <div className="space-y-2.5">
                {notifications.length === 0 ? (
                  <EmptyState icon={<Bell className="h-5 w-5" />} title="No notifications yet" description="We'll let you know when there's something new." />
                ) : (
                  notifications.map((n) => <NotificationItemRow key={n.id} item={n} onRead={markAsRead} />)
                )}
              </div>
            ),
          },
          {
            id: 'unread',
            label: `Unread (${unreadCount})`,
            content: (
              <div className="space-y-2.5">
                {unread.length === 0 ? (
                  <EmptyState icon={<Bell className="h-5 w-5" />} title="You're all caught up" description="No unread notifications right now." />
                ) : (
                  unread.map((n) => <NotificationItemRow key={n.id} item={n} onRead={markAsRead} />)
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
