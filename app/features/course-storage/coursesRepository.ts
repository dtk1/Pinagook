/**
 * Courses repository for database operations
 * Handles CRUD operations for courses stored in Supabase
 */

import { createServerSupabaseClient } from '../../lib/supabase/server';
import { loadCourseFromJson } from '../../../content/validate';
import type { Course } from '../../../content/types';

/**
 * Course metadata (without raw JSON)
 */
export interface CourseMetadata {
  courseId: string;
  title: string;
  description: string | null;
  updatedAt: string;
}

/**
 * List all courses for a specific owner
 * @param ownerId - The user ID (owner) to list courses for
 * @returns Array of course metadata
 * @throws Error if database operation fails
 */
export async function listCoursesForOwner(ownerId: string): Promise<CourseMetadata[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('courses')
    .select('course_id, title, description, updated_at')
    .eq('owner_id', ownerId)
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list courses: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Type assertion needed due to Supabase type inference limitations
  return (data as any[]).map((row: any) => ({
    courseId: row.course_id as string,
    title: row.title as string,
    description: row.description as string | null,
    updatedAt: row.updated_at as string,
  }));
}

/**
 * Get raw JSON for a specific course
 * @param ownerId - The user ID (owner) of the course
 * @param courseId - The course ID to retrieve
 * @returns Raw JSON data or null if not found
 * @throws Error if database operation fails
 */
export async function getCourseRawJson(
  ownerId: string,
  courseId: string
): Promise<unknown | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('courses')
    .select('raw_json')
    .eq('owner_id', ownerId)
    .eq('course_id', courseId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to get course: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  // Type assertion needed due to Supabase type inference limitations
  return (data as any).raw_json ?? null;
}

/**
 * Upsert a course from raw JSON
 * Validates the JSON, extracts metadata, and stores it in the database
 * @param ownerId - The user ID (owner) of the course
 * @param rawJson - Raw JSON data to validate and store
 * @returns Course metadata (courseId, title, description)
 * @throws Error if validation fails or database operation fails
 */
export async function upsertCourseFromRawJson(
  ownerId: string,
  rawJson: unknown
): Promise<{ courseId: string; title: string; description: string | null }> {
  // Validate the JSON using existing validation logic
  let validatedCourse: Course;
  try {
    validatedCourse = loadCourseFromJson(rawJson);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown validation error';
    throw new Error(`Invalid course JSON: ${message}`);
  }

  // Extract metadata
  const courseId = validatedCourse.id;
  const title = validatedCourse.title;
  const description = validatedCourse.description ?? null;

  const supabase = await createServerSupabaseClient();

  // Check if course already exists
  const { data: existing, error: selectError } = await supabase
    .from('courses')
    .select('id')
    .eq('owner_id', ownerId)
    .eq('course_id', courseId)
    .maybeSingle();

  const now = new Date().toISOString();

  if (selectError) {
    throw new Error(`Failed to check existing course: ${selectError.message}`);
  }

  if (existing) {
    // Update existing course
    // Update existing course
    // Using type assertion due to Supabase type inference limitations
    const { error: updateError } = await (supabase
      .from('courses')
      .update({
        title,
        description,
        raw_json: rawJson,
        updated_at: now,
      } as never) as any)
      .eq('owner_id', ownerId)
      .eq('course_id', courseId);

    if (updateError) {
      throw new Error(`Failed to update course: ${updateError.message}`);
    }
  } else {
    // Insert new course
    const { error: insertError } = await supabase
      .from('courses')
      .insert({
        owner_id: ownerId,
        course_id: courseId,
        title,
        description,
        raw_json: rawJson,
        created_at: now,
        updated_at: now,
      } as any); // Type assertion needed due to Supabase type inference limitations

    if (insertError) {
      throw new Error(`Failed to insert course: ${insertError.message}`);
    }
  }

  return {
    courseId,
    title,
    description,
  };
}
