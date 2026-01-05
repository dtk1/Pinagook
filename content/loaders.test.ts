import { describe, it, expect } from 'vitest';
import { 
  getCourseById, 
  getAllCourses, 
  getAvailableCourseIds, 
  courseExists,
  getDemoCourse 
} from './loaders';

describe('loaders', () => {
  describe('getAvailableCourseIds', () => {
    it('should return array of course IDs', () => {
      const ids = getAvailableCourseIds();
      expect(Array.isArray(ids)).toBe(true);
      expect(ids.length).toBeGreaterThan(0);
      expect(ids).toContain('present-simple-basics');
    });
  });

  describe('courseExists', () => {
    it('should return true for existing course', () => {
      expect(courseExists('present-simple-basics')).toBe(true);
    });

    it('should return false for non-existing course', () => {
      expect(courseExists('non-existent-course')).toBe(false);
    });
  });

  describe('getCourseById', () => {
    it('should load existing course', () => {
      const course = getCourseById('present-simple-basics');
      expect(course).toBeDefined();
      expect(course.id).toBe('present-simple-basics');
      expect(course.title).toBeDefined();
      expect(Array.isArray(course.lessons)).toBe(true);
    });

    it('should throw error for non-existing course', () => {
      expect(() => getCourseById('non-existent-course')).toThrow(/not found/i);
    });
  });

  describe('getAllCourses', () => {
    it('should return array of all courses', () => {
      const courses = getAllCourses();
      expect(Array.isArray(courses)).toBe(true);
      expect(courses.length).toBeGreaterThan(0);
      
      // All courses should be valid
      courses.forEach(course => {
        expect(course.id).toBeDefined();
        expect(course.title).toBeDefined();
        expect(Array.isArray(course.lessons)).toBe(true);
      });
    });

    it('should include demo course', () => {
      const courses = getAllCourses();
      const demoCourse = courses.find(c => c.id === 'present-simple-basics');
      expect(demoCourse).toBeDefined();
    });
  });

  describe('getDemoCourse', () => {
    it('should return demo course', () => {
      const course = getDemoCourse();
      expect(course.id).toBe('present-simple-basics');
      expect(course.title).toBeDefined();
      expect(course.lessons.length).toBeGreaterThan(0);
    });

    it('should match getCourseById result', () => {
      const demoCourse = getDemoCourse();
      const courseById = getCourseById('present-simple-basics');
      expect(demoCourse.id).toBe(courseById.id);
      expect(demoCourse.title).toBe(courseById.title);
    });
  });
});

