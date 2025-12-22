/**
 * Lesson Result component - shows summary and retry option
 */

import Button from '../../components/Button';

interface LessonResultProps {
  totalSteps: number;
  correctCount: number;
  onRetry: () => void;
}

export default function LessonResult({ totalSteps, correctCount, onRetry }: LessonResultProps) {
  const percentage = totalSteps > 0 ? Math.round((correctCount / totalSteps) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-2xl p-8 border border-[#E6EEF2] text-center space-y-6">
        <h2 className="text-3xl font-bold text-[#0F172A]">Lesson Complete!</h2>
        
        <div className="space-y-4">
          <div className="text-6xl font-bold text-[#0EA5B7]">{percentage}%</div>
          <div className="text-lg text-[#475569]">
            You got <span className="font-semibold text-[#0F172A]">{correctCount}</span> out of{' '}
            <span className="font-semibold text-[#0F172A]">{totalSteps}</span> correct
          </div>
        </div>

        <div className="pt-4">
          <Button variant="primary" onClick={onRetry} size="l">
            Retry Lesson
          </Button>
        </div>
      </div>
    </div>
  );
}

