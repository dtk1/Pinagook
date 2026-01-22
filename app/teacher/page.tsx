import { requireUser } from '../lib/auth/requireUser';
import TeacherPageClient from './TeacherPageClient';

/**
 * Teacher page - protected route
 * Requires authentication
 */
export default async function TeacherPage() {
  await requireUser('/teacher');

  return <TeacherPageClient />;
}
