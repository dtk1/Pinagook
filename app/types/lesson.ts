export type LessonBlockType = 'text' | 'question' | 'image' | 'video' | 'file';

export interface LessonBlock {
  id: string;
  type: LessonBlockType;
  content: string;
  order: number;
  // For questions
  options?: string[];
  correctAnswer?: string;
  // For files
  fileName?: string;
  fileUrl?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  blocks: LessonBlock[];
  teacherId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LessonResult {
  id: string;
  lessonId: string;
  studentName: string;
  studentEmail?: string;
  answers: Record<string, string>; // blockId -> answer
  submittedAt: string;
  score?: number;
}



