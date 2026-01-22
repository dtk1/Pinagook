import { listAvailableCourses } from '../features/courses/coursesService';
import CoursesPageClient from './CoursesPageClient';

import { Course } from '../../content';

export default async function CoursesPage() {
  let courses: Course[];
  let error: string | null = null;

  try {
    courses = await listAvailableCourses();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error loading courses';
    courses = [];
  }

  return <CoursesPageClient courses={courses} error={error} />;
}

