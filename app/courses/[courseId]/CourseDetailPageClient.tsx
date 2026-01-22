'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Course, Lesson } from '../../../content';
import { deleteCourseAction } from '../../actions/courseActions';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useState } from 'react';

interface CourseDetailPageClientProps {
  course: Course;
  courseId: string;
  canDelete: boolean;
}

export default function CourseDetailPageClient({
  course,
  courseId,
  canDelete,
}: CourseDetailPageClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!canDelete) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.title}"? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    setIsDeleting(true);
    const result = await deleteCourseAction(courseId);
    setIsDeleting(false);

    if (result.ok) {
      router.push('/courses');
      router.refresh();
    } else {
      alert(`Failed to delete course: ${result.error}`);
    }
  };

  if (course.lessons.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] p-8 flex items-center justify-center">
        <div className="max-w-4xl mx-auto w-full">
          <Card>
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-[#0F172A]">{course.title}</h1>
              <p className="text-[#475569]">This course doesn't have any lessons yet.</p>
              <div className="pt-2">
                <Link href="/courses">
                  <Button variant="secondary">Back to Courses</Button>
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/courses">
            <Button variant="ghost" size="s" className="mb-4">
              ← Back to Courses
            </Button>
          </Link>
        </div>

        <Card className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#0F172A] mb-2">{course.title}</h1>
              {course.description && (
                <p className="text-[#475569] text-lg">{course.description}</p>
              )}
            </div>
            {canDelete && (
              <Button
                variant="danger"
                size="s"
                onClick={handleDelete}
                isLoading={isDeleting}
                className="ml-4"
              >
                Delete
              </Button>
            )}
          </div>
        </Card>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#0F172A] mb-4">
            Lessons ({course.lessons.length})
          </h2>
        </div>

        <div className="space-y-4">
          {course.lessons.map((lesson: Lesson, index: number) => (
            <Card key={lesson.id} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D9F6F8] text-[#0EA5B7] font-semibold text-sm">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-semibold text-[#0F172A]">{lesson.title}</h3>
                </div>
                {lesson.description && (
                  <p className="text-[#475569] text-sm ml-11 mb-2">{lesson.description}</p>
                )}
                <div className="flex items-center gap-4 ml-11 text-sm text-[#475569]">
                  <span>{lesson.steps.length} {lesson.steps.length === 1 ? 'step' : 'steps'}</span>
                </div>
              </div>
              <Link href={`/courses/${courseId}/lessons/${lesson.id}`}>
                <Button variant="primary">Start Lesson</Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
