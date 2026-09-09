import type { Metadata } from 'next';
import './globals.css';
import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TransitionProvider from '@/components/TransitionProvider';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: {
    default: 'LearnHub',
    template: '%s · LearnHub',
  },
  description: 'Online learning platform — courses, admissions and support.',
};

/** Fetch website branding from the `system_settings` table. */
async function getBranding() {
  const supabase = createClient();
  const { data } = await supabase
    .from('system_settings')
    .select('institute_name, footer_text')
    .limit(1)
    .maybeSingle();

  return {
    instituteName: data?.institute_name || 'LearnHub',
    footerText: data?.footer_text || '© LearnHub. All rights reserved.',
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { instituteName, footerText } = await getBranding();

  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col">
        <Navbar instituteName={instituteName} />
        <main className="flex flex-1 flex-col">
          <Providers>
            <TransitionProvider>{children}</TransitionProvider>
          </Providers>
        </main>
        <Footer instituteName={instituteName} footerText={footerText} />
      </body>
    </html>
  );
}
