'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Lesson, Step, StepText, StepSingleChoice, StepFillBlank } from '../../../content/types';
import { Answer, AnswersByStepId, CheckedByStepId, SingleChoiceAnswer, FillBlankAnswer } from './types';
import { hasAnswer, isCorrect, isInteractiveStep } from './lessonEngine';
import { scoreLesson, LessonResult as LessonResultType } from './scoring';
import Button from '../../components/Button';
import LessonResultView from './LessonResultView';
import Card from '../../components/Card';
import {
  loadProgress,
  saveProgress,
  clearProgress,
  StoredLessonProgress,
} from '../progress/progressStorage';

interface LessonPlayerProps {
  lesson: Lesson;
  hasNextLesson?: boolean;
  onFinish?: () => void;
  onNextLesson?: () => void;
}

export default function LessonPlayer({ 
  lesson, 
  hasNextLesson = false, 
  onFinish, 
  onNextLesson 
}: LessonPlayerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersByStepId>({});
  const [checked, setChecked] = useState<CheckedByStepId>({});
  const [result, setResult] = useState<LessonResultType | null>(null);
  const [savedProgress, setSavedProgress] = useState<StoredLessonProgress | null>(null);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [savingEnabled, setSavingEnabled] = useState(false);
  const fillBlankInputRef = useRef<HTMLInputElement>(null);

  const currentStep = lesson.steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === lesson.steps.length - 1;
  const currentAnswer = answers[currentStep.id];
  const isChecked = checked[currentStep.id] || false;
  const isInteractive = isInteractiveStep(currentStep);
  const hasCurrentAnswer = hasAnswer(currentStep, currentAnswer);
  const isCurrentCorrect = isCorrect(currentStep, currentAnswer);
  const canCheck = isInteractive && !isChecked && hasCurrentAnswer;
  const canGoNext = !isInteractive || isChecked;
  const progressPercent = ((currentStepIndex + 1) / lesson.steps.length) * 100;

  // Load progress on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      setSavingEnabled(true);
      return;
    }

    const progress = loadProgress(lesson.courseId, lesson.id);

    if (progress) {
      setSavedProgress(progress);
      setShowResumePrompt(true);
    } else {
      setSavingEnabled(true);
    }
  }, [lesson.courseId, lesson.id]);

  // Auto-save progress when state changes and saving is enabled
  useEffect(() => {
    if (!savingEnabled || typeof window === 'undefined' || result) return;

    const progress: StoredLessonProgress = {
      version: 1,
      courseId: lesson.courseId,
      lessonId: lesson.id,
      currentStepIndex,
      answers,
      checked,
      updatedAt: Date.now(),
    };

    saveProgress(progress);
  }, [savingEnabled, result, lesson.courseId, lesson.id, currentStepIndex, answers, checked]);

  const handleCheck = useCallback(() => {
    if (!hasCurrentAnswer) return;
    setChecked(prev => ({ ...prev, [currentStep.id]: true }));
  }, [hasCurrentAnswer, currentStep.id]);

  const handleNext = useCallback(() => {
    if (isLastStep) {
      // Compute result using scoring logic
      const lessonResult = scoreLesson(lesson, answers, checked);
      setResult(lessonResult);
      clearProgress(lesson.courseId, lesson.id);
      if (onFinish) onFinish();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [isLastStep, lesson, answers, checked, onFinish, lesson.courseId, lesson.id]);

  // Autofocus fill_blank input when step changes
  useEffect(() => {
    if (currentStep.type === 'fill_blank' && fillBlankInputRef.current && !isChecked) {
      fillBlankInputRef.current.focus();
    }
  }, [currentStep.id, currentStep.type, isChecked]);

  // Enter key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || showResumePrompt || result) return;
      if (e.target instanceof HTMLInputElement && e.target.type === 'text') {
        // Don't trigger if typing in an input
        return;
      }

      e.preventDefault();
      if (canCheck) {
        handleCheck();
      } else if (canGoNext) {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canCheck, canGoNext, showResumePrompt, result, handleCheck, handleNext]);

  const applySavedProgress = () => {
    if (!savedProgress) return;

    // Clamp step index to valid range
    const maxIndex = Math.max(0, lesson.steps.length - 1);
    const clampedIndex = Math.min(
      Math.max(savedProgress.currentStepIndex, 0),
      maxIndex,
    );

    // Filter answers/checked to existing steps only
    const validStepIds = new Set(lesson.steps.map((s) => s.id));
    const filteredAnswers: AnswersByStepId = {};
    const filteredChecked: CheckedByStepId = {};

    Object.entries(savedProgress.answers || {}).forEach(([stepId, value]) => {
      if (validStepIds.has(stepId)) {
        filteredAnswers[stepId] = value as Answer;
      }
    });

    Object.entries(savedProgress.checked || {}).forEach(([stepId, value]) => {
      if (validStepIds.has(stepId)) {
        filteredChecked[stepId] = Boolean(value);
      }
    });

    setCurrentStepIndex(clampedIndex);
    setAnswers(filteredAnswers);
    setChecked(filteredChecked);
    setShowResumePrompt(false);
    setSavingEnabled(true);
  };

  const handleStartOver = () => {
    clearProgress(lesson.courseId, lesson.id);
    setSavedProgress(null);
    setShowResumePrompt(false);
    setCurrentStepIndex(0);
    setAnswers({});
    setChecked({});
    setResult(null);
    setSavingEnabled(true);
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleAnswerChange = (answer: Answer) => {
    setAnswers(prev => ({ ...prev, [currentStep.id]: answer }));
    // Reset checked status when answer changes
    if (checked[currentStep.id]) {
      setChecked(prev => ({ ...prev, [currentStep.id]: false }));
    }
  };

  const handleRetry = () => {
    handleStartOver();
  };

  // Show result view if lesson is finished
  if (result) {
    return (
      <LessonResultView
        result={result}
        lessonTitle={lesson.title}
        hasNextLesson={hasNextLesson}
        onRetry={handleRetry}
        onNextLesson={onNextLesson}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Resume prompt */}
      {showResumePrompt && savedProgress && (
        <Card padding="s" hover={false} className="border-[#0EA5B7]/40 bg-[#D9F6F8]/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">
                Saved progress found for this lesson.
              </p>
              <p className="text-xs text-[#475569]">
                Continue where you left off or start over from the beginning.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="s"
                onClick={handleStartOver}
              >
                Start over
              </Button>
              <Button
                variant="primary"
                size="s"
                onClick={applySavedProgress}
              >
                Continue
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Header */}
      <Card>
        <h1 className="text-2xl font-semibold text-[#0F172A] mb-2">{lesson.title}</h1>
        {lesson.description && <p className="text-[#475569] mb-4">{lesson.description}</p>}
        
        {/* Progress Bar */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#475569] font-medium">
              Step {currentStepIndex + 1} of {lesson.steps.length}
            </span>
            <span className="text-[#94A3B8]">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-2 bg-[#E6EEF2] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0EA5B7] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Current Step */}
      <Card>
        <StepRenderer
          step={currentStep}
          answer={currentAnswer}
          isChecked={isChecked}
          isCorrect={isCurrentCorrect}
          onAnswerChange={handleAnswerChange}
          fillBlankInputRef={fillBlankInputRef}
        />
      </Card>

      {/* Navigation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="secondary"
            onClick={handleBack}
            disabled={isFirstStep}
          >
            ← Back
          </Button>

          <div className="flex gap-3">
            {isInteractive && !isChecked && (
              <Button
                variant="primary"
                onClick={handleCheck}
                disabled={!hasCurrentAnswer}
              >
                Check
              </Button>
            )}

            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!canGoNext}
            >
              {isLastStep ? 'Finish' : 'Next →'}
            </Button>
          </div>
        </div>

        {/* Helper text for disabled states */}
        {isInteractive && !isChecked && !hasCurrentAnswer && (
          <p className="text-xs text-[#94A3B8] text-center">
            Please provide an answer to continue
          </p>
        )}
        {isInteractive && !isChecked && (
          <p className="text-xs text-[#94A3B8] text-center">
            Press <kbd className="px-1.5 py-0.5 bg-[#E6EEF2] rounded text-[#475569]">Enter</kbd> to check your answer
          </p>
        )}
        {isInteractive && isChecked && !isLastStep && (
          <p className="text-xs text-[#94A3B8] text-center">
            Press <kbd className="px-1.5 py-0.5 bg-[#E6EEF2] rounded text-[#475569]">Enter</kbd> to continue
          </p>
        )}
      </div>
    </div>
  );
}

interface StepRendererProps {
  step: Step;
  answer: Answer | undefined;
  isChecked: boolean;
  isCorrect: boolean;
  onAnswerChange: (answer: Answer) => void;
  fillBlankInputRef?: React.RefObject<HTMLInputElement>;
}

function StepRenderer({ step, answer, isChecked, isCorrect, onAnswerChange, fillBlankInputRef }: StepRendererProps) {
  if (step.type === 'text') {
    return <StepTextRenderer step={step} />;
  }

  if (step.type === 'single_choice') {
    return (
      <StepSingleChoiceRenderer
        step={step}
        answer={answer as SingleChoiceAnswer | undefined}
        isChecked={isChecked}
        isCorrect={isCorrect}
        onAnswerChange={(ans) => onAnswerChange(ans)}
      />
    );
  }

  if (step.type === 'fill_blank') {
    return (
      <StepFillBlankRenderer
        step={step}
        answer={answer as FillBlankAnswer | undefined}
        isChecked={isChecked}
        isCorrect={isCorrect}
        onAnswerChange={(ans) => onAnswerChange(ans)}
        inputRef={fillBlankInputRef}
      />
    );
  }

  return null;
}

function StepTextRenderer({ step }: { step: StepText }) {
  return (
    <div className="space-y-4">
      {step.title && <h3 className="text-xl font-semibold text-[#0F172A]">{step.title}</h3>}
      {step.prompt && <p className="text-[#475569] italic">{step.prompt}</p>}
      <div className="text-[#0F172A] whitespace-pre-wrap">{step.content}</div>
    </div>
  );
}

function StepSingleChoiceRenderer({
  step,
  answer,
  isChecked,
  isCorrect,
  onAnswerChange,
}: {
  step: StepSingleChoice;
  answer: SingleChoiceAnswer | undefined;
  isChecked: boolean;
  isCorrect: boolean;
  onAnswerChange: (answer: SingleChoiceAnswer) => void;
}) {
  const selectedId = answer?.selectedOptionId || '';

  return (
    <div className="space-y-4">
      {step.title && <h3 className="text-xl font-semibold text-[#0F172A]">{step.title}</h3>}
      {step.prompt && <p className="text-[#475569] italic">{step.prompt}</p>}
      <p className="text-lg font-medium text-[#0F172A]">{step.question}</p>
      
      <div className="space-y-2">
        {step.options.map((option) => {
          const isSelected = selectedId === option.id;
          const isCorrectOption = option.id === step.correctOptionId;
          let bgColor = 'bg-white border-[#E6EEF2]';
          let textColor = 'text-[#0F172A]';

          if (isChecked) {
            if (isCorrectOption) {
              bgColor = 'bg-green-50 border-green-500';
              textColor = 'text-green-900';
            } else if (isSelected && !isCorrectOption) {
              bgColor = 'bg-red-50 border-red-500';
              textColor = 'text-red-900';
            }
          } else if (isSelected) {
            bgColor = 'bg-[#D9F6F8] border-[#0EA5B7]';
          }

          return (
            <button
              key={option.id}
              onClick={() => !isChecked && onAnswerChange({ type: 'single_choice', selectedOptionId: option.id })}
              disabled={isChecked}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${bgColor} ${textColor} ${
                !isChecked ? 'hover:border-[#0EA5B7] cursor-pointer' : 'cursor-default'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 ${
                  isSelected ? 'border-[#0EA5B7] bg-[#0EA5B7]' : 'border-[#E6EEF2]'
                } flex items-center justify-center`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span>{option.text}</span>
                {isChecked && isCorrectOption && (
                  <span className="ml-auto text-green-600 font-semibold">✓ Correct</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback after checking */}
      {isChecked && (
        <div className="space-y-3">
          <div className={`p-4 rounded-xl ${
            isCorrect 
              ? 'bg-[#DCFCE7] border border-[#16A34A]' 
              : 'bg-[#FEE2E2] border border-[#EF4444]'
          }`}>
            <p className={`text-sm font-semibold ${
              isCorrect ? 'text-[#16A34A]' : 'text-[#EF4444]'
            }`}>
              {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </p>
            {!isCorrect && (
              <p className="text-sm text-[#EF4444] mt-1">
                The correct answer is: <strong>{step.options.find(opt => opt.id === step.correctOptionId)?.text}</strong>
              </p>
            )}
          </div>

          {step.explanation && (
            <div className="p-4 rounded-xl bg-[#DBEAFE] border border-[#3B82F6]">
              <p className="text-xs font-medium text-[#3B82F6] mb-1">Explanation</p>
              <p className="text-sm text-[#1E40AF]">
                {step.explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StepFillBlankRenderer({
  step,
  answer,
  isChecked,
  isCorrect,
  onAnswerChange,
  inputRef,
}: {
  step: StepFillBlank;
  answer: FillBlankAnswer | undefined;
  isChecked: boolean;
  isCorrect: boolean;
  onAnswerChange: (answer: FillBlankAnswer) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}) {
  const value = answer?.value || '';

  // Replace blank marker with input
  const parts = step.sentence.split('____');
  
  return (
    <div className="space-y-4">
      {step.title && <h3 className="text-xl font-semibold text-[#0F172A]">{step.title}</h3>}
      {step.prompt && <p className="text-[#475569] italic">{step.prompt}</p>}
      
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap text-lg">
          {parts[0]}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onAnswerChange({ type: 'fill_blank', value: e.target.value })}
            disabled={isChecked}
            className={`px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
              isChecked
                ? isCorrect
                  ? 'border-[#16A34A] bg-[#DCFCE7]'
                  : 'border-[#EF4444] bg-[#FEE2E2]'
                : 'border-[#E6EEF2] hover:border-[#CBD5E1] focus:border-[#0EA5B7] focus:ring-[#0EA5B7]/20'
            }`}
            placeholder="?"
          />
          {parts[1]}
        </div>

        {/* Feedback after checking */}
        {isChecked && (
          <div className="space-y-3">
            <div className={`p-4 rounded-xl ${
              isCorrect 
                ? 'bg-[#DCFCE7] border border-[#16A34A]' 
                : 'bg-[#FEE2E2] border border-[#EF4444]'
            }`}>
              <p className={`text-sm font-semibold ${
                isCorrect ? 'text-[#16A34A]' : 'text-[#EF4444]'
              }`}>
                {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </p>
              {!isCorrect && (
                <p className="text-sm text-[#EF4444] mt-1">
                  Correct answers: <strong>{step.correctAnswers.join(', ')}</strong>
                </p>
              )}
            </div>

            {step.explanation && (
              <div className="p-4 rounded-xl bg-[#DBEAFE] border border-[#3B82F6]">
                <p className="text-xs font-medium text-[#3B82F6] mb-1">Explanation</p>
                <p className="text-sm text-[#1E40AF]">
                  {step.explanation}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

