/**
 * Simple script to test course loading
 * Run with: npx tsx scripts/test-course.ts
 * or: node --loader ts-node/esm scripts/test-course.ts
 */

import { getDemoCourse, Course, Step } from '../content/index';

try {
  console.log('🧪 Testing Course Loading...\n');
  
  // Load the demo course
  const course: Course = getDemoCourse();
  
  console.log('✅ Course loaded successfully!\n');
  console.log('📚 Course Information:');
  console.log(`   ID: ${course.id}`);
  console.log(`   Title: ${course.title}`);
  if (course.description) {
    console.log(`   Description: ${course.description}`);
  }
  console.log(`   Lessons: ${course.lessons.length}\n`);
  
  // Display lessons
  course.lessons.forEach((lesson, lessonIndex) => {
    console.log(`📖 Lesson ${lessonIndex + 1}: ${lesson.title}`);
    console.log(`   ID: ${lesson.id}`);
    console.log(`   Course ID: ${lesson.courseId}`);
    if (lesson.description) {
      console.log(`   Description: ${lesson.description}`);
    }
    console.log(`   Steps: ${lesson.steps.length}`);
    
    // Count step types
    const stepTypes = lesson.steps.reduce((acc, step) => {
      acc[step.type] = (acc[step.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log(`   Step types:`, stepTypes);
    console.log('');
  });
  
  // Display step details
  console.log('📝 Step Details:\n');
  const firstLesson = course.lessons[0];
  firstLesson.steps.forEach((step: Step, index: number) => {
    console.log(`Step ${index + 1} (${step.id}):`);
    console.log(`  Type: ${step.type}`);
    if (step.title) console.log(`  Title: ${step.title}`);
    
    switch (step.type) {
      case 'text':
        console.log(`  Content: ${step.content.substring(0, 60)}...`);
        break;
      case 'single_choice':
        console.log(`  Question: ${step.question}`);
        console.log(`  Options: ${step.options.length}`);
        console.log(`  Correct: ${step.correctOptionId}`);
        break;
      case 'fill_blank':
        console.log(`  Sentence: ${step.sentence}`);
        console.log(`  Correct answers: ${step.correctAnswers.join(', ')}`);
        break;
    }
    console.log('');
  });
  
  console.log('✅ All tests passed!');
  
} catch (error) {
  console.error('❌ Error:', error instanceof Error ? error.message : error);
  process.exit(1);
}



