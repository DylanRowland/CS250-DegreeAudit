'use client';

import TopBar from '../components/TopBar';

export default function AuditPage() {

  const completedUnits = 0;
  const totalUnits = 0;

  return (
    <div className="min-h-screen bg-zinc-50">
      <TopBar />

      <div className="p-10 max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-10 text-center">
          Degree Evaluation
        </h1>

        {/* Summary of Progress */}
        <div className="bg-blue-100 p-6 rounded-xl shadow text-center mb-16">

            <h2 className="text-2xl font-semibold mb-4">
                Progress
            </h2>

            <p className="text-lg mb-4">
                {completedUnits} / {totalUnits} Units Completed
            </p>

        <div className="w-full bg-red-200 h-4 rounded-full">

            <div
            className="bg-green-600 h-4 rounded-full"
            style={{ width: `${(completedUnits / totalUnits) * 100}%` }}
            ></div>

        </div>
        </div>

        <h2 className="text-2xl font-semibold mb-6">
            Major: 
        </h2>

        {/* General Education */}
        <div className="mb-10">

        <h2 className="text-2xl font-semibold mb-4">
            General Education
        </h2>

        <div className="bg-white p-6 rounded-xl shadow"> 
        </div>

        </div>

        {/* Major Requirements */}
        <div className="mb-10">

        <h2 className="text-2xl font-semibold mb-4">
            Major Requirements
        </h2>

        <div className="bg-white p-6 rounded-xl shadow">
        </div>

        </div>
      </div>
    </div>
  );
}