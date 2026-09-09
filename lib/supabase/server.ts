/**
 * Server-side Supabase client (Server Components, Route Handlers, Server Actions).
 * Uses @supabase/ssr createServerClient so the session lives in httpOnly
 * cookies, keeping auth state secure and consistent server-side.
 */
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Resolve Supabase env vars with a descriptive error instead of passing
 * `undefined` into createServerClient (which throws a cryptic runtime crash
 * when the vars are missing from the host environment, e.g. Vercel).
 */
export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Supabase server client: missing environment variables. ' +
        'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY ' +
        '(Vercel: Project Settings → Environment Variables; see .env.example).'
    );
  }
  return { url, anonKey };
}

export function createClient() {
  const cookieStore = cookies();
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component. Safe to ignore when middleware,
            // Route Handlers or Server Actions are refreshing user sessions.
          }
        },
      },
    }
  );
}
