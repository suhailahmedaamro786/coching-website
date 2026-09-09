import { createClient } from '@/lib/supabase/server';
import CourseGrid from './CourseGrid';
import type { Course } from '@/lib/types';

/**
 * Server component that fetches published courses joined with their teacher,
 * then renders the interactive catalog grid.
 */
export default async function CoursesSection() {
  const supabase = createClient();
  const { data } = await supabase
    .from('courses')
    .select('*, teachers(*)')
    .eq('status', 'published')
    .order('created_at');

  const courses = (data ?? []) as unknown as Course[];

  return (
    <section className="app-container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Courses</h1>
        <p className="mt-2 text-slate-400">
          Browse our catalog and apply to the program that fits your goals.
        </p>
      </div>
      <CourseGrid courses={courses} />
    </section>
  );
}
