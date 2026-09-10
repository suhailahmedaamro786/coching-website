'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

export default function SupportWidget() {
  const [open, setOpen] = useState(false);

  const defaultMessage = useMemo(
    () => 'Hello! I have a question about your courses.',
    []
  );

  // Generic template only (no user-entered content). Use this to avoid
  // embedding user-provided text in outbound URLs.

  const waHref = useMemo(
    () => `https://wa.me/?text=${encodeURIComponent(defaultMessage)}`,
    [defaultMessage]
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open ? (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-glow"
          type="button"
        >
          <MessageSquare className="h-4 w-4" />
          Support
        </motion.button>
      ) : (
        <div className="w-80 rounded-2xl border border-white/10 bg-slate-950/90 backdrop-blur p-4 text-slate-200 shadow-glow">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Need help?</div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-1 text-xs text-slate-300 hover:bg-white/10"
            >
              Close
            </button>
          </div>

          <p className="mt-2 text-xs text-slate-400">
            For course questions, chat instantly on WhatsApp.
          </p>

          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block rounded-xl bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
          >
            Chat on WhatsApp
          </a>

          <a
            href="/contact"
            className="mt-2 block rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
          >
            Contact form
          </a>
        </div>
      )}
    </div>
  );
}
