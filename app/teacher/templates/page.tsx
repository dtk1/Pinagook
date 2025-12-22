import TeacherLayout from '../../layouts/TeacherLayout';
import Card from '../../components/Card';

export default function TeacherTemplatesPage() {
  return (
    <TeacherLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Templates</h1>
          <p className="text-gray-600">Browse and use pre-made lesson templates</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {['A2 Basics', 'B1 Conversations', 'IELTS Prep', 'Business English', 'Kids Starter', 'Grammar Focus'].map((template) => (
            <Card key={template}>
              <div className="h-32 bg-gradient-to-br from-[#0ea5e9] to-[#14b8a6] rounded-xl mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{template}</h3>
              <p className="text-sm text-gray-600 mb-4">Template description goes here...</p>
              <button className="text-sm text-[#0ea5e9] hover:underline">Use Template</button>
            </Card>
          ))}
        </div>
      </div>
    </TeacherLayout>
  );
}



