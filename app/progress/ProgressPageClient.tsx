'use client';

import Link from 'next/link';
import { CourseStats } from '../features/progress/progressStats';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';

interface ProgressPageClientProps {
  coursesStats: CourseStats[];
  error: string | null;
}

export default function ProgressPageClient({ coursesStats, error }: ProgressPageClientProps) {
  if (error) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] p-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-red-800 mb-2">Error</h1>
              <p className="text-red-600">{error}</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Filter out courses with no progress
  const coursesWithProgress = coursesStats.filter(
    stats => stats.completedSteps > 0 || stats.totalSteps > 0
  );

  if (coursesWithProgress.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#0F172A] mb-2">My Progress</h1>
            <p className="text-[#475569] text-lg">Track your learning progress</p>
          </div>

          <Card>
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-semibold text-[#0F172A] mb-2">No Progress Yet</h2>
              <p className="text-[#475569] mb-6">
                Start learning to see your progress here!
              </p>
              <Link href="/courses">
                <Button variant="primary">Browse Courses</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0F172A] mb-2">My Progress</h1>
          <p className="text-[#475569] text-lg">Track your learning progress across all courses</p>
        </div>

        <div className="space-y-6">
          {coursesWithProgress.map((courseStats) => (
            <Card key={courseStats.courseId} className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-[#0F172A] mb-2">
                      {courseStats.courseTitle}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-[#475569]">
                      <span>
                        {courseStats.completedLessons} / {courseStats.totalLessons} lessons completed
                      </span>
                      {courseStats.averageScore > 0 && (
                        <span className="font-medium text-[#0EA5B7]">
                          Average Score: {courseStats.averageScore}%
                        </span>
                      )}
                    </div>
                  </div>
                  <Link href={`/courses/${courseStats.courseId}`}>
                    <Button variant="secondary">View Course</Button>
                  </Link>
                </div>

                {/* Overall Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-[#475569] mb-2">
                    <span>Overall Progress</span>
                    <span className="font-medium">
                      {courseStats.completedSteps} / {courseStats.totalSteps} steps
                    </span>
                  </div>
                  <div className="w-full bg-[#E6EEF2] rounded-full h-3">
                    <div
                      className="bg-[#0EA5B7] h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${(courseStats.completedSteps / courseStats.totalSteps) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Interactive Steps Progress */}
                {courseStats.totalInteractiveSteps > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-[#475569] mb-2">
                      <span>Interactive Exercises</span>
                      <span className="font-medium">
                        {courseStats.completedInteractiveSteps} / {courseStats.totalInteractiveSteps} completed
                      </span>
                    </div>
                    <div className="w-full bg-[#E6EEF2] rounded-full h-2">
                      <div
                        className="bg-[#14B8A6] h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(courseStats.completedInteractiveSteps / courseStats.totalInteractiveSteps) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Lessons Progress */}
              <div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-4">
                  Lessons Progress
                </h3>
                <div className="space-y-3">
                  {courseStats.lessons.map((lessonStats) => {
                    const progressPercent = lessonStats.totalSteps > 0
                      ? (lessonStats.completedSteps / lessonStats.totalSteps) * 100
                      : 0;
                    const isCompleted = lessonStats.completedSteps === lessonStats.totalSteps && lessonStats.totalSteps > 0;

                    return (
                      <div
                        key={lessonStats.lessonId}
                        className="border border-[#E6EEF2] rounded-lg p-4 hover:bg-[#F8FAFC] transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-[#0F172A]">
                              {lessonStats.lessonTitle}
                            </h4>
                            {isCompleted && (
                              <Badge variant="success">Completed</Badge>
                            )}
                            {!isCompleted && lessonStats.completedSteps > 0 && (
                              <Badge variant="info">In Progress</Badge>
                            )}
                          </div>
                          <Link href={`/courses/${courseStats.courseId}/lessons/${lessonStats.lessonId}`}>
                            <Button variant="secondary" size="s">
                              {isCompleted ? 'Review' : 'Continue'}
                            </Button>
                          </Link>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-[#475569] mb-2">
                          <span>
                            {lessonStats.completedSteps} / {lessonStats.totalSteps} steps
                          </span>
                          {lessonStats.averageScore > 0 && (
                            <span className="font-medium">
                              Score: {lessonStats.averageScore}%
                            </span>
                          )}
                        </div>

                        <div className="w-full bg-[#E6EEF2] rounded-full h-2">
                          <div
                            className="bg-[#0EA5B7] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {courseStats.lastUpdated && (
                <div className="mt-4 text-xs text-[#94A3B8]">
                  Last updated: {new Date(courseStats.lastUpdated).toLocaleString()}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
