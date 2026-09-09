import { createClient } from '@/lib/supabase/server';
import TeamGrid from './TeamGrid';
import type { Teacher } from '@/lib/types';

/**
 * Server component that fetches faculty from the `teachers` table and
 * renders the interactive team grid. Wrapped in <Suspense> by its page so
 * a skeleton shows while the query resolves.
 */
export default async function TeamSection() {
  const supabase = createClient();
  const { data } = await supabase.from('teachers').select('*').order('created_at');

  const teachers = (data ?? []) as unknown as Teacher[];

  return (
    <section className="app-container py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold text-white">Meet the teaching team</h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-400">
          Seasoned mentors and subject experts dedicated to your growth.
        </p>
      </div>
      <TeamGrid teachers={teachers} />
    </section>
  );
}
