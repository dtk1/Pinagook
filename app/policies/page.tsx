import PublicLayout from '../layouts/PublicLayout';

export default function PoliciesPage() {
  return (
    <PublicLayout>
      <div className="w-full max-w-[1440px] mx-auto px-8 py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Policies</h1>
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy Policy</h2>
              <p className="text-gray-600">Privacy policy content goes here...</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Terms of Service</h2>
              <p className="text-gray-600">Terms of service content goes here...</p>
            </section>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}



