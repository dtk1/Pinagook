import TeacherLayout from '../../layouts/TeacherLayout';
import Card from '../../components/Card';

export default function TeacherDashboardPage() {
  return (
    <TeacherLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your teaching activity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Lessons</h3>
            <p className="text-3xl font-bold text-[#0ea5e9]">12</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Students</h3>
            <p className="text-3xl font-bold text-[#14b8a6]">8</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">This Month</h3>
            <p className="text-3xl font-bold text-[#0891b2]">24</p>
          </Card>
        </div>

        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <p className="text-gray-600">Recent activity will be displayed here...</p>
        </Card>
      </div>
    </TeacherLayout>
  );
}

