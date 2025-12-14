import Link from 'next/link';
import PublicLayout from './layouts/PublicLayout';
import Button from './components/Button';

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="w-full max-w-[1440px] mx-auto px-8 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-[#0EA5B7] mb-4">404</h1>
            <h2 className="text-4xl font-bold text-[#0F172A] mb-4">Page Not Found</h2>
            <p className="text-xl text-[#475569] mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="primary">Go Home</Button>
            </Link>
            <Link href="/teacher/dashboard">
              <Button variant="secondary">Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

