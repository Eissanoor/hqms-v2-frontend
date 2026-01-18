import React, { useRef, useState } from "react";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import newRequest from "../../../utils/newRequest";

const UpdatedRoles = ({ isVisible, setVisibility, selectdataroles, refreshroles }) => {
    const [Departmentname, setDepartmentname] = useState(selectdataroles?.name || "");
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const modalRef = useRef(null);
    if (!isVisible) return null;

    const handleSubmit = async (e) => {
        setLoading(true);
        try {
            const response = await newRequest.put(`/api/v1/roles/${selectdataroles?.id || ""}`, {
                name: Departmentname,
            });
            if (response.status >= 200 && response.status < 300) {
                toast.success(response.data?.message || "Successfully Add!");
                setVisibility(false);
                refreshroles()
            } else {
                throw new Error("Unexpected response status");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error .");
        } finally {
            setLoading(false); // Stop loading
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            {/* Modal Container */}
            <div
                ref={modalRef} // Attach the ref to the modal
                className="bg-white rounded-lg shadow-lg w-full max-w-lg"
            >
                {/* Modal Header */}
                <div
                    className="flex items-center justify-between px-4 py-3"
                    style={{ backgroundColor: "#5B4DF5" }}
                >
                    <h2 className="text-white text-xl font-semibold">
                        {t("Update Role")}
                    </h2>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setVisibility(false)}>
                            <CloseIcon style={{ color: "white" }} />
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                Department Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Department Name"
                                className="w-full border border-green-500 rounded px-3 py-2"
                                value={Departmentname}
                                onChange={(e) => setDepartmentname(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-gray-400"
                            onClick={() => setVisibility(false)}
                        >
                            {t("Cancel")}
                        </button>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: "#13BA88", color: "#ffffff" }}
                            onClick={handleSubmit}
                            disabled={loading}
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
                                    {t("Update...")}
                                </div>
                            ) : (
                                t("Update")
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdatedRoles;
