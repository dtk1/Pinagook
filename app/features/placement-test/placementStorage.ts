import { CEFRLevel, PlacementResult, QuestionCategory } from './types';
import { PLACEMENT_QUESTIONS } from './questions';

const STORAGE_KEY = 'pinagook_placement_results_ledger';

/**
 * Calculates CEFR level based on percentage score
 */
export function calculateCEFRLevel(scorePercent: number): CEFRLevel {
  if (scorePercent >= 92) return 'C2';
  if (scorePercent >= 78) return 'C1';
  if (scorePercent >= 62) return 'B2';
  if (scorePercent >= 45) return 'B1';
  if (scorePercent >= 25) return 'A2';
  return 'A1';
}

/**
 * Saves placement result to local storage ledger
 */
export function savePlacementResultLocally(result: PlacementResult): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getAllPlacementResultsLocally();
    // Filter out previous attempt by same email if any
    const updated = [result, ...existing.filter(r => r.studentEmail !== result.studentEmail)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save placement result locally:', e);
  }
}

/**
 * Retrieves all student placement results (for Teacher Dashboard)
 */
export function getAllPlacementResultsLocally(): PlacementResult[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as PlacementResult[];
  } catch (e) {
    console.error('Failed to load placement results:', e);
    return [];
  }
}

/**
 * Evaluates student answers and returns full PlacementResult object
 */
export function evaluatePlacementTest(
  studentEmail: string,
  userAnswers: Record<string, string>,
  studentName?: string
): PlacementResult {
  let correctCount = 0;
  const categoryScores: Record<QuestionCategory, { correct: number; total: number }> = {
    'Grammar': { correct: 0, total: 0 },
    'Vocabulary': { correct: 0, total: 0 },
    'Reading & Usage': { correct: 0, total: 0 },
  };

  PLACEMENT_QUESTIONS.forEach((q) => {
    categoryScores[q.category].total += 1;
    const userAnswer = userAnswers[q.id];
    if (userAnswer === q.correctOptionId) {
      correctCount += 1;
      categoryScores[q.category].correct += 1;
    }
  });

  const totalQuestions = PLACEMENT_QUESTIONS.length;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const cefrLevel = calculateCEFRLevel(scorePercent);

  const result: PlacementResult = {
    id: `pr_${Date.now()}`,
    studentEmail,
    studentName: studentName || studentEmail.split('@')[0],
    scorePercent,
    correctCount,
    totalQuestions,
    cefrLevel,
    categoryScores,
    completedAt: Date.now(),
  };

  savePlacementResultLocally(result);
  return result;
}
