import axios from "axios";
import { Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import Beds from "../../Images/Beds.jpg";
import CentralWaitingArea from "../../Images/Central Waiting Area.png";
import Department from "../../Images/Department.png";
import KPI from "../../Images/KPI.png";
import LocationAssignment from "../../Images/Location Assignment.png";
import logo from "../../Images/HD GST LOGO.png";
import logout from "../../Images/logout.png";
import MasterData from "../../Images/masterdata.png";
import PatientJourneyicon from "../../Images/PatientJourneyicon.png";
import Registration from "../../Images/Registration.png";
import Rolesicon from "../../Images/Roles.png";
import TVscreeen from "../../Images/TV screen.jpg";
import Usersicon from "../../Images/users.png";
import { baseUrl } from "../../utils/config";
import DepartmentWaitingList from "../DepartmentWaitingList/DepartmentWaitingList";

function SideNav({ children }) {
  const { t, i18n } = useTranslation();
  const [Masterdatashow, setMasterdatashow] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    return savedState ? JSON.parse(savedState) : true;
  });

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  // Load roles from localStorage if available
  useEffect(() => {
    const storedRoles = localStorage.getItem("userRoles");
    if (storedRoles) {
      setUserRoles(JSON.parse(storedRoles));
    } else {
      // Only fetch if roles aren't available in localStorage
      getAllRegisteredMembers();
    }
  }, []);

  const getTabClass = (path) => {
    return `flex items-center py-2.5 px-4 rounded-lg transition-all duration-200 relative group cursor-pointer ${
      activeTab === path
        ? "bg-green-100 text-green-800 font-medium"
        : "hover:bg-gray-50 text-gray-700"
    } ${
      i18n.language === "ar"
        ? "pr-3 pl-4 justify-end"
        : "pl-3 pr-4 justify-start"
    }`;
  };

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const sidebarItems = [
    {
      label: `${t("Registered Patients")}`,
      path: "/patient-table",
      icon: (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-50">
          <img src={Registration} alt="Registered Patients" className="w-5 h-5" />
        </div>
      ),
      requiredRole: "Registered Patients",
    },
    {
      label: `${t("Triage Waiting List")}`,
      path: "/monitoring",
      icon: (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-50">
          <img
            src={CentralWaitingArea}
            alt="Triage Waiting List"
            className="w-5 h-5"
          />
        </div>
      ),
      requiredRole: "Triage Waiting List",
    },
    {
      label: `${t("Department Waiting List")}`,
      path: "#",
      icon: (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50">
          <img
            src={LocationAssignment}
            alt="Location Assignment"
            className="w-5 h-5"
          />
        </div>
      ),
      requiredRole: "Department Waiting List",
    },
    {
      label: `${t("MasterData")}`,
      path: "#",
      icon: (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50">
          <img src={MasterData} alt="MasterData" className="w-5 h-5" />
        </div>
      ),
      requiredRole: "MasterData",
      subItems: [
        {
          label: `${t("Users")}`,
          path: "/users",
          icon: (
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-green-50">
              <img src={Usersicon} alt="Users" className="w-4 h-4" />
            </div>
          ),
        },
        {
          label: `${t("Roles")}`,
          path: "/Roles",
          icon: (
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-green-50">
              <img src={Rolesicon} alt="Roles" className="w-4 h-4" />
            </div>
          ),
        },
        {
          label: `${t("Beds")}`,
          path: "/Beds",
          icon: (
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-green-50">
              <img src={Beds} alt="Beds" className="w-4 h-4" />
            </div>
          ),
        },
        {
          label: `${t("Department")}`,
          path: "/Department",
          icon: (
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-green-50">
              <img src={Department} alt="Department" className="w-4 h-4" />
            </div>
          ),
        },
      ],
    },
    {
      label: `${t("TV Screen")}`,
      path: "/patient-display",
      icon: (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50">
          <img src={TVscreeen} alt="TV Screen" className="w-5 h-5" />
        </div>
      ),
      requiredRole: "TV Screen",
    },
    {
      label: `${t("KPI")}`,
      path: "/kpi",
      icon: (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50">
          <img src={KPI} alt="KPI" className="w-5 h-5" />
        </div>
      ),
      requiredRole: "KPI",
    },
    {
      label: `${t("Patient Journey")}`,
      path: "/PatientJourney",
      icon: (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-50">
          <img src={PatientJourneyicon} alt="Patient Journey" className="w-5 h-5" />
        </div>
      ),
      requiredRole: "Patient Journey",
    },
  ];

  const [userData, setUserData] = useState(() => {
    const storedUserData = localStorage.getItem("userdata");
    return storedUserData ? JSON.parse(storedUserData) : null;
  });

  const [showPopup, setShowPopup] = useState(false);
  const handleItemClick = (item) => {
    if (item.label === t("Department Waiting List")) {
      setShowPopup(true);
    } else if (item.subItems) {
      setMasterdatashow(!Masterdatashow);
    } else {
      navigate(item.path);
    }
  };

  const logoutbutton = () => {
    localStorage.removeItem("userdata");
    localStorage.removeItem("sidebarOpen");
    localStorage.removeItem("userRoles");
    navigate("/");
  };
  
  const accessToken = localStorage.getItem("accessToken");
  const storedUserData = JSON.parse(localStorage.getItem("userdata"));
  
  const getAllRegisteredMembers = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/v1/user/${storedUserData?.user?.id || ""}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const response = res.data?.data?.roles?.map((role) => role.name) || [];
      // Save roles to state
      setUserRoles(response);
      // Save roles to localStorage
      localStorage.setItem("userRoles", JSON.stringify(response));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="p-0 lg:h-screen">
        <div className="body-content">
          <nav
            className={`fixed top-0 transition-all duration-300 ease-in-out bg-white lg:mt-0 mt-16 bottom-0 flex flex-col shadow-lg overflow-hidden z-50 ${
              i18n.language === "ar" ? "right-0" : "left-0"
            } ${isOpen ? "w-[280px]" : "w-[80px]"}`}
            id="sidenav"
          >
            {/* Logo Section */}
            <div
              className="flex items-center w-full px-4 py-5 border-b border-gray-100 justify-center bg-green-50"
            >
              <div
                className={`transition-opacity duration-300 justify-center cursor-pointer ${
                  !isOpen ? "opacity-0 w-0" : "opacity-100"
                }`}
                onClick={() => navigate("/Home")}
              >
                <img
                  src={logo}
                  alt="GST logo"
                  className="w-full max-w-[180px] h-auto object-contain"
                />
              </div>
              <div
                className={`transition-opacity duration-300 cursor-pointer ${
                  isOpen ? "opacity-0 w-0" : "opacity-100"
                }`}
                onClick={() => navigate("/Home")}
              >
                <img
                  src={logo}
                  alt="GST logo"
                  className="w-16 h-auto object-contain"
                />
              </div>
            </div>

            {/* Profile Section */}
            {isOpen && (
              <div className="px-4 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-700 font-bold text-lg">
                      {userData?.user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {userData?.user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userData?.user?.email || "admin@example.com"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto py-4">
              <ul className="px-3 space-y-1">
                {sidebarItems.map((item, index) =>
                  userRoles.includes(item.requiredRole) ? (
                    <li key={index} className="mb-1">
                      <div
                        className={`flex items-center py-2.5 px-3 rounded-lg transition-all duration-200 relative group cursor-pointer ${
                          activeTab === item.path
                            ? "bg-green-100 text-green-800 font-medium"
                            : "hover:bg-gray-50 text-gray-700"
                        } ${
                          i18n.language === "ar"
                            ? "pr-3 pl-4 justify-end"
                            : "pl-3 pr-4 justify-start"
                        }`}
                        onClick={() => handleItemClick(item)}
                      >
                        {item.icon}
                        <span
                          className={`font-medium whitespace-nowrap transition-all duration-300 ms-3 ${
                            !isOpen && "opacity-0 w-0 overflow-hidden"
                          }`}
                        >
                          {item.label}
                        </span>
                        {item.subItems && isOpen && (
                          <div
                            className={`${
                              i18n.language === "ar"
                                ? "mr-auto ml-2"
                                : "ml-auto mr-0"
                            }`}
                          >
                            <div className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100">
                              {Masterdatashow ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {item.subItems && Masterdatashow && isOpen && (
                        <ul className="ml-6 mt-1 space-y-1">
                          {item.subItems.map((subItem, subIndex) => (
                            <li
                              key={subIndex}
                              onClick={() => navigate(subItem.path)}
                              className={`flex items-center py-2 px-3 rounded-lg transition-all duration-200 relative group cursor-pointer ${
                                activeTab === subItem.path
                                  ? "bg-green-50 text-green-700 font-medium"
                                  : "hover:bg-gray-50 text-gray-600"
                              }`}
                            >
                              {subItem.icon}
                              <span
                                className="font-medium text-sm whitespace-nowrap transition-all duration-300 ms-2"
                              >
                                {subItem.label}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ) : null
                )}
              </ul>
            </div>

            {/* Logout Section */}
            <div className="border-t border-gray-100 px-4 py-4">
              <div
                onClick={logoutbutton}
                className="flex items-center py-2 px-3 rounded-lg cursor-pointer hover:bg-red-50 text-gray-700 transition-all duration-200"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50">
                  <img src={logout} alt="Logout" className="w-5 h-5" />
                </div>
                <span
                  className={`font-medium whitespace-nowrap transition-all duration-300 ms-3 ${
                    !isOpen && "opacity-0 w-0 overflow-hidden"
                  }`}
                >
                  {t("Log-out")}
                </span>
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div
          className={`mx-auto transition-all duration-300 content-wrapper ${
            isOpen ? "lg:ml-[280px]" : "lg:ml-[80px]"
          }`}
        >
          {/* Top navbar */}
          <section className="sticky top-0 z-40 px-4 py-3 bg-white shadow-sm flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                {!isOpen ? (
                  <Menu size={22} className="text-gray-600" />
                ) : (
                  <X size={22} className="text-gray-600" />
                )}
              </button>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {t(
                    location.pathname.substring(1).replace(/-/g, " ").charAt(0).toUpperCase() +
                    location.pathname.substring(1).replace(/-/g, " ").slice(1).toLowerCase() || "Dashboard"
                  )}
                </h2>
              </div>
            </div>
          </section>

          {/* Page content */}
          <div className="main-content">
            {children}
          </div>
        </div>
      </div>

      {/* Department Waiting List popup */}
      {showPopup && (
        <DepartmentWaitingList
          isVisible={showPopup}
          setVisibility={() => setShowPopup(false)}
        />
      )}
    </>
  );
}

export default SideNav;
