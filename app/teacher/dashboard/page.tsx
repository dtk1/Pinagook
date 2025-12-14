'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TeacherLayout from '../../layouts/TeacherLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { getAllLessons, getAllResults } from '../../utils/lessonStorage';

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [lessonCount, setLessonCount] = useState(0);
  const [submissionCount, setSubmissionCount] = useState(0);

  useEffect(() => {
    if (user) {
      const lessons = getAllLessons(user.id);
      setLessonCount(lessons.length);
      
      const allResults = getAllResults();
      const userLessonIds = lessons.map(l => l.id);
      const userSubmissions = allResults.filter(r => userLessonIds.includes(r.lessonId));
      setSubmissionCount(userSubmissions.length);
    }
  }, [user]);

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <TeacherLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your teaching activity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Lessons</h3>
            <p className="text-3xl font-bold text-[#0ea5e9]">{lessonCount}</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Submissions</h3>
            <p className="text-3xl font-bold text-[#14b8a6]">{submissionCount}</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
            <Link href="/teacher/lessons/create">
              <Button variant="primary" className="w-full mt-2">Create Lesson</Button>
            </Link>
          </Card>
        </div>

        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          {submissionCount === 0 && lessonCount === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Get started by creating your first lesson!</p>
              <Link href="/teacher/lessons/create">
                <Button variant="primary">Create Lesson</Button>
              </Link>
            </div>
          ) : (
            <p className="text-gray-600">Activity feed will be displayed here...</p>
          )}
        </Card>
      </div>
    </TeacherLayout>
  );
}

