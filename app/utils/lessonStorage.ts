import { Lesson, LessonResult } from '../types/lesson';

const LESSONS_STORAGE_KEY = 'pinagook_lessons';
const RESULTS_STORAGE_KEY = 'pinagook_results';

// Lessons CRUD
export function getAllLessons(teacherId: string): Lesson[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(LESSONS_STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const lessons: Lesson[] = JSON.parse(stored);
    return lessons.filter(lesson => lesson.teacherId === teacherId);
  } catch {
    return [];
  }
}

export function getLessonById(id: string): Lesson | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(LESSONS_STORAGE_KEY);
  if (!stored) return null;
  
  try {
    const lessons: Lesson[] = JSON.parse(stored);
    return lessons.find(lesson => lesson.id === id) || null;
  } catch {
    return null;
  }
}

export function saveLesson(lesson: Lesson): void {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem(LESSONS_STORAGE_KEY);
  let lessons: Lesson[] = stored ? JSON.parse(stored) : [];
  
  const existingIndex = lessons.findIndex(l => l.id === lesson.id);
  if (existingIndex >= 0) {
    lessons[existingIndex] = { ...lesson, updatedAt: new Date().toISOString() };
  } else {
    lessons.push(lesson);
  }
  
  localStorage.setItem(LESSONS_STORAGE_KEY, JSON.stringify(lessons));
}

export function deleteLesson(id: string): void {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem(LESSONS_STORAGE_KEY);
  if (!stored) return;
  
  try {
    const lessons: Lesson[] = JSON.parse(stored);
    const filtered = lessons.filter(lesson => lesson.id !== id);
    localStorage.setItem(LESSONS_STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // Ignore errors
  }
}

// Results
export function getLessonResults(lessonId: string): LessonResult[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(RESULTS_STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const results: LessonResult[] = JSON.parse(stored);
    return results.filter(result => result.lessonId === lessonId);
  } catch {
    return [];
  }
}

export function saveResult(result: LessonResult): void {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem(RESULTS_STORAGE_KEY);
  let results: LessonResult[] = stored ? JSON.parse(stored) : [];
  
  results.push(result);
  localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(results));
}

export function getAllResults(): LessonResult[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(RESULTS_STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}



