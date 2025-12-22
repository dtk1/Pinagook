/**
 * Scoring logic for lesson player
 * Computes results for interactive steps and entire lessons
 */

import { Lesson, Step, StepSingleChoice, StepFillBlank } from '../../../content/types';
import { Answer, SingleChoiceAnswer, FillBlankAnswer } from './types';
import { AnswersByStepId, CheckedByStepId } from './types';

/**
 * Normalize answer string for comparison (trim + lowercase)
 */
export function normalizeAnswer(str: string): string {
  return str.trim().toLowerCase();
}

/**
 * Step result for single_choice
 */
export interface SingleChoiceStepResult {
  stepId: string;
  type: 'single_choice';
  isCorrect: boolean;
  prompt: string; // question
  userAnswer: string; // selected option text
  correctAnswer: string; // correct option text
  explanation?: string;
}

/**
 * Step result for fill_blank
 */
export interface FillBlankStepResult {
  stepId: string;
  type: 'fill_blank';
  isCorrect: boolean;
  prompt: string; // sentence
  userAnswer: string; // raw user input
  correctAnswers: string[]; // array of acceptable answers
  explanation?: string;
}

/**
 * Discriminated union for step results
 */
export type StepResult = SingleChoiceStepResult | FillBlankStepResult;

/**
 * Complete lesson result
 */
export interface LessonResult {
  totalInteractiveSteps: number;
  correctCount: number;
  percentCorrect: number;
  stepResults: StepResult[];
}

/**
 * Score a single step
 * Returns StepResult if step is interactive and checked, null otherwise
 */
export function scoreStep(
  step: Step,
  answer: Answer | undefined,
  isChecked: boolean
): StepResult | null {
  // Only score interactive steps that have been checked
  if (step.type === 'text' || !answer || !isChecked) {
    return null;
  }

  if (step.type === 'single_choice' && answer.type === 'single_choice') {
    const selectedOption = step.options.find(opt => opt.id === answer.selectedOptionId);
    const correctOption = step.options.find(opt => opt.id === step.correctOptionId);
    
    if (!selectedOption || !correctOption) {
      return null;
    }

    const isCorrect = answer.selectedOptionId === step.correctOptionId;

    return {
      stepId: step.id,
      type: 'single_choice',
      isCorrect,
      prompt: step.question,
      userAnswer: selectedOption.text,
      correctAnswer: correctOption.text,
      explanation: step.explanation,
    };
  }

  if (step.type === 'fill_blank' && answer.type === 'fill_blank') {
    const normalizedUserAnswer = normalizeAnswer(answer.value);
    const normalizedCorrectAnswers = step.correctAnswers.map(normalizeAnswer);
    const isCorrect = normalizedCorrectAnswers.includes(normalizedUserAnswer);

    return {
      stepId: step.id,
      type: 'fill_blank',
      isCorrect,
      prompt: step.sentence,
      userAnswer: answer.value,
      correctAnswers: step.correctAnswers,
      explanation: step.explanation,
    };
  }

  return null;
}

/**
 * Score entire lesson
 * Returns LessonResult with all interactive step results
 */
export function scoreLesson(
  lesson: Lesson,
  answers: AnswersByStepId,
  checked: CheckedByStepId
): LessonResult {
  // Get all interactive steps
  const interactiveSteps = lesson.steps.filter(step => 
    step.type === 'single_choice' || step.type === 'fill_blank'
  );

  // Score each interactive step (only checked steps are scored)
  const stepResults: StepResult[] = [];
  for (const step of interactiveSteps) {
    const answer = answers[step.id];
    const isChecked = checked[step.id] || false;
    const result = scoreStep(step, answer, isChecked);
    if (result) {
      stepResults.push(result);
    }
  }

  // Calculate stats
  const totalInteractiveSteps = interactiveSteps.length;
  const correctCount = stepResults.filter(r => r.isCorrect).length;
  const percentCorrect = totalInteractiveSteps > 0
    ? Math.round((correctCount / totalInteractiveSteps) * 100)
    : 0;

  return {
    totalInteractiveSteps,
    correctCount,
    percentCorrect,
    stepResults,
  };
}

