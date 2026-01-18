import React, { useState, useEffect } from "react";
import SideNav from "../../components/Sidebar/SideNav";
import { useTranslation } from "react-i18next";
import "react-phone-input-2/lib/style.css";
import { useParams, useNavigate } from "react-router-dom";
import { baseUrl } from "../../utils/config";
import toast from "react-hot-toast";
import newRequest from "../../utils/newRequest";
import AssignPopup from "../waintingArea/assignPopup";
const Servingss = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingbed, setloadingbed] = useState(false);
  const [loadingbegintime, setloadingbegintime] = useState(false);
  const [loadingendtime, setloadingendtime] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showDischargePopup, setShowDischargePopup] = useState(false);
  const [dischargeType, setDischargeType] = useState('');
  const [remarks, setRemarks] = useState('');
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const { t } = useTranslation();
  const { id } = useParams();
  const [PatientName, setPatientName] = useState("");
  const [IDNumber, setIDNumber] = useState("");
  const [Age, setAge] = useState("");
  const [ChiefComplaint, setChiefComplaint] = useState("");
  const [Availablebed, setAvailablebed] = useState([]);
  const [Allergies, setAllergies] = useState(false);
  const [VitalSigns, setVitalSigns] = useState({
    BP: "",
    HR: "",
    TEMP: "",
    RR: "",
    SPO2: "",
    RBS: "",
    Height: "",
    Weight: "",
    TimeVS: "",
  });
  const [MobileNumber, setMobileNumber] = useState("");
  const [Sex, setSex] = useState("");
  const [Nationality, setNationality] = useState("");
  const [patientData, setPatientData] = useState(null);
  const [callPatient, setCallPatient] = useState(false);
  const [bednumber, setbednumber] = useState("");
  const [assignedbednumber, setassignedbednumber] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [mrnNumber, setMrnNumber] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-GB", options).replace(",", "");
  };
  const fetchPatientData = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/v1/patients/${id}`);
      const data = await response.json();
      if (data.success) {
        const patient = data.data;
        console.log(patient, "patient");
        setPdfUrl(patient?.ticket);
        setPatientData(patient);
        setPatientName(patient.name);
        setIDNumber(patient.idNumber);
        setAge(patient.age);
        setChiefComplaint(patient.cheifComplaint);
        setMobileNumber(patient.mobileNumber);
        setSex(patient.sex);
        setNationality(patient.nationality);
        setCallPatient(patient.callPatient);
        setBloodGroup(patient.bloodGroup);
        setBirthDate(patient.birthDate ? patient.birthDate.split("T")[0] : "");
        setMrnNumber(patient.mrnNumber);
          try {
            const response = await newRequest.get(`/api/v1/beds/${patient?.bedId || ""}`);
            setassignedbednumber(response?.data?.data?.bedNumber || "");
          } catch (error) {
            console.error("Error fetching departments:", error);
          }

        if (patient.beginTime) {
          setStartTime(formatDateTime(patient.beginTime));
        }
        if (patient.endTime) {
          setEndTime(formatDateTime(patient.endTime));
        }
        if (patient.beginTime && patient.endTime) {
          const beginTime = new Date(patient.beginTime);
          const endTime = new Date(patient.endTime);
          const totalTime = endTime - beginTime;
          const hours = Math.floor(totalTime / 3600000);
          const minutes = Math.floor((totalTime % 3600000) / 60000);
          setTotalTime(`${hours}h ${minutes}m`);
        }
        if (patient.vitalSigns.length > 0) {
          const latestVitalSign = patient.vitalSigns[0];
          setAllergies(latestVitalSign.allergies || false);
          setVitalSigns({
            BP: latestVitalSign.bp,
            HR: latestVitalSign.hr,
            TEMP: latestVitalSign.temp,
            RR: latestVitalSign.rr,
            SPO2: latestVitalSign.spo2,
            RBS: latestVitalSign.rbs,
            Height: latestVitalSign.height,
            Weight: latestVitalSign.weight,
            TimeVS: latestVitalSign.timeVs,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  const handleVitalChange = (e) => {
    setVitalSigns({ ...VitalSigns, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    const patientId = id;
    const body = {
      bp: VitalSigns.BP,
      height: VitalSigns.Height,
      temp: VitalSigns.TEMP,
      spo2: VitalSigns.SPO2,
      weight: VitalSigns.Weight,
      hr: VitalSigns.HR,
      rbs: VitalSigns.RBS,
      rr: VitalSigns.RR,
      timeVs: new Date().toISOString(),
      allergies: Allergies === "Yes",
    };

    try {
      const response = await newRequest.post(
        `${baseUrl}/api/v2/patients/${patientId}/vital-sign`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.status >= 200) {
        toast.success(
          response?.data?.message || "Vital sign created successfully"
        );
      } else {
        throw new Error(response?.data?.message || "Unexpected error");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to save vital sign";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCallPatientToggle = async () => {
    const newCallPatientStatus = !callPatient;
    setCallPatient(newCallPatientStatus);

    try {
      const response = await fetch(
        `${baseUrl}/api/v2/patients/${id}/toggle-call?call=second`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ callPatient: newCallPatientStatus }),
        }
      );

      const data = await response.json();
      toast.success(
        data?.message || "Patient call status toggled successfully"
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };
  const openPopup = async () => {
    setShowPopup(true);
  };
  const closePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await newRequest.get(`/api/v1/beds/all`);
        setAvailablebed(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const Assignbed = async () => {
    setloadingbed(true);
    try {
      const response = await newRequest.patch(
        `/api/v1/patients/${id}/assign-bed`,
        {
          bedId: bednumber,
        }
      );
      if (response.status >= 200) {
        toast.success(response?.data?.message || "successfully Assign Bed");
        fetchPatientData();
      } else {
        throw new Error(response?.data?.message || "Unexpected error");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to assign roles";
      toast.error(errorMessage);
    } finally {
      setloadingbed(false);
    }
  };

  const handleBeginClick = async () => {
    setloadingbegintime(true);
    try {
      const response = await newRequest.patch(
        `/api/v2/patients/${id}/begin-time`
      );
      const data = response;
      if (response.status == 200) {
        toast.success(response?.data?.message || "successfully begin Time");
        fetchPatientData();
      } else {
        console.error("Error in API response:", data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error calling begin-time API";
      toast.error(errorMessage);
    } finally {
      setloadingbegintime(false);
    }
  };

  const handleEndClick = async () => {
    if (!startTime) {
      toast.error("Please select the begin date first.");
    } else {
      setloadingendtime(true);
      try {
        const response = await newRequest.patch(
          `/api/v2/patients/${id}/end-time`
        );
        const data = response;
        if (response.status == 200) {
          toast.success(data?.message || "End time set successfully");
          fetchPatientData();
          // navigate("/monitoring");
        } else {
          const errorMessage =
            data?.data?.message || "Error calling end-time API";
          toast.error(errorMessage);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Error calling end-time API";
        toast.error(errorMessage);
      } finally {
        setloadingendtime(false);
      }
    }
  };

  const handleDischarge = async () => {
    try {
      const response = await newRequest.patch(
        `/api/v2/patients/${id}/discharge`,
        { remarks }
      );
      
      if (response.status >= 200) {
        toast.success(`Patient discharged (${dischargeType}) successfully`);
        setShowDischargePopup(false);
        navigate("/monitoring");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to discharge patient");
    }
  };

  return (
    <SideNav>
      <div className="min-h-screen bg-green-100 p-8">
        <div className="min-h-screen flex flex-col antialiased text-black">
          {/* {loading ? (
            <Spinner />
          ) : ( */}
          <div className="container mx-auto p-6">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-green-700 font-bold text-xl">
                  {patientData?.name}
                </h5>
                <p className="text-gray-600 text-sm">
                  {new Date(patientData?.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t("Patient Name")}
                  </label>
                  <input
                    disabled
                    type="text"
                    value={PatientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder={t("Enter patient name")}
                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t("Mobile Number")}
                  </label>
                  <input
                    disabled
                    type="text"
                    value={MobileNumber}
                    readOnly
                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t("ID Number")}
                  </label>
                  <input
                    disabled
                    type="text"
                    value={IDNumber}
                    onChange={(e) => setIDNumber(e.target.value)}
                    placeholder={t("Enter ID number")}
                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t("Nationality")}
                  </label>
                  <input
                    disabled
                    type="text"
                    value={Nationality}
                    readOnly
                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t("Age")}
                  </label>
                  <input
                    disabled
                    type="text"
                    value={Age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder={t("Enter age")}
                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t("Gender")}
                  </label>
                  <input
                    disabled
                    type="text"
                    value={Sex}
                    readOnly
                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t("Blood Group")}
                  </label>
                  <input
                    disabled
                    type="text"
                    value={bloodGroup}
                    readOnly
                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t("Birth Date")}
                  </label>
                  <input
                    disabled
                    type="text"
                    value={birthDate}
                    readOnly
                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t("MRN Number")}
                  </label>
                  <input
                    disabled
                    type="text"
                    value={mrnNumber}
                    readOnly
                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("Chief Complaint")}
                  </label>
                  <input
                    disabled
                    type="text"
                    value={ChiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    placeholder={t("Describe the complaint")}
                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
              <h5 className="text-green-700 font-bold text-xl mb-4">
                Vital Sign
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  "BP",
                  "HR",
                  "TEMP",
                  "RR",
                  "SPO2",
                  "RBS",
                  "Height",
                  "Weight",
                ].map((field) => (
                  <div key={field}>
                    <label className="text-sm font-medium text-gray-700">
                      {t(field)}
                    </label>
                    <input
                      disabled
                      type="text"
                      name={field}
                      value={VitalSigns[field]}
                      onChange={handleVitalChange}
                      placeholder={t(`Enter ${field}`)}
                      className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
              <div className="flex w-full justify-between items-center my-auto">
                {/* First Section */}
                <div className="mt-6 flex items-center space-x-4 my-auto">
                  <span className="text-md font-medium text-Allergies">
                    Allergies
                  </span>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        disabled
                        type="radio"
                        value="true"
                        checked={Allergies === true}
                        onChange={() => setAllergies(true)}
                        className="hidden peer"
                        name="Allergies"
                      />
                      <span className="w-4 h-4 border-4 border-black rounded-full flex items-center justify-center">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            Allergies === true
                              ? "bg-[#EC5B01]"
                              : "bg-transparent"
                          }`}
                        ></span>
                      </span>
                      <span className="ml-2 text-sm">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        disabled
                        type="radio"
                        value="false"
                        checked={Allergies === false}
                        onChange={() => setAllergies(false)}
                        className="hidden peer"
                      />
                      <span className="w-4 h-4 border-4 border-black rounded-full flex items-center justify-center">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            Allergies === false
                              ? "bg-[#EC5B01]"
                              : "bg-transparent"
                          }`}
                        ></span>
                      </span>
                      <span className="ml-2 text-sm">No</span>
                    </label>
                    {Allergies === true && (
                      <div>
                        <label className="block text-green-700 font-semibold mb-2">
                          Specify
                        </label>
                        <input
                          disabled
                          type="text"
                          placeholder="Specify"
                          className="p-2 border border-green-500 rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Second Section */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-end w-full space-x-4">
                    {/* Input Field */}
                    <div className="flex flex-col items-start">
                      <label className="block text-green-700 font-semibold mb-2">
                        Start
                      </label>
                      <input
                        type="text"
                        value={startTime || ""}
                        readOnly
                        placeholder="Enter Start"
                        className="w-full border border-green-500 rounded px-3 py-2"
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-2 mt-7">
                      <button
                        className={`bg-[#33D805] text-white font-semibold py-2 px-10 rounded hover:bg-yellow-600 ${
                          startTime ? " cursor-not-allowed" : "cursor-pointer"
                        }`}
                        onClick={handleBeginClick}
                        disabled={startTime}
                      >
                        {loadingbegintime ? (
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
                            {t("Begin...")}
                          </div>
                        ) : (
                          // t("Begin")
                          t(startTime ? "started" : "Begin")
                        )}
                      </button>
                      <button
                        className={`bg-red-500 text-white font-semibold py-2 px-10 rounded hover:bg-blue-600 ${
                          endTime ? "cursor-not-allowed opacity-50" : ""
                        }`}
                        disabled={!!endTime} // Disable if endTime is not null
                        onClick={handleEndClick}
                      >
                        {loadingendtime ? (
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
                            {t("End...")}
                          </div>
                        ) : (
                          t("End")
                        )}
                      </button>
                    </div>
                  </div>
                  {/* Right side - Timing Information */}
                  <div className="flex flex-col space-y-4 mt-8">
                    <div className="flex gap-4">
                      <label className="text-gray-700 font-semibold mb-1 block">
                        Starting Time:
                      </label>
                      <span className="text-blue-700 font-bold text-lg">
                        {startTime}
                      </span>
                    </div>

                    <div className="flex gap-4">
                      <label className="text-gray-700 font-semibold mb-1 block">
                        Total Time:
                      </label>
                      <span className="text-blue-700 font-bold text-lg">
                        {totalTime}
                      </span>
                    </div>

                    <div className="flex gap-4">
                      <label className="text-gray-700 font-semibold mb-1 block">
                        Ending Time:
                      </label>
                      <span className="text-blue-700 font-bold text-lg">
                        {endTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned TO: */}
              <div className="mt-4">
                <h2 className="text-green-700 font-bold text-lg mb-2">
                  Assigned TO:{" "}
                  <span className="text-[#2113BA]">
                    {" "}
                    <strong className="text-blue-700">
                      {patientData?.department?.deptname}
                    </strong>
                  </span>
                </h2>
                <div className="flex gap-4">
                  {/* Left side - Bed Selection */}
                  <div className="w-1/2">
                    <div className="flex flex-col">
                      <label className="block text-gray-700 font-semibold mb-2">
                        Bed Number
                      </label>
                      <div className="flex gap-4">
                        <select
                          className="w-full border border-green-500 rounded px-3 py-2"
                          value={bednumber}
                          onChange={(e) => setbednumber(e.target.value)}
                        >
                          <option>Select Bed</option>
                          {Availablebed.map((beds) => (
                            <option key={beds.id} value={beds.id}>
                              {beds.bedNumber}
                            </option>
                          ))}
                        </select>

                        {/* Assign Bed Button */}
                        <button
                          className={`text-white px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 whitespace-nowrap ${
                            endTime ? "cursor-not-allowed opacity-50" : ""
                          }`}
                          onClick={Assignbed}
                          disabled={!!endTime} // Disable if endTime is not null
                        >
                          {loadingbed ? (
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
                              {t("Assign Bed...")}
                            </div>
                          ) : (
                            t("Assign Bed")
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-green-700 font-bold text-lg my-auto">
                    <h2 className="mt-8">
                      {" "}
                      Assigned Bed:{" "}
                      <span className="text-[#2113BA]">
                        {" "}
                        <strong className="text-blue-700">
                          {assignedbednumber}
                        </strong>
                      </span>
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                className={`text-white px-6 py-2 rounded-lg hover:bg-yellow-500  ${
                  callPatient
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-yellow-400 hover:bg-yellow-500"
                }`}
                onClick={handleCallPatientToggle}
              >
                {callPatient ? t("Cancel Call Patient") : t("Call Patient")}
              </button>
              <div className="flex space-x-4">
                <button
                  className={`bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 ${
                    endTime ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  onClick={() => {
                    setDischargeType('LAMA');
                    setShowDischargePopup(true);
                  }}
                  disabled={!!endTime} // Disable if endTime is not null
                >
                  {t("LAMA")}
                </button>
                <button
                  className={`bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 ${
                    endTime ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  onClick={() => {
                    setDischargeType('DAMA');
                    setShowDischargePopup(true);
                  }}
                  disabled={!!endTime} // Disable if endTime is not null
                >
                  {t("DAMA")}
                </button>
                
                <button 
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                  onClick={() => navigate("/monitoring")}
                >
                  {t("Close")}
                </button>
              </div>
            </div>
          </div>
          {/* // )} */}
        </div>

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold">Ticket Information</h2>
              {pdfUrl ? (
                <iframe
                  src={`${baseUrl}/${pdfUrl}`}
                  width="100%"
                  height="600px"
                  title="PDF Document"
                />
              ) : (
                <p>No PDF available</p>
              )}
              <button
                onClick={closePopup}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
        {isOpen && (
          <AssignPopup
            onClose={handleClose}
            patientId={id}
            onAssignSuccess={fetchPatientData}
          />
        )}
        {showDischargePopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Confirm {dischargeType} Discharge</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  rows="3"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter discharge remarks"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDischargePopup(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDischarge}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SideNav>
  );
};

export default Servingss;
