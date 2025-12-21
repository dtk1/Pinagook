'use client';

import { useEffect, useState } from 'react';
import { getDemoCourse, Course, Step } from '../../content';

export default function TestCoursePage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const demoCourse = getDemoCourse();
      setCourse(demoCourse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-[#0F172A] mb-4">Course Test - Error</h1>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-red-600 font-semibold mb-2">Error loading course:</p>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-[#0F172A] mb-4">Course Test</h1>
          <p className="text-[#475569]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-[#0F172A] mb-4">Course Test</h1>
          <p className="text-[#475569]">Testing the content module with demo course</p>
        </div>

        {/* Course Info */}
        <div className="bg-white rounded-2xl p-6 border border-[#E6EEF2]">
          <h2 className="text-2xl font-semibold text-[#0F172A] mb-4">Course Information</h2>
          <div className="space-y-2">
            <p><span className="font-semibold text-[#475569]">ID:</span> <span className="text-[#0F172A]">{course.id}</span></p>
            <p><span className="font-semibold text-[#475569]">Title:</span> <span className="text-[#0F172A]">{course.title}</span></p>
            {course.description && (
              <p><span className="font-semibold text-[#475569]">Description:</span> <span className="text-[#0F172A]">{course.description}</span></p>
            )}
            <p><span className="font-semibold text-[#475569]">Lessons:</span> <span className="text-[#0F172A]">{course.lessons.length}</span></p>
          </div>
        </div>

        {/* Lessons */}
        {course.lessons.map((lesson) => (
          <div key={lesson.id} className="bg-white rounded-2xl p-6 border border-[#E6EEF2]">
            <h2 className="text-2xl font-semibold text-[#0F172A] mb-4">{lesson.title}</h2>
            <div className="space-y-2 mb-6">
              <p><span className="font-semibold text-[#475569]">ID:</span> <span className="text-[#0F172A]">{lesson.id}</span></p>
              <p><span className="font-semibold text-[#475569]">Course ID:</span> <span className="text-[#0F172A]">{lesson.courseId}</span></p>
              {lesson.description && (
                <p><span className="font-semibold text-[#475569]">Description:</span> <span className="text-[#0F172A]">{lesson.description}</span></p>
              )}
              <p><span className="font-semibold text-[#475569]">Steps:</span> <span className="text-[#0F172A]">{lesson.steps.length}</span></p>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#0F172A]">Steps</h3>
              {lesson.steps.map((step, index) => (
                <StepDisplay key={step.id} step={step} index={index + 1} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepDisplay({ step, index }: { step: Step; index: number }) {
  return (
    <div className="border border-[#E6EEF2] rounded-xl p-4 bg-[#F7FAFC]">
      <div className="flex items-center gap-3 mb-3">
        <span className="px-3 py-1 bg-[#0EA5B7] text-white rounded-lg text-sm font-semibold">
          Step {index}
        </span>
        <span className="px-3 py-1 bg-[#D9F6F8] text-[#0EA5B7] rounded-lg text-sm font-medium">
          {step.type}
        </span>
        <span className="text-sm text-[#94A3B8]">{step.id}</span>
      </div>

      {step.title && (
        <h4 className="font-semibold text-[#0F172A] mb-2">{step.title}</h4>
      )}

      {step.prompt && (
        <p className="text-sm text-[#475569] italic mb-2">{step.prompt}</p>
      )}

      {step.type === 'text' && (
        <div className="mt-2">
          <p className="text-[#0F172A] whitespace-pre-wrap">{step.content}</p>
        </div>
      )}

      {step.type === 'single_choice' && (
        <div className="mt-2 space-y-2">
          <p className="font-medium text-[#0F172A]">{step.question}</p>
          <ul className="space-y-1 ml-4">
            {step.options.map((option) => (
              <li key={option.id} className="text-[#475569]">
                {option.id === step.correctOptionId ? (
                  <span className="font-semibold text-green-600">✓ {option.text}</span>
                ) : (
                  <span>{option.text}</span>
                )}
              </li>
            ))}
          </ul>
          {step.explanation && (
            <p className="text-sm text-[#475569] mt-2 italic">{step.explanation}</p>
          )}
        </div>
      )}

      {step.type === 'fill_blank' && (
        <div className="mt-2 space-y-2">
          <p className="font-medium text-[#0F172A]">{step.sentence}</p>
          <div>
            <p className="text-sm text-[#475569]">
              <span className="font-semibold">Correct answers:</span>{' '}
              {step.correctAnswers.join(', ')}
            </p>
          </div>
          {step.explanation && (
            <p className="text-sm text-[#475569] mt-2 italic">{step.explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}

