'use client';

import { useState } from 'react';
import { seedDemoCourseToDb } from '../../actions/devSeedCourse';
import Button from '../../components/Button';

export default function SeedButton() {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState<string>('');

  const handleSeed = async () => {
    setStatus('loading');
    setMessage('');

    const result = await seedDemoCourseToDb();

    if (result.ok) {
      setStatus('success');
      setMessage(`Success! Course "${result.courseId}" seeded to database.`);
    } else {
      setStatus('error');
      setMessage(`Error: ${result.error}`);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        variant="primary"
        onClick={handleSeed}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Seeding...' : 'Seed Demo Course'}
      </Button>

      {status === 'success' && (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
          {message}
        </div>
      )}

      {status === 'error' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          {message}
        </div>
      )}
    </div>
  );
}
