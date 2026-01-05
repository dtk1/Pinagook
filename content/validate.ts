/**
 * Runtime validation for Course/Lesson/Step structures
 * Manual type guards (no external dependencies)
 */

import { Course, Lesson, Step, StepText, StepSingleChoice, StepFillBlank } from './types';

/**
 * Type guard: Check if value is a string
 */
function isString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

/**
 * Type guard: Check if value is an array
 */
function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Type guard: Check if value is an object
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Validate StepText
 */
function validateStepText(step: unknown, stepId: string): StepText {
  if (!isObject(step)) {
    throw new Error(`Step ${stepId}: must be an object`);
  }

  if (step.type !== 'text') {
    throw new Error(`Step ${stepId}: type must be "text"`);
  }

  if (!isString(step.content)) {
    throw new Error(`Step ${stepId}: "content" field is required and must be a string`);
  }

  const result: StepText = {
    id: stepId,
    type: 'text',
    content: step.content,
  };

  if (step.title !== undefined) {
    if (!isString(step.title)) {
      throw new Error(`Step ${stepId}: "title" must be a string if provided`);
    }
    result.title = step.title;
  }

  if (step.prompt !== undefined) {
    if (!isString(step.prompt)) {
      throw new Error(`Step ${stepId}: "prompt" must be a string if provided`);
    }
    result.prompt = step.prompt;
  }

  return result;
}

/**
 * Validate StepSingleChoice
 */
function validateStepSingleChoice(step: unknown, stepId: string): StepSingleChoice {
  if (!isObject(step)) {
    throw new Error(`Step ${stepId}: must be an object`);
  }

  if (step.type !== 'single_choice') {
    throw new Error(`Step ${stepId}: type must be "single_choice"`);
  }

  if (!isString(step.question)) {
    throw new Error(`Step ${stepId}: "question" field is required and must be a string`);
  }

  if (!isArray(step.options) || step.options.length === 0) {
    throw new Error(`Step ${stepId}: "options" must be a non-empty array`);
  }

  const options: { id: string; text: string }[] = [];
  const optionIds = new Set<string>();

  for (let i = 0; i < step.options.length; i++) {
    const option = step.options[i];
    if (!isObject(option)) {
      throw new Error(`Step ${stepId}: option ${i} must be an object`);
    }

    if (!isString(option.id)) {
      throw new Error(`Step ${stepId}: option ${i} must have an "id" string`);
    }

    if (!isString(option.text)) {
      throw new Error(`Step ${stepId}: option ${i} must have a "text" string`);
    }

    if (optionIds.has(option.id)) {
      throw new Error(`Step ${stepId}: duplicate option id "${option.id}"`);
    }

    optionIds.add(option.id);
    options.push({ id: option.id, text: option.text });
  }

  if (!isString(step.correctOptionId)) {
    throw new Error(`Step ${stepId}: "correctOptionId" field is required and must be a string`);
  }

  if (!optionIds.has(step.correctOptionId)) {
    throw new Error(`Step ${stepId}: "correctOptionId" "${step.correctOptionId}" must exist in options`);
  }

  const result: StepSingleChoice = {
    id: stepId,
    type: 'single_choice',
    question: step.question,
    options,
    correctOptionId: step.correctOptionId,
  };

  if (step.title !== undefined) {
    if (!isString(step.title)) {
      throw new Error(`Step ${stepId}: "title" must be a string if provided`);
    }
    result.title = step.title;
  }

  if (step.prompt !== undefined) {
    if (!isString(step.prompt)) {
      throw new Error(`Step ${stepId}: "prompt" must be a string if provided`);
    }
    result.prompt = step.prompt;
  }

  if (step.explanation !== undefined) {
    if (!isString(step.explanation)) {
      throw new Error(`Step ${stepId}: "explanation" must be a string if provided`);
    }
    result.explanation = step.explanation;
  }

  return result;
}

/**
 * Validate StepFillBlank
 */
function validateStepFillBlank(step: unknown, stepId: string): StepFillBlank {
  if (!isObject(step)) {
    throw new Error(`Step ${stepId}: must be an object`);
  }

  if (step.type !== 'fill_blank') {
    throw new Error(`Step ${stepId}: type must be "fill_blank"`);
  }

  if (!isString(step.sentence)) {
    throw new Error(`Step ${stepId}: "sentence" field is required and must be a string`);
  }

  if (!isArray(step.correctAnswers) || step.correctAnswers.length === 0) {
    throw new Error(`Step ${stepId}: "correctAnswers" must be a non-empty array of strings`);
  }

  const correctAnswers: string[] = [];
  for (let i = 0; i < step.correctAnswers.length; i++) {
    const answer = step.correctAnswers[i];
    if (!isString(answer)) {
      throw new Error(`Step ${stepId}: correctAnswers[${i}] must be a string`);
    }
    correctAnswers.push(answer);
  }

  const result: StepFillBlank = {
    id: stepId,
    type: 'fill_blank',
    sentence: step.sentence,
    correctAnswers,
  };

  if (step.title !== undefined) {
    if (!isString(step.title)) {
      throw new Error(`Step ${stepId}: "title" must be a string if provided`);
    }
    result.title = step.title;
  }

  if (step.prompt !== undefined) {
    if (!isString(step.prompt)) {
      throw new Error(`Step ${stepId}: "prompt" must be a string if provided`);
    }
    result.prompt = step.prompt;
  }

  if (step.explanation !== undefined) {
    if (!isString(step.explanation)) {
      throw new Error(`Step ${stepId}: "explanation" must be a string if provided`);
    }
    result.explanation = step.explanation;
  }

  return result;
}

