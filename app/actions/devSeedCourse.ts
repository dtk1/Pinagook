/**
 * Dev-only server action to seed demo course to database
 * Requires authenticated user
 * 
 * This file should be removed or secured before production
 */

'use server';

import { upsertCourseFromRawJson } from '../features/course-storage/coursesRepository';
import { getAllCourses, getDemoCourse } from '../../content';
import { createServerSupabaseClient } from '../lib/supabase/server';

/**
 * Seed single demo course to the database
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

/**
 * Seed all British Council level-based courses to the database
 */
export async function seedAllBritishCouncilCoursesToDb(): Promise<
  { ok: true; count: number } | { ok: false; error: string }
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
        error: 'Unauthorized. Please sign in as a teacher to seed courses.',
      };
    }

    const allCourses = getAllCourses();
    let seededCount = 0;

    for (const course of allCourses) {
      const courseJson = JSON.parse(JSON.stringify(course));
      await upsertCourseFromRawJson(user.id, courseJson);
      seededCount++;
    }

    return {
      ok: true,
      count: seededCount,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      ok: false,
      error: message,
    };
  }
}

