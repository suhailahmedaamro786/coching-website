'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const STATS = [
  { label: 'Active Courses', value: 40, suffix: '+' },
  { label: 'Happy Students', value: 12000, suffix: '+' },
  { label: 'Expert Mentors', value: 85, suffix: '+' },
  { label: 'Completion Rate', value: 94, suffix: '%' },
];

/** Animated count-up stat badges, revealed when scrolled into view. */
export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="app-container py-10">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
          >
            <Counter value={stat.value} run={inView} />
            <span className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Counter({ value, run }: { value: number; run: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!run) return;
    const duration = 1200;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, run]);

  return (
    <span className="text-3xl font-extrabold text-white">
      {display.toLocaleString()}
      <span className="text-indigo-400">{STATS.find((s) => s.value === value)?.suffix ?? ''}</span>
    </span>
  );
}
