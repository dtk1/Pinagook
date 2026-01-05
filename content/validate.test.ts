import { describe, it, expect } from 'vitest';
import { loadCourseFromJson } from './validate';
import demoCourseJson from './demo-course.json';

describe('loadCourseFromJson', () => {
  it('should load demo-course.json successfully', () => {
    const course = loadCourseFromJson(demoCourseJson);

    expect(course).toBeDefined();
    expect(course.id).toBeDefined();
    expect(course.title).toBeDefined();
    expect(Array.isArray(course.lessons)).toBe(true);
    expect(course.lessons.length).toBeGreaterThan(0);
  });

  it('should reject empty lessons array', () => {
    const invalid = {
      id: 'course1',
      title: 'Test Course',
      lessons: [],
    };

    expect(() => loadCourseFromJson(invalid)).toThrow(/lessons.*non-empty array/i);
  });

  it('should reject empty steps array', () => {
    const invalid = {
      id: 'course1',
      title: 'Test Course',
      lessons: [
        {
          id: 'lesson1',
          courseId: 'course1',
          title: 'Test Lesson',
          steps: [],
        },
      ],
    };

    expect(() => loadCourseFromJson(invalid)).toThrow(/steps.*non-empty array/i);
  });

  it('should reject correctOptionId not in options', () => {
    const invalid = JSON.parse(JSON.stringify(demoCourseJson));
    
    // Find first single_choice step and break it
    const lesson = invalid.lessons[0];
    if (lesson && lesson.steps) {
      const singleChoiceStep = lesson.steps.find(
        (step: any) => step.type === 'single_choice'
      );
      
      if (singleChoiceStep) {
        singleChoiceStep.correctOptionId = 'non-existent-id';
        
        expect(() => loadCourseFromJson(invalid)).toThrow(/correctOptionId.*must exist in options/i);
      }
    }
  });

  it('should reject missing required fields', () => {
    expect(() => loadCourseFromJson({})).toThrow(/id.*required/i);
    expect(() => loadCourseFromJson({ id: 'course1' })).toThrow(/title.*required/i);
  });

  it('should reject invalid lesson courseId mismatch', () => {
    const invalid = {
      id: 'course1',
      title: 'Test Course',
      lessons: [
        {
          id: 'lesson1',
          courseId: 'wrong-course-id',
          title: 'Test Lesson',
          steps: [
            {
              id: 'step1',
              type: 'text',
              content: 'Test content',
            },
          ],
        },
      ],
    };

    expect(() => loadCourseFromJson(invalid)).toThrow(/courseId mismatch/i);
  });

  it('should reject invalid step type', () => {
    const invalid = {
      id: 'course1',
      title: 'Test Course',
      lessons: [
        {
          id: 'lesson1',
          courseId: 'course1',
          title: 'Test Lesson',
          steps: [
            {
              id: 'step1',
              type: 'invalid_type',
              content: 'Test content',
            },
          ],
        },
      ],
    };

    expect(() => loadCourseFromJson(invalid)).toThrow(/unknown type/i);
  });

  it('should reject single_choice with empty options', () => {
    const invalid = {
      id: 'course1',
      title: 'Test Course',
      lessons: [
        {
          id: 'lesson1',
          courseId: 'course1',
          title: 'Test Lesson',
          steps: [
            {
              id: 'step1',
              type: 'single_choice',
              question: 'Test question?',
              options: [],
              correctOptionId: 'opt1',
            },
          ],
        },
      ],
    };

    expect(() => loadCourseFromJson(invalid)).toThrow(/options.*non-empty array/i);
  });

  it('should reject fill_blank with empty correctAnswers', () => {
    const invalid = {
      id: 'course1',
      title: 'Test Course',
      lessons: [
        {
          id: 'lesson1',
          courseId: 'course1',
          title: 'Test Lesson',
          steps: [
            {
              id: 'step1',
              type: 'fill_blank',
              sentence: 'I ____ home.',
              correctAnswers: [],
            },
          ],
        },
      ],
    };

    expect(() => loadCourseFromJson(invalid)).toThrow(/correctAnswers.*non-empty array/i);
  });
});

