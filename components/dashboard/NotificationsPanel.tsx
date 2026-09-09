'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import type { NotificationRow } from '@/lib/types';

/**
 * Student notifications. Fetched by the server page; unread items are
 * marked read on click and animate out of the list.
 */
export default function NotificationsPanel({
  notifications,
  onChange,
}: {
  notifications: NotificationRow[];
  onChange: (next: NotificationRow[]) => void;
}) {
  const toast = useToast();

  async function handleRead(item: NotificationRow) {
    if (item.is_read) return;

    // Optimistic update + dismiss.
    const next = notifications.map((n) =>
      n.id === item.id ? { ...n, is_read: true } : n
    );
    onChange(next);

    const supabase = createClient();
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', item.id);

    if (error) {
      console.error('[NotificationsPanel]', error);
      toast.error('Could not update notification.');
      // Revert on failure.
      onChange(notifications);
    }
  }

  if (!notifications.length) {
    return (
      <div className="glass flex flex-col items-center rounded-2xl p-12 text-center">
        <Bell className="mb-3 h-10 w-10 text-slate-500" />
        <p className="font-medium text-white">You&rsquo;re all caught up</p>
        <p className="mt-1 text-sm text-slate-400">No notifications yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-white">Notifications</h2>

      <AnimatePresence>
        {notifications.map((n) => (
          <motion.button
            key={n.id}
            type="button"
            onClick={() => handleRead(n)}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className={cn(
              'glass w-full rounded-xl p-4 text-left transition',
              !n.is_read && 'border-indigo-400/30'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'h-2 w-2 shrink-0 rounded-full',
                    n.is_read ? 'bg-slate-600' : 'bg-indigo-400'
                  )}
                />
                <p className="font-semibold text-white">{n.title || 'Notification'}</p>
              </div>
              {!n.is_read && <Check className="h-4 w-4 shrink-0 text-indigo-300" />}
            </div>
            {n.message && <p className="mt-1.5 text-sm text-slate-400">{n.message}</p>}
            {n.created_at && (
              <p className="mt-2 text-xs text-slate-500">{formatDate(n.created_at)}</p>
            )}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}

function formatDate(value: string) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
