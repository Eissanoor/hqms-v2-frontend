import React, { useMemo, useRef, useState} from "react";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import {Table, Pagination, TableBody, TableColumn, TableHeader, TableRow ,TableCell} from "@nextui-org/react";
const PatientJourneyDetails = ({ isVisible, setVisibility, selectdataPatientJourney,}) => {
    const patientsDate = selectdataPatientJourney;
    const { t } = useTranslation();
    const modalRef = useRef(null);
    if (!isVisible) return null;

     const [pagination, setPagination] = useState({});
     const [loading, setLoading] = useState(true);
     const [page, setPage] = useState(1);

       const formatDateTime = (dateTime) => {
         if (!dateTime) return ""; // Handle empty values
         const date = new Date(dateTime);
         if (isNaN(date.getTime())) return ""; // Check for valid date
         return date.toLocaleString("en-GB", {
           day: "2-digit",
           month: "2-digit",
           year: "numeric", // Fix: Use "numeric" instead of "4-digit"
           hour: "2-digit",
           minute: "2-digit",
           hour12: true,
         });
       };

       const calculateTotalHours = (treatmentEnded, registration) => {
         const treatmentEndedtime = new Date(treatmentEnded);
         const registrationtime = new Date(registration);
         const totalTime = treatmentEndedtime - registrationtime; // Difference in milliseconds
         const hours = Math.floor(totalTime / 3600000); // Convert to hours
         const minutes = Math.floor((totalTime % 3600000) / 60000); // Convert to minutes
         // If the total time is less than an hour, show "0 hrs"
         const displayHours = hours > 0 ? `${hours} hrs` : "0 hrs";
         return `${displayHours} ${minutes} min`; // Return formatted result
       };
     

      const columns = [
        { name: "Registration", uid: "registration", sortable: true },
        { name: "Triage", uid: "firstCall", sortable: true },
        { name: "Dept. Call", uid: "secondCall", sortable: true },
        { name: "Vital Signs", uid: "vitalSigns" },
        { name: "Department Assigned", uid: "departmentAssigned", sortable: true },
        { name: "Treatment Began", uid: "treatmentBegan", sortable: true },
        { name: "Treatment Ended", uid: "treatmentEnded", sortable: true },
        { name: "Total Hrs", uid: "totalHrs", sortable: false },
    ];

    console.log(patientsDate, "patientsDatepatientsDate");
     const renderCell = (Roless, columnKey) => {
        switch (columnKey) {

            case "registration":
                return <span>{formatDateTime(Roless?.createdAt) || ""}</span>;
            case "firstCall":
                return <span>{formatDateTime(Roless?.firstCallTime) || ""}</span>;
            case "secondCall":
                return <span>{formatDateTime(Roless?.secondCallTime) || ""}</span>;
            case "vitalSigns":
                return <span>{formatDateTime(Roless?.vitalTime) || ""}</span>;
            case "departmentAssigned":
                return (
                  <span>{formatDateTime(Roless?.assignDeptTime) || ""}</span>
                );
            case "treatmentBegan":
                return <span>{formatDateTime(Roless?.beginTime) || ""}</span>;
            case "treatmentEnded":
                return <span>{formatDateTime(Roless?.endTime) || ""}</span>;
            case "totalHrs":
                return (
                    <span>
                        {calculateTotalHours(Roless?.endTime, Roless?.createdAt) || ""}
                    </span>
                );
            default:
                return PatientJourneyDetails[columnKey];
        }
    };


console.log(patientsDate.journeys.length);

     const bottomContent = useMemo(
       () => (
         <div className="py-2 px-2 flex justify-between items-center">
           <span className="w-[30%] text-sm text-gray-500">
             {patientsDate.journeys?.length || 0} Patient Journey in total
           </span>
           {/* <Pagination
             isCompact
             showControls
             showShadow
             color="secondary"
             //  page={page}
             //  total={pagination?.totalPages || 1}
             //  onChange={setPage}
           /> */}
         </div>
       ),
       [page, pagination]
     );

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        {/* Modal Container */}
        <div
          ref={modalRef} // Attach the ref to the modal
          className="bg-white rounded-lg shadow-lg w-full max-w-7xl"
        >
          {/* Modal Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ backgroundColor: "#5B4DF5" }}
          >
            <h2 className="text-white text-xl font-semibold">
              {t("Patient Journey")}
            </h2>
            <div className="flex items-center gap-4">
              <button onClick={() => setVisibility(false)}>
                <CloseIcon style={{ color: "white" }} />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            <Table
              aria-label="Patient Journey"
              bottomContent={bottomContent}
              classNames={{
                wrapper: "shadow-md rounded-lg bg-white mt-6 w-full ",
              }}
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn
                    key={column.uid}
                    align={column.uid === "actions" ? "center" : "start"}
                    className="bg-gray-50 text-gray-600"
                  >
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody
                // items={patientsDate}
                // items={patientsDate?.journeys || []}
                 items={Array.isArray(patientsDate?.journeys) ? patientsDate.journeys : []}
                emptyContent="No Patient Journey found"
                isLoading={loading}
                // loadingContent={<Spinner color="secondary" size="lg" />}
              >
                {(item) => (
                  <TableRow key={item.patientId}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-gray-400"
                onClick={() => setVisibility(false)}
              >
                {t("Cancel")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
};

export default PatientJourneyDetails;
