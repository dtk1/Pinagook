/**
 * Course/Lesson/Step Type Definitions
 * Discriminated union for Step types
 */

// Base step properties
export interface StepBase {
  id: string;
  type: 'text' | 'single_choice' | 'fill_blank';
  title?: string;
  prompt?: string;
  audioUrl?: string;
}

// Text step
export interface StepText extends StepBase {
  type: 'text';
  content: string;
}

// Single choice step
export interface StepSingleChoice extends StepBase {
  type: 'single_choice';
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation?: string;
}

// Fill blank step
export interface StepFillBlank extends StepBase {
  type: 'fill_blank';
  sentence: string;
  correctAnswers: string[];
  explanation?: string;
}

// Discriminated union for all step types
export type Step = StepText | StepSingleChoice | StepFillBlank;

export type SkillCategory = 'Grammar' | 'Vocabulary' | 'Listening' | 'Reading' | 'Use of English' | 'Writing' | 'Exams';
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

// Lesson structure
export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  category?: SkillCategory;
  level?: CEFRLevel;
  audioUrl?: string;
  steps: Step[];
}

// Course structure
export interface Course {
  id: string;
  title: string;
  description?: string;
  level?: CEFRLevel;
  category?: SkillCategory;
  lessons: Lesson[];
}



