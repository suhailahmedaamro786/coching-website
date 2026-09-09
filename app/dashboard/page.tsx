import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import type { NotificationRow, ProfileRow, SessionUser } from '@/lib/types';

export const metadata = { title: 'Dashboard' };

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Route protection is enforced in middleware; double-check here too.
  if (!user) redirect('/login');

  const sessionUser: SessionUser = { id: user.id, email: user.email ?? null };

  const [profileRes, notifRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50),
  ]);

  const profile = (profileRes.data ?? null) as ProfileRow | null;
  const notifications = (notifRes.data ?? []) as NotificationRow[];

  return (
    <StudentDashboard
      user={sessionUser}
      profile={profile}
      notifications={notifications}
    />
  );
}
