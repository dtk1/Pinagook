import { notFound } from 'next/navigation';
import { getCourseForUserOrFallback } from '../../features/courses/coursesService';
import { getOptionalUser } from '../../lib/auth/getOptionalUser';
import CourseDetailPageClient from './CourseDetailPageClient';

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  
  if (!courseId) {
    notFound();
  }

  try {
    const course = await getCourseForUserOrFallback(courseId);
    
    if (!course) {
      console.error(`Course ${courseId} not found`);
      notFound();
    }

    // Check if user is authenticated and owns this course (for delete button)
    const user = await getOptionalUser();
    const canDelete = !!user; // For now, any authenticated user can delete their own courses

    return (
      <CourseDetailPageClient
        course={course}
        courseId={courseId}
        canDelete={canDelete}
      />
    );
  } catch (error) {
    console.error(`Error loading course ${courseId}:`, error);
    notFound();
  }
}

