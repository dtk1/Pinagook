'use client';

import Link from 'next/link';
import { Course } from '../../content';
import Card from '../components/Card';
import Button from '../components/Button';

interface CoursesPageClientProps {
  courses: Course[];
  error: string | null;
}

export default function CoursesPageClient({ courses, error }: CoursesPageClientProps) {
  if (error) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] p-8 flex items-center justify-center">
        <div className="max-w-6xl mx-auto w-full">
          <Card className="border-[#EF4444]">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-[#EF4444] mb-2">Failed to load courses</h1>
              <p className="text-[#0F172A]">{error || 'An error occurred while loading courses.'}</p>
              <div className="pt-2">
                <Button variant="primary" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] p-8 flex items-center justify-center">
        <div className="max-w-6xl mx-auto w-full">
          <Card>
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-[#0F172A]">No courses yet</h1>
              <p className="text-[#475569]">Import one in /teacher to get started.</p>
              <div className="pt-2 flex gap-2 justify-center">
                <Link href="/teacher">
                  <Button variant="primary">Go to Teacher</Button>
                </Link>
                <Link href="/">
                  <Button variant="secondary">Back to Home</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0F172A] mb-2">Available Courses</h1>
          <p className="text-[#475569] text-lg">Choose a course to start learning</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-[#0F172A] mb-2">{course.title}</h2>
                {course.description && (
                  <p className="text-[#475569] text-sm mb-4 line-clamp-3">{course.description}</p>
                )}
                <div className="flex items-center gap-2 text-sm text-[#475569] mb-4">
                  <span className="font-medium">{course.lessons.length}</span>
                  <span>{course.lessons.length === 1 ? 'lesson' : 'lessons'}</span>
                </div>
              </div>
              <Link href={`/courses/${course.id}`}>
                <Button variant="primary" className="w-full">
                  View Course
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
