import { QRCodeSVG } from "qrcode.react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "react-phone-input-2/lib/style.css";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import SideNav from "../../components/Sidebar/SideNav";
import Spinner from "../../components/spinner/spinner";
import { baseUrl } from "../../utils/config";
import newRequest from "../../utils/newRequest";
import AssignPopup from "./assignPopup";
const WaitingArea = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showBandPopup, setShowBandPopup] = useState(false);
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
  const [Allergies, setAllergies] = useState("No");
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
  const [bloodGroup, setBloodGroup] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [mrnNumber, setMrnNumber] = useState("");

  const { isLoading, data, error, refetch } = useQuery("waitingarea", async () => {
    try {
      const response = await newRequest.get(`/api/v1/patients/${id}`);
      return response?.data?.data || {};
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  useEffect(() => {
    if (data) {
      const patient = data;
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
      // format date
      // setBirthDate(patient.birthDate.split('T')[0]);
      setBirthDate(patient.birthDate ? patient.birthDate.split('T')[0] : "");
      setMrnNumber(patient.mrnNumber);
      if (patient.vitalSigns?.length > 0) {
        const latestVitalSign = patient.vitalSigns[0];
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
  }, [data]);

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
        `/api/v2/patients/${patientId}/vital-sign`,
        body,
      );
      if (response.status >= 200) {
        toast.success(response?.data?.message || "Vital sign created successfully");
        refetch()
      } else {
        throw new Error(response?.data?.message || "Unexpected error");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to save vital sign";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCallPatientToggle = async () => {
    const newCallPatientStatus = !callPatient;
    setCallPatient(newCallPatientStatus);

    try {
      const response = await fetch(`${baseUrl}/api/v2/patients/${id}/toggle-call?call=first`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ callPatient: newCallPatientStatus }),
      });

      const data = await response.json();
      toast.success(data?.message || "Patient call status toggled successfully");
      refetch()
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };
  const openPopup = async () => {
    setShowPopup(true);
    refetch()
  };
  const closePopup = () => {
    setShowPopup(false);
  };

  const openBandPopup = () => {
    setShowBandPopup(true);
  };

  const closeBandPopup = () => {
    setShowBandPopup(false);
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
        refetch();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to discharge patient");
    }
  };

  const handleVoid = async () => {
    try {
      const response = await newRequest.patch(`/api/v2/patients/${id}/void`);
      if (response.status >= 200) {
        toast.success("Patient voided successfully");
        navigate("/monitoring"); // Navigate to monitoring screen
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to void patient");
    }
  };

  return (
    <div className="bg-gray-100">
      <SideNav>
        <div className="min-h-screen flex flex-col antialiased bg-white text-black">
          {/* {loading ? (
            <Spinner />
          ) : ( */}
          <div className="container mx-auto p-6">
            <div className="bg-green-50 shadow-md rounded-lg p-6">
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
                    //disable this input not changible
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

            <div className="bg-green-50 shadow-md rounded-lg p-6 mt-6">
              <h5 className="text-green-700 font-bold text-xl mb-4">
                Vital Sign
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { field: "BP", unit: "mmHg" },
                  { field: "HR", unit: "bpm" },
                  { field: "TEMP", unit: "°C" },
                  { field: "RR", unit: "/min" },
                  { field: "SPO2", unit: "%" },
                  { field: "RBS", unit: "mg/dL" },
                  { field: "Height", unit: "cm" },
                  { field: "Weight", unit: "kg" },
                ].map(({ field, unit }) => (
                  <div key={field}>
                    <label className="text-sm font-medium text-gray-700">
                      {t(field)} ({unit})
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={VitalSigns[field]}
                      onChange={handleVitalChange}
                      placeholder={t(`Enter ${field} (${unit})`)}
                      className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center space-x-4">
                <span className="text-sm font-medium text-red-700">
                  {t("Allergies")}
                </span>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="Allergies"
                      value="Yes"
                      checked={Allergies === "Yes"}
                      onChange={(e) => setAllergies(e.target.value)}
                      className="form-radio text-green-600"
                    />
                    <span className="ml-2 text-sm">{t("Yes")}</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="Allergies"
                      value="No"
                      checked={Allergies === "No"}
                      onChange={(e) => setAllergies(e.target.value)}
                      className="form-radio text-green-600"
                    />
                    <span className="ml-2 text-sm">{t("No")}</span>
                  </label>
                </div>
              </div>
              <div className="mt-6 flex items-center space-x-4">
                {patientData?.department &&
                  patientData?.department?.deptname !== "TR" && (
                    <span className="text-sm font-medium text-green-700">
                      {t("Assigned To  ")}
                      <strong className="text-blue-700">
                        {patientData?.department?.deptname}
                      </strong>
                    </span>
                  )}
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
              {/* /i want to their two button add his caption LAMA, DAMA/ */}

              <div className="flex space-x-4">
                {/* Save button - enabled after department is assigned */}
                <button
                  disabled={!patientData?.department}
                  className={`px-6 py-2 rounded-lg font-semibold ${
                    patientData?.department
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-400 text-gray-600 cursor-not-allowed opacity-60"
                  }`}
                  onClick={handleSave}
                >
                  {loading ? <Spinner /> : `${t("Save")}`}
                </button>
                {/* Print button - enabled after vital signs are saved */}
                <button
                  disabled={!patientData?.vitalSigns || patientData?.vitalSigns?.length === 0}
                  className={`px-6 py-2 rounded-lg font-semibold ${
                    patientData?.vitalSigns && patientData?.vitalSigns?.length > 0
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-400 text-gray-600 cursor-not-allowed opacity-60"
                  }`}
                  onClick={openBandPopup}
                >
                  {t("Print")}
                </button>
                {/* Assign button - always enabled (first step) */}
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-semibold"
                  onClick={handleOpen}
                >
                  {loading ? <Spinner /> : `${t("Assign")}`}
                </button>
                {/* Re-Print button - enabled when ticket exists */}
                <button
                  disabled={!pdfUrl}
                  className={`px-6 py-2 rounded-lg font-semibold ${
                    pdfUrl
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-400 text-gray-600 cursor-not-allowed opacity-60"
                  }`}
                  onClick={openPopup}
                >
                  {t("Re-Print")}
                </button>
                {/* Void button - enabled after department is assigned */}
                <button
                  disabled={!patientData?.department}
                  className={`px-6 py-2 rounded-lg font-semibold ${
                    patientData?.department
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gray-400 text-gray-600 cursor-not-allowed opacity-60"
                  }`}
                  onClick={handleVoid}
                >
                  {t("Void")}
                </button>
                {/* Close button - always enabled */}
                <button 
                  className="bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 px-6 py-2" 
                  onClick={() => window.close()}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
          {/* // )} */}
        </div>
      </SideNav>
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
          onAssignSuccess={refetch}
        />
      )}
      {showBandPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div
              id="printableArea"
              className="flex justify-center items-center m-auto"
              style={{
                height: "7in",
                width: "0.75in", // Added width for consistency
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div id="inside-BRCode" style={{ marginBottom: "40px" }}>
                <QRCodeSVG value={IDNumber} width="170" height="70" />
              </div>

              <div
                style={{
                  margin: "0 auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                {/* <div
                  className="text-xs p-1"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                > */}
                <div
                  style={{
                    writingMode: "vertical-lr",
                    textOrientation: "mixed",
                    transform: "rotate(180deg)",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    // alignItems: "center",
                    justifyContent: "center",
                    margin: "auto",
                    textAlign: "left",
                    lineHeight: "1.5",
                  }}
                >
                  <p style={{ fontSize: "14px" }} className="DOG">
                    MRN Number: {IDNumber}
                  </p>
                  <p style={{ fontSize: "14px" }} className="text-start DOG">
                    Date of Birth: {birthDate}
                  </p>
                  <p style={{ fontSize: "14px" }} className="text-start DOG">
                    Blood Type: {bloodGroup}
                  </p>
                  <p style={{ fontWeight: "bold", fontSize: "16px" }}>
                    {PatientName?.toUpperCase()}
                  </p>
                </div>
                {/* </div> */}
              </div>

              <div id="inside-BRCode" style={{ marginTop: "40px" }}>
                <QRCodeSVG value={IDNumber} width="170" height="70" />
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  const printContent = document.getElementById("printableArea");
                  const WinPrint = window.open("", "", "width=900,height=650");
                  WinPrint.document.write(`
    <html>
      <head>
        <style>
          @page {
            size: 0.75in 7in;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
          }
          #printableContent {
            width: 0.75in;
            height: 5in;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          p {
            font-size: 12px;
            margin: 0;
          }
          p:first-of-type {
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div id="printableContent">
          ${printContent.innerHTML}
        </div>
      </body>
    </html>
  `);
                  WinPrint.document.close();
                  WinPrint.focus();
                  setTimeout(() => {
                    WinPrint.print();
                    WinPrint.close();
                  }, 250);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Print
              </button>
              <button
                onClick={closeBandPopup}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showDischargePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">
              Confirm {dischargeType} Discharge
            </h2>
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
                Close
              </button>
              <button
                onClick={handleDischarge}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaitingArea;
