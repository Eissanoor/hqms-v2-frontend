import { Spinner } from "@nextui-org/react";
import axios from "axios";
import dayjs from "dayjs"; // Install dayjs for date comparison
import React, { useEffect, useState } from "react";
import { FaBell, FaClipboardList, FaSearch, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SideNav from "../../components/Sidebar/SideNav";
import { baseUrl } from "../../utils/config";

// Function to check if a date is from a previous day
const isPreviousDay = (registrationDate) => {
  const today = dayjs().startOf("day");
  const regDate = dayjs(registrationDate).startOf("day");
  return regDate.isBefore(today);
};

// Function to get the appropriate card class based on date only
const getCardClass = (registrationDate) => {
  if (isPreviousDay(registrationDate)) {
    return "bg-red-100 border-l-4 border-red-500 hover:shadow-md transition-all duration-200"; 
  }
  return "bg-green-100 border-l-4 border-green-500 hover:shadow-md transition-all duration-200";
};

const PatientMonitoring = () => {
  const [waitingPatients, setWaitingPatients] = useState([]);
  const [nowServing, setNowServing] = useState([]);
  const [nonDischargedPatients, setNonDischargedPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showCalledPatients, setShowCalledPatients] = useState(false);
  const [calledPatients, setCalledPatients] = useState([]);
  const [searchBarcode, setSearchBarcode] = useState("");

  // Fetch data from API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(`${baseUrl}/api/v1/patients/by-state`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        if (response.data.success) {
          setWaitingPatients(response.data.data.waiting || []);
          setNowServing(response.data.data.inProgress || []);
        } else {
          setError("Failed to fetch patient data.");
        }

        // Fetch non-discharged patients
        const nonDischargedResponse = await axios.get(
          `${baseUrl}/api/v1/patients/non-discharged`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (nonDischargedResponse.data.success) {
          setNonDischargedPatients(nonDischargedResponse.data.data || []);
        } else {
          setError("Failed to fetch non-discharged patients.");
        }
      } catch (err) {
        setError("Error fetching data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
    
    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(fetchPatients, 30000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Add new function to fetch called patients
  const fetchCalledPatients = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${baseUrl}/api/v1/patients/called`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (response.data.success) {
        setCalledPatients(response.data.data);
        setShowCalledPatients(true);
      } else {
        setError("Failed to fetch called patients.");
      }
    } catch (err) {
      setError("Error fetching called patients: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeSearch = (e) => {
    if (e.key === 'Enter') {
      // Implement barcode search functionality here
      console.log("Searching for barcode:", searchBarcode);
      // Clear the input after search
      setSearchBarcode("");
    }
  };

  const renderLoadingContent = () => (
    <div className="flex justify-center items-center my-12">
      <Spinner color="success" size="lg" />
    </div>
  );

  return (
    <SideNav>
      <div className="bg-gray-50 min-h-screen p-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaClipboardList className="text-green-600 mr-2" /> 
            Patient Monitoring Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Scan barcode..."
                value={searchBarcode}
                onChange={(e) => setSearchBarcode(e.target.value)}
                onKeyDown={handleBarcodeSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 focus:border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all duration-200 w-64"
              />
            </div>
            <button 
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2"
              onClick={fetchCalledPatients}
            >
              <FaBell /> Called Patients
            </button>
          </div>
        </div>

        {/* Legend for color coding */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-100 border border-red-500 mr-2"></div>
              <span className="text-sm text-gray-700">Previous Day</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-100 border border-green-500 mr-2"></div>
              <span className="text-sm text-gray-700">Today's Patients</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2 pulse-animation"></div>
              <span className="text-sm text-gray-700">Ready to Call</span>
            </div>
          </div>
        </div>

        {/* Called Patients Modal */}
        {showCalledPatients && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-3/4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-green-700 flex items-center">
                  <FaBell className="mr-2" /> Called Patients List
                </h2>
                <button 
                  onClick={() => setShowCalledPatients(false)}
                  className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
              
              {loading ? (
                renderLoadingContent()
              ) : calledPatients.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No called patients found</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {calledPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className={`${getCardClass(patient.registrationDate)} rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer`}
                      onClick={() => window.open(`/Servings/${patient.id}`, '_blank')}
                    >
                      <div className="flex justify-between items-start">
                        <strong className="text-gray-700 text-sm">
                          {patient.department?.deptname ?? "TR"}
                        </strong>
                        <span className={`bg-blue-500 text-white text-xs px-2 py-1 rounded-full ${
                          isPreviousDay(patient.registrationDate) 
                            ? "bg-red-200 text-red-800" 
                            : "bg-green-200 text-green-800"
                        }`}>
                          {isPreviousDay(patient.registrationDate) 
                            ? "Called" 
                            : "Called"}
                        </span>
                      </div>
                      <h3 className="text-blue-600 font-bold text-lg mt-2">{patient.ticketNumber}</h3>
                      <div className="flex items-center mt-2">
                        <FaUser className="text-gray-400 mr-2" />
                        <p className="text-gray-800 font-medium">{patient.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {loading ? (
          renderLoadingContent()
        ) : (
          <>
            {/* Waiting Patients Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-yellow-600 flex items-center">
                  <span className="bg-yellow-100 p-2 rounded-lg mr-2">
                    <FaUser className="text-yellow-600" />
                  </span>
                  WAITING PATIENTS
                </h2>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Total:</span>
                  <span className="bg-yellow-100 text-yellow-800 font-medium px-3 py-1 rounded-full">
                    {waitingPatients.length} patients
                  </span>
                </div>
              </div>
              
              {waitingPatients.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No waiting patients</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {waitingPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className={`${getCardClass(patient.registrationDate)} rounded-lg p-4 cursor-pointer relative`}
                      onClick={() => window.open(`/waiting-area/${patient.id}`, '_blank')}
                    >
                      {/* Call indicator */}
                      {patient.callPatient && (
                        <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full pulse-animation"></div>
                      )}
                      
                      <div className="flex justify-between items-start">
                        <strong className="text-gray-700 text-sm">
                          {patient.department?.deptname || "TR"}
                        </strong>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isPreviousDay(patient.registrationDate) 
                            ? "bg-red-200 text-red-800" 
                            : "bg-green-200 text-green-800"
                        }`}>
                          Waiting
                        </span>
                      </div>
                      
                      <h3 className={`text-lg font-bold mt-2 ${
                        isPreviousDay(patient.registrationDate)
                          ? "text-red-800"
                          : "text-green-800"
                      }`}>{patient.ticketNumber}</h3>
                      
                      <div className="flex items-center mt-2">
                        <FaUser className="text-gray-400 mr-2" />
                        <p className="text-gray-800 font-medium">{patient.name}</p>
                      </div>
                      
                      <div className="mt-2 text-xs text-gray-500">
                        {dayjs(patient.registrationDate).format('MMM D, YYYY h:mm A')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Assigned Patients Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-blue-600 flex items-center">
                  <span className="bg-blue-100 p-2 rounded-lg mr-2">
                    <FaUser className="text-blue-600" />
                  </span>
                  ASSIGNED PATIENTS
                </h2>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Total:</span>
                  <span className="bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-full">
                    {nonDischargedPatients.length} patients
                  </span>
                </div>
              </div>
              
              {nonDischargedPatients.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No assigned patients</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {nonDischargedPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className={`${
                        isPreviousDay(patient.registrationDate)
                          ? "bg-red-100 border-l-4 border-red-500"
                          : "bg-blue-100 border-l-4 border-blue-500"
                      } rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer relative`}
                      onClick={() => window.open(`/Servings/${patient.id}`, '_blank')}
                    >
                      {/* Call indicator */}
                      {patient.callPatient && (
                        <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full pulse-animation"></div>
                      )}
                      
                      <div className="flex justify-between items-start">
                        <strong className="text-gray-700 text-sm">
                          {patient.department?.deptname || "TR"}
                        </strong>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isPreviousDay(patient.registrationDate)
                            ? "bg-red-200 text-red-800"
                            : "bg-green-200 text-green-800"
                        }`}>
                          Assigned
                        </span>
                      </div>
                      
                      <h3 className={`text-lg font-bold mt-2 ${
                        isPreviousDay(patient.registrationDate)
                          ? "text-red-800"
                          : "text-blue-800"
                      }`}>{patient.ticketNumber}</h3>
                      
                      <div className="flex items-center mt-2">
                        <FaUser className="text-gray-400 mr-2" />
                        <p className="text-gray-800 font-medium">{patient.name}</p>
                      </div>
                      
                      <div className="mt-2 text-xs text-gray-500">
                        {dayjs(patient.registrationDate).format('MMM D, YYYY h:mm A')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* CSS for pulse animation */}
      <style jsx>{`
        .pulse-animation {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 6px rgba(22, 163, 74, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(22, 163, 74, 0);
          }
        }
      `}</style>
    </SideNav>
  );
};

export default PatientMonitoring;
