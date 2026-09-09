import SignupForm from '@/components/auth/SignupForm';

export const metadata = { title: 'Create account' };

export default function SignupPage() {
  return (
    <section className="app-container flex flex-col items-center justify-center py-16">
      <SignupForm />
    </section>
  );
}
