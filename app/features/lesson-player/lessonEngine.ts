/**
 * Pure helper functions for lesson player logic
 */

import { Step } from '../../../content/types';
import { Answer } from './types';

/**
 * Normalize string for comparison (trim + lowercase)
 */
export function normalize(str: string): string {
  return str.trim().toLowerCase();
}

/**
 * Check if step has an answer
 */
export function hasAnswer(step: Step, answer: Answer | undefined): boolean {
  if (!answer) return false;

  if (step.type === 'single_choice' && answer.type === 'single_choice') {
    return answer.selectedOptionId.length > 0;
  }

  if (step.type === 'fill_blank' && answer.type === 'fill_blank') {
    return answer.value.trim().length > 0;
  }

  return false;
}

/**
 * Check if answer is correct
 */
export function isCorrect(step: Step, answer: Answer | undefined): boolean {
  if (!answer) return false;

  if (step.type === 'single_choice' && answer.type === 'single_choice') {
    return answer.selectedOptionId === step.correctOptionId;
  }

  if (step.type === 'fill_blank' && answer.type === 'fill_blank') {
    const normalizedAnswer = normalize(answer.value);
    return step.correctAnswers.some(correct => normalize(correct) === normalizedAnswer);
  }

  return false;
}

/**
 * Check if step is interactive (requires answer)
 */
export function isInteractiveStep(step: Step): boolean {
  return step.type === 'single_choice' || step.type === 'fill_blank';
}

