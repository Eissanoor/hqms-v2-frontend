import React, { useState } from "react";
import SideNav from "../../components/Sidebar/SideNav";
import AssignLocation from "../../components/AssignLocation/AssignLocation";

const LocationAssignment = () => { 
   const [isAssignLocation, setAssignLocation] = useState(false);
  return (
    <>
      <SideNav>
        <div className="min-h-screen bg-green-100 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-green-700 text-xl font-bold">EB TN # 5</h1>
            <p className="text-gray-600">01/11/2016 08:45:47</p>
          </div>

          {/* Form */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            {/* <form> */}
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Patient Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Patient Name"
                  className="w-full border border-green-500 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Nationality
                </label>
                <select className="w-full border border-green-500 rounded px-3 py-2">
                  <option value="Saudi">Saudi</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Mobile Number
                </label>
                <input
                  type="text"
                  placeholder="Enter Mobile Number"
                  className="w-full border border-green-500 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  ID Number
                </label>
                <input
                  type="text"
                  placeholder="Enter ID Number"
                  className="w-full border border-green-500 rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Age
                </label>
                <input
                  type="text"
                  placeholder="Enter Age"
                  className="w-full border border-green-500 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Sex
                </label>
                <input
                  type="text"
                  placeholder="Enter Sex"
                  className="w-full border border-green-500 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Chief Complaint
                </label>
                <input
                  type="text"
                  placeholder="Enter Chief Complaint"
                  className="w-full border border-green-500 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Category
                </label>
                <select className="w-full border border-green-500 rounded px-3 py-2">
                  <option>Select</option>
                </select>
              </div>
            </div>

            {/* Vital Sign */}
            <div className="mb-4">
              <h2 className="text-green-700 font-semibold mb-2">Vital Sign</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    BP
                  </label>
                  <input
                    type="text"
                    placeholder="Enter BP"
                    className="w-full border border-green-500 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    RR
                  </label>
                  <input
                    type="text"
                    placeholder="Enter RR"
                    className="w-full border border-green-500 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Height
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Height"
                    className="w-full border border-green-500 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Weight
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Weight"
                    className="w-full border border-green-500 rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Allergies */}
            <div className="mb-4">
              <h2 className="text-green-700 font-semibold mb-2">Allergies</h2>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="allergies"
                    className="form-radio text-orange-500"
                  />
                  <span className="ml-2">YES</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="allergies"
                    className="form-radio text-orange-500"
                  />
                  <span className="ml-2">NO</span>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6">
              <button className="bg-yellow-500 text-white font-semibold py-2 rounded hover:bg-yellow-600">
                Call Patient
              </button>
              <button
                className="bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600"
                onClick={() => setAssignLocation(true)}
              >
                Assign
              </button>
              <button className="bg-green-500 text-white font-semibold py-2 rounded hover:bg-green-600">
                Save
              </button>
              <button className="bg-gray-700 text-white font-semibold py-2 rounded hover:bg-gray-800">
                Re-Print
              </button>
              <button className="bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600">
                Void
              </button>
              <button className="bg-orange-500 text-white font-semibold py-2 rounded hover:bg-orange-600">
                Close
              </button>
            </div>
            {/* </form> */}
          </div>
        </div>
       
        {isAssignLocation && (
          <AssignLocation
            isVisible={isAssignLocation}
            setVisibility={() => setAssignLocation(false)}
          />
        )}
      </SideNav>
    </>
  );
};

export default LocationAssignment;
