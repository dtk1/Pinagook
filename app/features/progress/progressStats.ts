/**
 * Progress statistics utilities
 * Calculate statistics from progress data
 */

import type { StepProgress } from './progressRepository';
import type { Course, Lesson } from '../../../content/types';

/**
 * Statistics for a single lesson
 */
export interface LessonStats {
  lessonId: string;
  lessonTitle: string;
  totalSteps: number;
  completedSteps: number;
  totalInteractiveSteps: number;
  completedInteractiveSteps: number;
  averageScore: number;
  lastUpdated: string | null;
}

/**
 * Statistics for a course
 */
export interface CourseStats {
  courseId: string;
  courseTitle: string;
  courseDbId: string | null;
  totalLessons: number;
  completedLessons: number;
  totalSteps: number;
  completedSteps: number;
  totalInteractiveSteps: number;
  completedInteractiveSteps: number;
  averageScore: number;
  lessons: LessonStats[];
  lastUpdated: string | null;
}

/**
 * Calculate statistics for a lesson
 */
export function calculateLessonStats(
  lesson: Lesson,
  progress: StepProgress[]
): LessonStats {
  const lessonProgress = progress.filter(p => p.lessonId === lesson.id);
  const interactiveSteps = lesson.steps.filter(
    step => step.type === 'single_choice' || step.type === 'fill_blank'
  );

  const completedSteps = lessonProgress.filter(p => p.isCompleted).length;
  const completedInteractiveSteps = lessonProgress.filter(
    p => p.isCompleted && interactiveSteps.some(s => s.id === p.stepId)
  ).length;

  const scores = lessonProgress
    .filter(p => p.isCompleted)
    .map(p => p.score);
  const averageScore = scores.length > 0
    ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    : 0;

  const lastUpdated = lessonProgress.length > 0
    ? lessonProgress.reduce((latest, p) => 
        p.updatedAt > latest ? p.updatedAt : latest, 
        lessonProgress[0].updatedAt
      )
    : null;

  return {
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    totalSteps: lesson.steps.length,
    completedSteps,
    totalInteractiveSteps: interactiveSteps.length,
    completedInteractiveSteps,
    averageScore,
    lastUpdated,
  };
}

/**
 * Calculate statistics for a course
 */
export function calculateCourseStats(
  course: Course,
  courseDbId: string | null,
  progress: StepProgress[]
): CourseStats {
  const courseProgress = progress;
  const allInteractiveSteps = course.lessons.flatMap(lesson =>
    lesson.steps.filter(step => step.type === 'single_choice' || step.type === 'fill_blank')
  );

  const completedSteps = courseProgress.filter(p => p.isCompleted).length;
  const completedInteractiveSteps = courseProgress.filter(
    p => p.isCompleted && allInteractiveSteps.some(s => s.id === p.stepId)
  ).length;

  const scores = courseProgress
    .filter(p => p.isCompleted)
    .map(p => p.score);
  const averageScore = scores.length > 0
    ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    : 0;

  const lessons = course.lessons.map(lesson =>
    calculateLessonStats(lesson, courseProgress)
  );

  const completedLessons = lessons.filter(
    l => l.completedSteps === l.totalSteps && l.totalSteps > 0
  ).length;

  const lastUpdated = courseProgress.length > 0
    ? courseProgress.reduce((latest, p) => 
        p.updatedAt > latest ? p.updatedAt : latest, 
        courseProgress[0].updatedAt
      )
    : null;

  return {
    courseId: course.id,
    courseTitle: course.title,
    courseDbId,
    totalLessons: course.lessons.length,
    completedLessons,
    totalSteps: course.lessons.reduce((sum, l) => sum + l.steps.length, 0),
    completedSteps,
    totalInteractiveSteps: allInteractiveSteps.length,
    completedInteractiveSteps,
    averageScore,
    lessons,
    lastUpdated,
  };
}
