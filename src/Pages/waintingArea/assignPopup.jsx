import React, { useState, useEffect } from 'react';
import { baseUrl } from "../../utils/config";
import newRequest from '../../utils/newRequest';
import toast from 'react-hot-toast';

const AssignPopup = ({ onClose, patientId, onAssignSuccess }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [departments, setDepartments] = useState([]);
    const [selectedDeptId, setSelectedDeptId] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchDepartments = async () => {
            const response = await newRequest.get(`/api/v1/departments/all`);
            setDepartments(response.data.data);
        };
        fetchDepartments();
    }, []);

    const handleAssign = async () => {
        setLoading(true);
        try {
            const response = await newRequest.patch(
                `/api/v2/patients/${patientId}/assign-department`,
                { departmentId: selectedDeptId }
            );
            toast.success(
                response?.data?.message ||
                "Department assigned to patient successfully"
            );
            onAssignSuccess();
            handleClose();
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to assign department";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        onClose();
    };

    return (
        <div>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-80">
                        <h2 className="text-lg font-bold mb-4">Assign Location</h2>
                        <label className="block mb-2">Department Code</label>

                        <select
                            value={selectedDeptId}
                            onChange={(e) => setSelectedDeptId(e.target.value)}
                            className="border border-gray-300 p-2 w-full mb-4"
                        >
                            <option value="">Select Department</option>
                            {departments.map((department) => (
                                <option
                                    key={department.tblDepartmentID}
                                    value={department.tblDepartmentID}
                                >
                                    {department.deptcode}
                                </option>
                            ))}
                        </select>

                        <div className="flex justify-between">
                            <button
                                onClick={handleClose}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAssign}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8z"
                                            ></path>
                                        </svg>
                                        Assign...
                                    </div>
                                ) : (
                                    'Assign'
                                )}
                            </button>
                        </div>
                        <button
                            onClick={handleClose}
                            className="absolute top-2 right-2 text-gray-500"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignPopup;