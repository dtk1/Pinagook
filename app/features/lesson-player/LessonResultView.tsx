/**
 * Lesson Result View - displays scoring results and incorrect answers
 */

import { LessonResult as LessonResultType, StepResult } from './scoring';
import Button from '../../components/Button';
import Card from '../../components/Card';

interface LessonResultViewProps {
  result: LessonResultType;
  lessonTitle: string;
  hasNextLesson: boolean;
  onRetry: () => void;
  onNextLesson?: () => void;
}

export default function LessonResultView({
  result,
  lessonTitle,
  hasNextLesson,
  onRetry,
  onNextLesson,
}: LessonResultViewProps) {
  const incorrectResults = result.stepResults.filter(r => !r.isCorrect);
  const isPerfect = incorrectResults.length === 0;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-[#0F172A]">Lesson Complete!</h1>
          <p className="text-xl text-[#475569]">{lessonTitle}</p>
          
          {/* Score */}
          <div className="pt-4">
            <div className="text-6xl font-bold text-[#0EA5B7] mb-2">
              {result.percentCorrect}%
            </div>
            <div className="text-lg text-[#475569]">
              Score: <span className="font-semibold text-[#0F172A]">{result.correctCount}</span> /{' '}
              <span className="font-semibold text-[#0F172A]">{result.totalInteractiveSteps}</span>
            </div>
          </div>

          {isPerfect && (
            <div className="pt-4">
              <div className="inline-block px-6 py-3 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-900 font-semibold">🎉 Perfect Score!</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Incorrect Answers */}
      {!isPerfect && incorrectResults.length > 0 && (
        <Card>
          <h2 className="text-2xl font-semibold text-[#0F172A] mb-4">Review Incorrect Answers</h2>
          <div className="space-y-6">
            {incorrectResults.map((stepResult, index) => (
              <IncorrectAnswerItem key={stepResult.stepId} result={stepResult} index={index + 1} />
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="secondary" onClick={onRetry} size="l">
          Retry Lesson
        </Button>
        {hasNextLesson && onNextLesson && (
          <Button variant="primary" onClick={onNextLesson} size="l">
            Next Lesson →
          </Button>
        )}
      </div>
    </div>
  );
}

function IncorrectAnswerItem({ result, index }: { result: StepResult; index: number }) {
  if (result.type === 'single_choice') {
    return (
      <div className="border-l-4 border-red-500 pl-4 py-2 space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-semibold">
            #{index}
          </span>
          <span className="text-sm text-[#94A3B8] uppercase font-medium">{result.type}</span>
        </div>
        <p className="font-medium text-[#0F172A]">{result.prompt}</p>
        <div className="space-y-1 text-sm">
          <p>
            <span className="font-semibold text-red-700">Your answer:</span>{' '}
            <span className="text-[#475569]">{result.userAnswer}</span>
          </p>
          <p>
            <span className="font-semibold text-green-700">Correct:</span>{' '}
            <span className="text-[#475569]">{result.correctAnswer}</span>
          </p>
        </div>
        {result.explanation && (
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">{result.explanation}</p>
          </div>
        )}
      </div>
    );
  }

  if (result.type === 'fill_blank') {
    return (
      <div className="border-l-4 border-red-500 pl-4 py-2 space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-semibold">
            #{index}
          </span>
          <span className="text-sm text-[#94A3B8] uppercase font-medium">{result.type}</span>
        </div>
        <p className="font-medium text-[#0F172A]">{result.prompt}</p>
        <div className="space-y-1 text-sm">
          <p>
            <span className="font-semibold text-red-700">Your answer:</span>{' '}
            <span className="text-[#475569]">{result.userAnswer || '(empty)'}</span>
          </p>
          <p>
            <span className="font-semibold text-green-700">Correct:</span>{' '}
            <span className="text-[#475569]">{result.correctAnswers.join(', ')}</span>
          </p>
        </div>
        {result.explanation && (
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">{result.explanation}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}



