import { notFound } from 'next/navigation';
import { getCourseForUserOrFallback } from '../../../../features/courses/coursesService';
import LessonPageClient from './LessonPageClient';

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;

  if (!courseId || !lessonId) {
    notFound();
  }

  const course = await getCourseForUserOrFallback(courseId);

  if (!course) {
    notFound();
  }

  const lesson = course.lessons.find((l: { id: string }) => l.id === lessonId);

  if (!lesson) {
    notFound();
  }

  return <LessonPageClient course={course} lesson={lesson} courseId={courseId} />;
}

