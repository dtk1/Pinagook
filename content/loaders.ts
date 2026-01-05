/**
 * Content loaders - import and validate JSON course data
 * Supports multiple courses via local JSON files and localStorage
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
 * Registry of available course loaders (static/built-in courses)
 * Add new courses by importing their JSON and adding a loader function here
 */
const courseLoaders: Record<string, CourseLoader> = {
  'present-simple-basics': () => validateCourse(demoCourseJson),
  // Add more courses here as they become available
  // Example:
  // 'past-tense-basics': () => validateCourse(pastTenseCourseJson),
};

/**
 * Load a course from localStorage by ID
 * This is a client-side only function
 * @param courseId - The course ID to load
 * @returns Validated Course object
 * @throws Error if course not found or validation fails
 */
function loadStoredCourseById(courseId: string): Course {
  if (typeof window === 'undefined') {
    throw new Error('loadStoredCourseById can only be called on the client side');
  }

  try {
    // Import dynamically to avoid SSR issues
    const storageKey = 'pinagook:courses:v1';
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      throw new Error(`Stored course "${courseId}" not found`);
    }

    const courses = JSON.parse(stored);
    if (!Array.isArray(courses)) {
      throw new Error('Invalid stored courses format');
    }

    const course = courses.find((c: { courseId: string }) => c.courseId === courseId);
    if (!course || !course.rawJson) {
      throw new Error(`Stored course "${courseId}" not found`);
    }

    const parsed = JSON.parse(course.rawJson);
    return validateCourse(parsed);
  } catch (error) {
    throw new Error(`Failed to load stored course "${courseId}": ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get all stored course IDs from localStorage
 * This is a client-side only function
 * @returns Array of course IDs
 */
function getStoredCourseIds(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storageKey = 'pinagook:courses:v1';
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      return [];
    }

    const courses = JSON.parse(stored);
    if (!Array.isArray(courses)) {
      return [];
    }

    return courses.map((c: { courseId: string }) => c.courseId);
  } catch (error) {
    console.error('Failed to load stored course IDs:', error);
    return [];
  }
}

/**
 * Get all available course IDs (static + stored)
 * @returns Array of course IDs
 */
export function getAvailableCourseIds(): string[] {
  const staticIds = Object.keys(courseLoaders);
  const storedIds = typeof window !== 'undefined' ? getStoredCourseIds() : [];
  
  // Combine and deduplicate
  const allIds = [...staticIds, ...storedIds];
  return Array.from(new Set(allIds));
}

/**
 * Load a course by ID (checks static loaders first, then localStorage)
 * @param courseId - The course ID to load
 * @returns Validated Course object
 * @throws Error if course not found or validation fails
 */
export function getCourseById(courseId: string): Course {
  // Try static loader first
  const loader = courseLoaders[courseId];
  if (loader) {
    return loader();
  }

  // Try stored course (client-side only)
  if (typeof window !== 'undefined') {
    try {
      return loadStoredCourseById(courseId);
    } catch (error) {
      // If stored course fails, continue to throw error below
    }
  }

  throw new Error(`Course "${courseId}" not found. Available courses: ${getAvailableCourseIds().join(', ')}`);
}

/**
 * Get all available courses (static + stored)
 * @returns Array of validated Course objects
 * @throws Error if any course validation fails
 */
export function getAllCourses(): Course[] {
  return getAvailableCourseIds().map(courseId => getCourseById(courseId));
}

/**
 * Check if a course exists (static or stored)
 * @param courseId - The course ID to check
 * @returns true if course exists, false otherwise
 */
export function courseExists(courseId: string): boolean {
  if (courseId in courseLoaders) {
    return true;
  }

  if (typeof window !== 'undefined') {
    try {
      const { storedCourseExists } = require('../app/features/course-storage/courseStorage');
      return storedCourseExists(courseId);
    } catch (error) {
      return false;
    }
  }

  return false;
}

/**
 * API functions for accessing stored courses (for use in client components)
 * These functions are safe to use in client components
 * Note: These are re-exported from course-storage module for convenience
 */
export const courseStorageAPI = {
  /**
   * List all stored courses
   * @returns Array of stored course metadata
   */
  listStoredCourses: (): Array<{ id: string; courseId: string; title: string; savedAt: number }> => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const storageKey = 'pinagook:courses:v1';
      const stored = localStorage.getItem(storageKey);
      if (!stored) {
        return [];
      }
      const courses = JSON.parse(stored);
      if (!Array.isArray(courses)) {
        return [];
      }
      return courses.map((c: { id: string; courseId: string; title: string; savedAt: number }) => ({
        id: c.id,
        courseId: c.courseId,
        title: c.title,
        savedAt: c.savedAt,
      }));
    } catch (error) {
      console.error('Failed to list stored courses:', error);
      return [];
    }
  },

  /**
   * Load a stored course by ID
   * @param courseId - The course ID to load
   * @returns Raw JSON string or null if not found
   */
  loadStoredCourseById: (courseId: string): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      const storageKey = 'pinagook:courses:v1';
      const stored = localStorage.getItem(storageKey);
      if (!stored) {
        return null;
      }
      const courses = JSON.parse(stored);
      if (!Array.isArray(courses)) {
        return null;
      }
      const course = courses.find((c: { courseId: string }) => c.courseId === courseId);
      return course?.rawJson || null;
    } catch (error) {
      console.error('Failed to load stored course:', error);
      return null;
    }
  },
};
