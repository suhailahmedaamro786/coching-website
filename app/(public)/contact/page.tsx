import SupportForm from '@/components/SupportForm';
import SupportWidget from '@/components/SupportWidget';

export const metadata = { title: 'Contact & Support' };

export default function ContactPage() {
  return (
    <section className="app-container flex flex-col items-center py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-white">We&rsquo;re here to help</h1>
        <p className="mt-2 text-slate-400">Reach out and we&rsquo;ll get back to you shortly.</p>
      </div>
      <SupportForm />
      <SupportWidget />

    </section>
  );
}
