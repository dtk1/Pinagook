'use client';

import { useState } from 'react';
import Button from '../../components/Button';
import {
  saveStepProgressAction,
  loadLessonProgressAction,
  clearLessonProgressAction,
} from '../../actions/progressActions';
import type { Answer } from '../../features/lesson-player/types';

export default function ProgressTestButton() {
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [progressData, setProgressData] = useState<any>(null);

  // Test data
  const testCourseId = 'present-simple-basics';
  const testLessonId = 'daily-routines';
  const testStepId = 'step-3-quiz-1';
  const testAnswer: Answer = {
    type: 'single_choice',
    selectedOptionId: 'opt-1',
  };

  const handleSaveProgress = async () => {
    setIsLoading(true);
    setStatus('');

    try {
      const result = await saveStepProgressAction(
        testCourseId,
        null, // courseDbId - will be fetched automatically
        testLessonId,
        testStepId,
        true, // isCompleted
        100, // score
        testAnswer
      );

      if (result.ok) {
        setStatus('✅ Progress saved successfully!');
      } else {
        setStatus(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadProgress = async () => {
    setIsLoading(true);
    setStatus('');
    setProgressData(null);

    try {
      const result = await loadLessonProgressAction(
        testCourseId,
        null, // courseDbId - will be fetched automatically
        testLessonId
      );

      if (result.ok) {
        setProgressData(result.progress);
        setStatus(`✅ Loaded ${result.progress.length} progress entries`);
      } else {
        setStatus(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearProgress = async () => {
    setIsLoading(true);
    setStatus('');

    try {
      const result = await clearLessonProgressAction(
        testCourseId,
        null, // courseDbId - will be fetched automatically
        testLessonId
      );

      if (result.ok) {
        setStatus('✅ Progress cleared successfully!');
        setProgressData(null);
      } else {
        setStatus(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Button
          variant="primary"
          onClick={handleSaveProgress}
          isLoading={isLoading}
          disabled={isLoading}
        >
          Save Test Progress
        </Button>
        <Button
          variant="secondary"
          onClick={handleLoadProgress}
          isLoading={isLoading}
          disabled={isLoading}
        >
          Load Progress
        </Button>
        <Button
          variant="secondary"
          onClick={handleClearProgress}
          isLoading={isLoading}
          disabled={isLoading}
        >
          Clear Progress
        </Button>
      </div>

      {status && (
        <div className={`p-3 rounded-lg text-sm ${
          status.includes('✅') 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {status}
        </div>
      )}

      {progressData && progressData.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <h3 className="font-semibold mb-2">Loaded Progress:</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(progressData, null, 2)}
          </pre>
        </div>
      )}

      {progressData && progressData.length === 0 && (
        <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200 text-sm">
          No progress found for this lesson.
        </div>
      )}

      <div className="text-xs text-gray-500 mt-4">
        <p><strong>Test Data:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Course ID: {testCourseId}</li>
          <li>Lesson ID: {testLessonId}</li>
          <li>Step ID: {testStepId}</li>
          <li>Answer: {JSON.stringify(testAnswer)}</li>
        </ul>
        <p className="mt-2">
          <strong>Note:</strong> Make sure you have seeded the course &quot;{testCourseId}&quot; 
          (it should have a lesson with id &quot;{testLessonId}&quot; and a step with id &quot;{testStepId}&quot;).
        </p>
      </div>
    </div>
  );
}
