import { notFound } from 'next/navigation';
import { getCourseForUserOrFallback } from '../../features/courses/coursesService';
import { getOptionalUser } from '../../lib/auth/getOptionalUser';
import CourseDetailPageClient from './CourseDetailPageClient';
import { Course } from '../../../content';

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  
  if (!courseId) {
    notFound();
  }

  let course: Course | null = null;
  let canDelete = false;

  try {
    course = await getCourseForUserOrFallback(courseId);
    const user = await getOptionalUser();
    canDelete = !!user;
  } catch (error) {
    console.error(`Error loading course ${courseId}:`, error);
  }

  if (!course) {
    notFound();
  }

  return (
    <CourseDetailPageClient
      course={course}
      courseId={courseId}
      canDelete={canDelete}
    />
  );
}

