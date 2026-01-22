/**
 * Course server actions
 * Handles course creation, update, and deletion
 */

'use server';

import { requireUser } from '../lib/auth/requireUser';
import { upsertCourseFromRawJson } from '../features/course-storage/coursesRepository';
import { createServerSupabaseClient } from '../lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Upsert a course from raw JSON
 * Validates the JSON and saves it to the database
 * @param rawJson - Raw JSON data to validate and store
 * @returns Result object with ok status and courseId or error message
 */
export async function upsertCourseAction(
  rawJson: unknown
): Promise<{ ok: true; courseId: string } | { ok: false; error: string }> {
  try {
    const user = await requireUser('/teacher');
    
    const result = await upsertCourseFromRawJson(user.id, rawJson);
    
    // Revalidate courses pages to ensure fresh data
    revalidatePath('/courses', 'layout');
    revalidatePath(`/courses/${result.courseId}`, 'page');
    revalidatePath(`/courses/${result.courseId}`, 'layout');
    
    return {
      ok: true,
      courseId: result.courseId,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in upsertCourseAction:', error);
    return {
      ok: false,
      error: message,
    };
  }
}

/**
 * Delete a course
 * @param courseId - The course ID to delete
 * @returns Result object with ok status or error message
 */
export async function deleteCourseAction(
  courseId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const user = await requireUser('/courses');
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('owner_id', user.id)
      .eq('course_id', courseId);

    if (error) {
      return {
        ok: false,
        error: `Failed to delete course: ${error.message}`,
      };
    }

    // Revalidate courses pages
    revalidatePath('/courses', 'layout');
    revalidatePath(`/courses/${courseId}`, 'page');

    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      ok: false,
      error: message,
    };
  }
}
