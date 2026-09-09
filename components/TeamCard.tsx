'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { User, BadgeCheck } from 'lucide-react';
import type { Teacher } from '@/lib/types';

/** Teacher card with a 3D hover tilt and animated bio overlay. */
export default function TeamCard({ teacher }: { teacher: Teacher }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 160, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 160, damping: 20 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 p-6"
    >
      {/* Avatar */}
      <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-500/40 to-violet-500/40 ring-2 ring-white/10">
        {teacher.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={teacher.avatar_url} alt={teacher.name ?? 'Teacher'} className="h-full w-full object-cover" />
        ) : (
          <User className="h-9 w-9 text-slate-300" />
        )}
      </div>

      {/* Name + role */}
      <div className="mt-4 text-center" style={{ transform: 'translateZ(30px)' }}>
        <h3 className="font-bold text-white">{teacher.name || 'Faculty member'}</h3>
        <p className="mt-0.5 text-sm text-slate-400">{teacher.role || ''}</p>
      </div>

      {/* Subject badge */}
      {teacher.subject && (
        <div className="mt-3 flex justify-center" style={{ transform: 'translateZ(24px)' }}>
          <span className="inline-flex items-center gap-1 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-200">
            <BadgeCheck className="h-3.5 w-3.5" />
            {teacher.subject}
          </span>
        </div>
      )}

      {/* Bio overlay */}
      {teacher.bio && (
        <motion.div
          initial={false}
          className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-slate-950/95 to-slate-950/70 p-4 text-sm text-slate-300 transition-transform duration-300 group-hover:translate-y-0"
          style={{ transform: 'translateZ(20px)' }}
        >
          {teacher.bio}
        </motion.div>
      )}
    </motion.div>
  );
}
