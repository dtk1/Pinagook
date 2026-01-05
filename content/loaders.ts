/**
 * Content loaders - import and validate JSON course data
 * Supports multiple courses via local JSON files
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

/**
 * Course loader function type
 * Each loader function returns a validated Course
 */
export type CourseLoader = () => Course;

/**
 * Registry of available course loaders
 * Add new courses by importing their JSON and adding a loader function here
 */
const courseLoaders: Record<string, CourseLoader> = {
  'present-simple-basics': () => validateCourse(demoCourseJson),
  // Add more courses here as they become available
  // Example:
  // 'past-tense-basics': () => validateCourse(pastTenseCourseJson),
};

/**
 * Get all available course IDs
 * @returns Array of course IDs
 */
export function getAvailableCourseIds(): string[] {
  return Object.keys(courseLoaders);
}

/**
 * Load a course by ID
 * @param courseId - The course ID to load
 * @returns Validated Course object
 * @throws Error if course not found or validation fails
 */
export function getCourseById(courseId: string): Course {
  const loader = courseLoaders[courseId];
  if (!loader) {
    throw new Error(`Course "${courseId}" not found. Available courses: ${getAvailableCourseIds().join(', ')}`);
  }
  return loader();
}

/**
 * Get all available courses
 * @returns Array of validated Course objects
 * @throws Error if any course validation fails
 */
export function getAllCourses(): Course[] {
  return getAvailableCourseIds().map(courseId => getCourseById(courseId));
}

/**
 * Check if a course exists
 * @param courseId - The course ID to check
 * @returns true if course exists, false otherwise
 */
export function courseExists(courseId: string): boolean {
  return courseId in courseLoaders;
}
