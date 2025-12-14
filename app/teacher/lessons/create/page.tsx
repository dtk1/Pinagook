import TeacherLayout from '../../../layouts/TeacherLayout';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Link from 'next/link';

export default function CreateLessonPage() {
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

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <form className="space-y-6">
            <Input type="text" label="Lesson Title" placeholder="Enter lesson title" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent"
                rows={4}
                placeholder="Enter lesson description"
              />
            </div>
            <div className="flex gap-4">
              <Button variant="primary">Create Lesson</Button>
              <Link href="/teacher/lessons">
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </TeacherLayout>
  );
}

