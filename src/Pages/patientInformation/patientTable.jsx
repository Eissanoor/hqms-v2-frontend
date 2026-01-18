import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CiEdit } from "react-icons/ci";
import { FaCalendarAlt, FaFilePdf, FaHistory, FaPlusCircle, FaSearch, FaTrash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import SideNav from '../../components/Sidebar/SideNav';
import { baseUrl } from '../../utils/config';
import newRequest from '../../utils/newRequest';
import PatientJourneyDetails from "../PatientJourney2/PatientJourneyDetails";

function PatientTable() {
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
    const [Detailspatient, setDetailspatient] = useState(false);
      const [selectedData, setselectedData] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const fetchPatients = async (page) => {
    setLoading(true);
    try {
      const response = await newRequest.get(`/api/v1/patients?page=${page}&limit=10${searchTerm ? `&search=${searchTerm}` : ''}`);
      setPatients(response?.data?.data?.data || []);
      setTotalPages(response?.data?.data?.pagination?.totalPages);
      setTotal(response?.data?.data?.pagination?.total);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPatients(currentPage);
  }, [currentPage, searchTerm]);
  
  const toggleDropdown = (patientId) => {
    setDropdownVisible((prev) => (prev === patientId ? null : patientId));
  };

  const handleDelete = async (patient) => {
    setDropdownVisible(null);
    Swal.fire({
      title: `Are you sure to delete this record?`,
      text: `You will not be able to recover this! ${patient?.name || ""}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, Delete!`,
      cancelButtonText: `No, keep it!`,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#FF0032",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await newRequest.delete(`/api/v1/patients/` + patient?.id);
          toast.success(response?.data?.message || "Patient information has been deleted successfully");
          fetchPatients(currentPage);
        } catch (error) {
          const errorMessage = error.response?.data?.message || "An unexpected error occurred";
          toast.error(errorMessage);
        }
      }
    });
  };
  
  const handleupdated = (patient) => {
    navigate("/update/patient-information/" + patient.id);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    setLoading(true);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
    setLoading(true);
  };
  
  const renderLoadingContent = () => (
    <div className="flex justify-center items-center py-8">
      <Spinner color="success" size="lg" />
    </div>
  );

   const handledetaild = (patient) => {
     setselectedData(patient);
     setDetailspatient(true);
     setDropdownVisible(null);
   };
  
  return (
    <>
      <div className="font-[sans-serif]">
        <SideNav>
          <div className="w-11/12 mx-auto">
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6 mt-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Patients Information
              </h2>
              <div className="flex items-center mb-4 justify-between w-full">
                <div className="relative w-80">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    className="w-full border border-gray-300 focus:border-green-500 rounded-lg px-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-lg text-sm font-medium border border-green-600 bg-green-600 text-white hover:bg-green-700 transition-all duration-300 flex items-center gap-2"
                  onClick={() => navigate("/patient-information")}
                >
                  <FaPlusCircle />
                  New Entry
                </button>
              </div>

              <div className="rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white divide-y divide-gray-200">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">
                          Age
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">
                          ID Number
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">
                          PDF
                        </th>
                        <th className="px-6 py-3.5 text-center text-xs font-semibold text-green-800 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {loading ? (
                        <tr>
                          <td colSpan="7">{renderLoadingContent()}</td>
                        </tr>
                      ) : patients.length === 0 ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="py-8 text-center text-gray-500"
                          >
                            No patients found
                          </td>
                        </tr>
                      ) : (
                        patients.map((patient) => (
                          <tr
                            key={patient.id}
                            className="hover:bg-green-50/30 transition-colors duration-200"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {patient.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  patient.status === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {patient.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {patient.age}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {patient.mobileNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {patient.idNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <FaFilePdf
                                size={20}
                                className="text-red-500 hover:text-red-600 transition-colors duration-200 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const fileUrl =
                                    baseUrl + "/" + patient.ticket;
                                  window.open(fileUrl, "_blank");
                                }}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleDropdown(patient.id);
                                }}
                                className="text-gray-500 text-lg hover:text-green-600 transition-colors duration-200 font-bold"
                              >
                                ⋮
                              </button>
                              {dropdownVisible === patient.id && (
                                <div className="absolute right-6 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                                  <ul className="py-1">
                                    <li
                                      className="px-4 py-2 hover:bg-green-50 cursor-pointer flex items-center text-gray-700 transition-colors duration-150"
                                      onClick={() => handleupdated(patient)}
                                    >
                                      <CiEdit className="text-green-600 mr-3" />{" "}
                                      <span className="text-sm">Edit</span>
                                    </li>
                                    <li
                                      className="px-4 py-2 hover:bg-indigo-50 cursor-pointer flex items-center text-gray-700 transition-colors duration-150"
                                      onClick={() => handledetaild(patient)}
                                    >
                                      <div className="flex items-center w-full">
                                        <FaHistory className="text-indigo-600 mr-3" />
                                        <span className="text-sm font-medium">Journey History</span>
                                      </div>
                                    </li>
                                    <li
                                      className="px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer flex items-center transition-colors duration-150"
                                      onClick={() => handleDelete(patient)}
                                    >
                                      <FaTrash className="mr-3" />{" "}
                                      <span className="text-sm">Delete</span>
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex items-center gap-1 mx-2">
                    {(() => {
                      let pages = [];
                      const maxButtons = 5;
                      let start = Math.max(1, currentPage - 2);
                      let end = Math.min(totalPages, start + maxButtons - 1);

                      if (end - start + 1 < maxButtons) {
                        start = Math.max(1, end - maxButtons + 1);
                      }

                      if (start > 1) {
                        pages.push(
                          <span
                            key="ellipsis-start"
                            className="px-2 text-gray-500"
                          >
                            ...
                          </span>
                        );
                      }

                      for (let i = start; i <= end; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => {
                              setCurrentPage(i);
                              setLoading(true);
                            }}
                            className={`w-8 h-8 rounded-full ${
                              currentPage === i
                                ? "bg-green-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            } flex items-center justify-center text-sm font-medium transition-colors duration-200`}
                          >
                            {i}
                          </button>
                        );
                      }

                      if (end < totalPages) {
                        pages.push(
                          <span
                            key="ellipsis-end"
                            className="px-2 text-gray-500"
                          >
                            ...
                          </span>
                        );
                      }

                      return pages;
                    })()}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    Total: {total} patients
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handlePreviousPage}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                    disabled={currentPage === 1}
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={handleNextPage}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                    disabled={currentPage === totalPages}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
            <Modal
              isOpen={Detailspatient}
              onClose={() => setDetailspatient(false)}
              size="3xl"
              scrollBehavior="inside"
            >
              <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-green-600" />
                    <h3 className="text-lg font-bold">
                      Patient Journey History
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    {selectedData?.name} - ID: {selectedData?.idNumber}
                  </p>
                </ModalHeader>
                <ModalBody>
                  {selectedData && (
                    <PatientJourneyDetails
                      isVisible={true}
                      setVisibility={() => {}}
                      selectdataPatientJourney={selectedData}
                    />
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button 
                    color="danger" 
                    variant="light"
                    onPress={() => setDetailspatient(false)}
                  >
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </SideNav>
      </div>
    </>
  );
}

export default PatientTable;
