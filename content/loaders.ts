/**
 * Content loaders - import and validate JSON course data
 */

import { Course } from './types';
import { loadCourseFromJson as validateCourse } from './validate';
import demoCourseJson from './demo-course.json';

/**
 * Load and validate a course from JSON data
 * @param data - Raw JSON data (unknown type for safety)
 * @returns Validated Course object
 * @throws Error with descriptive message if validation fails
 */
export function loadCourseFromJson(data: unknown): Course {
  return validateCourse(data);
}

/**
 * Get the demo course "Present Simple Basics"
 * @returns Validated Course object
 * @throws Error if demo course JSON is invalid
 */
export function getDemoCourse(): Course {
  return validateCourse(demoCourseJson);
}
