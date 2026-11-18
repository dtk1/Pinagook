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
  const dbValidated: Course[] = [];

  if (user) {
    // Try fetching user DB courses
    try {
      const dbCourses = await listCoursesForOwner(user.id);
      
      for (const metadata of dbCourses) {
        try {
          const rawJson = await getCourseRawJson(user.id, metadata.courseId);
          if (rawJson) {
            const validated = loadCourseFromJson(rawJson);
            dbValidated.push(validated);
          }
        } catch (error) {
          console.error(`Failed to load course ${metadata.courseId}:`, error);
        }
      }
    } catch (error) {
      console.error('Failed to load courses from DB, falling back to static:', error);
    }
  }

  // Get static bundled courses
  const staticCourses = getAllCourses();

  // Combine static and DB courses (DB overrides static if ID matches)
  const courseMap = new Map<string, Course>();
  for (const c of staticCourses) {
    courseMap.set(c.id, c);
  }
  for (const c of dbValidated) {
    courseMap.set(c.id, c);
  }

  return Array.from(courseMap.values());
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
