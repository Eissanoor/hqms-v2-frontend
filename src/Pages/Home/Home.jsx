import { Button, Spinner as NextUISpinner } from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronRight, FaDoorOpen, FaUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import SideNav from "../../components/Sidebar/SideNav";
import Beds from "../../Images/Beds.jpg";
import CentralWaitingArea from "../../Images/Central Waiting Area.png";
import Department from "../../Images/Department.png";
import KPI from "../../Images/KPI.png";
import LocationAssignment from "../../Images/Location Assignment.png";
import MasterData from "../../Images/masterdata.png";
import PatientJourneyicon from "../../Images/PatientJourneyicon.png";
import Registration from "../../Images/Registration.png";
import Rolesicon from "../../Images/Roles.png";
import TVscreeen from "../../Images/TV screen.jpg";
import Usersicon from "../../Images/users.png";
import { baseUrl } from "../../utils/config";

const Home = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [userRoles, setUserRoles] = useState([]);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedItem, setExpandedItem] = useState(null);
    const [todayStats, setTodayStats] = useState({
        waitingPatients: 0,
        calledPatients: 0,
        assignedPatients: 0,
        dischargedPatients: 0
    });

    const sidebarItems = [
        {
            id: 'registered',
            label: `${t("Registered Patients")}`,
            path: "/patient-table",
            icon: (
                <img
                    src={Registration}
                    alt="Registered Patients"
                    className="w-16 h-16 object-contain"
                />
            ),
            description: "Register new patients and manage patient information",
            requiredRole: "Registered Patients",
            color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
            borderColor: "border-l-4 border-blue-500",
            iconBg: "bg-blue-100"
        },
        {
            id: 'triage',
            label: `${t("Triage Waiting List")}`,
            path: "/monitoring",
            icon: (
                <img
                    src={CentralWaitingArea}
                    alt="Triage Waiting List"
                    className="w-16 h-16 object-contain"
                />
            ),
            description: "Monitor and manage patients in the triage waiting area",
            requiredRole: "Triage Waiting List",
            color: "bg-green-50 border-green-200 hover:bg-green-100",
            borderColor: "border-l-4 border-green-500",
            iconBg: "bg-green-100"
        },
        {
            id: 'department',
            label: `${t("Department Waiting List")}`,
            path: "#",
            icon: (
                <img
                    src={LocationAssignment}
                    alt="Department Waiting List"
                    className="w-16 h-16 object-contain"
                />
            ),
            description: "View and manage department-specific waiting lists",
            requiredRole: "Department Waiting List",
            color: "bg-teal-50 border-teal-200 hover:bg-teal-100",
            borderColor: "border-l-4 border-teal-500",
            iconBg: "bg-teal-100"
        },
        {
            id: 'masterdata',
            label: `${t("MasterData")}`,
            path: "#",
            icon: (
                <img
                    src={MasterData}
                    alt="Master Data"
                    className="w-16 h-16 object-contain"
                />
            ),
            description: "Manage system configuration and reference data",
            requiredRole: "MasterData",
            color: "bg-amber-50 border-amber-200 hover:bg-amber-100",
            borderColor: "border-l-4 border-amber-500",
            iconBg: "bg-amber-100",
            subItems: [
                {
                    id: 'users',
                    label: `${t("Users")}`,
                    path: "/users",
                    icon: <img src={Usersicon} alt="Users" className="w-16 h-16 object-contain" />,
                    description: "Manage system users and their profiles",
                    color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
                    borderColor: "border-l-4 border-indigo-500",
                    iconBg: "bg-indigo-100"
                },
                {
                    id: 'roles',
                    label: `${t("Roles")}`,
                    path: "/Roles",
                    icon: <img src={Rolesicon} alt="Roles" className="w-16 h-16 object-contain" />,
                    description: "Configure user roles and permissions",
                    color: "bg-violet-50 border-violet-200 hover:bg-violet-100",
                    borderColor: "border-l-4 border-violet-500",
                    iconBg: "bg-violet-100"
                },
                {
                    id: 'beds',
                    label: `${t("Beds")}`,
                    path: "/Beds",
                    icon: <img src={Beds} alt="Beds" className="w-16 h-16 object-contain" />,
                    description: "Manage hospital beds and their assignments",
                    color: "bg-sky-50 border-sky-200 hover:bg-sky-100",
                    borderColor: "border-l-4 border-sky-500",
                    iconBg: "bg-sky-100"
                },
                {
                    id: 'department-config',
                    label: `${t("Department")}`,
                    path: "/Department",
                    icon: (
                        <img src={Department} alt="Department" className="w-16 h-16 object-contain" />
                    ),
                    description: "Configure departments and their settings",
                    color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
                    borderColor: "border-l-4 border-emerald-500",
                    iconBg: "bg-emerald-100"
                },
            ],
        },
        {
            id: 'tvscreen',
            label: `${t("TV Screen")}`,
            path: "/patient-display",
            icon: <img src={TVscreeen} alt="TV Screen" className="w-16 h-16 object-contain" />,
            description: "Manage display screens in waiting areas",
            requiredRole: "TV Screen",
            color: "bg-rose-50 border-rose-200 hover:bg-rose-100",
            borderColor: "border-l-4 border-rose-500",
            iconBg: "bg-rose-100"
        },
        {
            id: 'kpi',
            label: `${t("KPI")}`,
            path: "/kpi",
            icon: <img src={KPI} alt="KPI" className="w-16 h-16 object-contain" />,
            description: "View performance metrics and analytics",
            requiredRole: "KPI",
            color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
            borderColor: "border-l-4 border-purple-500",
            iconBg: "bg-purple-100"
        },
        {
            id: 'patientjourney',
            label: `${t("Patient Journey")}`,
            path: "/PatientJourney",
            icon: <img src={PatientJourneyicon} alt="Patient Journey" className="w-16 h-16 object-contain" />,
            description: "Track and visualize patient journey throughout the system",
            requiredRole: "Patient Journey",
            color: "bg-cyan-50 border-cyan-200 hover:bg-cyan-100",
            borderColor: "border-l-4 border-cyan-500",
            iconBg: "bg-cyan-100"
        },
    ];

    const fetchDashboardStats = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            // You can replace this with actual API calls to get real stats
            const waitingResponse = await axios.get(`${baseUrl}/api/v1/patients/by-state`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            
            // Set stats based on API response
            if (waitingResponse.data.success) {
                setTodayStats({
                    waitingPatients: waitingResponse.data.data.waiting?.length || 0,
                    calledPatients: 0, // Replace with actual data from API
                    assignedPatients: waitingResponse.data.data.inProgress?.length || 0,
                    dischargedPatients: 0 // Replace with actual data from API
                });
            }
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
        }
    };

    const getAllRegisteredMembers = async () => {
        const storedUserData = JSON.parse(localStorage.getItem("userdata"));
        const accessToken = localStorage.getItem("accessToken");
        
        if (!storedUserData?.user?.id) {
            navigate('/');
            return;
        }

        setUserData(storedUserData);

        try {
            const res = await axios.get(`${baseUrl}/api/v1/user/${storedUserData.user.id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const response = res.data?.data?.roles?.map((role) => role.name) || [];
            setUserRoles(response);
            localStorage.setItem("userRoles", JSON.stringify(response));
            
            // Fetch dashboard stats after roles are loaded
            fetchDashboardStats();
        } catch (error) {
            console.error("Error fetching user roles:", error);
            navigate('/');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const storedRoles = localStorage.getItem("userRoles");
        if (storedRoles) {
            setUserRoles(JSON.parse(storedRoles));
            setUserData(JSON.parse(localStorage.getItem("userdata")));
            fetchDashboardStats();
            setIsLoading(false);
        } else {
            getAllRegisteredMembers();
        }
    }, []);

    const handleItemClick = (page) => {
        if (page.subItems) {
            setExpandedItem(expandedItem === page.id ? null : page.id);
        } else if (page.path !== "#" && userRoles.includes(page.requiredRole)) {
            navigate(page.path);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <NextUISpinner color="success" size="lg" />
            </div>
        );
    }

    const getAccessibleModules = () => {
        return sidebarItems.filter(item => userRoles.includes(item.requiredRole));
    };

    const accessibleModules = getAccessibleModules();

    return (
        <SideNav>
            <div className="min-h-screen bg-gray-50 p-6">
                {/* Welcome Section */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                    <div className="md:flex">
                        <div className="md:flex-shrink-0 bg-green-600 md:w-48 flex items-center justify-center p-6">
                            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                                <FaUser className="text-green-600 text-5xl" />
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="uppercase tracking-wide text-sm text-green-600 font-semibold">
                                {t("Welcome back")}
                            </div>
                            <h1 className="mt-1 text-2xl font-medium text-gray-800 leading-tight">
                                {userData?.user?.name || "User"}
                            </h1>
                            <p className="mt-2 text-gray-600">
                                {userData?.user?.email || ""}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {userRoles.map((role, index) => (
                                    <span 
                                        key={index}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                    >
                                        {role}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

             

                {/* Your Modules Section */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                        <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        {t("Your Modules")}
                    </h2>
                    
                    {accessibleModules.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {accessibleModules.map((module) => (
                                <div
                                    key={module.id}
                                    className={`rounded-xl shadow-sm ${module.color} ${module.borderColor} transition-all duration-200 overflow-hidden`}
                                >
                                    <div 
                                        className="p-6 cursor-pointer"
                                        onClick={() => handleItemClick(module)}
                                    >
                                        <div className="flex items-center mb-4">
                                            <div className={`w-16 h-16 rounded-lg ${module.iconBg} flex items-center justify-center mr-4`}>
                                                {module.icon}
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800">{module.label}</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                                        <div className="flex justify-end">
                                            <Button
                                                size="sm"
                                                className="bg-green-600 text-white hover:bg-green-700"
                                                endContent={<FaChevronRight size={12} />}
                                                onClick={() => module.path !== "#" && navigate(module.path)}
                                            >
                                                {module.subItems ? 'View Options' : 'Access Module'}
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    {expandedItem === module.id && module.subItems && (
                                        <div className="px-6 pb-6 pt-0 border-t border-gray-200">
                                            <div className="grid grid-cols-1 gap-4 mt-4">
                                                {module.subItems.map((subItem) => (
                                                    <div
                                                        key={subItem.id}
                                                        className={`p-4 rounded-lg ${subItem.color} ${subItem.borderColor} flex items-center cursor-pointer transition-all duration-200`}
                                                        onClick={() => navigate(subItem.path)}
                                                    >
                                                        <div className={`w-10 h-10 rounded-lg ${subItem.iconBg} flex items-center justify-center mr-3`}>
                                                            {React.cloneElement(subItem.icon, { className: 'w-6 h-6' })}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-sm font-medium text-gray-800">{subItem.label}</h4>
                                                            <p className="text-xs text-gray-600">{subItem.description}</p>
                                                        </div>
                                                        <FaChevronRight className="text-gray-400" size={12} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-8 bg-gray-50 rounded-lg">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-700 mb-2">No Access Modules Found</h3>
                            <p className="text-gray-500">You don't have access to any modules. Please contact your administrator.</p>
                        </div>
                    )}
                </div>

                {/* All Available Modules */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                        <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        {t("All System Modules")}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sidebarItems.map((module) => {
                            const hasAccess = userRoles.includes(module.requiredRole);
                            return (
                                <div
                                    key={module.id}
                                    className={`rounded-xl shadow-sm transition-all duration-200 overflow-hidden ${
                                        hasAccess 
                                            ? `${module.color} ${module.borderColor}` 
                                            : "bg-gray-100 border-l-4 border-gray-300"
                                    }`}
                                >
                                    <div className="p-6">
                                        <div className="flex items-center mb-4">
                                            <div className={`w-16 h-16 rounded-lg ${hasAccess ? module.iconBg : 'bg-gray-200'} flex items-center justify-center mr-4 ${!hasAccess && 'opacity-50'}`}>
                                                {module.icon}
                                            </div>
                                            <div>
                                                <h3 className={`text-lg font-semibold ${hasAccess ? 'text-gray-800' : 'text-gray-500'}`}>
                                                    {module.label}
                                                </h3>
                                                {!hasAccess && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                                                        <FaDoorOpen className="mr-1" size={10} /> No Access
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <p className={`text-sm ${hasAccess ? 'text-gray-600' : 'text-gray-500'} mb-4`}>
                                            {module.description}
                                        </p>
                                        <div className="flex justify-end">
                                            <Button
                                                size="sm"
                                                className={hasAccess 
                                                    ? "bg-green-600 text-white hover:bg-green-700" 
                                                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                }
                                                endContent={hasAccess && <FaChevronRight size={12} />}
                                                onClick={() => hasAccess && handleItemClick(module)}
                                                disabled={!hasAccess}
                                            >
                                                {hasAccess ? (module.subItems ? 'View Options' : 'Access Module') : 'No Access'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </SideNav>
    );
};

export default Home;