/**
 * Validate a single Step
 */
function validateStep(step: unknown, stepId: string): Step {
  if (!isObject(step)) {
    throw new Error(`Step ${stepId}: must be an object`);
  }

  if (!isString(step.id)) {
    throw new Error(`Step ${stepId}: "id" field is required and must be a string`);
  }

  if (step.id !== stepId) {
    throw new Error(`Step ${stepId}: id mismatch (expected "${stepId}", got "${step.id}")`);
  }

  if (!isString(step.type)) {
    throw new Error(`Step ${stepId}: "type" field is required and must be a string`);
  }

  switch (step.type) {
    case 'text':
      return validateStepText(step, stepId);
    case 'single_choice':
      return validateStepSingleChoice(step, stepId);
    case 'fill_blank':
      return validateStepFillBlank(step, stepId);
    default:
      throw new Error(`Step ${stepId}: unknown type "${step.type}" (expected "text", "single_choice", or "fill_blank")`);
  }
}

/**
 * Validate a Lesson
 */
function validateLesson(lesson: unknown, lessonId: string, courseId: string): Lesson {
  if (!isObject(lesson)) {
    throw new Error(`Lesson ${lessonId}: must be an object`);
  }

  if (!isString(lesson.id)) {
    throw new Error(`Lesson ${lessonId}: "id" field is required and must be a string`);
  }

  if (lesson.id !== lessonId) {
    throw new Error(`Lesson ${lessonId}: id mismatch (expected "${lessonId}", got "${lesson.id}")`);
  }

  if (!isString(lesson.courseId)) {
    throw new Error(`Lesson ${lessonId}: "courseId" field is required and must be a string`);
  }

  if (lesson.courseId !== courseId) {
    throw new Error(`Lesson ${lessonId}: courseId mismatch (expected "${courseId}", got "${lesson.courseId}")`);
  }

  if (!isString(lesson.title)) {
    throw new Error(`Lesson ${lessonId}: "title" field is required and must be a string`);
  }

  if (!isArray(lesson.steps) || lesson.steps.length === 0) {
    throw new Error(`Lesson ${lessonId}: "steps" must be a non-empty array`);
  }

  const steps: Step[] = [];
  for (let i = 0; i < lesson.steps.length; i++) {
    const step = lesson.steps[i];
    if (!isObject(step) || !isString(step.id)) {
      throw new Error(`Lesson ${lessonId}: step ${i} must have an "id" string`);
    }
    steps.push(validateStep(step, step.id));
  }

  const result: Lesson = {
    id: lessonId,
    courseId,
    title: lesson.title,
    steps,
  };

  if (lesson.description !== undefined) {
    if (!isString(lesson.description)) {
      throw new Error(`Lesson ${lessonId}: "description" must be a string if provided`);
    }
    result.description = lesson.description;
  }

  return result;
}

/**
 * Validate and return a Course from JSON data
 */
export function loadCourseFromJson(data: unknown): Course {
  if (!isObject(data)) {
    throw new Error('Course data must be an object');
  }

  if (!isString(data.id)) {
    throw new Error('Course "id" field is required and must be a string');
  }

  if (!isString(data.title)) {
    throw new Error('Course "title" field is required and must be a string');
  }

  if (!isArray(data.lessons) || data.lessons.length === 0) {
    throw new Error('Course "lessons" must be a non-empty array');
  }

  const courseId = data.id;
  const lessons: Lesson[] = [];

  for (let i = 0; i < data.lessons.length; i++) {
    const lesson = data.lessons[i];
    if (!isObject(lesson) || !isString(lesson.id)) {
      throw new Error(`Course ${courseId}: lesson ${i} must have an "id" string`);
    }
    lessons.push(validateLesson(lesson, lesson.id, courseId));
  }

  const result: Course = {
    id: courseId,
    title: data.title,
    lessons,
  };

  if (data.description !== undefined) {
    if (!isString(data.description)) {
      throw new Error('Course "description" must be a string if provided');
    }
    result.description = data.description;
  }

  return result;
}



