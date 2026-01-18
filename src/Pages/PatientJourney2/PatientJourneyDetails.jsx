import {
    Card,
    Chip,
    Divider,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCalendarAlt, FaClock, FaExclamationTriangle } from "react-icons/fa";
import getTotalTimeString from "../../utils/Funtions/totalTimeCalculator";
import newRequest from "../../utils/newRequest";

const PatientJourneyDetails = ({
  isVisible,
  setVisibility,
  selectdataPatientJourney,
}) => {
  const patientsDate = selectdataPatientJourney;
  const { t } = useTranslation();
  
  const [loading, setLoading] = useState(true);
  const [patientsDateget, setpatientsDateget] = useState([]);
  const [patientdatelenght, setpatientdatelenght] = useState(0);

  const refreshUsersWithoutSearch = async () => {
    setLoading(true);
    try {
      const response = await newRequest.get(
        `/api/v1/journeys/patient/${patientsDate?.id || ""}`
      );
      setpatientsDateget(response?.data?.data || []);
      setpatientdatelenght(response?.data?.data?.length || 0);
    } catch (error) {
      console.error("Error fetching patient journey data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUsersWithoutSearch();
  }, [patientsDate?.id]);

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "-"; // Show dash for empty values
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) return "-"; // Check for valid date
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Calculate time difference between two dates in minutes
  const getTimeDifference = (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
    
    const diffMs = end - start;
    return Math.round(diffMs / 60000); // Convert to minutes
  };

  // Format time difference as hours and minutes
  const formatTimeDiff = (minutes) => {
    if (minutes === null) return "-";
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  const columns = [
    { name: "NAME", uid: "name" },
    { name: "MRN NUMBER", uid: "mrnNumber" },
    { name: "REGISTRATION", uid: "registration" },
    { name: "TRIAGE", uid: "firstCall" },
    { name: "TRIAGE WAIT", uid: "triageWait" },
    { name: "VITALS", uid: "vitalSigns" },
    { name: "DEPT. ASSIGNED", uid: "departmentAssigned" },
    { name: "DEPT. CALL", uid: "secondCall" },
    { name: "TREATMENT BEGAN", uid: "treatmentBegan" },
    { name: "TREATMENT ENDED", uid: "treatmentEnded" },
    { name: "TOTAL TIME", uid: "totalHrs" },
  ];

  const renderCell = (journey, columnKey) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="font-medium text-gray-900">
            {journey?.patient?.name || "-"}
          </div>
        );
      
      case "mrnNumber":
        return (
          <Chip size="sm" variant="flat" color="primary">
            {journey?.patient?.mrnNumber || "-"}
          </Chip>
        );
      
      case "registration":
        return (
          <div className="flex items-center gap-1">
            <FaCalendarAlt className="text-gray-400 text-xs" />
            <span>{formatDateTime(journey?.createdAt)}</span>
          </div>
        );
      
      case "firstCall":
        return <span>{formatDateTime(journey?.firstCallTime)}</span>;
      
      case "triageWait":
        return (
          <Tooltip content="Time between registration and triage">
            <Chip 
              size="sm" 
              variant="flat" 
              color={getTimeDifference(journey?.createdAt, journey?.firstCallTime) > 30 ? "warning" : "success"}
            >
              {formatTimeDiff(getTimeDifference(journey?.createdAt, journey?.firstCallTime))}
            </Chip>
          </Tooltip>
        );
      
      case "vitalSigns":
        return <span>{formatDateTime(journey?.vitalTime)}</span>;
      
      case "departmentAssigned":
        return (
          <div className="flex items-center gap-1">
            <span>{formatDateTime(journey?.assignDeptTime)}</span>
            {journey?.department?.deptname && (
              <Chip size="sm" variant="flat" color="secondary" className="ml-1">
                {journey?.department?.deptname}
              </Chip>
            )}
          </div>
        );
      
      case "secondCall":
        return <span>{formatDateTime(journey?.secondCallTime)}</span>;
      
      case "treatmentBegan":
        return <span>{formatDateTime(journey?.beginTime)}</span>;
      
      case "treatmentEnded":
        return <span>{formatDateTime(journey?.endTime)}</span>;
      
      case "totalHrs": {
        const totalTime = getTotalTimeString(
          journey.registrationDate,
          journey.firstCallTime,
          journey.vitalTime,
          journey.assignDeptTime,
          journey.secondCallTime,
          journey.beginTime,
          journey.endTime
        );
        
        return (
          <Tooltip content="Total patient journey time">
            <Chip 
              size="sm" 
              startContent={<FaClock />} 
              variant="solid" 
              color="success"
              className="font-medium bg-green-600 text-white"
            >
              {totalTime || "-"}
            </Chip>
          </Tooltip>
        );
      }
      
      default:
        return null;
    }
  };

  const renderSummary = () => {
    if (patientsDateget.length === 0) return null;
    
    // Calculate average total time for all journeys
    let totalCompletedJourneys = 0;
    let totalMinutes = 0;
    
    patientsDateget.forEach(journey => {
      if (journey.createdAt && journey.endTime) {
        const start = new Date(journey.createdAt);
        const end = new Date(journey.endTime);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          totalMinutes += (end - start) / 60000;
          totalCompletedJourneys++;
        }
      }
    });
    
    const avgMinutes = totalCompletedJourneys > 0 ? Math.round(totalMinutes / totalCompletedJourneys) : 0;
    const avgHours = Math.floor(avgMinutes / 60);
    const avgMins = avgMinutes % 60;
    
    return (
      <Card className="mt-4 p-4">
        <div className="flex flex-wrap gap-6 justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Journeys</p>
            <p className="text-xl font-bold">{patientdatelenght}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Average Journey Time</p>
            <p className="text-xl font-bold">
              {totalCompletedJourneys > 0 
                ? `${avgHours}h ${avgMins}m` 
                : "No completed journeys"}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Completed Journeys</p>
            <p className="text-xl font-bold">{totalCompletedJourneys} of {patientdatelenght}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Latest Visit</p>
            <p className="text-xl font-bold">
              {patientsDateget.length > 0 
                ? new Date(patientsDateget[0].createdAt).toLocaleDateString() 
                : "-"}
            </p>
          </div>
        </div>
      </Card>
    );
  };

  if (!isVisible) return null;

  return (
    <div className="p-0 m-0">
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Spinner color="success" size="lg" />
        </div>
      ) : patientsDateget.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FaExclamationTriangle className="text-amber-500 text-5xl mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Journey History Found</h3>
          <p className="text-gray-500 max-w-md">
            This patient has no recorded visits or journey history in the system.
          </p>
        </div>
      ) : (
        <>
          {renderSummary()}
          
          <Divider className="my-4" />
          
          <div className="mt-4">
            <Table
              aria-label="Patient Journey History"
              classNames={{
                wrapper: "shadow-sm rounded-lg border border-gray-200",
                th: "bg-green-50 text-green-800 font-medium text-xs py-3",
                td: "py-3",
              }}
              selectionMode="none"
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn 
                    key={column.uid}
                    className="text-xs uppercase tracking-wider"
                  >
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody
                items={patientsDateget}
                emptyContent="No journey history found"
              >
                {(item) => (
                  <TableRow key={item.id || item.patientId} className="hover:bg-gray-50">
                    {(columnKey) => (
                      <TableCell className="text-sm">
                        {renderCell(item, columnKey)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientJourneyDetails;
