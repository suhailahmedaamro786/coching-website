import { Suspense } from 'react';
import Hero from '@/components/Hero';
import StatsBar from '@/components/StatsBar';
import TeamSection from '@/components/TeamSection';
import { TeamCardSkeleton } from '@/components/ui/skeleton';

export const metadata = { title: 'Home' };

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <Suspense
        fallback={
          <section className="app-container py-16">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <TeamCardSkeleton key={i} />
              ))}
            </div>
          </section>
        }
      >
        <TeamSection />
      </Suspense>
    </>
  );
}
