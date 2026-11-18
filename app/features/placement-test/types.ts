export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type QuestionCategory = 'Grammar' | 'Vocabulary' | 'Reading & Usage';

export interface PlacementQuestion {
  id: string;
  category: QuestionCategory;
  targetLevel: CEFRLevel;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  explanation: string;
}

export interface PlacementResult {
  id: string;
  studentEmail: string;
  studentName?: string;
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  cefrLevel: CEFRLevel;
  categoryScores: Record<QuestionCategory, { correct: number; total: number }>;
  completedAt: number;
}
