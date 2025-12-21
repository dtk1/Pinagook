/**
 * Answer types used by the lesson player
 */

// Answer for single_choice step
export interface SingleChoiceAnswer {
  type: 'single_choice';
  selectedOptionId: string;
}

// Answer for fill_blank step
export interface FillBlankAnswer {
  type: 'fill_blank';
  value: string;
}

// Union type for all answers
export type Answer = SingleChoiceAnswer | FillBlankAnswer;

// Answers stored by step ID
export type AnswersByStepId = Record<string, Answer>;

// Checked status stored by step ID
export type CheckedByStepId = Record<string, boolean>;

