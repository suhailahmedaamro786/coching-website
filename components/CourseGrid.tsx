'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, User, Wine } from 'lucide-react';
import AdmissionModal from './AdmissionModal';
import type { Course } from '@/lib/types';

/**
 * Client-side catalog: renders course cards (thumbnail zoom on hover,
 * duration tag, instructor avatar, price, Apply button) and manages the
 * admission modal state.
 */
export default function CourseGrid({ courses }: { courses: Course[] }) {
  const [selected, setSelected] = useState<Course | null>(null);

  if (!courses.length) {
    return <p className="text-center text-slate-400">No courses available yet. Check back soon!</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, i) => (
          <motion.article
            key={course.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40"
          >
            {/* Thumbnail */}
            <div className="relative aspect-[16/9] overflow-hidden">
              {course.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={course.thumbnail_url}
                  alt={course.title ?? 'Course'}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/30 to-violet-500/30 text-slate-300">
                  <Wine className="h-10 w-10" />
                </div>
              )}
              {course.duration_weeks && (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-950/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                  <Clock className="h-3 w-3" />
                  {course.duration_weeks} weeks
                </span>
              )}
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col p-5">
              {course.teachers?.name && (
                <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                  {course.teachers.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.teachers.avatar_url}
                      alt={course.teachers.name}
                      className="h-6 w-6 rounded-full object-cover ring-1 ring-white/20"
                    />
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                      <User className="h-3.5 w-3.5" />
                    </span>
                  )}
                  {course.teachers.name}
                </div>
              )}

              <h3 className="text-lg font-bold text-white">{course.title || 'Untitled course'}</h3>
              <p className="mt-2 flex-1 text-sm text-slate-400">
                {course.description || 'Learn more and apply today.'}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-extrabold text-indigo-300">
                  {course.price != null
                    ? `$${Number(course.price).toFixed(course.price % 1 ? 2 : 0)}`
                    : 'Free'}
                </span>
                <button
                  type="button"
                  onClick={() => setSelected(course)}
                  className="rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {selected && (
        <AdmissionModal course={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
