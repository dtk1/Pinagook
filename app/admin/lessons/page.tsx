import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/Card';

export default function AdminLessonsPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Lessons Management</h1>
          <p className="text-gray-600">View and manage all lessons in the system</p>
        </div>

        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">All Lessons</h2>
          <div className="space-y-4">
            <p className="text-gray-600">Lesson management interface will be displayed here...</p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

