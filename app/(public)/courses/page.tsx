import { Suspense } from 'react';
import CoursesSection from '@/components/CoursesSection';
import { CourseGridSkeleton } from '@/components/ui/skeleton';

export const metadata = { title: 'Courses' };

// Ensure fresh data after Supabase seeding; avoid Next.js cache.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function CoursesPage() {
  return (
    <Suspense fallback={<CourseGridSkeleton />}>
      <CoursesSection />
    </Suspense>
  );
}
