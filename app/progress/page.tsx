import { redirect } from 'next/navigation';
import { requireUser } from '../lib/auth/requireUser';
import { listAvailableCourses } from '../features/courses/coursesService';
import { getCourseDbId } from '../features/course-storage/coursesRepository';
import { getCourseProgress } from '../features/progress/progressRepository';
import { calculateCourseStats, type CourseStats } from '../features/progress/progressStats';
import ProgressPageClient from './ProgressPageClient';

export default async function ProgressPage() {
  // Require authentication
  const user = await requireUser('/progress');

  let coursesStats: CourseStats[] = [];
  let error: string | null = null;

  try {
    // Get all available courses
    const courses = await listAvailableCourses();

    // Get progress for each course
    const statsPromises = courses.map(async (course) => {
      try {
        // Try to get course DB ID
        let courseDbId: string | null = null;
        try {
          courseDbId = await getCourseDbId(user.id, course.id);
        } catch {
          // Course might not be in DB (demo course), that's okay
          courseDbId = null;
        }

        // Get progress if course is in DB
        let progress: Awaited<ReturnType<typeof getCourseProgress>> = [];
        if (courseDbId) {
          try {
            progress = await getCourseProgress(user.id, courseDbId);
          } catch {
            // No progress yet, that's okay
            progress = [];
          }
        }

        return calculateCourseStats(course, courseDbId, progress);
      } catch (err) {
        console.error(`Error calculating stats for course ${course.id}:`, err);
        // Return empty stats for this course
        return calculateCourseStats(course, null, []);
      }
    });

    coursesStats = await Promise.all(statsPromises);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error loading progress';
    console.error('Error loading progress:', err);
  }

  return <ProgressPageClient coursesStats={coursesStats} error={error} />;
}
