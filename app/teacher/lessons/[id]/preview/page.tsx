import TeacherLayout from '../../../../layouts/TeacherLayout';
import Button from '../../../../components/Button';
import Link from 'next/link';

interface PreviewLessonPageProps {
  params: {
    id: string;
  };
}

export default function PreviewLessonPage({ params }: PreviewLessonPageProps) {
  return (
    <TeacherLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <Link href="/teacher/lessons" className="text-[#0ea5e9] hover:underline mb-4 inline-block">
            ← Back to Lessons
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Preview Lesson</h1>
          <p className="text-gray-600">Lesson ID: {params.id}</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Lesson Preview</h2>
              <p className="text-gray-600">This is how students will see your lesson...</p>
            </div>
            <div className="flex gap-4">
              <Link href={`/viewer/${params.id}`}>
                <Button variant="primary">View as Student</Button>
              </Link>
              <Link href={`/teacher/lessons/${params.id}/edit`}>
                <Button variant="outline">Edit Lesson</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}

