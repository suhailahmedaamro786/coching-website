import { createClient } from '@/lib/supabase/server';
import CourseGrid from './CourseGrid';
import type { Course } from '@/lib/types';

/**
 * Server component that fetches active/published courses joined with their
 * teacher, then renders the interactive catalog grid.
 */
export default async function CoursesSection() {
  let courses: Course[] = [];

  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('courses')
      .select('*, teachers(*)')
      .or('status.eq.published,status.eq.active')
      .order('created_at');

    if (error) {
      console.error('[CoursesSection] Supabase query failed:', error.message);
    } else {
      // Normalize image field so the UI can render from either
      // `thumbnail_url` or `image_url` depending on what exists in the DB.
      const normalized = (data ?? []).map((c: any) => ({
        ...c,
        thumbnail_url: c.thumbnail_url ?? c.image_url ?? null,
      }));

      courses = normalized as unknown as Course[];
    }
  } catch (err) {
    // Gracefully degrade to an empty catalog rather than crashing the page.
    console.error('[CoursesSection] unexpected error:', err);
  }

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
