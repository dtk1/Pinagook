import PlacementTestClient from './PlacementTestClient';
import { requireUser } from '../lib/auth/requireUser';

export const metadata = {
  title: 'CEFR English Placement Test | Pinagook',
  description: 'International level determination test (CEFR A1-C2) for online English learners.',
};

export default async function PlacementTestPage() {
  await requireUser('/placement-test');
  return <PlacementTestClient />;
}

