'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl, AUDIT_SESSION_KEY } from '@/lib/api';

interface School {
  school_name: string;
}

interface Major {
  major_name: string;
}

interface CourseInput {
  course_name: string;
  community_college: string;
}
// Implement json fetching from database
async function fetchJsonList<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url);
    const data: unknown = await res.json();
    if (!res.ok || !Array.isArray(data)) {
      if (!res.ok) {
        console.error('API error', res.status, data);
      } else {
        console.error('Expected JSON array from', url, data);
      }
      return [];
    }
    return data as T[];
  } catch (err) {
    console.error('Fetch failed', url, err);
    return [];
  }
}

export default function Form() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');
  const [coursesText, setCoursesText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Fetch schools
  useEffect(() => {
    let cancelled = false;
    fetchJsonList<School>(apiUrl('/api/v1/schools')).then((list) => {
      if (!cancelled) setSchools(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch majors for selected school
  useEffect(() => {
    if (!selectedSchool) {
      setMajors([]);
      return;
    }
    let cancelled = false;
    fetchJsonList<Major>(
      apiUrl(`/api/v1/majors?school_name=${encodeURIComponent(selectedSchool)}`)
    ).then((list) => {
      if (!cancelled) setMajors(list);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedSchool]);

  const handleSubmit = async () => {
    if (!selectedSchool || !selectedMajor || !coursesText.trim()) return;

    setLoading(true);
    try {
      const coursesLines = coursesText.split('\n').map(line => line.trim()).filter(Boolean);
      const courses = coursesLines.map(course => ({
        course_name: course,
        community_college: selectedSchool
      }));
      // Get api request 
      const response = await fetch(apiUrl('/api/v1/audits/generate'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          school_name: selectedSchool,
          major_name: selectedMajor,
          courses_entered: courses
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const auditResult = await response.json();
      setResult(auditResult);
      try {
        sessionStorage.setItem(AUDIT_SESSION_KEY, JSON.stringify(auditResult));
      } catch {
        /* ignore quota / private mode */
      }
      router.push('/audit');
    } catch (error) {
      console.error('Audit error:', error);
      setResult({ error: 'Failed to generate audit. Check console.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="pb-20 relative flex-grow">
        <section id="top-of-form"></section>
        <h1 className="text-4xl text-center py-8">Student Info Form</h1>

        <div className="absolute inset-y-20 left-1/2 -translate-x-1/2 w-[800px] bg-gray-200 border-3 border-gray-400 rounded-lg p-8 shadow-xl">
          <div className="flex flex-col items-center space-y-6">
            
            {/* School Selection */}
            <div>
              <label className="text-2xl block mb-2">Enter Your School:</label>
              <input 
                className="border-2 border-black rounded-lg p-3 w-96 text-lg"
                list="schools-list"
                placeholder="Type school name..."
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
              />
              <datalist id="schools-list">
                {schools.map((school, index) => (
                  <option key={index} value={school.school_name} />
                ))}
              </datalist>
            </div>

            {/* Major Selection */}
            <div>
              <label className="text-2xl block mb-2">Enter Your Major:</label>
              <input 
                className="border-2 border-black rounded-lg p-3 w-96 text-lg"
                list="majors-list"
                placeholder="Type major name..."
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
              />
              <datalist id="majors-list">
                {majors.map((major, index) => (
                  <option key={index} value={major.major_name} />
                ))}
              </datalist>
            </div>

            {/* Courses Input */}
            <div className="w-full max-w-md">
              <label className="text-2xl block mb-2">Courses Taken (one per line):</label>
              <textarea 
                className="border-2 border-black rounded-lg p-3 w-full h-32 text-lg resize-none"
                placeholder="Example:
MATH 150
CS 135
ENGL 101"
                value={coursesText}
                onChange={(e) => setCoursesText(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              className="rounded-full bg-[#97da9bff] text-black text-2xl px-24 py-6 hover:bg-green-200 hover:shadow-lg transition-all duration-200 font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={loading || !selectedSchool || !selectedMajor || !coursesText.trim()}
            >
              {loading ? 'Generating Audit...' : 'Generate Degree Audit'}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="p-8 max-w-6xl mx-auto mt-12">
            <h2 className="text-4xl font-bold mb-6 text-center text-green-800">Degree Audit Results</h2>
            {result.error ? (
              <div className="bg-red-100 border-2 border-red-400 p-6 rounded-lg">
                <p className="text-xl text-red-800">{result.error}</p>
              </div>
            ) : (
              <pre className="bg-white border-2 border-green-400 p-6 rounded-lg shadow-xl overflow-auto max-h-96 text-sm font-mono">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>  
    </div>
  );
}
