import { describe, it, expect } from 'vitest';
import { scoreStep, scoreLesson, normalizeAnswer } from './scoring';
import type { StepSingleChoice, StepFillBlank, Lesson } from '../../../content/types';
import type { SingleChoiceAnswer, FillBlankAnswer, AnswersByStepId, CheckedByStepId } from './types';

describe('normalizeAnswer', () => {
  it('should trim whitespace and convert to lowercase', () => {
    expect(normalizeAnswer('  HELLO  ')).toBe('hello');
    expect(normalizeAnswer('World')).toBe('world');
    expect(normalizeAnswer('  Test  Case  ')).toBe('test  case');
  });
});

describe('scoreStep - single_choice', () => {
  const step: StepSingleChoice = {
    id: 'step1',
    type: 'single_choice',
    question: 'What is 2+2?',
    options: [
      { id: 'opt1', text: '3' },
      { id: 'opt2', text: '4' },
      { id: 'opt3', text: '5' },
    ],
    correctOptionId: 'opt2',
  };

  it('should return correct result for correct answer', () => {
    const answer: SingleChoiceAnswer = {
      type: 'single_choice',
      selectedOptionId: 'opt2',
    };

    const result = scoreStep(step, answer, true);

    expect(result).not.toBeNull();
    expect(result?.type).toBe('single_choice');
    expect(result?.isCorrect).toBe(true);
    expect(result?.userAnswer).toBe('4');
    expect(result?.correctAnswer).toBe('4');
  });

  it('should return incorrect result for wrong answer', () => {
    const answer: SingleChoiceAnswer = {
      type: 'single_choice',
      selectedOptionId: 'opt1',
    };

    const result = scoreStep(step, answer, true);

    expect(result).not.toBeNull();
    expect(result?.type).toBe('single_choice');
    expect(result?.isCorrect).toBe(false);
    expect(result?.userAnswer).toBe('3');
    expect(result?.correctAnswer).toBe('4');
  });

  it('should return null if not checked', () => {
    const answer: SingleChoiceAnswer = {
      type: 'single_choice',
      selectedOptionId: 'opt2',
    };

    const result = scoreStep(step, answer, false);
    expect(result).toBeNull();
  });

  it('should return null if no answer provided', () => {
    const result = scoreStep(step, undefined, true);
    expect(result).toBeNull();
  });
});

describe('scoreStep - fill_blank', () => {
  const step: StepFillBlank = {
    id: 'step2',
    type: 'fill_blank',
    sentence: 'I ____ to school every day.',
    correctAnswers: ['go', 'walk'],
  };

  it('should return correct for exact match', () => {
    const answer: FillBlankAnswer = {
      type: 'fill_blank',
      value: 'go',
    };

    const result = scoreStep(step, answer, true);

    expect(result).not.toBeNull();
    expect(result?.type).toBe('fill_blank');
    expect(result?.isCorrect).toBe(true);
    expect(result?.userAnswer).toBe('go');
  });

  it('should return correct with whitespace normalization', () => {
    const answer: FillBlankAnswer = {
      type: 'fill_blank',
      value: '  go  ',
    };

    const result = scoreStep(step, answer, true);
    expect(result?.isCorrect).toBe(true);
  });

  it('should return correct with case normalization', () => {
    const answer: FillBlankAnswer = {
      type: 'fill_blank',
      value: 'GO',
    };

    const result = scoreStep(step, answer, true);
    expect(result?.isCorrect).toBe(true);
  });

  it('should return correct with both whitespace and case normalization', () => {
    const answer: FillBlankAnswer = {
      type: 'fill_blank',
      value: '  WALK  ',
    };

    const result = scoreStep(step, answer, true);
    expect(result?.isCorrect).toBe(true);
  });

  it('should return incorrect for wrong answer', () => {
    const answer: FillBlankAnswer = {
      type: 'fill_blank',
      value: 'run',
    };

    const result = scoreStep(step, answer, true);

    expect(result).not.toBeNull();
    expect(result?.type).toBe('fill_blank');
    expect(result?.isCorrect).toBe(false);
    expect(result?.userAnswer).toBe('run');
  });

  it('should return null if not checked', () => {
    const answer: FillBlankAnswer = {
      type: 'fill_blank',
      value: 'go',
    };

    const result = scoreStep(step, answer, false);
    expect(result).toBeNull();
  });
});

describe('scoreLesson', () => {
  const lesson: Lesson = {
    id: 'lesson1',
    courseId: 'course1',
    title: 'Test Lesson',
    steps: [
      {
        id: 'step1',
        type: 'text',
        content: 'Introduction text',
      },
      {
        id: 'step2',
        type: 'single_choice',
        question: 'What is 2+2?',
        options: [
          { id: 'opt1', text: '3' },
          { id: 'opt2', text: '4' },
        ],
        correctOptionId: 'opt2',
      },
      {
        id: 'step3',
        type: 'fill_blank',
        sentence: 'I ____ home.',
        correctAnswers: ['go'],
      },
    ],
  };

  it('should calculate correct percentage', () => {
    const answers: AnswersByStepId = {
      step2: { type: 'single_choice', selectedOptionId: 'opt2' },
      step3: { type: 'fill_blank', value: 'go' },
    };

    const checked: CheckedByStepId = {
      step2: true,
      step3: true,
    };

    const result = scoreLesson(lesson, answers, checked);

    expect(result.totalInteractiveSteps).toBe(2);
    expect(result.correctCount).toBe(2);
    expect(result.percentCorrect).toBe(100);
    expect(result.stepResults.length).toBe(2);
  });

  it('should calculate partial score', () => {
    const answers: AnswersByStepId = {
      step2: { type: 'single_choice', selectedOptionId: 'opt1' }, // wrong
      step3: { type: 'fill_blank', value: 'go' }, // correct
    };

    const checked: CheckedByStepId = {
      step2: true,
      step3: true,
    };

    const result = scoreLesson(lesson, answers, checked);

    expect(result.totalInteractiveSteps).toBe(2);
    expect(result.correctCount).toBe(1);
    expect(result.percentCorrect).toBe(50);
  });

  it('should only score checked steps', () => {
    const answers: AnswersByStepId = {
      step2: { type: 'single_choice', selectedOptionId: 'opt2' },
      step3: { type: 'fill_blank', value: 'go' },
    };

    const checked: CheckedByStepId = {
      step2: true,
      // step3 not checked
    };

    const result = scoreLesson(lesson, answers, checked);

    expect(result.totalInteractiveSteps).toBe(2);
    expect(result.correctCount).toBe(1);
    expect(result.stepResults.length).toBe(1);
  });

  it('should handle empty lesson', () => {
    const emptyLesson: Lesson = {
      id: 'lesson2',
      courseId: 'course1',
      title: 'Empty Lesson',
      steps: [],
    };

    const result = scoreLesson(emptyLesson, {}, {});

    expect(result.totalInteractiveSteps).toBe(0);
    expect(result.correctCount).toBe(0);
    expect(result.percentCorrect).toBe(0);
    expect(result.stepResults.length).toBe(0);
  });
});

