import RequireRole from '../components/RequireRole';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireRole allowedRoles={['teacher', 'admin']}>
      {children}
    </RequireRole>
  );
}



