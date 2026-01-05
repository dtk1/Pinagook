'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCourseById, Course, Lesson } from '../../../../../content';
import LessonPlayer from '../../../../features/lesson-player/LessonPlayer';
import Card from '../../../../components/Card';
import Button from '../../../../components/Button';

type PageState = 'loading' | 'error' | 'empty' | 'ready';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [state, setState] = useState<PageState>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId || !lessonId) {
      setError('Course ID and Lesson ID are required');
      setState('error');
      return;
    }

    setState('loading');
    try {
      const loadedCourse = getCourseById(courseId);
      setCourse(loadedCourse);
      
      const foundLesson = loadedCourse.lessons.find(l => l.id === lessonId);
      
      if (!foundLesson) {
        setError(`Lesson "${lessonId}" not found in course "${courseId}"`);
        setState('error');
        return;
      }

      setLesson(foundLesson);
      
      setTimeout(() => {
        if (foundLesson.steps.length === 0) {
          setState('empty');
        } else {
          setState('ready');
        }
      }, 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error loading lesson');
      setState('error');
    }
  }, [courseId, lessonId]);

  const handleRetry = () => {
    if (!courseId || !lessonId) return;
    
    setState('loading');
    setError(null);
    try {
      const loadedCourse = getCourseById(courseId);
      setCourse(loadedCourse);
      
      const foundLesson = loadedCourse.lessons.find(l => l.id === lessonId);
      
      if (!foundLesson) {
        setError(`Lesson "${lessonId}" not found in course "${courseId}"`);
        setState('error');
        return;
      }

      setLesson(foundLesson);
      
      if (foundLesson.steps.length === 0) {
        setState('empty');
      } else {
        setState('ready');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error loading lesson');
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
              <p className="text-[#475569] text-lg">Loading lesson...</p>
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
              <h1 className="text-2xl font-bold text-[#EF4444] mb-2">Failed to load lesson</h1>
              <p className="text-[#0F172A]">{error || 'An error occurred while loading the lesson.'}</p>
              <div className="flex gap-2 pt-2">
                <Button variant="primary" onClick={handleRetry}>
                  Retry
                </Button>
                {courseId && (
                  <Link href={`/courses/${courseId}`}>
                    <Button variant="secondary">
                      Back to Course
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!course || !lesson) {
    return null;
  }

  if (state === 'empty') {
    return (
      <div className="min-h-screen bg-[#F7FAFC] p-8 flex items-center justify-center">
        <div className="max-w-4xl mx-auto w-full">
          <Card>
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-[#0F172A]">{lesson.title}</h1>
              <p className="text-[#475569]">This lesson doesn't have any steps to complete.</p>
              <div className="pt-2">
                <Link href={`/courses/${courseId}`}>
                  <Button variant="secondary">
                    Back to Course
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Find current lesson index and next lesson
  const currentLessonIndex = course.lessons.findIndex(l => l.id === lessonId);
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

