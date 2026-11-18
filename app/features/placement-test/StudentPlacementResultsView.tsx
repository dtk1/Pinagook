'use client';

import { useState } from 'react';
import { PlacementResult } from './types';
import { getAllPlacementResultsLocally, savePlacementResultLocally } from './placementStorage';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

export default function StudentPlacementResultsView() {
  const [results, setResults] = useState<PlacementResult[]>(() => {
    if (typeof window !== 'undefined') {
      return getAllPlacementResultsLocally();
    }
    return [];
  });
  const [searchTerm, setSearchTerm] = useState('');

  const refreshResults = () => {
    const loaded = getAllPlacementResultsLocally();
    setResults(loaded);
  };

  const seedDemoStudentResult = () => {
    const demoResults: PlacementResult[] = [
      {
        id: 'pr_demo_1',
        studentEmail: 'maria.student@gmail.com',
        studentName: 'Maria Ivanova',
        scorePercent: 75,
        correctCount: 9,
        totalQuestions: 12,
        cefrLevel: 'B2',
        categoryScores: {
          Grammar: { correct: 3, total: 4 },
          Vocabulary: { correct: 3, total: 4 },
          'Reading & Usage': { correct: 3, total: 4 },
        },
        completedAt: Date.now() - 3600000 * 2,
      },
      {
        id: 'pr_demo_2',
        studentEmail: 'john.doe@example.com',
        studentName: 'John Doe',
        scorePercent: 92,
        correctCount: 11,
        totalQuestions: 12,
        cefrLevel: 'C2',
        categoryScores: {
          Grammar: { correct: 4, total: 4 },
          Vocabulary: { correct: 4, total: 4 },
          'Reading & Usage': { correct: 3, total: 4 },
        },
        completedAt: Date.now() - 3600000 * 24,
      },
      {
        id: 'pr_demo_3',
        studentEmail: 'anna.smirnova@mail.ru',
        studentName: 'Anna Smirnova',
        scorePercent: 42,
        correctCount: 5,
        totalQuestions: 12,
        cefrLevel: 'A2',
        categoryScores: {
          Grammar: { correct: 2, total: 4 },
          Vocabulary: { correct: 2, total: 4 },
          'Reading & Usage': { correct: 1, total: 4 },
        },
        completedAt: Date.now() - 3600000 * 48,
      },
    ];

    demoResults.forEach(savePlacementResultLocally);
    refreshResults();
  };

  const filtered = results.filter(
    (r) =>
      r.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.studentName && r.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.cefrLevel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cefrBadgeVariants: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
    A1: 'default',
    A2: 'warning',
    B1: 'info',
    B2: 'info',
    C1: 'success',
    C2: 'success',
  };

  return (
    <Card className="p-6 space-y-6 border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
            🎓 Student Placement Results
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Student CEFR Assessment Results
          </h2>
          <p className="text-slate-600 text-sm">
            View test scores and assigned CEFR levels (A1-C2) for all tested students.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" size="s" tactile={true} onClick={seedDemoStudentResult}>
            + Add Demo Students
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by student email, name, or level (A1, B2...)"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
        />
      </div>

      {/* Results Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="font-semibold text-base">No student placement test results yet.</p>
          <p className="text-xs text-slate-400 mt-1">
            Students can take the test at <code className="bg-slate-200 px-1 rounded">/placement-test</code> or click &quot;+ Add Demo Students&quot; above.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                <th className="pb-3 px-2">Student</th>
                <th className="pb-3 px-2">CEFR Level</th>
                <th className="pb-3 px-2">Score</th>
                <th className="pb-3 px-2">Category Breakdown</th>
                <th className="pb-3 px-2 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-800">
              {filtered.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-2">
                    <div className="font-bold text-slate-900">{res.studentName || 'Student'}</div>
                    <div className="text-xs text-slate-500">{res.studentEmail}</div>
                  </td>
                  <td className="py-4 px-2">
                    <Badge variant={cefrBadgeVariants[res.cefrLevel] || 'info'} className="font-extrabold px-3 py-1 text-sm">
                      {res.cefrLevel} Level
                    </Badge>
                  </td>
                  <td className="py-4 px-2">
                    <span className="font-bold text-slate-900">{res.scorePercent}%</span>
                    <span className="text-xs text-slate-500 ml-1">
                      ({res.correctCount}/{res.totalQuestions})
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex gap-2 text-xs">
                      {Object.entries(res.categoryScores).map(([cat, s]) => (
                        <span key={cat} className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">
                          {cat.split(' ')[0]}: {s.correct}/{s.total}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right text-xs text-slate-400">
                    {new Date(res.completedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
