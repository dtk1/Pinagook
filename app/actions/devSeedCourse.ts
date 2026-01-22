/**
 * Dev-only server action to seed demo course to database
 * Requires authenticated user
 * 
 * This file should be removed or secured before production
 */

'use server';

import { upsertCourseFromRawJson } from '../features/course-storage/coursesRepository';
import { getDemoCourse } from '../../content';
import { createServerSupabaseClient } from '../lib/supabase/server';

/**
 * Seed the demo course to the database
 * Uses the current authenticated user's ID as owner
 * @returns Result object with ok status and courseId or error message
 */
export async function seedDemoCourseToDb(): Promise<
  { ok: true; courseId: string } | { ok: false; error: string }
> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        ok: false,
        error: 'Unauthorized. Please sign in to seed courses.',
      };
    }

    // Get demo course and convert back to raw JSON for storage
    const demoCourse = getDemoCourse();
    const demoCourseJson = JSON.parse(JSON.stringify(demoCourse));

    const result = await upsertCourseFromRawJson(user.id, demoCourseJson);
    return {
      ok: true,
      courseId: result.courseId,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      ok: false,
      error: message,
    };
  }
}
