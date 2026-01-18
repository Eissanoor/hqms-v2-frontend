import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DataTableProvider from "./Contexts/DataTableContext";
import { QueryClient, QueryClientProvider } from "react-query";
import RolesProvider from "./Contexts/FetchRolesContext.jsx";
import PatientInformation from "./Pages/patientInformation/patientInformation.jsx";
import Login from "./Pages/adminLogin/login.jsx";
import WaitingArea from "./Pages/waintingArea/waitingArea.jsx";
import Dashboard from "./Pages/dashboard/dashoboard.jsx";
import LocationAssignment from "./Pages/locationAssignment/locationAssignment.jsx";
import LocationWaitingArea from "./Pages/LocationWaitingArea/LocationWaitingArea.jsx";
import PatientTable from "./Pages/patientInformation/patientTable.jsx";
import Locationpage from "./Pages/Locationpage/Locationpage.jsx";
import Kpi from "./Pages/KPI/Kpi.jsx";
import PatientMonitoring from "./Pages/LocationWaitingArea/monitoring.jsx";
import PatientDisplay from "./Pages/patientDisplay/patientDisplay.jsx";
import UpdatePatientInformation from "./Pages/patientInformation/UpdatePatientInformation.jsx";
import Department from "./Pages/Department/Department.jsx";
import Users from "./Pages/MasterData/Users/Users.jsx";
import Roless from "./Pages/MasterData/Roles/Roless.jsx";
import Beds from "./Pages/MasterData/Beds/Beds.jsx";
import Servingss from "./Pages/Serving/Servingss.jsx";
import Departmentmonitoring from "./Pages/DepartmentWaitingList/Departmentmonitoring.jsx";
import newRequest from "./utils/newRequest.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import NotFound from "./Pages/NotFound/NotFound.jsx";
import PatientJourney from "./Pages/PatientJourney2/PatientJourney.jsx";
import Home from "./Pages/Home/Home.jsx";
const queryClient = new QueryClient();

export const RolesContext = createContext([]);

const App = () => {
  const [userRoles, setUserRoles] = useState([]);
  const accessuserdata = JSON.parse(localStorage.getItem("userdata"));
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await newRequest.get(`/api/v1/user/${accessuserdata?.user?.id || ""}`);
        setUserRoles(response?.data?.data?.roles?.map(role => role.name) || []);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);
  return (
    <>
      <DataTableProvider>
        <QueryClientProvider client={queryClient}>
          <RolesProvider>
            <div>
              <RolesContext.Provider value={userRoles}>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/Home" element={<Home />} />
                    <Route
                      path="/patient-information"
                      element={
                          <ProtectedRoute allowedRoles={["Registered Patients"]}>
                            <PatientInformation />
                          </ProtectedRoute>
                    }
                    />
                    <Route
                      path="/update/patient-information/:Id"
                      element={<UpdatePatientInformation />}
                    />
                    <Route path="/patient-table" element={<PatientTable />} />
                    <Route
                      path="/monitoring"
                      // element={<PatientMonitoring />}
                      element={
                        <ProtectedRoute allowedRoles={["Triage Waiting List"]}>
                          <PatientMonitoring />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/waiting-area/:id"
                      // element={<WaitingArea />}
                      element={
                        <ProtectedRoute allowedRoles={["Triage Waiting List"]}>
                          <WaitingArea />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/Servings/:id"
                      // element={<Servingss />}
                      element={
                        <ProtectedRoute allowedRoles={["Triage Waiting List"]}>
                          <Servingss />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      // element={<Dashboard />}
                      element={
                        <ProtectedRoute allowedRoles={["Dashboard"]}>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/location-assignment"
                      // element={<LocationAssignment />}
                      element={
                        <ProtectedRoute allowedRoles={["Location Assignment"]}>
                          <LocationAssignment />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/location-waiting-area/:id"
                      element={<LocationWaitingArea />}
                      // element={
                      //   <ProtectedRoute
                      //     allowedRoles={["location-waiting-area/:id"]}
                      //   >
                      //     <LocationWaitingArea />
                      //   </ProtectedRoute>
                      // }
                    />
                    <Route
                      path="/location"
                      // element={<Locationpage />}
                      element={
                        <ProtectedRoute allowedRoles={["location"]}>
                          <Locationpage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/kpi"
                      element={
                        <ProtectedRoute allowedRoles={["KPI"]}>
                          <Kpi />
                        </ProtectedRoute>
                      }
                    />
                    {/* <Route path="/kpi" element={<Kpi />} /> */}
                    <Route
                      path="/patient-display"
                      // element={<PatientDisplay />}
                      element={
                        <ProtectedRoute allowedRoles={["TV Screen"]}>
                          <PatientDisplay />
                        </ProtectedRoute>
                      }
                    />
                    {/* Master Data */}
                    <Route
                      path="/Department"
                      // element={<Department />}
                      element={
                        <ProtectedRoute allowedRoles={["MasterData"]}>
                          <Department />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/users"
                      // element={<Users />}
                      element={
                        <ProtectedRoute allowedRoles={["MasterData"]}>
                          <Users />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/Roles"
                      // element={<Roless />}
                      element={
                        <ProtectedRoute allowedRoles={["MasterData"]}>
                          <Roless />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/Beds"
                      // element={<Beds />}
                      element={
                        <ProtectedRoute allowedRoles={["MasterData"]}>
                          <Beds />
                        </ProtectedRoute>
                      }
                    />
                    {/* Department monitoring */}
                    <Route
                      path="/Department-monitoring/:id"
                      // element={<Departmentmonitoring />}
                      element={
                        <ProtectedRoute
                          allowedRoles={["Department Waiting List"]}
                        >
                          <Departmentmonitoring />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/PatientJourney"
                      element={
                        <ProtectedRoute allowedRoles={["Patient Journey"]}>
                          <PatientJourney />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </RolesContext.Provider>
            </div>
          </RolesProvider>
        </QueryClientProvider>
      </DataTableProvider>
    </>
  );
};

export default App;
