'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TeacherLayout from '../../layouts/TeacherLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { getAllLessons, deleteLesson } from '../../utils/lessonStorage';
import { Lesson } from '../../types/lesson';

export default function TeacherLessonsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    if (user) {
      const userLessons = getAllLessons(user.id);
      setLessons(userLessons);
    }
  }, [user]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      deleteLesson(id);
      setLessons(lessons.filter(l => l.id !== id));
    }
  };

  if (!user) return null;

  return (
    <TeacherLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Lessons</h1>
            <p className="text-gray-600">Manage all your lessons in one place</p>
          </div>
          <Link href="/teacher/lessons/create">
            <Button variant="primary">Create Lesson</Button>
          </Link>
        </div>

        {lessons.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No lessons yet. Create your first lesson to get started!</p>
              <Link href="/teacher/lessons/create">
                <Button variant="primary">Create Lesson</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <Card key={lesson.id}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{lesson.title}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{lesson.description || 'No description'}</p>
                <p className="text-xs text-gray-400 mb-4">
                  {lesson.blocks.length} block{lesson.blocks.length !== 1 ? 's' : ''}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/teacher/lessons/${lesson.id}/edit`} className="text-sm text-[#0ea5e9] hover:underline">
                    Edit
                  </Link>
                  <Link href={`/teacher/lessons/${lesson.id}/preview`} className="text-sm text-[#0ea5e9] hover:underline">
                    Preview
                  </Link>
                  <Link href={`/teacher/lessons/${lesson.id}/results`} className="text-sm text-[#0ea5e9] hover:underline">
                    Results
                  </Link>
                  <button
                    onClick={() => handleDelete(lesson.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}

