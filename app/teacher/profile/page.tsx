import TeacherLayout from '../../layouts/TeacherLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function TeacherProfilePage() {
  return (
    <TeacherLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Personal Information</h2>
          <form className="space-y-6">
            <Input type="text" label="Full Name" placeholder="John Doe" />
            <Input type="email" label="Email" placeholder="you@example.com" />
            <Input type="text" label="Phone" placeholder="+1 (555) 000-0000" />
            <Button variant="primary">Save Changes</Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Change Password</h2>
          <form className="space-y-6">
            <Input type="password" label="Current Password" placeholder="••••••••" />
            <Input type="password" label="New Password" placeholder="••••••••" />
            <Input type="password" label="Confirm New Password" placeholder="••••••••" />
            <Button variant="primary">Update Password</Button>
          </form>
        </Card>
      </div>
    </TeacherLayout>
  );
}

