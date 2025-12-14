import TeacherLayout from '../../layouts/TeacherLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Link from 'next/link';

export default function TeacherLessonsPage() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((lesson) => (
            <Card key={lesson}>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lesson {lesson}</h3>
              <p className="text-sm text-gray-600 mb-4">Lesson description goes here...</p>
              <div className="flex gap-2">
                <Link href={`/teacher/lessons/${lesson}/edit`} className="text-sm text-[#0ea5e9] hover:underline">
                  Edit
                </Link>
                <Link href={`/teacher/lessons/${lesson}/preview`} className="text-sm text-[#0ea5e9] hover:underline">
                  Preview
                </Link>
                <Link href={`/teacher/lessons/${lesson}/results`} className="text-sm text-[#0ea5e9] hover:underline">
                  Results
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </TeacherLayout>
  );
}

