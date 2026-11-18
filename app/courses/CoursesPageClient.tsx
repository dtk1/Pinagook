'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Course, Lesson, SkillCategory, CEFRLevel } from '../../content';
import Card from '../components/Card';
import Button from '../components/Button';

interface CoursesPageClientProps {
  courses: Course[];
  error: string | null;
}

const CEFR_LEVEL_METADATA: Record<
  CEFRLevel,
  {
    title: string;
    subtitle: string;
    icon: string;
    color: string;
    bgBadge: string;
    borderAccent: string;
    desc: string;
  }
> = {
  A1: {
    title: 'A1 Elementary',
    subtitle: 'Beginner Level',
    icon: '🌱',
    color: 'from-emerald-500 to-teal-600',
    bgBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    borderAccent: 'border-l-emerald-500',
    desc: 'Basic grammar rules, present simple forms, daily routines, cafe orders, short personal introductions.',
  },
  A2: {
    title: 'A2 Pre-Intermediate',
    subtitle: 'Elementary / Pre-Int',
    icon: '🚀',
    color: 'from-sky-500 to-blue-600',
    bgBadge: 'bg-sky-100 text-sky-800 border-sky-300',
    borderAccent: 'border-l-sky-500',
    desc: 'Past tenses, comparative forms, travel & airport vocabulary, public announcements, travel blogs.',
  },
  B1: {
    title: 'B1 Intermediate',
    subtitle: 'Intermediate Level',
    icon: '🎯',
    color: 'from-amber-500 to-orange-600',
    bgBadge: 'bg-amber-100 text-amber-800 border-amber-300',
    borderAccent: 'border-l-amber-500',
    desc: 'Used to vs Would, workplace terms, job interview scripts, remote work articles, PET exam cloze.',
  },
  B2: {
    title: 'B2 Upper-Intermediate',
    subtitle: 'Upper-Intermediate',
    icon: '🔥',
    color: 'from-pink-500 to-rose-600',
    bgBadge: 'bg-pink-100 text-pink-800 border-pink-300',
    borderAccent: 'border-l-pink-500',
    desc: 'Conditionals, renewable energy, tech podcast scripts, ethics in robotics, word formation, FCE Cloze.',
  },
  C1: {
    title: 'C1 Advanced',
    subtitle: 'Advanced Level',
    icon: '👑',
    color: 'from-purple-500 to-indigo-600',
    bgBadge: 'bg-purple-100 text-purple-800 border-purple-300',
    borderAccent: 'border-l-purple-500',
    desc: 'Inversion, academic discourse markers, economics lectures, neuroscience literature, CAE transformations.',
  },
};

const SKILL_PARTS: { key: SkillCategory; label: string; icon: string }[] = [
  { key: 'Grammar', label: 'Grammar', icon: '📘' },
  { key: 'Vocabulary', label: 'Vocabulary', icon: '🔤' },
  { key: 'Listening', label: 'Listening', icon: '🎧' },
  { key: 'Reading', label: 'Reading', icon: '📖' },
  { key: 'Use of English', label: 'Use of English', icon: '🧩' },
  { key: 'Writing', label: 'Writing', icon: '✍️' },
  { key: 'Exams', label: 'Exams', icon: '🎓' },
];

