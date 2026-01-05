'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCourseById, Course, Lesson } from '../../../content';
import Card from '../../components/Card';
import Button from '../../components/Button';

type PageState = 'loading' | 'error' | 'empty' | 'ready';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [state, setState] = useState<PageState>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      setError('Course ID is required');
      setState('error');
      return;
    }

    setState('loading');
    try {
      const loadedCourse = getCourseById(courseId);
      setCourse(loadedCourse);
      
      setTimeout(() => {
        if (loadedCourse.lessons.length === 0) {
          setState('empty');
        } else {
          setState('ready');
        }
      }, 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error loading course');
      setState('error');
    }
  }, [courseId]);

  const handleRetry = () => {
    if (!courseId) return;
    
    setState('loading');
    setError(null);
    try {
      const loadedCourse = getCourseById(courseId);
      setCourse(loadedCourse);
      if (loadedCourse.lessons.length === 0) {
        setState('empty');
      } else {
        setState('ready');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error loading course');
      setState('error');
    }
  };

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-[#F7FAFC] p-8 flex items-center justify-center">
        <div className="max-w-4xl mx-auto w-full">
          <Card className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0EA5B7] border-t-transparent"></div>
              <p className="text-[#475569] text-lg">Loading course...</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="min-h-screen bg-[#F7FAFC] p-8 flex items-center justify-center">
        <div className="max-w-4xl mx-auto w-full">
          <Card className="border-[#EF4444]">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-[#EF4444] mb-2">Failed to load course</h1>
              <p className="text-[#0F172A]">{error || 'An error occurred while loading the course.'}</p>
              <div className="flex gap-2 pt-2">
                <Button variant="primary" onClick={handleRetry}>
                  Retry
                </Button>
                <Link href="/courses">
                  <Button variant="secondary">
                    Back to Courses
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  if (state === 'empty') {
    return (
      <div className="min-h-screen bg-[#F7FAFC] p-8 flex items-center justify-center">
        <div className="max-w-4xl mx-auto w-full">
          <Card>
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-[#0F172A]">{course.title}</h1>
              <p className="text-[#475569]">This course doesn't have any lessons yet.</p>
              <div className="pt-2">
                <Link href="/courses">
                  <Button variant="secondary">
                    Back to Courses
                  </Button>
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
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">{course.title}</h1>
          {course.description && (
            <p className="text-[#475569] text-lg">{course.description}</p>
          )}
        </Card>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#0F172A] mb-4">
            Lessons ({course.lessons.length})
          </h2>
        </div>

        <div className="space-y-4">
          {course.lessons.map((lesson, index) => (
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
                <Button variant="primary">
                  Start Lesson
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

