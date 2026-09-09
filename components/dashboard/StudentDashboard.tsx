'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { UserRound, Bell, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import ProfilePanel from './ProfilePanel';
import NotificationsPanel from './NotificationsPanel';
import type { NotificationRow, ProfileRow, SessionUser } from '@/lib/types';

type TabKey = 'profile' | 'notifications';

const TABS = [
  { key: 'profile' as const, label: 'My Profile', icon: UserRound },
  { key: 'notifications' as const, label: 'Notifications', icon: Bell },
];

export default function StudentDashboard({
  user,
  profile,
  notifications,
}: {
  user: SessionUser;
  profile: ProfileRow | null;
  notifications: NotificationRow[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>('profile');
  const [list, setList] = useState<NotificationRow[]>(notifications);

  const unreadCount = list.filter((n) => !n.is_read).length;

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="app-container grid gap-6 py-10 lg:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="glass h-fit rounded-2xl p-3 lg:sticky lg:top-24">
        <nav className="flex flex-col gap-1">
          <span className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Student menu
          </span>

          {TABS.map((t) => {
            const active = tab === t.key;
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  active ? 'text-white' : 'text-slate-300 hover:text-white'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="dash-active"
                    className="absolute inset-0 rounded-xl bg-white/10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="relative z-10 h-4 w-4" />
                <span className="relative z-10">{t.label}</span>

                {t.key === 'notifications' && unreadCount > 0 && (
                  <motion.span
                    key={unreadCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative z-10 ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1.5 text-xs font-bold text-white"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-3 border-t border-white/10 pt-3">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {tab === 'profile' ? (
            <ProfilePanel user={user} profile={profile} />
          ) : (
            <NotificationsPanel notifications={list} onChange={setList} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
