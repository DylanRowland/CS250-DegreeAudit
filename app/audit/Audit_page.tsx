'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TopBar from '../components/TopBar';
import { AUDIT_SESSION_KEY } from '@/lib/api';
// definitions for the audit data
type CourseEquivalencyRow = {
  cc_course_name: string;
  sdsu_course_name: string;
  units: number;
  is_transferable: boolean;
};

// definition for the audit payload
type DegreeEvalPayload = {
  chosen_major: string;
  chosen_school?: { school_name: string };
  completed_courses: CourseEquivalencyRow[];
  uncompleted_courses: CourseEquivalencyRow[];
  total_units_completed: number;
  total_units_remaining?: number;
  total_units_required: number;
};

// Normalizes the course row
function normalizeCourseRow(raw: unknown): CourseEquivalencyRow | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const cc = o.cc_course_name;
  const sdsu = o.sdsu_course_name;
  if (typeof cc !== 'string' || typeof sdsu !== 'string') return null;
  const units = typeof o.units === 'number' ? o.units : Number(o.units) || 0;
  const is_transferable =
    typeof o.is_transferable === 'boolean' ? o.is_transferable : true;
  return { cc_course_name: cc, sdsu_course_name: sdsu, units, is_transferable };
}

// Main component for the audit page
export default function AuditPage() {
  const [data, setData] = useState<DegreeEvalPayload | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(AUDIT_SESSION_KEY);
      if (!raw) {
        setData(null);
        return;
      }
      const parsed = JSON.parse(raw) as unknown;
      if (!parsed || typeof parsed !== 'object') {
        setLoadError('Invalid saved audit data.');
        return;
      }
      const p = parsed as Record<string, unknown>;
      const chosen_major =
        typeof p.chosen_major === 'string' ? p.chosen_major : '';
      const completed = Array.isArray(p.completed_courses)
        ? p.completed_courses
            .map(normalizeCourseRow)
            .filter((x): x is CourseEquivalencyRow => x !== null)
        : [];
      const uncompleted = Array.isArray(p.uncompleted_courses)
        ? p.uncompleted_courses
            .map(normalizeCourseRow)
            .filter((x): x is CourseEquivalencyRow => x !== null)
        : [];
      const total_units_completed =
        typeof p.total_units_completed === 'number'
          ? p.total_units_completed
          : Number(p.total_units_completed) || 0;
      const total_units_required =
        typeof p.total_units_required === 'number'
          ? p.total_units_required
          : Number(p.total_units_required) || 0;
      const total_units_remaining =
        typeof p.total_units_remaining === 'number'
          ? p.total_units_remaining
          : Number(p.total_units_remaining);

      let chosen_school: DegreeEvalPayload['chosen_school'];
      if (
        p.chosen_school &&
        typeof p.chosen_school === 'object' &&
        typeof (p.chosen_school as { school_name?: unknown }).school_name ===
          'string'
      ) {
        chosen_school = {
          school_name: (p.chosen_school as { school_name: string })
            .school_name,
        };
      }

      setData({
        chosen_major,
        chosen_school,
        completed_courses: completed,
        uncompleted_courses: uncompleted,
        total_units_completed,
        total_units_remaining: Number.isFinite(total_units_remaining)
          ? total_units_remaining
          : undefined,
        total_units_required,
      });
      setLoadError(null);
    } catch {
      setLoadError('Could not read audit from this browser session.');
    }
  }, []);

  if (loadError) {
    return (
      <div className="min-h-screen relative">
        <TopBar />
        <div className="p-10 max-w-5xl mx-auto text-center">
          <p className="text-lg text-red-700 mb-6">{loadError}</p>
          <Link
            href="/form"
            className="rounded-full bg-[#97da9bff] text-black px-8 py-3 hover:bg-green-200"
          >
            Back to form
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen relative">
        <TopBar />
        <div className="p-10 max-w-5xl mx-auto text-center">
          <h1 className="text-3xl font-semibold mb-4">Degree evaluation</h1>
          <p className="text-zinc-600 mb-8">
            No audit yet. Generate one from the student form and you will be
            redirected here with your results.
          </p>
          <Link
            href="/form"
            className="rounded-full bg-[#97da9bff] text-black px-8 py-3 hover:bg-green-200"
          >
            Go to form
          </Link>
        </div>
      </div>
    );
  }

  const completedUnits = data.total_units_completed;
  const totalUnits = data.total_units_required;
  const progress =
    totalUnits > 0 ? (completedUnits / totalUnits) * 100 : 0;

  return (
    <div className="min-h-screen relative">
      <TopBar />

      <div className="absolute inset-y-13 left-1/2 -translate-x-1/2 w-[1100px] bg-gray-200 border-3 border-gray-400 -z-10"></div>

      <div className="p-10 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center">
          Degree Evaluation
        </h1>

        <div className="bg-blue-100 p-6 rounded-xl shadow text-center mb-16">
          <h2 className="text-2xl font-semibold mb-4">Progress</h2>

          <p className="text-lg mb-2">
            {completedUnits} / {totalUnits} Units Completed
          </p>

          {data.total_units_remaining !== undefined && (
            <p className="text-base mb-2 text-zinc-700">
              Remaining (toward requirements total):{' '}
              {data.total_units_remaining.toFixed(1)}
            </p>
          )}

          <p className="mb-4">{progress.toFixed(1)}% Complete</p>

          <div className="w-full bg-red-200 h-4 rounded-full">
            <div
              className="bg-green-600 h-4 rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-2">Major: {data.chosen_major}</h2>
        {data.chosen_school && (
          <p className="text-lg text-zinc-600 mb-6">
            School: {data.chosen_school.school_name}
          </p>
        )}

        <h2 className="text-2xl font-semibold mb-6">
          (Community college course) → (SDSU course)
        </h2>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-700">
            Completed courses
          </h2>

          <div className="bg-white p-6 rounded-xl shadow">
            {data.completed_courses.length === 0 ? (
              <p className="text-zinc-500">None listed.</p>
            ) : (
              data.completed_courses.map((course, index) => (
                <div key={index} className="mb-2">
                  {course.is_transferable ? '✅' : '⚠️'}{' '}
                  {course.cc_course_name} → {course.sdsu_course_name} (
                  {course.units} units)
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-red-700">
            Remaining requirements
          </h2>

          <div className="bg-white p-6 rounded-xl shadow">
            {data.uncompleted_courses.length === 0 ? (
              <p className="text-zinc-500">
                {data.total_units_required > 0
                  ? 'None — all listed major requirements are satisfied.'
                  : 'No major requirement list is available for this program in the catalog yet. Completed courses above still show how your classes map to SDSU equivalents.'}
              </p>
            ) : (
              data.uncompleted_courses.map((course, index) => (
                <div key={index} className="mb-2">
                  ❌ {course.cc_course_name} → {course.sdsu_course_name} (
                  {course.units} units)
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="text-center">
          <Link
            href="/form"
            className="inline-block rounded-full bg-black text-white px-8 py-3 hover:bg-gray-800"
          >
            New audit
          </Link>
        </div>
      </div>
    </div>
  );
}
