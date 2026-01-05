/**
 * Serialization helpers for lesson progress.
 * Keeps the stored shape JSON-safe and does minimal validation on load.
 */

import type { StoredLessonProgress } from "./progressStorage";

/**
 * Serialize progress to a JSON string.
 */
export function serializeProgress(progress: StoredLessonProgress): string {
  return JSON.stringify(progress);
}

/**
 * Safely parse JSON string into StoredLessonProgress.
 * Returns null if the shape is invalid.
 */
export function deserializeProgress(json: string): StoredLessonProgress | null {
  try {
    const data = JSON.parse(json) as Partial<StoredLessonProgress> | unknown;

    if (!data || typeof data !== "object") {
      return null;
    }

    const obj = data as Partial<StoredLessonProgress>;

    if (obj.version !== 1) return null;
    if (!obj.courseId || typeof obj.courseId !== "string") return null;
    if (!obj.lessonId || typeof obj.lessonId !== "string") return null;

    const currentStepIndex =
      typeof obj.currentStepIndex === "number" && obj.currentStepIndex >= 0
        ? obj.currentStepIndex
        : 0;

    const answers =
      obj.answers && typeof obj.answers === "object" ? obj.answers : {};

    const checked =
      obj.checked && typeof obj.checked === "object" ? obj.checked : {};

    const updatedAt =
      typeof obj.updatedAt === "number" && obj.updatedAt > 0
        ? obj.updatedAt
        : Date.now();

    const resultSummary =
      obj.resultSummary && typeof obj.resultSummary === "object"
        ? obj.resultSummary
        : undefined;

    return {
      version: 1,
      courseId: obj.courseId,
      lessonId: obj.lessonId,
      currentStepIndex,
      answers,
      checked,
      updatedAt,
      resultSummary,
    };
  } catch {
    return null;
  }
}


