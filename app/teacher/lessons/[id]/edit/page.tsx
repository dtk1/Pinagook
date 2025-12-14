'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import TeacherLayout from '../../../../layouts/TeacherLayout';
import Button from '../../../../components/Button';
import Input from '../../../../components/Input';
import Link from 'next/link';
import { getLessonById, saveLesson } from '../../../../utils/lessonStorage';
import { Lesson } from '../../../../types/lesson';
import LessonBlockEditor from '../../../../components/LessonBlockEditor';

interface EditLessonPageProps {
  params: {
    id: string;
  };
}

export default function EditLessonPage({ params }: EditLessonPageProps) {
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [blocks, setBlocks] = useState<Lesson['blocks']>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedLesson = getLessonById(params.id);
    if (loadedLesson) {
      setLesson(loadedLesson);
      setTitle(loadedLesson.title);
      setDescription(loadedLesson.description);
      setBlocks(loadedLesson.blocks);
    }
    setLoading(false);
  }, [params.id]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!lesson || !title.trim()) return;

    const updatedLesson: Lesson = {
      ...lesson,
      title: title.trim(),
      description: description.trim(),
      blocks,
      updatedAt: new Date().toISOString(),
    };

    saveLesson(updatedLesson);
    router.push('/teacher/lessons');
  };

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Loading...</p>
        </div>
      </TeacherLayout>
    );
  }

  if (!lesson) {
    return (
      <TeacherLayout>
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <Link href="/teacher/lessons" className="text-[#0ea5e9] hover:underline mb-4 inline-block">
              ← Back to Lessons
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Lesson Not Found</h1>
            <p className="text-gray-600">The lesson you're looking for doesn't exist.</p>
          </div>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <Link href="/teacher/lessons" className="text-[#0ea5e9] hover:underline mb-4 inline-block">
            ← Back to Lessons
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Lesson</h1>
          <p className="text-gray-600">{lesson.title}</p>
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
            <Button variant="primary" type="submit">Save Changes</Button>
            <Link href="/teacher/lessons">
              <Button variant="secondary" type="button">Cancel</Button>
            </Link>
          </div>
        </form>
      </div>
    </TeacherLayout>
  );
}

