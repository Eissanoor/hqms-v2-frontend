import { Spinner } from "@nextui-org/react";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaBell, FaClock, FaHospital, FaSearch, FaUser } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import SideNav from "../../components/Sidebar/SideNav";
import newRequest from "../../utils/newRequest";

const Departmentmonitoring = () => {
    const [waitingPatients, setWaitingPatients] = useState([]);
    const [inProgressPatients, setInProgressPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCalledPatients, setShowCalledPatients] = useState(false);
    const [calledPatients, setCalledPatients] = useState([]);
    const [departmentName, setDepartmentName] = useState("");
    const [departmentCode, setDepartmentCode] = useState("");
    const [searchBarcode, setSearchBarcode] = useState("");
    const navigate = useNavigate();

    const { id } = useParams();
    
    // Function to check if a date is from a previous day
    const isPreviousDay = (registrationDate) => {
        const today = dayjs().startOf("day");
        const regDate = dayjs(registrationDate).startOf("day");
        return regDate.isBefore(today);
    };
    
    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch patients
                const patientsResponse = await newRequest.get(
                    `api/v1/patients/by-state?deptId=${id}`
                );
                setWaitingPatients(patientsResponse.data.data.waiting || []);
                setInProgressPatients(patientsResponse.data.data.inProgress || []);
                
                // Fetch department details
                const deptResponse = await newRequest.get(`/api/v1/departments/all`);
                const departments = deptResponse?.data?.data || [];
                const department = departments.find(dept => dept.tblDepartmentID === id);
                setDepartmentName(department?.deptname || "Unknown Department");
                setDepartmentCode(department?.deptcode || "");
                
            } catch (err) {
                setError("Error fetching data: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        
        // Set up auto-refresh every 30 seconds
        const intervalId = setInterval(() => fetchData(), 30000);
        
        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [id]);

    const fetchCalledPatients = async () => {
        try {
            setLoading(true);
            const response = await newRequest.get('api/v1/patients/called');
            setCalledPatients(response.data.data || []);
            setShowCalledPatients(true);
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

    // Get card class based on registration date
    const getCardClass = (registrationDate) => {
        if (isPreviousDay(registrationDate)) {
            return "bg-red-100 border-l-4 border-red-500 hover:shadow-md transition-all duration-200";
        }
        return "bg-green-100 border-l-4 border-green-500 hover:shadow-md transition-all duration-200";
    };

    return (
        <SideNav>
            <div className="bg-gray-50 min-h-screen p-6">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex items-center">
                            <button 
                                onClick={() => navigate(-1)}
                                className="p-2 mr-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200"
                            >
                                <FaArrowLeft />
                            </button>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-800 flex items-center">
                                    <FaHospital className="text-green-600 mr-2" /> 
                                    Department Monitoring
                                </h1>
                                <div className="flex items-center mt-1">
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2">
                                        {departmentCode}
                                    </span>
                                    <h2 className="text-lg text-gray-600">{departmentName}</h2>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 w-full lg:w-auto">
                            <div className="relative flex-1 lg:flex-none">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Scan barcode..."
                                    value={searchBarcode}
                                    onChange={(e) => setSearchBarcode(e.target.value)}
                                    onKeyDown={handleBarcodeSearch}
                                    className="pl-10 pr-4 py-2 border border-gray-300 focus:border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all duration-200 w-full lg:w-64"
                                />
                            </div>
                            <button 
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
                                onClick={fetchCalledPatients}
                            >
                                <FaBell /> Called Patients
                            </button>
                        </div>
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
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    isPreviousDay(patient.registrationDate) 
                                                        ? "bg-red-200 text-red-800" 
                                                        : "bg-green-200 text-green-800"
                                                }`}>
                                                    Called
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
                                        <FaClock className="text-yellow-600" />
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
                                            className={`${getCardClass(patient.registrationDate)} rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer relative`}
                                            onClick={() => window.open(`/Servings/${patient.id}`, '_blank')}
                                        >
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

                        {/* In Progress Patients Section */}
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
                                        {inProgressPatients.length} patients
                                    </span>
                                </div>
                            </div>
                            
                            {inProgressPatients.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">No assigned patients</div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {inProgressPatients.map((patient) => (
                                        <div
                                            key={patient.id}
                                            className={`${getCardClass(patient.registrationDate)} rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer relative`}
                                            onClick={() => window.open(`/Servings/${patient.id}`, '_blank')}
                                        >
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
                    </>
                )}
                
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
            </div>
        </SideNav>
    );
};

export default Departmentmonitoring;
