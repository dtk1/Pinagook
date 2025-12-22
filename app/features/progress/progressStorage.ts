/**
 * Local storage helpers for lesson progress.
 */

import type {
  AnswersByStepId,
  CheckedByStepId,
} from "../lesson-player/types";
import { serializeProgress, deserializeProgress } from "./serialize";

export const STORAGE_KEY_PREFIX = "pinagook:progress:";

export interface StoredLessonResultSummary {
  correctCount: number;
  totalInteractive: number;
  percent: number;
  finishedAt: number; // Date.now()
}

export interface StoredLessonProgress {
  version: 1;
  courseId: string;
  lessonId: string;
  currentStepIndex: number;
  answers: AnswersByStepId;
  checked: CheckedByStepId;
  updatedAt: number; // Date.now()
  resultSummary?: StoredLessonResultSummary;
}

export function makeKey(courseId: string, lessonId: string): string {
  return `${STORAGE_KEY_PREFIX}${courseId}:${lessonId}`;
}

export function loadProgress(
  courseId: string,
  lessonId: string
): StoredLessonProgress | null {
  if (typeof window === "undefined") return null;

  const key = makeKey(courseId, lessonId);
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;

  return deserializeProgress(raw);
}

export function saveProgress(progress: StoredLessonProgress): void {
  if (typeof window === "undefined") return;

  const key = makeKey(progress.courseId, progress.lessonId);
  const json = serializeProgress(progress);
  window.localStorage.setItem(key, json);
}

export function clearProgress(courseId: string, lessonId: string): void {
  if (typeof window === "undefined") return;

  const key = makeKey(courseId, lessonId);
  window.localStorage.removeItem(key);
}


