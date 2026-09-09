'use client';

import { ToastProvider } from './ui/toast';

/** Client-side providers mountable from a Server Component (layout). */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
