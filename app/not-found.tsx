import Link from 'next/link';
import PublicLayout from './layouts/PublicLayout';
import Button from './components/Button';

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="w-full max-w-[1440px] mx-auto px-8 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-[#0ea5e9] mb-4">404</h1>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h2>
            <p className="text-xl text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="primary">Go Home</Button>
            </Link>
            <Link href="/teacher/dashboard">
              <Button variant="outline">Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

