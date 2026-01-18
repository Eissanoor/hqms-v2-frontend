import { Spinner } from "@heroui/spinner";
import {
    Input,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@nextui-org/react";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import newRequest from "../../utils/newRequest";
import PickerFilter from "../PatientJourney2/PickerFilter";
import PickerSort from "../PatientJourney2/PickerSort";
import exportToExcel from "../../utils/exportToExcel";

// Utility function to format date-time
const formatDateTime = (dateString) => {
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

const PrevouseJourney = ({ data }) => {
  const [AllRoles, setAllRoles] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filters, setFilters] = useState({});
  const [exporting, setExporting] = useState(false);

  const buildFilters = () =>
    Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

  const fetchAllRoles = async () => {
    setLoading(true);
    try {
      const cleanFilters = buildFilters();

      const response = await newRequest.get("/api/v1/journeys/previous", {
        params: {
          page,
          sortBy,
          order: sortOrder,
          ...cleanFilters,
          search: search || undefined,
        },
      });
      setAllRoles(response?.data?.data?.journeys || []);
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

  const columns = [
    { name: "Name", uid: "name", sortable: true },
    { name: "MRN Number", uid: "mrnNumber", sortable: true },
    { name: "First Call", uid: "firstCallTime", sortable: true },
    { name: "Vital", uid: "vitalTime", sortable: true },
    { name: "Assign Department", uid: "assignDeptTime", sortable: true },
    { name: "Second Call", uid: "secondCallTime", sortable: true },
    { name: "Begin Time", uid: "beginTime", sortable: true },
    { name: "End Time", uid: "endTime", sortable: true },
  ];

  const renderCell = (journey, columnKey) => {
    switch (columnKey) {
      case "name":
        return <span>{journey?.patient?.name || ""}</span>;
      case "mrnNumber":
        return <span>{journey?.patient?.mrnNumber || ""}</span>;
      case "firstCallTime":
        return <span>{formatDateTime(journey?.firstCallTime)}</span>;
      case "vitalTime":
        return <span>{formatDateTime(journey?.vitalTime)}</span>;
      case "assignDeptTime":
        return <span>{formatDateTime(journey?.assignDeptTime)}</span>;
      case "secondCallTime":
        return <span>{formatDateTime(journey?.secondCallTime)}</span>;
      case "beginTime":
        return <span>{formatDateTime(journey?.beginTime)}</span>;
      case "endTime":
        return <span>{formatDateTime(journey?.endTime)}</span>;
      default:
        return null;
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const cleanFilters = buildFilters();
      const baseParams = {
        page: 1,
        sortBy,
        order: sortOrder,
        ...cleanFilters,
        search: search || undefined,
      };

      const firstResponse = await newRequest.get("/api/v1/journeys/previous", {
        params: baseParams,
      });
      const journeys = firstResponse?.data?.data?.journeys || [];
      const paginationData = firstResponse?.data?.data?.pagination || {};
      const totalPages = paginationData?.totalPages || 1;
      let allJourneys = [...journeys];

      for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
        const response = await newRequest.get("/api/v1/journeys/previous", {
          params: {
            ...baseParams,
            page: currentPage,
          },
        });
        allJourneys = allJourneys.concat(response?.data?.data?.journeys || []);
      }

      const rows = allJourneys.map((journey, index) => ({
        "#": index + 1,
        Name: journey?.patient?.name || "",
        "MRN Number": journey?.patient?.mrnNumber || "",
        "First Call": formatDateTime(journey?.firstCallTime),
        Vital: formatDateTime(journey?.vitalTime),
        "Assign Department": formatDateTime(journey?.assignDeptTime),
        "Second Call": formatDateTime(journey?.secondCallTime),
        "Begin Time": formatDateTime(journey?.beginTime),
        "End Time": formatDateTime(journey?.endTime),
      }));

      exportToExcel(rows, "previous-patient-journeys", "PreviousJourneys");
    } catch (error) {
      console.error("Failed to export previous journeys", error);
    } finally {
      setExporting(false);
    }
  };

  const topContent = useMemo(
    () => (
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Input
            isClearable
            value={search}
            onValueChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            className="w-full sm:max-w-[44%] rounded-lg focus:outline-none"
            placeholder="Search by patient name or MRN ..."
            startContent={<FaSearch className="text-default-300 me-2" />}
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
          <button
            onClick={handleExport}
            disabled={exporting}
            className="ml-auto px-3 py-1 text-sm font-medium rounded-md bg-green-700 text-white hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {exporting ? "Exporting..." : "Export Excel"}
          </button>
        </div>
      </div>
    ),
    [search, exporting, handleExport]
  );

  const bottomContent = useMemo(
    () => (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-sm text-gray-500">
          {pagination?.total || 0} Previous Patient Journey in total
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="secondary"
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
    <div style={{ width: "98%",margin:'auto' }}>
      <Table
        aria-label="Previous Patient Journey"
        bottomContent={bottomContent}
        topContent={topContent}
        topContentPlacement="outside"
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "shadow-md rounded-lg bg-white w-full",
          base: "h-[480px]",
          table: "min-h-[400px]",
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
              className="bg-gray-50 text-gray-600 uppercase"
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={AllRoles}
          emptyContent="No Previous Patient Journey found"
          isLoading={loading}
          loadingContent={<Spinner color="secondary" size="lg" />}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell className="whitespace-nowrap ">{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PrevouseJourney;
