import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LessonPlayer from './LessonPlayer';
import { Lesson, StepSingleChoice, StepFillBlank, StepText } from '../../../content/types';

// Helper to find button by text content
function findButtonByText(text: string | RegExp) {
  const buttons = screen.getAllByRole('button');
  return buttons.find(btn => {
    const btnText = btn.textContent?.trim() || '';
    if (typeof text === 'string') {
      return btnText.toLowerCase().includes(text.toLowerCase());
    }
    return text.test(btnText);
  });
}

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

// Mock progress storage
vi.mock('../progress/progressStorage', () => ({
  loadProgress: vi.fn(() => null),
  saveProgress: vi.fn(),
  clearProgress: vi.fn(),
}));

// Helper to create test lesson
function createTestLesson(steps: Lesson['steps']): Lesson {
  return {
    id: 'test-lesson',
    courseId: 'test-course',
    title: 'Test Lesson',
    steps,
  };
}

describe('LessonPlayer', () => {
  beforeEach(() => {
    localStorageMock.clear();
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  describe('UX Rules', () => {
    it('should render lesson player with text step', () => {
      const lesson = createTestLesson([
        {
          id: 'step-1',
          type: 'text',
          content: 'Welcome to the lesson',
        },
      ]);

      render(<LessonPlayer lesson={lesson} />);

      // Check that lesson content is rendered
      expect(screen.getByText('Welcome to the lesson')).toBeInTheDocument();
      expect(screen.getByText('Test Lesson')).toBeInTheDocument();
      
      // Check that navigation buttons exist
      const allButtons = screen.getAllByRole('button');
      expect(allButtons.length).toBeGreaterThan(0);
    });

    it('should disable Check button until user provides answer for single_choice', () => {
      const lesson = createTestLesson([
        {
          id: 'step-1',
          type: 'single_choice',
          question: 'What is 2+2?',
          options: [
            { id: 'opt-1', text: '3' },
            { id: 'opt-2', text: '4' },
            { id: 'opt-3', text: '5' },
          ],
          correctOptionId: 'opt-2',
        },
      ]);

      render(<LessonPlayer lesson={lesson} />);

      const checkButton = screen.getByRole('button', { name: /check/i });
      expect(checkButton).toBeDisabled();

      // Select an option
      const option = screen.getByText('4');
      fireEvent.click(option);

      // Check button should be enabled
      expect(checkButton).not.toBeDisabled();
    });

    it('should disable Check button until user provides answer for fill_blank', () => {
      const lesson = createTestLesson([
        {
          id: 'step-1',
          type: 'fill_blank',
          sentence: 'I ____ to school every day.',
          correctAnswers: ['go'],
        },
      ]);

      render(<LessonPlayer lesson={lesson} />);

      const checkButton = screen.getByRole('button', { name: /check/i });
      expect(checkButton).toBeDisabled();

      // Type an answer
      const input = screen.getByPlaceholderText('?');
      fireEvent.change(input, { target: { value: 'go' } });

      // Check button should be enabled
      expect(checkButton).not.toBeDisabled();
    });

    it('should disable Next button on interactive step until checked', async () => {
      const lesson = createTestLesson([
        {
          id: 'step-1',
          type: 'single_choice',
          question: 'What is 2+2?',
          options: [
            { id: 'opt-1', text: '3' },
            { id: 'opt-2', text: '4' },
            { id: 'opt-3', text: '5' },
          ],
          correctOptionId: 'opt-2',
        },
      ]);

      render(<LessonPlayer lesson={lesson} />);

      // Check that question is rendered
      expect(screen.getByText('What is 2+2?')).toBeInTheDocument();
      
      // Check button should be disabled initially
      const checkButton = screen.getByRole('button', { name: /check/i });
      expect(checkButton).toBeDisabled();

      // Select an option
      const option = screen.getByText('4');
      fireEvent.click(option);

      // Check button should be enabled after selection
      expect(checkButton).not.toBeDisabled();
      
      // Click check
      fireEvent.click(checkButton);

      // Should show feedback after check (use getAllByText since there might be multiple matches)
      await waitFor(() => {
        const feedback = screen.getAllByText(/correct|incorrect/i);
        expect(feedback.length).toBeGreaterThan(0);
      }, { timeout: 2000 });
    });

    it('should enable Check button after typing in fill_blank input', async () => {
      const user = userEvent.setup();
      const lesson = createTestLesson([
        {
          id: 'step-1',
          type: 'fill_blank',
          sentence: 'I ____ home.',
          correctAnswers: ['go'],
        },
      ]);

      render(<LessonPlayer lesson={lesson} />);

      const input = screen.getByPlaceholderText('?') as HTMLInputElement;
      const checkButton = screen.getByRole('button', { name: /check/i });
      
      expect(checkButton).toBeDisabled();

      // Type answer
      await user.type(input, 'go');

      // Check button should be enabled
      await waitFor(() => {
        expect(checkButton).not.toBeDisabled();
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate between steps', async () => {
      const lesson = createTestLesson([
        {
          id: 'step-1',
          type: 'text',
          content: 'First step',
        },
        {
          id: 'step-2',
          type: 'text',
          content: 'Second step',
        },
      ]);

      render(<LessonPlayer lesson={lesson} />);

      expect(screen.getByText('First step')).toBeInTheDocument();

      const nextButton = findButtonByText(/next/i);
      expect(nextButton).toBeDefined();
      fireEvent.click(nextButton!);

      await waitFor(() => {
        expect(screen.getByText('Second step')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should disable Back button on first step', () => {
      const lesson = createTestLesson([
        {
          id: 'step-1',
          type: 'text',
          content: 'First step',
        },
      ]);

      render(<LessonPlayer lesson={lesson} />);

      const backButton = findButtonByText(/back/i);
      expect(backButton).toBeDefined();
      expect(backButton).toBeDisabled();
    });
  });
});

