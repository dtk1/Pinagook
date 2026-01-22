'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { loadCourseFromJson, Course } from '../../content';
import { saveStoredCourse } from '../features/course-storage/courseStorage';
import { upsertCourseAction } from '../actions/courseActions';
import Card from '../components/Card';
import Button from '../components/Button';

type ValidationError = {
  path: string;
  message: string;
};

type PageState = 'idle' | 'validating' | 'valid' | 'error';

export default function TeacherPageClient() {
  const router = useRouter();
  const [jsonInput, setJsonInput] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [validatedCourse, setValidatedCourse] = useState<Course | null>(null);
  const [state, setState] = useState<PageState>('idle');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setValidationErrors([{
        path: 'file',
        message: 'File is too large. Maximum size is 5MB.',
      }]);
      setState('error');
      return;
    }

    // Check file type
    if (!file.name.endsWith('.json')) {
      setValidationErrors([{
        path: 'file',
        message: 'Only JSON files are allowed.',
      }]);
      setState('error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonInput(content);
      setValidationErrors([]);
      setState('idle');
      setValidatedCourse(null);
    };
    reader.onerror = () => {
      setValidationErrors([{
        path: 'file',
        message: 'Failed to read file.',
      }]);
      setState('error');
    };
    reader.readAsText(file);
  };

  const handleValidate = () => {
    setValidationErrors([]);
    setState('validating');
    setValidatedCourse(null);

    try {
      const parsed = JSON.parse(jsonInput);
      const validated = loadCourseFromJson(parsed);
      setValidatedCourse(validated);
      setState('valid');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown validation error';
      setValidationErrors([{
        path: 'json',
        message,
      }]);
      setState('error');
    }
  };

  const handleSaveToDb = async () => {
    if (!validatedCourse) return;

    setSaveStatus('saving');
    setSaveError(null);

    try {
      const parsed = JSON.parse(jsonInput);
      const result = await upsertCourseAction(parsed);

      if (result.ok) {
        setSaveStatus('success');
        // Redirect to course page and force refresh
        // Use window.location for a full page reload to ensure fresh data
        window.location.href = `/courses/${result.courseId}`;
      } else {
        setSaveStatus('error');
        setSaveError(result.error);
      }
    } catch (error) {
      setSaveStatus('error');
      setSaveError(error instanceof Error ? error.message : 'Failed to save course');
    }
  };

  const handleSaveLocally = () => {
    if (!validatedCourse) return;

    const success = saveStoredCourse(
      validatedCourse.id,
      validatedCourse.title,
      jsonInput
    );

    if (success) {
      alert('Course saved to localStorage!');
    } else {
      alert('Failed to save course to localStorage');
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Import Course</h1>
          <p className="text-[#64748B]">
            Import a course by pasting JSON or uploading a file
          </p>
        </div>

        <Card>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Course JSON
              </label>
              <textarea
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  setState('idle');
                  setValidationErrors([]);
                  setValidatedCourse(null);
                }}
                className="w-full h-64 px-3.5 py-3 rounded-xl border border-[#E6EEF2] hover:border-[#CBD5E1] focus:border-[#0EA5B7] focus:ring-2 focus:ring-[#0EA5B7]/20 focus:outline-none transition-all font-mono text-sm"
                placeholder="Paste your course JSON here..."
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 border-t border-[#E6EEF2]"></div>
              <span className="text-sm text-[#94A3B8]">OR</span>
              <div className="flex-1 border-t border-[#E6EEF2]"></div>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload JSON File
              </Button>
            </div>

            <Button
              variant="primary"
              onClick={handleValidate}
              disabled={!jsonInput.trim() || state === 'validating'}
              isLoading={state === 'validating'}
            >
              Validate & Preview
            </Button>

            {validationErrors.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#EF4444]">Validation Errors:</p>
                <div className="space-y-1">
                  {validationErrors.map((err, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800"
                    >
                      <span className="font-medium">{err.path}:</span> {err.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {validatedCourse && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800 mb-2">
                    ✓ Course validated successfully!
                  </p>
                  <div className="space-y-2 text-sm text-green-700">
                    <p><span className="font-medium">ID:</span> {validatedCourse.id}</p>
                    <p><span className="font-medium">Title:</span> {validatedCourse.title}</p>
                    {validatedCourse.description && (
                      <p><span className="font-medium">Description:</span> {validatedCourse.description}</p>
                    )}
                    <p><span className="font-medium">Lessons:</span> {validatedCourse.lessons.length}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#475569]">Lessons:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-[#64748B]">
                    {validatedCourse.lessons.map((lesson) => (
                      <li key={lesson.id}>{lesson.title}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="primary"
                    onClick={handleSaveToDb}
                    disabled={saveStatus === 'saving' || saveStatus === 'success'}
                    isLoading={saveStatus === 'saving'}
                    className="w-full"
                  >
                    {saveStatus === 'success' ? 'Saved!' : 'Save to Database'}
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={handleSaveLocally}
                    className="w-full"
                  >
                    Save Locally (Offline)
                  </Button>

                  {saveStatus === 'error' && saveError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                      <p className="font-medium">Failed to save course:</p>
                      <p>{saveError}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
