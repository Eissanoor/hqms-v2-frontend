import { Spinner } from "@heroui/spinner";
import {
    Button,
    Input,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@nextui-org/react";
import React, { useEffect, useMemo, useState } from "react";
import { FaFileExcel, FaSearch, } from "react-icons/fa";
import SideNav from "../../components/Sidebar/SideNav";
import getTotalTimeString from "../../utils/Funtions/totalTimeCalculator";
import newRequest from "../../utils/newRequest";
import PickerFilter from "./PickerFilter";
import PickerSort from "./PickerSort";

export const VerticalDotsIcon = ({ size = 24, width, height, ...props }) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height={size || height}
            role="presentation"
            viewBox="0 0 24 24"
            width={size || width}
            {...props}
        >
            <path
                d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                fill="currentColor"
            />
        </svg>
    );
};

function PatientJourney() {
    const [AllRoles, setAllRoles] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [filters, setFilters] = useState({});
    
    const fetchAllRoles = async () => {
        setLoading(true);
        try {
            const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
                if (value !== "" && value !== null && value !== undefined) {
                    acc[key] = value;
                }
                return acc;
            }, {});

            const response = await newRequest.get("/api/v1/journeys/active", {
                params: { 
                    page,
                    sortBy, 
                    order: sortOrder,
                    ...cleanFilters,
                    search: search || undefined  // Add search parameter
                },
            });
            setAllRoles(response?.data?.data?.data || []);
            setPagination(response.data.data.pagination);
        } catch (error) {
            console.error("Error fetching Role:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllRoles();
    }, [page, sortBy, sortOrder, filters, search]);

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
      { name: "Name", uid: "name", sortable: true },
      { name: "MRN Number", uid: "mrnNumber", sortable: true },
      {name: "Registration Date", uid: "registrationDate", sortable: true},
      { name: "First Call", uid: "firstCallTime", sortable: true },
      { name: "Vital", uid: "vitalTime", sortable: true },
      { name: "Assign Department", uid: "assignDeptTime", sortable: true },
      { name: "Second Call", uid: "secondCallTime", sortable: true },
      { name: "Begin Time", uid: "beginTime", sortable: true },
      { name: "End Time", uid: "endTime", sortable: true },
      { name: "Total Hrs", uid: "totalHrs", sortable: true },
    ];

    const renderCell = (journey, columnKey) => {
        const formatDate = (dateString) => {
            if (!dateString) return "Not Set";
            const date = new Date(dateString);
            return new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }).format(date);
        };

        switch (columnKey) {
          case "name":
            return <span>{journey?.patient?.name || ""}</span>;
          case "mrnNumber":
            return <span>{journey?.patient?.mrnNumber || ""}</span>;
          case "registrationDate":
            return <span>{formatDate(journey?.createdAt)}</span>;
          case "firstCallTime":
            return <span>{formatDate(journey?.firstCallTime)}</span>;
          case "vitalTime":
            return <span>{formatDate(journey?.vitalTime)}</span>;
          case "assignDeptTime":
            return <span>{formatDate(journey?.assignDeptTime)}</span>;
          case "secondCallTime":
            return <span>{formatDate(journey?.secondCallTime)}</span>;
          case "beginTime":
            return <span>{formatDate(journey?.beginTime)}</span>;
          case "endTime":
            return <span>{formatDate(journey?.endTime)}</span>;
          case "totalHrs":
            return (
              <span>
                {getTotalTimeString(journey.registrationDate, journey.firstCallTime, journey.vitalTime, journey.assignDeptTime, journey.secondCallTime, journey.beginTime, journey.endTime) ||
                ""}
              </span>
            );
          default:
            return null;
        }
    };

      const handleExport = async () => {
        try {
            const response = await newRequest.get("/api/v1/journeys/export", {
            responseType: 'blob' // Important for handling file downloads
        });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement("a");
            a.href = url;
            a.download = `patient_journeys_${new Date().toISOString().split("T")[0]}.xlsx`;

            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export. Please try again.");
        }
    };

    const bottomContent = useMemo(
      () => (
        <div className="py-2 px-2 flex justify-between items-center">
          <span className="w-[30%] text-sm text-gray-500">
            {pagination?.total || 0} Patient Journey in total
          </span>
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pagination?.totalPages || 1}
            onChange={setPage}
          />
        </div>
      ),
      [page, pagination]
    );

    const handleColumnSort = (descriptor) => {
        const newSortBy = descriptor.column;
        const newSortOrder = descriptor.direction === "ascending" ? "asc" : "desc";
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
    };

    return (
      <SideNav>
        <div className="p-6 bg-gray-50 min-h-screen">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Patient Journey</h2>
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex flex-wrap items-center gap-4">
                <Input
                  isClearable
                  value={search}
                  onValueChange={(value) => {
                    setSearch(value);
                    setPage(1); // Reset to first page when searching
                  }}
                  className="w-full sm:max-w-[44%] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Search by patient name or MRN ..."
                  startContent={<FaSearch className="text-gray-400 me-2" />}
                />

                <PickerFilter
                  onFilterChange={(newFilters) => {
                    setFilters(newFilters);
                    fetchAllRoles();
                  }}
                />

                <PickerSort
                  onSort={({ sortBy: newSortBy, sortOrder: newSortOrder }) => {
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                  }}
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                />

                <Button
                  className="bg-green-600 text-white hover:bg-green-700 transition-all duration-300 rounded-lg py-2 px-4 flex items-center gap-2"
                  startContent={<FaFileExcel />}
                  onClick={handleExport}
                >
                  Export to Excel
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto" style={{ maxWidth: '100%' }}>
              <Table
                aria-label="Patient Journey"
                bottomContent={bottomContent}
                topContent={null}
                classNames={{
                  wrapper: "shadow-md rounded-lg bg-white mt-6 w-full min-w-[1200px]", // Set a minimum width
                  base: "min-w-full table-fixed", // Use table-fixed for better column control
                  th: "bg-green-50 text-green-800 font-semibold text-xs uppercase tracking-wide py-3 px-3",
                  td: "py-3 px-3 text-sm whitespace-nowrap text-gray-700",
                  tr: "border-b border-gray-100 hover:bg-green-50/30 transition-colors duration-150 cursor-pointer",
                  tbody: "divide-y divide-gray-100",
                  table: "min-w-full"
                }}
                sortDescriptor={{
                  column: sortBy,
                  direction: sortOrder === "asc" ? "ascending" : "descending",
                }}
                onSortChange={handleColumnSort}
              >
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn
                      key={column.uid}
                      align={column.uid === "actions" ? "center" : "start"}
                    >
                      {column.name}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody
                  items={AllRoles}
                  emptyContent={
                    <div className="text-center text-gray-500 py-8">
                      No Patient Journey found
                    </div>
                  }
                  isLoading={loading}
                  loadingContent={
                    <div className="flex justify-center items-center py-8">
                      <Spinner color="success" size="lg" />
                    </div>
                  }
                >
                  {(item) => (
                    <TableRow
                      key={item.id}
                    >
                      {(columnKey) => (
                        <TableCell>
                          {renderCell(item, columnKey)}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </SideNav>
    );
}

export default PatientJourney;
