/**
 * Course storage in localStorage
 * Stores raw JSON data for courses imported by teachers
 */

const STORAGE_KEY = 'pinagook:courses:v1';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface StoredCourse {
  id: string;
  courseId: string;
  title: string;
  rawJson: string;
  savedAt: number; // timestamp
}

/**
 * Get all stored courses from localStorage
 * @returns Array of stored course metadata
 */
export function listStoredCourses(): StoredCourse[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const data = JSON.parse(stored);
    if (!Array.isArray(data)) {
      return [];
    }

    return data;
  } catch (error) {
    console.error('Failed to load stored courses:', error);
    return [];
  }
}

/**
 * Load a stored course by ID
 * @param courseId - The course ID to load
 * @returns Raw JSON string or null if not found
 */
export function loadStoredCourseById(courseId: string): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const courses = listStoredCourses();
    const course = courses.find(c => c.courseId === courseId);
    return course ? course.rawJson : null;
  } catch (error) {
    console.error('Failed to load stored course:', error);
    return null;
  }
}

/**
 * Save a course to localStorage
 * @param courseId - The course ID
 * @param title - The course title
 * @param rawJson - The raw JSON string
 * @returns true if saved successfully, false otherwise
 */
export function saveStoredCourse(courseId: string, title: string, rawJson: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    // Validate JSON size
    if (rawJson.length > MAX_FILE_SIZE) {
      throw new Error(`Course JSON is too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`);
    }

    const courses = listStoredCourses();
    
    // Check if course already exists
    const existingIndex = courses.findIndex(c => c.courseId === courseId);
    
    const storedCourse: StoredCourse = {
      id: existingIndex >= 0 ? courses[existingIndex].id : Date.now().toString(),
      courseId,
      title,
      rawJson,
      savedAt: Date.now(),
    };

    if (existingIndex >= 0) {
      // Update existing
      courses[existingIndex] = storedCourse;
    } else {
      // Add new
      courses.push(storedCourse);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    return true;
  } catch (error) {
    console.error('Failed to save course:', error);
    return false;
  }
}

/**
 * Delete a stored course by ID
 * @param courseId - The course ID to delete
 * @returns true if deleted successfully, false otherwise
 */
export function deleteStoredCourse(courseId: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const courses = listStoredCourses();
    const filtered = courses.filter(c => c.courseId !== courseId);
    
    if (filtered.length === courses.length) {
      // Course not found
      return false;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete course:', error);
    return false;
  }
}

/**
 * Check if a course exists in storage
 * @param courseId - The course ID to check
 * @returns true if course exists, false otherwise
 */
export function storedCourseExists(courseId: string): boolean {
  const courses = listStoredCourses();
  return courses.some(c => c.courseId === courseId);
}

