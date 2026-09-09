/**
 * Browser-side Supabase client (client components).
 * Values come from `.env.local` — they are prefixed with NEXT_PUBLIC_ so
 * they are inlined into the browser bundle at build time.
 */
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
