/**
 * Dev-only page to test database operations
 * TODO: Remove before production
 * 
 * Protected: Requires authentication and NODE_ENV === 'development'
 */

import { redirect } from 'next/navigation';
import { requireUser } from '../../lib/auth/requireUser';
import { seedDemoCourseToDb } from '../../actions/devSeedCourse';
import SeedButton from './SeedButton';

export default async function DevDbPage() {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    redirect('/');
  }

  // Require authentication
  await requireUser('/dev/db');

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Database Test Page</h1>
          <p className="text-sm text-gray-600">
            This page is for local development only. Remove before production.
          </p>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Seed Demo Course</h2>
          <p className="text-sm text-gray-600">
            Click the button below to seed the demo course to the database.
          </p>
          <SeedButton />
        </div>
      </div>
    </div>
  );
}
