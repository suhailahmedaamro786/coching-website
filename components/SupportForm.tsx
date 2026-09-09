'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

/** Glassmorphism support / complaint form → support_tickets (status='Open'). */
export default function SupportForm() {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', subject: '', message: '' });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const supabase = createClient();
    setSubmitting(true);
    const { error } = await supabase.from('support_tickets').insert({
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      status: 'Open',
    });
    setSubmitting(false);

    if (error) {
      console.error('[SupportForm]', error);
      toast.error('Could not send your message. Please try again.');
      return;
    }

    toast.success('Message sent! We will get back to you soon.');
    setForm({ email: '', subject: '', message: '' });
  }

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none ring-indigo-500/50 transition focus:ring-2';

  return (
    <motion.form
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="glass relative w-full max-w-lg rounded-2xl p-8"
    >
      <div className="pointer-events-none absolute -top-20 right-0 h-40 w-64 rounded-full bg-sky-500/15 blur-3xl" />

      <h2 className="text-xl font-bold text-white">Contact support</h2>
      <p className="mb-6 mt-1 text-sm text-slate-400">
        Have a question or complaint? We typically reply within 24 hours.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="sp-email" className="mb-1 block text-sm font-medium text-slate-300">
            Email
          </label>
          <input
            id="sp-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="sp-subject" className="mb-1 block text-sm font-medium text-slate-300">
            Subject
          </label>
          <input
            id="sp-subject"
            type="text"
            required
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className={inputClass}
            placeholder="How can we help?"
          />
        </div>

        <div>
          <label htmlFor="sp-message" className="mb-1 block text-sm font-medium text-slate-300">
            Message
          </label>
          <textarea
            id="sp-message"
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={inputClass}
            placeholder="Describe your issue or message…"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          {submitting ? 'Sending…' : 'Send message'}
        </button>
      </div>
    </motion.form>
  );
}
