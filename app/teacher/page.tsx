'use client';

import { useState, useRef } from 'react';
import { loadCourseFromJson, Course } from '../../content';
import { saveStoredCourse } from '../features/course-storage/courseStorage';
import Card from '../components/Card';
import Button from '../components/Button';

type ValidationError = {
  path: string;
  message: string;
};

type PageState = 'idle' | 'validating' | 'valid' | 'error';

export default function TeacherPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [validatedCourse, setValidatedCourse] = useState<Course | null>(null);
  const [state, setState] = useState<PageState>('idle');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
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
    if (!jsonInput.trim()) {
      setValidationErrors([{
        path: 'json',
        message: 'Please paste or upload a JSON file.',
      }]);
      setState('error');
      setValidatedCourse(null);
      return;
    }

    setState('validating');
    setValidationErrors([]);
    setValidatedCourse(null);
    setSaveStatus('idle');

    try {
      // Parse JSON
      let parsed: unknown;
      try {
        parsed = JSON.parse(jsonInput);
      } catch (parseError) {
        throw new Error(`Invalid JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }

      // Validate using existing validation
      const course = loadCourseFromJson(parsed);
      
      setValidatedCourse(course);
      setState('valid');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';
      
      // Try to extract path from error message
      const pathMatch = errorMessage.match(/(?:Course|Lesson|Step)\s+([^:]+):/);
      const path = pathMatch ? pathMatch[1] : 'root';
      
      setValidationErrors([{
        path,
        message: errorMessage,
      }]);
      setState('error');
      setValidatedCourse(null);
    }
  };

  const handleSave = () => {
    if (!validatedCourse) return;

    setSaveStatus('saving');
    
    const success = saveStoredCourse(
      validatedCourse.id,
      validatedCourse.title,
      jsonInput
    );

    if (success) {
      setSaveStatus('success');
      // Clear form after successful save
      setTimeout(() => {
        setJsonInput('');
        setValidatedCourse(null);
        setState('idle');
        setSaveStatus('idle');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 2000);
    } else {
      setSaveStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0F172A] mb-2">Import Course</h1>
          <p className="text-[#475569] text-lg">Upload or paste a course JSON file to validate and save it</p>
        </div>

        <div className="space-y-6">
          {/* Upload Section */}
          <Card>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-2">
                  Upload JSON File
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-[#475569] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#0EA5B7] file:text-white hover:file:bg-[#0B8A99] file:cursor-pointer"
                />
                <p className="mt-2 text-xs text-[#94A3B8]">Maximum file size: 5MB</p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E6EEF2]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-[#94A3B8]">or</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#475569] mb-2">
                  Paste JSON
                </label>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="Paste your course JSON here..."
                  className="w-full h-64 px-4 py-3 rounded-xl border border-[#E6EEF2] focus:border-[#0EA5B7] focus:ring-2 focus:ring-[#0EA5B7]/20 focus:outline-none font-mono text-sm resize-none"
                />
              </div>

              <Button
                variant="primary"
                onClick={handleValidate}
                isLoading={state === 'validating'}
                className="w-full"
              >
                Validate & Preview
              </Button>
            </div>
          </Card>

          {/* Validation Errors */}
          {state === 'error' && validationErrors.length > 0 && (
            <Card className="border-[#EF4444]">
              <h2 className="text-xl font-semibold text-[#EF4444] mb-4">Validation Errors</h2>
              <div className="space-y-2">
                {validationErrors.map((error, index) => (
                  <div key={index} className="p-3 bg-[#FEE2E2] rounded-lg">
                    <div className="text-sm font-medium text-[#EF4444] mb-1">
                      {error.path !== 'root' ? `Path: ${error.path}` : 'Root'}
                    </div>
                    <div className="text-sm text-[#DC2626]">{error.message}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Preview Section */}
          {state === 'valid' && validatedCourse && (
            <Card>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-[#0F172A] mb-4">Course Preview</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-[#475569] mb-1">Course ID</div>
                      <div className="text-lg text-[#0F172A] font-mono">{validatedCourse.id}</div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-[#475569] mb-1">Title</div>
                      <div className="text-lg text-[#0F172A]">{validatedCourse.title}</div>
                    </div>

                    {validatedCourse.description && (
                      <div>
                        <div className="text-sm font-medium text-[#475569] mb-1">Description</div>
                        <div className="text-[#475569]">{validatedCourse.description}</div>
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-medium text-[#475569] mb-1">Lessons</div>
                      <div className="text-lg text-[#0F172A]">{validatedCourse.lessons.length} lesson{validatedCourse.lessons.length !== 1 ? 's' : ''}</div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-[#475569] mb-3">Lesson List</div>
                      <div className="space-y-2">
                        {validatedCourse.lessons.map((lesson, index) => (
                          <div key={lesson.id} className="p-3 bg-[#F7FAFC] rounded-lg border border-[#E6EEF2]">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#D9F6F8] text-[#0EA5B7] font-semibold text-xs">
                                {index + 1}
                              </span>
                              <div className="flex-1">
                                <div className="font-medium text-[#0F172A]">{lesson.title}</div>
                                <div className="text-sm text-[#475569]">
                                  {lesson.steps.length} step{lesson.steps.length !== 1 ? 's' : ''}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E6EEF2]">
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    isLoading={saveStatus === 'saving'}
                    disabled={saveStatus === 'success'}
                    className="w-full"
                  >
                    {saveStatus === 'success' ? '✓ Saved Successfully' : 'Save Locally'}
                  </Button>
                  {saveStatus === 'error' && (
                    <p className="mt-2 text-sm text-[#EF4444] text-center">
                      Failed to save course. Please try again.
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

