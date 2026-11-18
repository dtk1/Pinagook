'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { PLACEMENT_QUESTIONS } from '../features/placement-test/questions';
import { evaluatePlacementTest } from '../features/placement-test/placementStorage';
import { PlacementResult } from '../features/placement-test/types';
import Card from '../components/Card';
import Button from '../components/Button';

export default function PlacementTestClient() {
  const { user } = useAuth();
  const [studentEmail, setStudentEmail] = useState(user?.email || '');
  const [studentName, setStudentName] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<PlacementResult | null>(null);

  const currentQuestion = PLACEMENT_QUESTIONS[currentIndex];
  const isLastQuestion = currentIndex === PLACEMENT_QUESTIONS.length - 1;
  const currentAnswer = selectedAnswers[currentQuestion?.id];
  const progressPercent = Math.round(((currentIndex + 1) / PLACEMENT_QUESTIONS.length) * 100);

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const emailToUse = studentEmail.trim() || user?.email || 'guest_student@pinagook.io';
      const evaluated = evaluatePlacementTest(emailToUse, selectedAnswers, studentName);
      setResult(evaluated);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // 1. Result View (Certificate)
  if (result) {
    const cefrColors: Record<string, string> = {
      A1: 'from-amber-400 to-orange-500 text-white',
      A2: 'from-yellow-400 to-amber-500 text-white',
      B1: 'from-emerald-400 to-teal-500 text-white',
      B2: 'from-sky-400 to-blue-600 text-white',
      C1: 'from-indigo-500 to-purple-600 text-white',
      C2: 'from-purple-600 to-pink-600 text-white',
    };

    return (
      <div className="min-h-screen bg-slate-50/50 p-6 md:p-12">
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <Card className="text-center p-8 md:p-12 bg-white border-sky-100 shadow-xl rounded-3xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-sky-100/50 rounded-full blur-2xl pointer-events-none" />
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-100 text-sky-800 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              🎓 Official CEFR Assessment Certificate
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
              International English Level
            </h1>
            <p className="text-slate-600 text-base mb-6">
              Assessed for student: <span className="font-bold text-slate-900">{result.studentEmail}</span>
            </p>

            {/* CEFR Level Badge */}
            <div className="py-6 flex flex-col items-center justify-center">
              <div
                className={`w-36 h-36 rounded-3xl bg-gradient-to-br ${
                  cefrColors[result.cefrLevel] || 'from-sky-400 to-blue-600'
                } shadow-2xl flex flex-col items-center justify-center mb-4 transform hover:scale-105 transition-transform`}
              >
                <span className="text-xs uppercase font-extrabold opacity-80 tracking-widest">Level</span>
                <span className="text-5xl font-black tracking-tight">{result.cefrLevel}</span>
              </div>
              
              <div className="text-lg font-extrabold text-slate-900">
                Score: {result.scorePercent}% ({result.correctCount} / {result.totalQuestions} Correct)
              </div>
            </div>

            {/* Breakdown by Category */}
            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {Object.entries(result.categoryScores).map(([cat, stats]) => {
                const percent = Math.round((stats.correct / stats.total) * 100) || 0;
                return (
                  <div key={cat} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{cat}</p>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">{percent}%</p>
                    <p className="text-xs text-slate-500">{stats.correct} of {stats.total} correct</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button variant="primary" tactile={true} size="l" className="w-full sm:w-auto">
                  Browse Courses for {result.cefrLevel} Level 🚀
                </Button>
              </Link>
              <Link href="/teacher">
                <Button variant="secondary" tactile={true} size="l" className="w-full sm:w-auto">
                  View in Teacher Dashboard 👩‍🏫
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // 2. Start Screen
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-6 md:p-12 flex items-center justify-center">
        <div className="max-w-2xl mx-auto w-full space-y-6">
          <Card className="p-8 md:p-10 text-center space-y-6">
            <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-md">
              🌍
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                International CEFR Placement Test
              </h1>
              <p className="text-slate-600 text-base leading-relaxed max-w-lg mx-auto">
                Accurately evaluate your English language proficiency from <span className="font-bold text-sky-600">A1 (Beginner)</span> to <span className="font-bold text-purple-600">C2 (Mastery)</span>. Your teacher will automatically see your level and score!
              </p>
            </div>

            {/* Email Input */}
            <div className="max-w-md mx-auto space-y-4 text-left pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Student Email / Identifier
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none text-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Student Name (Optional)
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Alex Smith"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none text-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                variant="success"
                tactile={true}
                size="l"
                className="w-full max-w-md mx-auto"
                disabled={!studentEmail.trim()}
                onClick={() => setIsStarted(true)}
              >
                Start Placement Test ✨
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // 3. Question View
  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Progress header */}
        <Card className="p-6">
          <div className="flex items-center justify-between text-sm font-bold text-slate-600 mb-3">
            <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs uppercase">
              Question {currentIndex + 1} of {PLACEMENT_QUESTIONS.length}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs uppercase">
              {currentQuestion.category} ({currentQuestion.targetLevel})
            </span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-teal-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </Card>

        {/* Question card */}
        <Card className="p-8 space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((opt) => {
              const isSelected = currentAnswer === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between font-semibold ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50/80 text-sky-900 shadow-md'
                      : 'border-slate-200 bg-white hover:border-sky-300 text-slate-800'
                  }`}
                >
                  <span>{opt.text}</span>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <span className="text-xs font-bold">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="secondary"
            tactile={true}
            onClick={handleBack}
            disabled={currentIndex === 0}
          >
            ← Previous
          </Button>

          <Button
            variant={isLastQuestion ? 'success' : 'primary'}
            tactile={true}
            onClick={handleNext}
            disabled={!currentAnswer}
          >
            {isLastQuestion ? 'Complete Assessment 🎓' : 'Next Question →'}
          </Button>
        </div>
      </div>
    </div>
  );
}
