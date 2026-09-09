import LoginForm from '@/components/auth/LoginForm';

export const metadata = { title: 'Sign in' };

export default function LoginPage() {
  return (
    <section className="app-container flex flex-col items-center justify-center py-16">
      <LoginForm />
    </section>
  );
}
