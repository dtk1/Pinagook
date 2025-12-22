import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/Card';

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Users Management</h1>
          <p className="text-gray-600">Manage all users in the system</p>
        </div>

        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">All Users</h2>
              <button className="px-4 py-2 bg-[#0ea5e9] text-white rounded-lg hover:bg-[#0891b2] transition-colors">
                Add User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-600">John Doe</td>
                    <td className="py-3 px-4 text-sm text-gray-600">john@example.com</td>
                    <td className="py-3 px-4 text-sm text-gray-600">Teacher</td>
                    <td className="py-3 px-4 text-sm text-green-600">Active</td>
                    <td className="py-3 px-4 text-sm">
                      <button className="text-[#0ea5e9] hover:underline">Edit</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}



