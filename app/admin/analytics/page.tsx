import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/Card';

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Platform analytics and insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-[#0ea5e9]">1,234</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Lessons</h3>
            <p className="text-3xl font-bold text-[#14b8a6]">5,678</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Teachers</h3>
            <p className="text-3xl font-bold text-[#0891b2]">456</p>
          </Card>
        </div>

        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Analytics Dashboard</h2>
          <p className="text-gray-600">Detailed analytics charts and graphs will be displayed here...</p>
        </Card>
      </div>
    </AdminLayout>
  );
}

