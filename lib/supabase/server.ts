/**
 * Server-side Supabase client (Server Components, Route Handlers, Server Actions).
 * Uses @supabase/ssr createServerClient so the session lives in httpOnly
 * cookies, keeping auth state secure and consistent server-side.
 */
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
