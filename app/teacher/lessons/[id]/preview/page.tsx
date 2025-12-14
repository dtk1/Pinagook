'use client';

import { useState, useEffect } from 'react';
import TeacherLayout from '../../../../layouts/TeacherLayout';
import Button from '../../../../components/Button';
import Card from '../../../../components/Card';
import Link from 'next/link';
import { getLessonById } from '../../../../utils/lessonStorage';
import { Lesson } from '../../../../types/lesson';

interface PreviewLessonPageProps {
  params: {
    id: string;
  };
}

export default function PreviewLessonPage({ params }: PreviewLessonPageProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [studentLink, setStudentLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadedLesson = getLessonById(params.id);
    if (loadedLesson) {
      setLesson(loadedLesson);
      if (typeof window !== 'undefined') {
        setStudentLink(`${window.location.origin}/viewer/${params.id}`);
      }
    }
  }, [params.id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(studentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!lesson) {
    return (
      <TeacherLayout>
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <Link href="/teacher/lessons" className="text-[#0ea5e9] hover:underline mb-4 inline-block">
              ← Back to Lessons
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Lesson Not Found</h1>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Preview Lesson</h1>
          <p className="text-gray-600">{lesson.title}</p>
        </div>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Student Link</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={studentLink}
              readOnly
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
            />
            <Button variant="primary" onClick={copyToClipboard}>
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          </div>
          <p className="text-sm text-gray-600">Share this link with your students to access the lesson.</p>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Lesson Preview</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{lesson.title}</h3>
              {lesson.description && (
                <p className="text-gray-600 mb-4">{lesson.description}</p>
              )}
            </div>

            {lesson.blocks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No blocks in this lesson yet.</p>
            ) : (
              <div className="space-y-4">
                {lesson.blocks.map((block, index) => (
                  <div key={block.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {block.type}
                      </span>
                      <span className="text-xs text-gray-400">#{index + 1}</span>
                    </div>
                    {block.type === 'text' && <p className="text-gray-700 whitespace-pre-wrap">{block.content}</p>}
                    {block.type === 'question' && (
                      <div>
                        <p className="font-medium text-gray-900 mb-2">{block.content}</p>
                        {block.options && (
                          <ul className="space-y-1">
                            {block.options.map((opt, i) => (
                              <li key={i} className="text-gray-600">
                                {opt} {block.correctAnswer === opt && '✓'}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                    {(block.type === 'image' || block.type === 'video' || block.type === 'file') && (
                      <p className="text-gray-600 text-sm">{block.content || block.fileName || 'No URL provided'}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <div className="flex gap-4">
          <Link href={`/viewer/${params.id}`}>
            <Button variant="primary">View as Student</Button>
          </Link>
          <Link href={`/teacher/lessons/${params.id}/edit`}>
            <Button variant="secondary">Edit Lesson</Button>
          </Link>
        </div>
      </div>
    </TeacherLayout>
  );
}

