'use client';

import { useEffect, useState } from 'react';
import { getDemoCourse, Course, Lesson } from '../../content';
import LessonPlayer from '../features/lesson-player/LessonPlayer';

export default function LessonPlayerPage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const demoCourse = getDemoCourse();
      setCourse(demoCourse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error loading course');
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h1 className="text-2xl font-bold text-red-900 mb-2">Error</h1>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-[#475569]">Loading lesson...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentLesson = course.lessons[currentLessonIndex];
  const hasNextLesson = currentLessonIndex < course.lessons.length - 1;

  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <p className="text-yellow-900">No lessons found in course</p>
          </div>
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

