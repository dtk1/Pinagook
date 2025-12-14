import TeacherLayout from '../../../../layouts/TeacherLayout';
import Card from '../../../../components/Card';
import Link from 'next/link';

interface LessonResultsPageProps {
  params: {
    id: string;
  };
}

export default function LessonResultsPage({ params }: LessonResultsPageProps) {
  return (
    <TeacherLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <Link href="/teacher/lessons" className="text-[#0ea5e9] hover:underline mb-4 inline-block">
            ← Back to Lessons
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Lesson Results</h1>
          <p className="text-gray-600">Lesson ID: {params.id}</p>
        </div>

        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Student Progress</h2>
          <div className="space-y-4">
            <p className="text-gray-600">Student results and progress will be displayed here...</p>
          </div>
        </Card>
      </div>
    </TeacherLayout>
  );
}

