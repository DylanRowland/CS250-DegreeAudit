'use client';

import TopBar from '../components/TopBar';

/* Sample Data */

const sampleData = {
  chosen_major: "Computer Science",

  completed_courses: [
    {
      cc_course_name: "CSIS 101",
      sdsu_course_name: "CS 150",
      units: 3,
      is_transferable: true,
    },
    {
      cc_course_name: "MATH 180",
      sdsu_course_name: "MATH 150",
      units: 4,
      is_transferable: true,
    },
  ],

  uncompleted_courses: [
    {
      cc_course_name: "CSIS 250",
      sdsu_course_name: "CS 210",
      units: 3,
      is_transferable: true,
    },
    {
      cc_course_name: "CSIS 293",
      sdsu_course_name: "CS 250",
      units: 3,
      is_transferable: true,
    },
  ],

  total_units_completed: 7,
  total_units_required: 120,
};

/* Component */

export default function AuditPage() {

  const completedUnits = sampleData.total_units_completed;
  const totalUnits = sampleData.total_units_required;

  const progress =
    totalUnits > 0 ? (completedUnits / totalUnits) * 100 : 0;

  return (
    <div className="min-h-screen relative">
      <TopBar />

      <div className = "absolute inset-y-13 left-1/2 -translate-x-1/2 w-[1100px] bg-gray-200 border-3 border-gray-400 -z-10"></div>

      <div className="p-10 max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-10 text-center">
          Degree Evaluation
        </h1>

        {/* Progress */}
        <div className="bg-blue-100 p-6 rounded-xl shadow text-center mb-16">
          <h2 className="text-2xl font-semibold mb-4">
            Progress
          </h2>

          <p className="text-lg mb-2">
            {completedUnits} / {totalUnits} Units Completed
          </p>

          <p className="mb-4">
            {progress.toFixed(1)}% Complete
          </p>

          <div className="w-full bg-red-200 h-4 rounded-full">
            <div
              className="bg-green-600 h-4 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Major */}
        <h2 className="text-2xl font-semibold mb-6">
          Major: {sampleData.chosen_major}
        </h2>

        <h2 className="text-2xl font-semibold mb-6">
          (Commmunity College Course) → (San Diego State University Course)
        </h2>

        {/* Completed Courses */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-700">
            Completed Courses
          </h2>

          <div className="bg-white p-6 rounded-xl shadow">
            {sampleData.completed_courses.map((course, index) => (
              <div key={index} className="mb-2">
                ✅ {course.cc_course_name} → {course.sdsu_course_name} ({course.units} units)
              </div>
            ))}
          </div>
        </div>

        {/* Remaining Courses */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-red-700">
            Remaining Requirements
          </h2>

          <div className="bg-white p-6 rounded-xl shadow">
            {sampleData.uncompleted_courses.map((course, index) => (
              <div key={index} className="mb-2">
                ❌ {course.cc_course_name} → {course.sdsu_course_name} ({course.units} units)
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}