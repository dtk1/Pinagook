import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/Card';

export default function AdminPlansPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Subscription Plans</h1>
          <p className="text-gray-600">Manage subscription plans and pricing</p>
        </div>

        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Plans Management</h2>
          <p className="text-gray-600">Plan management interface will be displayed here...</p>
          <p className="text-sm text-gray-500 mt-2">(Future feature)</p>
        </Card>
      </div>
    </AdminLayout>
  );
}

