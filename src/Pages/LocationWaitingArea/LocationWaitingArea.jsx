import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useParams } from "react-router-dom";
import SideNav from "../../components/Sidebar/SideNav";
import { baseUrl } from "../../utils/config";

const LocationWaitingArea = () => {
    const { id } = useParams();
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
    const [patientData, setPatientData] = useState({
        name: "",
        nationality: "Select Nationality",
        sex: "",
        idNumber: "",
        age: "",
        mobileNumber: "",
        chiefComplaint: "",
        beginTime:""
    });
    const [assignedTo, setAssignedTo] = useState("");
    const [departmentName, setDepartmentName] = useState("");

    const handleVitalChange = (e) => {
        setVitalSigns({ ...VitalSigns, [e.target.name]: e.target.value });
    };

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const options = { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
        return date.toLocaleString('en-GB', options).replace(',', '');
    };

    const fetchPatientData = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/v1/patients/${id}`);
            const data = await response.json();
            if (data.success) {
                setPatientData({
                    name: data.data.name,
                    nationality: data.data.nationality,
                    sex: data.data.sex,
                    idNumber: data.data.idNumber,
                    age: data.data.age,
                    mobileNumber: data.data.mobileNumber,
                    chiefComplaint: data.data.cheifComplaint,
                    beginTime: data.data.beginTime ? formatDateTime(data.data.beginTime) : "",
                });
               
                setVitalSigns({
                    BP: data.data.vitalSigns[0].bp,
                    HR: data.data.vitalSigns[0].hr,
                    TEMP: data.data.vitalSigns[0].temp,
                    RR: data.data.vitalSigns[0].rr,
                    SPO2: data.data.vitalSigns[0].spo2,
                    RBS: data.data.vitalSigns[0].rbs,
                    Height: data.data.vitalSigns[0].height,
                    Weight: data.data.vitalSigns[0].weight,
                    TimeVS: formatDateTime(data.data.vitalSigns[0].timeVs),
                });
                setAssignedTo(data.data.user.name);
                setDepartmentName(data.data.department.deptname);
                console.log("begin time ", patientData.beginTime || "")
            }
        } catch (error) {
            console.error("Error fetching patient data:", error);
        }
    };
   
    const handleBeginClick = async () => {
      console.log("Response Status1:");
        
        try {
            const response = await fetch(`${baseUrl}/api/v2/patients/${id}/begin-time`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                // Replace with actual userId if needed
            });

            console.log("Response Status:", response.status); // Log the response status

            const data = await response.json();
            if (data.success) {
                console.log("API call successful:", data); // Log the successful response
                fetchPatientData(); // Refresh patient data
            } else {
                console.error("Error in API response:", data.message);
            }
        } catch (error) {
            console.error("Error calling begin-time API:", error);
        }
    };
    useEffect(() => {
      fetchPatientData();
  }, []);
    

    return (
      <>
        <SideNav>
          <div className="min-h-screen bg-green-100 p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-green-700 text-xl font-bold">EB TN # 5</h1>
              <h1 className="text-green-700 text-xl font-bold">ACU: 1</h1>
              <p className="text-gray-600">01/11/2016 08:45:47</p>
            </div>

            {/* Form */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <form>
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Patient Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Patient Name"
                      value={patientData.name}
                      onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                      className="w-full border border-green-500 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Nationality
                    </label>
                    <select
                      value={patientData.nationality}
                      onChange={(e) => setPatientData({ ...patientData, nationality: e.target.value })}
                      className="w-full border border-green-500 rounded px-3 py-2"
                    >
                      <option value="Saudi">Saudi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Mobile Number
                    </label>
                    <PhoneInput
                      international
                      country={"sa"}
                      defaultCountry={"sa"}
                      value={patientData.mobileNumber}
                      onChange={(value) => setPatientData({ ...patientData, mobileNumber: value })}
                      inputProps={{
                        id: "mobileNumber",
                        placeholder: "Enter mobile number",
                      }}
                      inputStyle={{
                        width: "100%",
                        border: "1px solid #05D899",
                        borderRadius: "8px",
                        paddingTop: "7px",
                        paddingBottom: "7px",
                        fontSize: "16px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "white",
                        height: "auto",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      ID Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter ID Number"
                      value={patientData.idNumber}
                      onChange={(e) => setPatientData({ ...patientData, idNumber: e.target.value })}
                      className="w-full border border-green-500 rounded px-3 py-2"
                    />
                  </div>
                </div>
                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Age
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Age"
                      value={patientData.age}
                      onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                      className="w-full border border-green-500 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Sex
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Sex"
                      value={patientData.sex}
                      onChange={(e) => setPatientData({ ...patientData, sex: e.target.value })}
                      className="w-full border border-green-500 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Chief Complaint
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Chief Complaint"
                      value={patientData.chiefComplaint}
                      onChange={(e) => setPatientData({ ...patientData, chiefComplaint: e.target.value })}
                      className="w-full border border-green-500 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Category
                    </label>
                    <select className="w-full border border-green-500 rounded px-3 py-2">
                      <option>Select</option>
                    </select>
                  </div>
                </div>
                {/* Chief Complaint */}
                <div className="col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Chief Complaint
                  </label>
                  <textarea
                    id="chiefComplaint"
                    placeholder="Describe the complaint"
                    value={patientData.chiefComplaint}
                    onChange={(e) => setPatientData({ ...patientData, chiefComplaint: e.target.value })}
                    className="w-full mt-2 p-3 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-300"
                  ></textarea>
                </div>
                {/* Vital Sign */}
                <div className="my-4">
                  <h2 className="text-green-700 text-lg  font-bold mb-2">
                    Vital Sign
                  </h2>
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
                      "TimeVS",
                    ].map((field) => (
                      <div key={field}>
                        <label className="text-sm font-medium text-gray-700">
                          {field}
                        </label>
                        <input
                          type="text"
                          name={field}
                          value={VitalSigns[field]}
                          onChange={handleVitalChange}
                          placeholder={`Enter ${field}`}
                          className="w-full border border-green-500 rounded px-3 py-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Allergies */}
                <div className="flex w-full justify-between items-center my-auto">
                  {/* First Section */}
                  <div className="mt-6 flex items-center space-x-4 my-auto">
                    <span className="text-md font-medium text-Allergies">
                      Allergies
                    </span>
                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="Allergies"
                          value="Yes"
                          checked={Allergies === "Yes"}
                          onChange={(e) => setAllergies(e.target.value)}
                          className="form-radio peer hidden"
                        />
                        <span className="w-4 h-4 border-4 border-black rounded-full flex items-center justify-center">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              Allergies === "Yes"
                                ? "bg-[#EC5B01]"
                                : "bg-transparent"
                            }`}
                          ></span>
                        </span>
                        <span className="ml-2 text-sm">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="Allergies"
                          value="No"
                          checked={Allergies === "No"}
                          onChange={(e) => setAllergies(e.target.value)}
                          className="form-radio peer hidden"
                        />
                        <span className="w-4 h-4 border-4 border-black rounded-full flex items-center justify-center">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              Allergies === "No"
                                ? "bg-[#EC5B01]"
                                : "bg-transparent"
                            }`}
                          ></span>
                        </span>
                        <span className="ml-2 text-sm">No</span>
                      </label>
                      {Allergies === "Yes" && (
                        <div>
                          <label className="block text-green-700 font-semibold mb-2">
                            Specify
                          </label>
                          <input
                            type="text"
                            placeholder="Specify"
                            className="p-2 border border-green-500 rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Second Section */}
                  <div className="flex items-center justify-end w-full space-x-4">
                    {/* Input Field */}
                    <div className="flex flex-col items-start">
                      <label className="block text-green-700 font-semibold mb-2">
                        Start
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Start"
                        // value={patientData.beginTime || ""}
                        className="w-full border border-green-500 rounded px-3 py-2"
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-2 mt-7">
                      <button 
                        type="button"
                        className="bg-[#33D805] text-white font-semibold py-2 px-10 rounded hover:bg-yellow-600"
                        onClick={handleBeginClick}
                      >
                        Begin
                      </button>
                      <button className="bg-red-500 text-white font-semibold py-2 px-10 rounded hover:bg-blue-600">
                        End
                      </button>
                    </div>
                  </div>
                </div>
                {/* Assigned TO: */}
                <div className="mt-4">
                  <h2 className="text-green-700 font-bold text-lg mb-2">
                    Assigned TO: <span className="text-[#2113BA]">{departmentName}</span>
                  </h2>
                 
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    {/* Select Element */}
                    <div className="col-span-1">
                      <label className="block text-gray-700 font-semibold mb-2">
                        Bed
                      </label>
                      <select className="w-full border border-green-500 rounded px-3 py-2">
                        <option value="Saudi">Select Bed</option>
                      </select>
                    </div>

                    {/* Input Element */}
                    <div className="col-span-3">
                      <label className="block text-gray-700 font-semibold mb-2">
                        To Remarks
                      </label>
                      <input
                        type="text"
                        placeholder="Enter To Remarks"
                        className="w-full border border-green-500 rounded px-3 py-2"
                      />
                    </div>
                  </div>
                </div>
                {/* Buttons */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6">
                  <button className="bg-yellow-500 text-white font-semibold py-2 rounded hover:bg-yellow-600">
                    Call Patient
                  </button>
                  <button className="bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600">
                    Assign
                  </button>
                  <button className="bg-green-500 text-white font-semibold py-2 rounded hover:bg-green-600">
                    Save
                  </button>

                  <button className="bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600">
                    Void
                  </button>
                  <button className="bg-orange-500 text-white font-semibold py-2 rounded hover:bg-orange-600">
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </SideNav>
      </>
    );
};

export default LocationWaitingArea;