export default function CoursesPageClient({ courses, error }: CoursesPageClientProps) {
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | null>(null);
  const [activeSkillCategory, setActiveSkillCategory] = useState<SkillCategory>('Grammar');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all lessons with level metadata
  const allCategorizedLessons = useMemo(() => {
    const list: Array<{
      lesson: Lesson;
      courseId: string;
      level: CEFRLevel;
      category: SkillCategory;
    }> = [];

    courses.forEach((course) => {
      // Determine level from course ID or lesson level
      let courseLevel: CEFRLevel = 'A1';
      if (course.id.includes('-a2')) courseLevel = 'A2';
      else if (course.id.includes('-b1')) courseLevel = 'B1';
      else if (course.id.includes('-b2')) courseLevel = 'B2';
      else if (course.id.includes('-c1')) courseLevel = 'C1';
      else if (course.id.includes('-c2') || course.id.includes('-advanced')) courseLevel = 'C1';

      course.lessons.forEach((lesson) => {
        const lessonLevel = lesson.level || course.level || courseLevel;
        const lessonCategory = lesson.category || course.category || 'Grammar';

        list.push({
          lesson,
          courseId: course.id,
          level: lessonLevel,
          category: lessonCategory,
        });
      });
    });

    return list;
  }, [courses]);

  // Count lessons per level
  const levelCounts = useMemo(() => {
    const counts: Record<CEFRLevel, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0 };
    allCategorizedLessons.forEach((item) => {
      counts[item.level] = (counts[item.level] || 0) + 1;
    });
    return counts;
  }, [allCategorizedLessons]);

  // Filter lessons for the selected level and skill part
  const filteredLessons = useMemo(() => {
    if (!selectedLevel) return [];

    return allCategorizedLessons.filter((item) => {
      if (item.level !== selectedLevel) return false;
      if (item.category !== activeSkillCategory) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = item.lesson.title.toLowerCase().includes(q);
        const descMatch = item.lesson.description?.toLowerCase().includes(q) || false;
        return titleMatch || descMatch;
      }

      return true;
    });
  }, [selectedLevel, activeSkillCategory, searchQuery, allCategorizedLessons]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="max-w-xl mx-auto w-full">
          <Card className="border-rose-500">
            <div className="space-y-4 text-center">
              <h1 className="text-2xl font-extrabold text-rose-600">Failed to load courses</h1>
              <p className="text-slate-600">{error}</p>
              <Button variant="primary" tactile={true} onClick={() => window.location.reload()}>
                Retry Loading
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              🇬🇧 Test-English Complete Curriculum
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              English Learning Hub
            </h1>
            <p className="text-slate-600 text-base sm:text-lg mt-1 max-w-2xl">
              Choose your CEFR Level first, then explore structured parts: Grammar, Vocabulary, Listening, Reading, Use of English, Writing & Exams.
            </p>
            <div className="mt-3">
              <Link
                href="/courses/present-simple-basics"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/80 px-3.5 py-1.5 rounded-xl transition-all"
              >
                <span>🌟</span>
                <span>Interactive Demo: Present Simple Basics &rarr;</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {selectedLevel && (
              <Button
                variant="secondary"
                tactile={true}
                size="s"
                onClick={() => {
                  setSelectedLevel(null);
                  setActiveSkillCategory('Grammar');
                  setSearchQuery('');
                }}
              >
                ← Back to Levels
              </Button>
            )}
            <Link href="/teacher">
              <Button variant="ghost" size="s">
                ⚙️ Teacher Hub
              </Button>
            </Link>
          </div>
        </div>

        {/* STEP 1: LEVEL SELECTION SCREEN */}
        {!selectedLevel && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  1. Select Your CEFR Level
                </h2>
                <p className="text-slate-500 text-sm">
                  Click on any level to access its full parts & lessons
                </p>
              </div>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-200">
                5 Levels Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(['A1', 'A2', 'B1', 'B2', 'C1'] as CEFRLevel[]).map((levelKey) => {
                const meta = CEFR_LEVEL_METADATA[levelKey];
                const count = levelCounts[levelKey] || 0;

                return (
                  <div
                    key={levelKey}
                    onClick={() => {
                      setSelectedLevel(levelKey);
                      setActiveSkillCategory('Grammar');
                      setSearchQuery('');
                    }}
                    className={`group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden ${meta.borderAccent} border-l-8 hover:-translate-y-1`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{meta.icon}</span>
                          <div>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${meta.bgBadge}`}>
                              CEFR {levelKey}
                            </span>
                            <h3 className="text-xl font-black text-slate-900 group-hover:text-sky-600 transition-colors mt-0.5">
                              {meta.title}
                            </h3>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                          {count} {count === 1 ? 'lesson' : 'lessons'}
                        </span>
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed">
                        {meta.desc}
                      </p>

                      <div className="pt-2">
                        <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold text-slate-500">
                          <span className="bg-slate-100 px-2 py-0.5 rounded">Grammar</span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded">Vocabulary</span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded">Listening</span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded">Reading</span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded">Use of English</span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded">Writing</span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded">Exams</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Explore Level {levelKey} &rarr;
                      </span>
                      <Button variant="primary" tactile={true} size="s">
                        Open Level 🚀
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: INSIDE A LEVEL (PARTS & LESSONS VIEW) */}
        {selectedLevel && (
          <div className="space-y-6 animate-fadeIn">
            {/* Level Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{CEFR_LEVEL_METADATA[selectedLevel].icon}</span>
                  <div>
                    <span className="px-3 py-1 bg-sky-500 text-white rounded-full text-xs font-black uppercase tracking-widest">
                      Level {selectedLevel}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black mt-1">
                      {CEFR_LEVEL_METADATA[selectedLevel].title}
                    </h2>
                  </div>
                </div>
                <p className="text-slate-300 text-sm max-w-2xl">
                  {CEFR_LEVEL_METADATA[selectedLevel].desc}
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 self-start md:self-auto">
                <span className="text-2xl">📚</span>
                <div>
                  <div className="text-xs text-slate-300 font-medium">Total Lessons</div>
                  <div className="text-lg font-black text-white">{filteredLessons.length} Parts Available</div>
                </div>
              </div>
            </div>

            {/* SKILL PARTS NAVIGATION TAB BAR (MATCHING USER SCREENSHOT) */}
            <div className="bg-white rounded-3xl p-3 border border-slate-200/80 shadow-sm space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 pt-1">
                Select Part / Skill Category:
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 px-1 scrollbar-none">
                {SKILL_PARTS.map((part) => {
                  const isActive = activeSkillCategory === part.key;
                  return (
                    <button
                      key={part.key}
                      onClick={() => setActiveSkillCategory(part.key)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 scale-[1.02]'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
                      }`}
                    >
                      <span>{part.icon}</span>
                      <span>{part.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Search filter bar */}
              <div className="pt-2 border-t border-slate-100 px-2 flex items-center gap-3">
                <span className="text-slate-400 text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Search topics, tenses, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-slate-400 hover:text-slate-600 font-bold px-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* LESSONS BENTO GRID */}
            {filteredLessons.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
                <div className="text-4xl">🔍</div>
                <h3 className="text-xl font-bold text-slate-900">No lessons found</h3>
                <p className="text-slate-500 text-sm">
                  No parts match the selected category &quot;{activeSkillCategory}&quot; or search query.
                </p>
                <Button
                  variant="secondary"
                  size="s"
                  onClick={() => {
                    setActiveSkillCategory('Grammar');
                    setSearchQuery('');
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLessons.map(({ lesson, courseId, category }) => {
                  const stepCount = lesson.steps.length;

                  return (
                    <div
                      key={lesson.id}
                      className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group hover:border-sky-300"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 bg-sky-50 text-sky-700 border border-sky-200/70 rounded-full text-xs font-bold inline-flex items-center gap-1.5">
                            <span>
                              {category === 'Grammar' && '📘'}
                              {category === 'Vocabulary' && '🔤'}
                              {category === 'Listening' && '🎧'}
                              {category === 'Reading' && '📖'}
                              {category === 'Use of English' && '🧩'}
                              {category === 'Writing' && '✍️'}
                              {category === 'Exams' && '🎓'}
                            </span>
                            <span>{category}</span>
                          </span>

                          <span className="text-xs font-semibold text-slate-400">
                            {stepCount} {stepCount === 1 ? 'step' : 'steps'}
                          </span>
                        </div>

                        <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors leading-snug">
                          {lesson.title}
                        </h3>

                        {lesson.description && (
                          <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                            {lesson.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                        <span className="text-xs text-slate-400 font-medium">
                          ⏱ ~10 mins
                        </span>

                        <Link href={`/courses/${courseId}/lessons/${lesson.id}`}>
                          <Button variant="primary" tactile={true} size="s">
                            Start Practice 🚀
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
