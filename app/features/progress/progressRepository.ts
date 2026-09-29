/**
 * Progress repository for database operations
 * Handles CRUD operations for user progress stored in Supabase
 */

import { createServerSupabaseClient } from '../../lib/supabase/server';
import type { Answer } from '../lesson-player/types';

/**
 * Progress entry for a single step
 */
export interface StepProgress {
  stepId: string;
  lessonId: string;
  isCompleted: boolean;
  score: number;
  userAnswer: Answer | null;
  updatedAt: string;
}

/**
 * Save or update progress for a specific step
 * @param userId - The user ID
 * @param courseDbId - The course database ID (UUID from courses table)
 * @param lessonId - The lesson ID
 * @param stepId - The step ID
 * @param isCompleted - Whether the step is completed
 * @param score - Score for this step (0-100)
 * @param userAnswer - User's answer (JSONB)
 * @throws Error if database operation fails
 */
export async function upsertStepProgress(
  userId: string,
  courseDbId: string,
  lessonId: string,
  stepId: string,
  isCompleted: boolean,
  score: number,
  userAnswer: Answer | null
): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from('user_progress')
    .upsert(
      {
        user_id: userId,
        course_db_id: courseDbId,
        lesson_id: lessonId,
        step_id: stepId,
        is_completed: isCompleted,
        score: score,
        user_answer: userAnswer as unknown,
        updated_at: new Date().toISOString(),
      } as any,
      {
        onConflict: 'user_id,course_db_id,step_id',
      }
    );

  if (error) {
    throw new Error(`Failed to save progress: ${error.message}`);
  }
}

/**
 * Get all progress entries for a specific lesson
 * @param userId - The user ID
 * @param courseDbId - The course database ID
 * @param lessonId - The lesson ID
 * @returns Array of step progress entries
 * @throws Error if database operation fails
 */
export async function getLessonProgress(
  userId: string,
  courseDbId: string,
  lessonId: string
): Promise<StepProgress[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('user_progress')
    .select('step_id, lesson_id, is_completed, score, user_answer, updated_at')
    .eq('user_id', userId)
    .eq('course_db_id', courseDbId)
    .eq('lesson_id', lessonId)
    .order('updated_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to load progress: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Type assertion needed due to Supabase type inference limitations
  return (data as any[]).map((row: any) => ({
    stepId: row.step_id as string,
    lessonId: row.lesson_id as string,
    isCompleted: row.is_completed as boolean,
    score: row.score as number,
    userAnswer: (row.user_answer as Answer | null) || null,
    updatedAt: row.updated_at as string,
  }));
}

/**
 * Get all progress entries for a specific course
 * @param userId - The user ID
 * @param courseDbId - The course database ID
 * @returns Array of step progress entries
 * @throws Error if database operation fails
 */
export async function getCourseProgress(
  userId: string,
  courseDbId: string
): Promise<StepProgress[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('user_progress')
    .select('step_id, lesson_id, is_completed, score, user_answer, updated_at')
    .eq('user_id', userId)
    .eq('course_db_id', courseDbId)
    .order('updated_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to load progress: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Type assertion needed due to Supabase type inference limitations
  return (data as any[]).map((row: any) => ({
    stepId: row.step_id as string,
    lessonId: row.lesson_id as string,
    isCompleted: row.is_completed as boolean,
    score: row.score as number,
    userAnswer: (row.user_answer as Answer | null) || null,
    updatedAt: row.updated_at as string,
  }));
}

/**
 * Delete all progress for a specific lesson
 * @param userId - The user ID
 * @param courseDbId - The course database ID
 * @param lessonId - The lesson ID
 * @throws Error if database operation fails
 */
export async function deleteLessonProgress(
  userId: string,
  courseDbId: string,
  lessonId: string
): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from('user_progress')
    .delete()
    .eq('user_id', userId)
    .eq('course_db_id', courseDbId)
    .eq('lesson_id', lessonId);

  if (error) {
    throw new Error(`Failed to delete progress: ${error.message}`);
  }
}
