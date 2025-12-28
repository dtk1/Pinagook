'use client';

import { useEffect, useState } from 'react';
import { getDemoCourse, Course, Lesson } from '../../content';
import LessonPlayer from '../features/lesson-player/LessonPlayer';
import Card from '../components/Card';
import Button from '../components/Button';

type PageState = 'loading' | 'error' | 'empty' | 'ready';

export default function LessonPlayerPage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [state, setState] = useState<PageState>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setState('loading');
    try {
      const demoCourse = getDemoCourse();
      setCourse(demoCourse);
      
      // Simulate loading delay for better UX
      setTimeout(() => {
        if (demoCourse.lessons.length === 0) {
          setState('empty');
        } else {
          setState('ready');
        }
      }, 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error loading course');
      setState('error');
    }
  }, []);

  const handleRetry = () => {
    setState('loading');
    setError(null);
    try {
      const demoCourse = getDemoCourse();
      setCourse(demoCourse);
      if (demoCourse.lessons.length === 0) {
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
              <div className="pt-2">
                <Button variant="primary" onClick={handleRetry}>
                  Retry
                </Button>
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

  const currentLesson = course.lessons[currentLessonIndex];
  const hasNextLesson = currentLessonIndex < course.lessons.length - 1;

  if (state === 'empty' || !currentLesson) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] p-8 flex items-center justify-center">
        <div className="max-w-4xl mx-auto w-full">
          <Card>
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-[#0F172A]">No steps yet</h1>
              <p className="text-[#475569]">This lesson doesn't have any steps to complete.</p>
              <div className="pt-2">
                <Button variant="secondary" onClick={() => window.location.href = '/'}>
                  Back to Home
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Check if lesson has steps
  if (currentLesson.steps.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] p-8 flex items-center justify-center">
        <div className="max-w-4xl mx-auto w-full">
          <Card>
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-[#0F172A]">No steps yet</h1>
              <p className="text-[#475569]">This lesson doesn't have any steps to complete.</p>
              <div className="pt-2">
                <Button variant="secondary" onClick={() => window.location.href = '/'}>
                  Back to Home
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const handleNextLesson = () => {
    if (hasNextLesson) {
      setCurrentLessonIndex(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] p-8">
      <LessonPlayer
        lesson={currentLesson}
        hasNextLesson={hasNextLesson}
        onFinish={() => {
          console.log('Lesson finished!');
        }}
        onNextLesson={handleNextLesson}
      />
    </div>
  );
}

