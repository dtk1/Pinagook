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
    <div className="max-w-3xl mx-auto p-6 space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <Card className="text-center p-8 bg-gradient-to-b from-white to-sky-50/50 border-sky-100">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-100 text-sky-800 rounded-full text-sm font-bold tracking-wide uppercase">
            Lesson Complete 🎉
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{lessonTitle}</h1>
          
          {/* Score Circle */}
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 rounded-full bg-white shadow-xl border-4 border-sky-400 flex items-center justify-center mb-3">
              <span className="text-4xl font-black text-sky-600">
                {result.percentCorrect}%
              </span>
            </div>
            <div className="text-base text-slate-600 font-medium">
              Score: <span className="font-bold text-slate-900 text-lg">{result.correctCount}</span> /{' '}
              <span className="font-bold text-slate-900 text-lg">{result.totalInteractiveSteps}</span> correct answers
            </div>
          </div>

          {isPerfect ? (
            <div className="inline-block px-6 py-3 bg-emerald-50 border-2 border-emerald-300 rounded-2xl shadow-sm">
              <p className="text-emerald-800 font-extrabold text-lg">🌟 Perfect Score! You mastered this lesson!</p>
            </div>
          ) : (
            <div className="inline-block px-5 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-amber-800 font-semibold text-sm">Great effort! Review the questions below to strengthen your accuracy.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Incorrect Answers */}
      {!isPerfect && incorrectResults.length > 0 && (
        <Card className="border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span>📝</span> Review Incorrect Answers
          </h2>
          <div className="space-y-6">
            {incorrectResults.map((stepResult, index) => (
              <IncorrectAnswerItem key={stepResult.stepId} result={stepResult} index={index + 1} />
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <Button variant="secondary" tactile={true} onClick={onRetry} size="l">
          🔄 Retry Lesson
        </Button>
        {hasNextLesson && onNextLesson && (
          <Button variant="success" tactile={true} onClick={onNextLesson} size="l">
            Next Lesson 🚀
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



