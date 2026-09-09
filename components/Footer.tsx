import Link from 'next/link';

/**
 * Global footer. Renders branding (institute name + footer text) that is
 * fetched server-side from the `system_settings` table in the layout and
 * passed down as props.
 */
export default function Footer({
  instituteName,
  footerText,
}: {
  instituteName: string;
  footerText: string;
}) {
  return (
    <footer className="mt-16 border-t border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="app-container flex flex-col items-center justify-between gap-3 py-8 text-sm text-slate-400 sm:flex-row">
        <p className="font-semibold text-slate-200">{instituteName}</p>
        <p>{footerText}</p>
        <p className="flex items-center gap-3">
          <Link href="/courses" className="transition-colors hover:text-white">Courses</Link>
          <span className="text-slate-600">·</span>
          <Link href="/contact" className="transition-colors hover:text-white">Support</Link>
        </p>
      </div>
    </footer>
  );
}
