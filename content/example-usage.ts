/**
 * Example usage of the content module
 * This file demonstrates how to use getDemoCourse()
 */

import { getDemoCourse, Course, Step } from './index';

// Example 1: Load the demo course
const demoCourse: Course = getDemoCourse();

console.log('Course ID:', demoCourse.id);
console.log('Course Title:', demoCourse.title);
console.log('Number of lessons:', demoCourse.lessons.length);

// Example 2: Access lessons and steps
const firstLesson = demoCourse.lessons[0];
console.log('First lesson:', firstLesson.title);
console.log('Number of steps:', firstLesson.steps.length);

// Example 3: Type-safe step handling with discriminated union
firstLesson.steps.forEach((step: Step) => {
  console.log(`Step ${step.id}: ${step.type}`);
  
  // TypeScript narrows the type based on step.type
  switch (step.type) {
    case 'text':
      console.log('  Content:', step.content);
      break;
    case 'single_choice':
      console.log('  Question:', step.question);
      console.log('  Correct answer:', step.correctOptionId);
      break;
    case 'fill_blank':
      console.log('  Sentence:', step.sentence);
      console.log('  Correct answers:', step.correctAnswers);
      break;
  }
});

// Example 4: Filter steps by type
const textSteps = firstLesson.steps.filter(step => step.type === 'text');
const quizSteps = firstLesson.steps.filter(step => step.type === 'single_choice');

console.log(`Text steps: ${textSteps.length}`);
console.log(`Quiz steps: ${quizSteps.length}`);



