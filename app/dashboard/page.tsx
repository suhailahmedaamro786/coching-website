import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import type { NotificationRow, ProfileRow, SessionUser } from '@/lib/types';

export const metadata = { title: 'Dashboard' };

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let user: { id: string; email?: string | null } | null = null;
  let profile: ProfileRow | null = null;
  let notifications: NotificationRow[] = [];

  try {
    const supabase = createClient();

    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    user = u;

    if (user) {
      const [profileRes, notifRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50),
      ]);

      if (profileRes.error) console.error('[dashboard] profile fetch failed:', profileRes.error.message);
      if (notifRes.error) console.error('[dashboard] notifications fetch failed:', notifRes.error.message);

      profile = (profileRes.data ?? null) as ProfileRow | null;
      notifications = (notifRes.data ?? []) as NotificationRow[];
    }
  } catch (err) {
    // Route protection is also enforced in middleware; if anything throws
    // here (e.g. missing env), fail safe to the login page instead of 500.
    console.error('[dashboard] unexpected error:', err);
  }

  // Route protection is enforced in middleware; double-check here too.
  if (!user) redirect('/login');

  const sessionUser: SessionUser = { id: user.id, email: user.email ?? null };

  return (
    <StudentDashboard
      user={sessionUser}
      profile={profile}
      notifications={notifications}
    />
  );
}
