import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveProgress,
  loadProgress,
  clearProgress,
  makeKey,
  StoredLessonProgress,
} from './progressStorage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

describe('progressStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    // Mock window.localStorage
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  describe('makeKey', () => {
    it('should create correct storage key', () => {
      const key = makeKey('course1', 'lesson1');
      expect(key).toBe('pinagook:progress:course1:lesson1');
    });
  });

  describe('saveProgress', () => {
    it('should save progress to localStorage', () => {
      const progress: StoredLessonProgress = {
        version: 1,
        courseId: 'course1',
        lessonId: 'lesson1',
        currentStepIndex: 2,
        answers: {
          'step-1': { type: 'single_choice', selectedOptionId: 'opt-1' },
        },
        checked: {
          'step-1': true,
        },
        updatedAt: Date.now(),
      };

      saveProgress(progress);

      const stored = localStorageMock.getItem(makeKey('course1', 'lesson1'));
      expect(stored).toBeTruthy();
      
      const parsed = JSON.parse(stored!);
      expect(parsed.courseId).toBe('course1');
      expect(parsed.lessonId).toBe('lesson1');
      expect(parsed.currentStepIndex).toBe(2);
    });

    it('should update existing progress', () => {
      const progress1: StoredLessonProgress = {
        version: 1,
        courseId: 'course1',
        lessonId: 'lesson1',
        currentStepIndex: 1,
        answers: {},
        checked: {},
        updatedAt: 1000,
      };

      const progress2: StoredLessonProgress = {
        version: 1,
        courseId: 'course1',
        lessonId: 'lesson1',
        currentStepIndex: 3,
        answers: { 'step-2': { type: 'single_choice', selectedOptionId: 'opt-2' } },
        checked: { 'step-2': true },
        updatedAt: 2000,
      };

      saveProgress(progress1);
      saveProgress(progress2);

      const loaded = loadProgress('course1', 'lesson1');
      expect(loaded?.currentStepIndex).toBe(3);
      expect(loaded?.answers['step-2']).toBeDefined();
    });
  });

  describe('loadProgress', () => {
    it('should return null if no progress exists', () => {
      const result = loadProgress('course1', 'lesson1');
      expect(result).toBeNull();
    });

    it('should load saved progress', () => {
      const progress: StoredLessonProgress = {
        version: 1,
        courseId: 'course1',
        lessonId: 'lesson1',
        currentStepIndex: 2,
        answers: {
          'step-1': { type: 'single_choice', selectedOptionId: 'opt-1' },
        },
        checked: {
          'step-1': true,
        },
        updatedAt: Date.now(),
      };

      saveProgress(progress);
      const loaded = loadProgress('course1', 'lesson1');

      expect(loaded).toBeTruthy();
      expect(loaded?.courseId).toBe('course1');
      expect(loaded?.lessonId).toBe('lesson1');
      expect(loaded?.currentStepIndex).toBe(2);
      expect(loaded?.answers['step-1']).toBeDefined();
      expect(loaded?.checked['step-1']).toBe(true);
    });

    it('should return null for different course/lesson', () => {
      const progress: StoredLessonProgress = {
        version: 1,
        courseId: 'course1',
        lessonId: 'lesson1',
        currentStepIndex: 0,
        answers: {},
        checked: {},
        updatedAt: Date.now(),
      };

      saveProgress(progress);
      const loaded = loadProgress('course2', 'lesson1');
      expect(loaded).toBeNull();
    });
  });

  describe('clearProgress', () => {
    it('should remove progress from localStorage', () => {
      const progress: StoredLessonProgress = {
        version: 1,
        courseId: 'course1',
        lessonId: 'lesson1',
        currentStepIndex: 2,
        answers: {},
        checked: {},
        updatedAt: Date.now(),
      };

      saveProgress(progress);
      expect(loadProgress('course1', 'lesson1')).toBeTruthy();

      clearProgress('course1', 'lesson1');
      expect(loadProgress('course1', 'lesson1')).toBeNull();
    });

    it('should not affect other progress', () => {
      const progress1: StoredLessonProgress = {
        version: 1,
        courseId: 'course1',
        lessonId: 'lesson1',
        currentStepIndex: 1,
        answers: {},
        checked: {},
        updatedAt: Date.now(),
      };

      const progress2: StoredLessonProgress = {
        version: 1,
        courseId: 'course1',
        lessonId: 'lesson2',
        currentStepIndex: 2,
        answers: {},
        checked: {},
        updatedAt: Date.now(),
      };

      saveProgress(progress1);
      saveProgress(progress2);

      clearProgress('course1', 'lesson1');

      expect(loadProgress('course1', 'lesson1')).toBeNull();
      expect(loadProgress('course1', 'lesson2')).toBeTruthy();
    });
  });
});

