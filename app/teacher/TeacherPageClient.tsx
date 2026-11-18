'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { loadCourseFromJson, Course } from '../../content';
import { saveStoredCourse } from '../features/course-storage/courseStorage';
import { upsertCourseAction } from '../actions/courseActions';
import { seedAllBritishCouncilCoursesToDb } from '../actions/devSeedCourse';
import Card from '../components/Card';
import Button from '../components/Button';
import StudentPlacementResultsView from '../features/placement-test/StudentPlacementResultsView';

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
  const [seedingStatus, setSeedingStatus] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSeedBCCourses = async () => {
    setIsSeeding(true);
    setSeedingStatus(null);
    try {
      const res = await seedAllBritishCouncilCoursesToDb();
      if (res.ok) {
        setSeedingStatus(`✓ Successfully published ${res.count} British Council courses to database!`);
        setTimeout(() => {
          window.location.href = '/courses';
        }, 1200);
      } else {
        setSeedingStatus(`⚠️ ${res.error}`);
      }
    } catch (err) {
      setSeedingStatus(`⚠️ Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setValidationErrors([{
        path: 'file',
        message: 'File is too large. Maximum size is 5MB.',
      }]);
      setState('error');
      return;
    }

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
    <div className="container mx-auto p-8 max-w-5xl space-y-8">
      {/* Teacher Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          👩‍🏫 Teacher Workspace
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Teacher Dashboard</h1>
        <p className="text-slate-600 text-lg">
          Manage courses, preview content, and track student placement assessment results.
        </p>
      </div>

      {/* 1. Student Placement Test Results Component */}
      <StudentPlacementResultsView />

      {/* 2. British Council & Test-English Curriculum Presets */}
      <Card className="border-sky-200 bg-gradient-to-r from-sky-50/80 to-teal-50/80 p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-extrabold uppercase">
              🌐 International Curriculum Presets (A1 - C2)
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Publish All British Council & Test-English.com Courses
            </h3>
            <p className="text-slate-600 text-sm">
              Instantly publish structured Elementary (A1-A2), Intermediate (B1-B2), and Advanced (C1) courses based on British Council & Test-English curriculum.
            </p>
          </div>
          <div>
            <Button
              variant="success"
              tactile={true}
              size="m"
              onClick={handleSeedBCCourses}
              isLoading={isSeeding}
              disabled={isSeeding}
            >
              🚀 Publish All Courses to DB
            </Button>
          </div>
        </div>
        {seedingStatus && (
          <div className="p-3 bg-white border border-sky-200 rounded-xl text-xs font-bold text-sky-900 shadow-sm">
            {seedingStatus}
          </div>
        )}
      </Card>

      {/* 3. Course Import Component */}
      <Card className="border-slate-200">
        <div className="space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-2xl font-extrabold text-slate-900">Import & Publish Custom Course</h2>
            <p className="text-slate-500 text-sm">Upload or paste course JSON definitions</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
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
              className="w-full h-64 px-4 py-3 rounded-2xl border border-slate-200 hover:border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus:outline-none transition-all font-mono text-xs bg-slate-50/50"
              placeholder="Paste your course JSON here..."
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="text-xs font-bold text-slate-400">OR</span>
            <div className="flex-1 border-t border-slate-200"></div>
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
              tactile={true}
              onClick={() => fileInputRef.current?.click()}
            >
              📂 Upload JSON File
            </Button>
          </div>

          <Button
            variant="primary"
            tactile={true}
            onClick={handleValidate}
            disabled={!jsonInput.trim() || state === 'validating'}
            isLoading={state === 'validating'}
          >
            🔍 Validate & Preview
          </Button>

          {validationErrors.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-bold text-red-600">Validation Errors:</p>
              <div className="space-y-1">
                {validationErrors.map((err, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-medium"
                  >
                    <span className="font-bold">{err.path}:</span> {err.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {validatedCourse && (
            <div className="space-y-4 pt-2">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <p className="text-sm font-bold text-emerald-800 mb-2">
                  ✓ Course validated successfully!
                </p>
                <div className="space-y-1 text-xs text-emerald-700 font-medium">
                  <p><span className="font-bold">ID:</span> {validatedCourse.id}</p>
                  <p><span className="font-bold">Title:</span> {validatedCourse.title}</p>
                  {validatedCourse.description && (
                    <p><span className="font-bold">Description:</span> {validatedCourse.description}</p>
                  )}
                  <p><span className="font-bold">Lessons:</span> {validatedCourse.lessons.length}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  variant="success"
                  tactile={true}
                  onClick={handleSaveToDb}
                  disabled={saveStatus === 'saving' || saveStatus === 'success'}
                  isLoading={saveStatus === 'saving'}
                  className="w-full"
                >
                  {saveStatus === 'success' ? 'Saved!' : '🚀 Publish Course to Database'}
                </Button>

                <Button
                  variant="secondary"
                  tactile={true}
                  onClick={handleSaveLocally}
                  className="w-full"
                >
                  💾 Save Locally (Offline)
                </Button>

                {saveStatus === 'error' && saveError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
                    <p className="font-bold">Failed to save course:</p>
                    <p>{saveError}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

