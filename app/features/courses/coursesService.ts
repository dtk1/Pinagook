/**
 * Courses service - DB-first with localStorage fallback
 * Provides unified interface for accessing courses from DB or localStorage
 */

import { getOptionalUser } from '../../lib/auth/getOptionalUser';
import {
  listCoursesForOwner,
  getCourseRawJson,
  type CourseMetadata,
} from '../course-storage/coursesRepository';
import {
  getAllCourses,
  getCourseById,
  getDemoCourse,
  type Course,
} from '../../../content';
import { loadCourseFromJson } from '../../../content/validate';

/**
 * List available courses for the current user
 * - If authenticated: returns courses from DB
 * - If not authenticated: returns localStorage + static demo course
 */
export async function listAvailableCourses(): Promise<Course[]> {
  const user = await getOptionalUser();

  if (user) {
    // DB-first: fetch from Supabase
    try {
      const dbCourses = await listCoursesForOwner(user.id);
      
      // Load and validate each course from DB
      const validatedCourses: Course[] = [];
      for (const metadata of dbCourses) {
        try {
          const rawJson = await getCourseRawJson(user.id, metadata.courseId);
          if (rawJson) {
            const validated = loadCourseFromJson(rawJson);
            validatedCourses.push(validated);
          }
        } catch (error) {
          // Skip invalid courses, log error
          console.error(`Failed to load course ${metadata.courseId}:`, error);
        }
      }
      
      return validatedCourses;
    } catch (error) {
      // If DB fails, fallback to localStorage/static
      console.error('Failed to load courses from DB, falling back:', error);
      return getAllCourses();
    }
  } else {
    // Not authenticated: use localStorage + static demo
    return getAllCourses();
  }
}

/**
 * Get a course by ID
 * - If authenticated: tries DB first, then fallback
 * - If not authenticated: uses localStorage/static
 */
export async function getCourseForUserOrFallback(
  courseId: string
): Promise<Course | null> {
  const user = await getOptionalUser();

  if (user) {
    // DB-first: try to fetch from Supabase
    try {
      const rawJson = await getCourseRawJson(user.id, courseId);
      if (rawJson) {
        // Validate and return
        try {
          return loadCourseFromJson(rawJson);
        } catch (validationError) {
          console.error(`Course ${courseId} failed validation:`, validationError);
          // If validation fails, don't fallback - return null
          return null;
        }
      } else {
        // Course not found in DB, try fallback
        console.log(`Course ${courseId} not found in DB for user ${user.id}, trying fallback`);
      }
    } catch (error) {
      // If DB fails, fallback to localStorage/static
      console.error(`Failed to load course ${courseId} from DB, falling back:`, error);
    }
  }

  // Fallback: use existing localStorage/static loaders
  try {
    return getCourseById(courseId);
  } catch (error) {
    console.error(`Course ${courseId} not found in fallback sources:`, error);
    return null;
  }
}
