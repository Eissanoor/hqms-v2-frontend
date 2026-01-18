import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from "axios";
import { countries } from 'countries-list';
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import SideNav from "../../components/Sidebar/SideNav";
import Spinner from "../../components/spinner/spinner";
import { baseUrl } from "../../utils/config";

const countryList = Object.entries(countries).map(([code, country]) => ({
    name: country.name,
    code,
}));

const CountryDropdown = ({ value, onChange, t }) => (
  <Autocomplete
    disablePortal
    options={countryList.map((country) => country.name)}
    value={value}
    onChange={(event, newValue) => onChange({ target: { value: newValue } })}
    renderInput={(params) => (
      <TextField
        {...params}
        sx={{
          width: "100%",
          "& .MuiInputBase-root": {
            border: "1px solid #34D399",
            borderRadius: "8px",
          },
        }}
      />
    )}
    sx={{ width: "100%", mt: 1 }}
  />
);

const PatientInformation = () => {

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [PatientName, setPatientName] = useState("");
  const [IDNumber, setIDNumber] = useState("");
  const [Age, setAge] = useState("");
  const [Nationality, setNationality] = useState("Saudi Arabia");
  const [Sex, setSex] = useState("");
  const [Status, setStatus] = useState("Non-urgent");
  const [MobileNumber, setMobileNumber] = useState("");
  const [cheifComplaint, setcheifComplaint] = useState("");
  const [ticket, setTicket] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const [bloodGroup, setBloodGroup] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [mrnNumber, setMrnNumber] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const patientData = {
      name: PatientName,
      nationality: Nationality,
      sex: Sex,
      idNumber: IDNumber,
      age: Age,
      mobileNumber: MobileNumber,
      cheifComplaint: cheifComplaint,
      status: Status,
      bloodGroup: bloodGroup,
      birthDate: birthDate,
      mrnNumber: mrnNumber,
    };

    try {
      const response = await axios.post(`${baseUrl}/api/v2/patients`, patientData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        const { data } = response.data;
        setTicket(`${baseUrl}/${data.ticket}`);
        setPdfUrl(data.ticket);
        const pdfResponse = await axios.get(`${baseUrl}/${data.ticket}`, { responseType: 'blob' });
        const blobUrl = URL.createObjectURL(pdfResponse.data);
        setPdfBlobUrl(blobUrl);
        setShowPopup(true);
        toast.success("Successfully submitted patient data!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const printTicket = () => {
    const iframe = document.getElementById('pdfFrame');
    if (iframe) {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    }
  };

  const searchPatient = async () => {
    if (!searchValue.trim()) {
      toast.error("Please enter MRN, Mobile Number, or Iqama/Resident Number to search");
      return;
    }

    setLoading(true);
    try {
      const trimmedValue = searchValue.trim();
      
      // Build the search URL with only searchKey parameter
      const searchUrl = `${baseUrl}/api/v1/patients/search?searchKey=${encodeURIComponent(trimmedValue)}`;

      const response = await axios.get(searchUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.status === 200) {
        const patientData = response.data.data;
        setPatientId(patientData.id);
        setPatientName(patientData.name || "");
        setNationality(patientData.nationality || "Saudi Arabia");
        setSex(patientData.sex || "");
        setIDNumber(patientData.idNumber || "");
        setAge(patientData.age || "");
        setStatus(patientData.status || "Non-urgent");
        setMobileNumber(patientData.mobileNumber || "");
        setcheifComplaint(patientData.cheifComplaint || "");
        setBloodGroup(patientData.bloodGroup || "");
        setBirthDate(patientData.birthDate || "");
        setMrnNumber(patientData.mrnNumber || "");

        toast.success(response.data.message || "Patient found!");
      }
    } catch (error) {
      setPatientId(null);
      toast.error(error.response?.data?.message || "Patient not found");
      setPatientName("");
      setNationality("Saudi Arabia");
      setSex("");
      setAge("");
      setStatus("");
      setcheifComplaint("");
      setBloodGroup("");
      setBirthDate("");
      setMrnNumber("");
      setMobileNumber("");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!patientId) {
      toast.error("Please search for a patient first");
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        name: PatientName,
        nationality: Nationality,
        sex: Sex,
        idNumber: IDNumber,
        age: parseInt(Age),
        mobileNumber: MobileNumber,
        cheifComplaint: cheifComplaint,
        status: Status,
        bloodGroup: bloodGroup,
        birthDate: birthDate,
        mrnNumber: mrnNumber,
      };

      const response = await axios.post(
        `${baseUrl}/api/v2/patients/re-register/${patientId}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const { data } = response.data;
        setTicket(`${baseUrl}/${data.ticket}`);
        setPdfUrl(data.ticket);
        const pdfResponse = await axios.get(`${baseUrl}/${data.ticket}`, { responseType: 'blob' });
        const blobUrl = URL.createObjectURL(pdfResponse.data);
        setPdfBlobUrl(blobUrl);
        setShowPopup(true);
        toast.success("Patient information updated successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating patient information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100">
      <SideNav>
        <div className="min-h-screen flex flex-col antialiased bg-white text-black">
          <div className="container mx-auto p-6">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h5 className="text-green-600 text-2xl font-bold mb-6">
                Patient Information
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="patientName"
                    className="text-lg font-medium text-gray-700"
                  >
                    {t("Patient Name")}
                  </label>
                  <input
                    type="text"
                    id="patientName"
                    value={PatientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder={t("Enter patient name")}
                    className="w-full mt-2 p-3 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-300"
                  />
                </div>
                <div>
                  <label
                    htmlFor="nationality"
                    className="text-lg font-medium text-gray-700"
                  >
                    {t("Nationality")}
                  </label>
                  <CountryDropdown
                    value={Nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    t={t}
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="searchField"
                    className="text-lg font-medium text-gray-700"
                  >
                    {t("Search Patient (MRN / Mobile Number / Iqama/Resident Number)")}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="searchField"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          searchPatient();
                        }
                      }}
                      placeholder={t("Enter MRN, Mobile Number, or Iqama/Resident Number")}
                      className="w-full mt-2 p-3 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-300"
                    />
                    <button
                      onClick={searchPatient}
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="idNumber"
                    className="text-lg font-medium text-gray-700"
                  >
                    {t("ID Number")}
                  </label>
                  <input
                    type="text"
                    id="idNumber"
                    value={IDNumber}
                    onChange={(e) => setIDNumber(e.target.value)}
                    placeholder={t("Enter ID number")}
                    className="w-full mt-2 p-3 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-300"
                  />
                </div>
                <div>
                  <label
                    htmlFor="mobileNumber"
                    className="text-lg font-medium text-gray-700"
                  >
                    {t("Mobile Number")}
                  </label>
                  <div className="mt-2">
                    <PhoneInput
                      onChange={(e) => setMobileNumber(e)}
                      value={MobileNumber}
                      international
                      country={"sa"}
                      defaultCountry={"sa"}
                      inputProps={{
                        id: "mobileNumber",
                        placeholder: t("Enter mobile number"),
                      }}
                      inputStyle={{
                        width: "100%",
                        border: "1px solid #05D899",
                        borderRadius: "8px",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        fontSize: "16px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "white",
                        height: "auto",
                      }}
                      flagStyle={{
                        width: "80px",
                        height: "80px",
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="sex"
                    className="text-lg font-medium text-gray-700"
                  >
                    {t("Gender")}
                  </label>
                  <select
                    value={Sex}
                    onChange={(e) => setSex(e.target.value)}
                    id="sex"
                    className="w-full mt-2 p-3 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-300"
                  >
                    <option value="">{t("Select Gender")}</option>
                    <option value="M">{t("Male")}</option>
                    <option value="F">{t("Female")}</option>
                    {/* <option value="O">{t("Other")}</option> */}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="age"
                    className="text-lg font-medium text-gray-700"
                  >
                    {t("Age")}
                  </label>
                  <input
                    type="number"
                    id="age"
                    value={Age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder={t("Enter age")}
                    className="w-full mt-2 p-3 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-300"
                  />
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="text-lg font-medium text-gray-700"
                  >
                    {t("Status")}
                  </label>
                  <select
                    value={Status}
                    onChange={(e) => setStatus(e.target.value)}
                    id="status"
                    className="w-full mt-2 p-3 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-300"
                  >
                    
                    <option value="Non-urgent">{t("Non-urgent")}</option>
                    <option value="Urgent">{t("Urgent")}</option>
                    <option value="Critical">{t("Critical")}</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="bloodGroup"
                    className="text-lg font-medium text-gray-700"
                  >
                    {t("Blood Group")}
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    id="bloodGroup"
                    className="w-full mt-2 p-3 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-300"
                  >
                    <option value="">{t("Select Blood Group")}</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="birthDate"
                    className="text-lg font-medium text-gray-700"
                  >
                    {t("Birth Date")}
                  </label>
                  {/* format date */}

                  <input
                    type="date"
                    id="birthDate"
                    value={birthDate ? (birthDate.includes("T") ? birthDate.split("T")[0] : birthDate) : ""}
                    onChange={(e) => setBirthDate(e.target.value)}
                    placeholder={t("Enter birth date")}
                    className="w-full mt-2 p-3 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-300"
                  />
                </div>
                <div>
                  <label
                    htmlFor="mrnNumber"
                    className="text-lg font-medium text-gray-700"
                  >
                    {t("MRN Number")}
                  </label>
                  <input
                    type="text"
                    id="mrnNumber"
                    value={mrnNumber}
                    onChange={(e) => setMrnNumber(e.target.value)}
                    placeholder={t("Enter MRN number")}
                    className="w-full mt-2 p-3 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-300"
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="cheifComplaint"
                    className="text-lg font-medium text-gray-700"
                  >
                    {t("Chief Complaint")}
                  </label>
                  <textarea
                    id="cheifComplaint"
                    rows="4"
                    
                    onChange={(e) => setcheifComplaint(e.target.value)}
                    placeholder={t("Describe the complaint")}
                    className="w-full mt-2 p-3 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-300"
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
                  onClick={() => navigate(-1)}
                >
                  {t("Close")}
                </button>
                {patientId ? (
                  <button
                    onClick={handleUpdate}
                    type="button"
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
                  >
                    {t("Print Ticket")}
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    type="submit"
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
                  >
                    {t("Issue Ticket")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </SideNav>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold">Ticket Information</h2>
            {pdfBlobUrl ? (
              <iframe
                src={pdfBlobUrl}
                width="100%"
                height="600px"
                title="PDF Document"
                id="pdfFrame"
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
            <button
              onClick={printTicket}
              className="mt-4 ml-40 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Print
            </button>
          </div>
        </div>
      )}
      {loading && <Spinner />}
    </div>
  );
};

export default PatientInformation;
