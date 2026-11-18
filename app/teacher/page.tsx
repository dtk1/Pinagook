import { requireTeacher } from '../lib/auth/requireUser';
import TeacherPageClient from './TeacherPageClient';

/**
 * Teacher page - protected route for Teachers only
 */
export default async function TeacherPage() {
  await requireTeacher('/teacher');

  return <TeacherPageClient />;
}
