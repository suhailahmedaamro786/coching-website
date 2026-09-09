'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import AvatarUpload from './AvatarUpload';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';
import type { ProfileRow, SessionUser } from '@/lib/types';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none ring-indigo-500/60 transition focus:ring-2';

/**
 * Profile management: read/update full_name, phone, avatar_url in the
 * `profiles` table. Avatar uploads via the avatars bucket.
 */
export default function ProfilePanel({
  user,
  profile,
}: {
  user: SessionUser;
  profile: ProfileRow | null;
}) {
  const toast = useToast();
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url ?? null);
  const [saving, setSaving] = useState(false);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, full_name: fullName.trim(), phone: phone.trim(), avatar_url: avatarUrl }, {
        onConflict: 'id',
      });
    setSaving(false);

    if (error) {
      console.error('[ProfilePanel]', error);
      toast.error('Could not save your profile.');
      return;
    }
    toast.success('Profile saved.');
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass rounded-2xl p-6"
    >
      <h2 className="text-lg font-bold text-white">Profile</h2>
      <p className="mb-6 mt-1 text-sm text-slate-400">{user.email}</p>

      <form onSubmit={handleSave} className="space-y-6">
        <AvatarUpload userId={user.id} currentUrl={avatarUrl} onUploaded={setAvatarUrl} />

        <div>
          <label htmlFor="pf-name" className="mb-1 block text-sm font-medium text-slate-300">
            Full name
          </label>
          <input
            id="pf-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="pf-phone" className="mb-1 block text-sm font-medium text-slate-300">
            Phone
          </label>
          <input
            id="pf-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 000 1234"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </motion.div>
  );
}
