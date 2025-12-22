import PublicLayout from '../../layouts/PublicLayout';

interface ViewerPageProps {
  params: {
    lessonId: string;
  };
}

export default function ViewerPage({ params }: ViewerPageProps) {
  return (
    <PublicLayout>
      <div className="w-full max-w-[1440px] mx-auto px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Lesson Viewer</h1>
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <p className="text-gray-600 mb-4">Lesson ID: {params.lessonId}</p>
            <p className="text-gray-600">Lesson content will be displayed here...</p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}



