import { Suspense } from 'react';
import CoursesSection from '@/components/CoursesSection';
import { CourseGridSkeleton } from '@/components/ui/skeleton';

export const metadata = { title: 'Courses' };

export default function CoursesPage() {
  return (
    <Suspense fallback={<CourseGridSkeleton />}>
      <CoursesSection />
    </Suspense>
  );
}
