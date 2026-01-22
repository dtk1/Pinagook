'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Course, Lesson } from '../../../../../content';
import LessonPlayer from '../../../../features/lesson-player/LessonPlayer';
import Card from '../../../../components/Card';
import Button from '../../../../components/Button';

interface LessonPageClientProps {
  course: Course;
  lesson: Lesson;
  courseId: string;
}

export default function LessonPageClient({
  course,
  lesson,
  courseId,
}: LessonPageClientProps) {
  const router = useRouter();

  // Find current lesson index and next lesson
  const currentLessonIndex = course.lessons.findIndex((l: Lesson) => l.id === lesson.id);
  const hasNextLesson = currentLessonIndex < course.lessons.length - 1;
  const nextLesson = hasNextLesson ? course.lessons[currentLessonIndex + 1] : null;

  const handleNextLesson = () => {
    if (nextLesson) {
      router.push(`/courses/${courseId}/lessons/${nextLesson.id}`);
    }
  };

  const handleFinish = () => {
    // Optionally navigate back to course page or show completion message
    console.log('Lesson finished!');
  };

  if (lesson.steps.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] p-8 flex items-center justify-center">
        <div className="max-w-4xl mx-auto w-full">
          <Card>
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-[#0F172A]">{lesson.title}</h1>
              <p className="text-[#475569]">This lesson doesn't have any steps to complete.</p>
              <div className="pt-2">
                <Link href={`/courses/${courseId}`}>
                  <Button variant="secondary">Back to Course</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] p-8">
      <div className="max-w-4xl mx-auto mb-6">
        <Link href={`/courses/${courseId}`}>
          <Button variant="ghost" size="s">
            ← Back to {course.title}
          </Button>
        </Link>
      </div>

      <LessonPlayer
        lesson={lesson}
        hasNextLesson={hasNextLesson}
        onFinish={handleFinish}
        onNextLesson={handleNextLesson}
      />
    </div>
  );
}
