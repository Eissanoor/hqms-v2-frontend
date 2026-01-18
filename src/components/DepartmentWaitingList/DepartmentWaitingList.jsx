import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FaHospital, FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";

const DepartmentWaitingList = ({
    isVisible,
    setVisibility,
    selectdatauser,
    refreshuser,
}) => {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [selectedDeptId, setSelectedDeptId] = useState(null);
    const { t } = useTranslation();
    const modalRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");
    
    if (!isVisible) return null;

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await newRequest.get(`/api/v1/departments/all`);
                setDepartments(response?.data?.data || []);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };

        fetchDepartments();
    }, []);

    const filteredDepartments = departments.filter(
        (dept) => 
            dept.deptcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (dept.deptname && dept.deptname.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const departmentSearch = () => {
        if (selectedDeptId) {
            navigate(`/Department-monitoring/${selectedDeptId}`);
            setVisibility(false);
        } else {
            toast.error("Please select a department");
        }
    };

    // Handle click outside modal to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setVisibility(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setVisibility]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            {/* Modal Container */}
            <div
                ref={modalRef}
                className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 ease-in-out"
            >
                {/* Modal Header */}
                <div className="bg-green-600 rounded-t-lg px-6 py-4 flex items-center justify-between">
                    <h2 className="text-white text-xl font-semibold flex items-center gap-2">
                        <FaHospital className="text-white" />
                        {t("Department Waiting List")}
                    </h2>
                    <button 
                        onClick={() => setVisibility(false)}
                        className="p-1.5 rounded-full bg-green-700 hover:bg-green-800 text-white transition-colors duration-200 flex items-center justify-center"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t("Search Department")}
                        </label>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by department code or name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t("Select Department")}
                        </label>
                        
                        {filteredDepartments.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
                                No departments found matching your search
                            </div>
                        ) : (
                            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                                {filteredDepartments.map((department) => (
                                    <div
                                        key={department.tblDepartmentID}
                                        onClick={() => setSelectedDeptId(department.tblDepartmentID)}
                                        className={`flex items-center p-3 border-b last:border-b-0 cursor-pointer ${
                                            selectedDeptId === department.tblDepartmentID
                                                ? "bg-green-50 border-l-4 border-green-500"
                                                : "hover:bg-gray-50"
                                        }`}
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-800">{department.deptcode}</div>
                                            {department.deptname && (
                                                <div className="text-sm text-gray-500">{department.deptname}</div>
                                            )}
                                        </div>
                                        {selectedDeptId === department.tblDepartmentID && (
                                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            onClick={() => setVisibility(false)}
                            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                        >
                            {t("Cancel")}
                        </button>
                        <button
                            onClick={departmentSearch}
                            className="px-5 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 font-medium flex items-center gap-2"
                        >
                            <FaSearch size={14} /> {t("View Department")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentWaitingList;
