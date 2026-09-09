'use client';

import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';
import type { Course } from '@/lib/types';

/**
 * Animated admission application modal.
 * Submits to the `admissions` table with student_id, course_id and
 * status='Pending', plus contact details collected from the applicant.
 */
export default function AdmissionModal({
  course,
  onClose,
}: {
  course: Course;
  onClose: () => void;
}) {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const supabase = createClient();
    // Capture the authenticated student id if present; otherwise null (public apply).
    let studentId: string | null = null;
    try {
      const { data } = await supabase.auth.getUser();
      studentId = data.user?.id ?? null;
    } catch {
      studentId = null;
    }

    const payload = {
      student_id: studentId,
      course_id: course.id,
      status: 'Pending',
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };

    setSubmitting(true);
    const { error } = await supabase.from('admissions').insert(payload);
    setSubmitting(false);

    if (error) {
      console.error('[AdmissionModal]', error);
      toast.error('Could not submit your application. Please try again.');
      return;
    }

    toast.success(`Application sent for ${course.title ?? 'the course'}!`);
    setForm({ name: '', email: '', phone: '' });
    onClose();
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[90] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
        >
          <div className="pointer-events-none absolute -top-24 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-indigo-500/25 blur-3xl" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="text-xl font-bold text-white">Apply Now</h2>
          <p className="mt-1 text-sm text-slate-400">{course.title || 'This course'}</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="adm-name" className="mb-1 block text-sm font-medium text-slate-300">
                Full name
              </label>
              <input
                id="adm-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none ring-indigo-500/50 transition focus:ring-2"
                placeholder="Jordan Smith"
              />
            </div>

            <div>
              <label htmlFor="adm-email" className="mb-1 block text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                id="adm-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none ring-indigo-500/50 transition focus:ring-2"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="adm-phone" className="mb-1 block text-sm font-medium text-slate-300">
                Phone
              </label>
              <input
                id="adm-phone"
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none ring-indigo-500/50 transition focus:ring-2"
                placeholder="+1 555 000 1234"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Submit application'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
