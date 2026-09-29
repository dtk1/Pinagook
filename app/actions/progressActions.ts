/**
 * Progress server actions
 * Handles saving and loading user progress with DB-first approach
 */

'use server';

import { requireUser } from '../lib/auth/requireUser';
import {
  upsertStepProgress,
  getLessonProgress,
  deleteLessonProgress,
  type StepProgress,
} from '../features/progress/progressRepository';
import { getCourseDbId } from '../features/course-storage/coursesRepository';
import type { Answer } from '../features/lesson-player/types';
import { scoreStep } from '../features/lesson-player/scoring';
import type { Lesson, Step } from '../../content/types';

/**
 * Save progress for a single step
 * @param courseId - The course ID (string identifier)
 * @param courseDbId - The course database ID (UUID)
 * @param lessonId - The lesson ID
 * @param stepId - The step ID
 * @param isCompleted - Whether the step is completed
 * @param score - Score for this step (0-100)
 * @param userAnswer - User's answer
 * @returns Result object with ok status and optional error message
 */
export async function saveStepProgressAction(
  courseId: string,
  courseDbId: string | null,
  lessonId: string,
  stepId: string,
  isCompleted: boolean,
  score: number,
  userAnswer: Answer | null
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const user = await requireUser();

    // If courseDbId is not provided, try to get it from the course
    let dbId = courseDbId;
    if (!dbId) {
      dbId = await getCourseDbId(user.id, courseId);
    }

    // If still no dbId, this is likely a demo course or localStorage-only course
    // In this case, we can't save to DB, so return success (progress will be in localStorage)
    if (!dbId) {
      return { ok: true };
    }

    await upsertStepProgress(
      user.id,
      dbId,
      lessonId,
      stepId,
      isCompleted,
      score,
      userAnswer
    );

    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { ok: false, error: message };
  }
}

/**
 * Save all progress for a lesson (all checked steps)
 * @param courseId - The course ID (string identifier)
 * @param courseDbId - The course database ID (UUID)
 * @param lesson - The lesson object
 * @param answers - All answers by step ID
 * @param checked - All checked statuses by step ID
 * @returns Result object with ok status and optional error message
 */
export async function saveLessonProgressAction(
  courseId: string,
  courseDbId: string | null,
  lesson: Lesson,
  answers: Record<string, Answer>,
  checked: Record<string, boolean>
): Promise<{ ok: true; savedCount: number } | { ok: false; error: string }> {
  try {
    const user = await requireUser();

    // If courseDbId is not provided, try to get it from the course
    let dbId = courseDbId;
    if (!dbId) {
      dbId = await getCourseDbId(user.id, courseId);
    }

    // If still no dbId, this is likely a demo course or localStorage-only course
    if (!dbId) {
      return { ok: false, error: 'Course not found in database. Progress can only be saved for courses you own.' };
    }

    // Save progress for all checked steps
    let savedCount = 0;
    for (const step of lesson.steps) {
      const answer = answers[step.id];
      const isStepChecked = checked[step.id] || false;

      if (!isStepChecked) {
        continue; // Skip unchecked steps
      }

      // Calculate score for this step
      const stepResult = scoreStep(step, answer, isStepChecked);
      const score = stepResult?.isCorrect ? 100 : 0;
      const isCompleted = true; // If checked, it's completed

      await upsertStepProgress(
        user.id,
        dbId,
        lesson.id,
        step.id,
        isCompleted,
        score,
        answer || null
      );

      savedCount++;
    }

    return { ok: true, savedCount };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { ok: false, error: message };
  }
}

/**
 * Load progress for a lesson
 * @param courseId - The course ID (string identifier)
 * @param courseDbId - The course database ID (UUID)
 * @param lessonId - The lesson ID
 * @returns Result object with progress data or error
 */
export async function loadLessonProgressAction(
  courseId: string,
  courseDbId: string | null,
  lessonId: string
): Promise<
  | { ok: true; progress: StepProgress[] }
  | { ok: false; error: string }
> {
  try {
    const user = await requireUser();

    // If courseDbId is not provided, try to get it from the course
    let dbId = courseDbId;
    if (!dbId) {
      dbId = await getCourseDbId(user.id, courseId);
    }

    // If still no dbId, this is likely a demo course or localStorage-only course
    // Return empty progress (will be loaded from localStorage on client)
    if (!dbId) {
      return { ok: true, progress: [] };
    }

    const progress = await getLessonProgress(user.id, dbId, lessonId);
    return { ok: true, progress };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { ok: false, error: message };
  }
}

/**
 * Clear progress for a lesson (reset)
 * @param courseId - The course ID (string identifier)
 * @param courseDbId - The course database ID (UUID)
 * @param lessonId - The lesson ID
 * @returns Result object with ok status and optional error message
 */
export async function clearLessonProgressAction(
  courseId: string,
  courseDbId: string | null,
  lessonId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const user = await requireUser();

    // If courseDbId is not provided, try to get it from the course
    let dbId = courseDbId;
    if (!dbId) {
      dbId = await getCourseDbId(user.id, courseId);
    }

    // If still no dbId, this is likely a demo course or localStorage-only course
    // Return success (progress will be cleared from localStorage on client)
    if (!dbId) {
      return { ok: true };
    }

    await deleteLessonProgress(user.id, dbId, lessonId);
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { ok: false, error: message };
  }
}
