'use client';

import TeamCard from './TeamCard';
import type { Teacher } from '@/lib/types';

/** Responsive grid of teacher cards with 3D perspective. */
export default function TeamGrid({ teachers }: { teachers: Teacher[] }) {
  if (!teachers.length) {
    return <p className="text-center text-slate-400">Meet our faculty soon.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 [perspective:1200px]">
      {teachers.map((teacher) => (
        <TeamCard key={teacher.id} teacher={teacher} />
      ))}
    </div>
  );
}
