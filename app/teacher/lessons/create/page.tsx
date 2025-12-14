'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import TeacherLayout from '../../../layouts/TeacherLayout';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import { saveLesson } from '../../../utils/lessonStorage';
import { Lesson } from '../../../types/lesson';
import LessonBlockEditor from '../../../components/LessonBlockEditor';

export default function CreateLessonPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [blocks, setBlocks] = useState<Lesson['blocks']>([]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim()) return;

    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      blocks,
      teacherId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveLesson(newLesson);
    router.push('/teacher/lessons');
  };

  if (!user) return null;

  return (
    <TeacherLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <Link href="/teacher/lessons" className="text-[#0ea5e9] hover:underline mb-4 inline-block">
            ← Back to Lessons
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Lesson</h1>
          <p className="text-gray-600">Build a lesson plan from scratch or use a template</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
            <Input
              type="text"
              label="Lesson Title"
              placeholder="Enter lesson title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent"
                rows={4}
                placeholder="Enter lesson description"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Lesson Blocks</h2>
            <LessonBlockEditor blocks={blocks} onChange={setBlocks} />
          </div>

          <div className="flex gap-4">
            <Button variant="primary" type="submit">Create Lesson</Button>
            <Link href="/teacher/lessons">
              <Button variant="secondary" type="button">Cancel</Button>
            </Link>
          </div>
        </form>
      </div>
    </TeacherLayout>
  );
}

