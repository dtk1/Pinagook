import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Settings</h1>
          <p className="text-gray-600">Configure platform settings and preferences</p>
        </div>

        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">General Settings</h2>
          <form className="space-y-6">
            <Input type="text" label="Platform Name" placeholder="Pinagook" />
            <Input type="email" label="Support Email" placeholder="support@pinagook.com" />
            <Button variant="primary">Save Settings</Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">System Configuration</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-gray-700">Enable email notifications</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-gray-700">Enable maintenance mode</span>
            </label>
            <Button variant="primary">Update Configuration</Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

