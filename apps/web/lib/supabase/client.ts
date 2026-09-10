/**
 * Browser-side Supabase client (client components).
 * Values come from `.env.local` — they are prefixed with NEXT_PUBLIC_ so
 * they are inlined into the browser bundle at build time.
 */
import { createBrowserClient } from '@supabase/ssr';

/** Guard env vars so a missing var surfaces a clear error, not an undefined crash. */
function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Supabase browser client: missing NEXT_PUBLIC_SUPABASE_URL or ' +
        'NEXT_PUBLIC_SUPABASE_ANON_KEY. Add them to .env.local and to Vercel ' +
        'Project Settings → Environment Variables.'
    );
  }
  return { url, anonKey };
}

export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient(url, anonKey);
}
