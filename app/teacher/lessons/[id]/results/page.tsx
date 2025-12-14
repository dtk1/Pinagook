'use client';

import { useState, useEffect } from 'react';
import TeacherLayout from '../../../../layouts/TeacherLayout';
import Card from '../../../../components/Card';
import Link from 'next/link';
import { getLessonById, getLessonResults } from '../../../../utils/lessonStorage';
import { Lesson, LessonResult } from '../../../../types/lesson';

interface LessonResultsPageProps {
  params: {
    id: string;
  };
}

export default function LessonResultsPage({ params }: LessonResultsPageProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [results, setResults] = useState<LessonResult[]>([]);

  useEffect(() => {
    const loadedLesson = getLessonById(params.id);
    if (loadedLesson) {
      setLesson(loadedLesson);
      const lessonResults = getLessonResults(params.id);
      setResults(lessonResults);
    }
  }, [params.id]);

  const calculateScore = (result: LessonResult): number => {
    if (!lesson) return 0;
    let correct = 0;
    let total = 0;

    lesson.blocks.forEach(block => {
      if (block.type === 'question' && block.correctAnswer) {
        total++;
        const answer = result.answers[block.id];
        if (answer === block.correctAnswer) {
          correct++;
        }
      }
    });

    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };

  if (!lesson) {
    return (
      <TeacherLayout>
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <Link href="/teacher/lessons" className="text-[#0ea5e9] hover:underline mb-4 inline-block">
              ← Back to Lessons
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Lesson Not Found</h1>
          </div>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <Link href="/teacher/lessons" className="text-[#0ea5e9] hover:underline mb-4 inline-block">
            ← Back to Lessons
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Lesson Results</h1>
          <p className="text-gray-600">{lesson.title}</p>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Student Submissions</h2>
            <span className="text-sm text-gray-600">{results.length} submission{results.length !== 1 ? 's' : ''}</span>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No submissions yet. Share the lesson link with students to collect results.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => {
                const score = calculateScore(result);
                return (
                  <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{result.studentName}</h3>
                        {result.studentEmail && (
                          <p className="text-sm text-gray-600">{result.studentEmail}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Submitted: {new Date(result.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#0ea5e9]">{score}%</div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {lesson.blocks
                        .filter(block => block.type === 'question')
                        .map(block => {
                          const answer = result.answers[block.id];
                          const isCorrect = answer === block.correctAnswer;
                          return (
                            <div key={block.id} className="text-sm">
                              <p className="font-medium text-gray-900 mb-1">{block.content}</p>
                              <p className={`${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                Answer: {answer || 'No answer'}
                                {isCorrect ? ' ✓' : ' ✗'}
                              </p>
                              {!isCorrect && block.correctAnswer && (
                                <p className="text-gray-500">Correct: {block.correctAnswer}</p>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </TeacherLayout>
  );
}

