import React from "react";

const Dashboard = () => {
  return (
    
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <button className="text-xl font-bold">&#9776;</button>
          <h1 className="text-blue-600 font-bold text-2xl">
            Que System KPI Dashboard
          </h1>
        </div>
      </header>

      {/* Filters */}
      <div className="container mx-auto py-4 px-6 bg-white shadow-md rounded-lg mt-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex space-x-2">
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Today
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              This Week
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              This Month
            </button>
          </div>
          <div className="flex space-x-2 items-center">
            <input
              type="text"
              placeholder="dd/mm/yyyy"
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="dd/mm/yyyy"
              className="border rounded px-3 py-2 text-sm"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="container mx-auto py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Clinic Assignment */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Clinic Assignment</h2>
          <div className="flex justify-center items-center">
            <div className="w-32 h-32 rounded-full bg-gray-200"></div>
          </div>
        </div>

        {/* Category */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Category</h2>
          <div className="w-full h-32 bg-gray-200"></div>
        </div>

        {/* Number of Patients */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">
            Number of Patients for the Last 7 Days
          </h2>
          <div className="w-full h-32 bg-gray-200"></div>
        </div>

        {/* Time from Eyeball to TRIAGE */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">
            Time from Eyeball to TRIAGE
          </h2>
          <div className="w-full h-32 bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
