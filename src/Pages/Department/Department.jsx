import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Pagination,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@nextui-org/react";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaBuilding, FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import SideNav from "../../components/Sidebar/SideNav";
import newRequest from "../../utils/newRequest";
import AddDepartment from "./AddDepartment";
import UpdateDepartment from "./UpdateDepartment";

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

function Department() {
    const [departments, setDepartments] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [isAdddepartmentModalOpen, setIsAdddepartmentModalOpen] = useState(false);
    const [editDepartment, seteditDepartment] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const response = await newRequest.get("/api/v1/departments", {
                params: { page, search },
            });
            setDepartments(response?.data?.data?.data || []);
            setPagination(response.data.data.pagination);

        } catch (error) {
            console.error("Error fetching departments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, [page, search]);

    const handleDelete = async (department) => {
        Swal.fire({
            title: `Are you sure to delete this record?`,
            text: `You will not be able to recover this! ${department?.deptname || ""}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: `Yes, Delete!`,
            cancelButtonText: `No, keep it!`,
            confirmButtonColor: "#16a34a",
            cancelButtonColor: "#FF0032",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await newRequest.delete(`/api/v1/departments/${department?.deptcode}`);
                    toast.success(response?.data?.message || "Department has been deleted successfully");
                    fetchDepartments();
                } catch (error) {
                    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
                    toast.error(errorMessage);
                }
            }
        });
    };

    const handleedit = (department) => {
      setSelectedDepartment(department);
      seteditDepartment(true);
    };

    const columns = [
        { name: "DEPARTMENT NAME", uid: "name" },
        { name: "DEPARTMENT CODE", uid: "code" },
        { name: "ACTIONS", uid: "actions" },
    ];

    const renderCell = (department, columnKey) => {
        switch (columnKey) {
            case "name":
                return (
                    <div className="flex items-center gap-2">
                        <FaBuilding className="text-green-600" />
                        <span className="font-medium text-gray-900">{department.deptname || "Uncategorized"}</span>
                    </div>
                );
            case "code":
                return (
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                        {department.deptcode || "Uncategorized"}
                    </span>
                );
            case "actions":
                return (
                    <div className="relative flex justify-center items-center">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button 
                                    isIconOnly 
                                    size="sm" 
                                    variant="light" 
                                    className="text-gray-500 hover:text-green-600 transition-colors duration-200"
                                >
                                    <VerticalDotsIcon />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu 
                                aria-label="Department actions" 
                                className="bg-white shadow-lg rounded-lg p-1 border border-gray-200"
                            >
                                <DropdownItem
                                    key="edit"
                                    className="py-2 px-4 flex items-center gap-2 hover:bg-green-50 rounded-md text-gray-700 transition-all duration-200"
                                    startContent={<FaEdit className="text-green-600" />}
                                    onClick={() => handleedit(department)}
                                >
                                    Edit Department
                                </DropdownItem>
                                <DropdownItem
                                    key="delete"
                                    className="py-2 px-4 hover:bg-red-50 rounded-md text-red-600 transition-all duration-200 flex items-center gap-2"
                                    startContent={<FaTrash />}
                                    onClick={() => handleDelete(department)}
                                >
                                    Delete Department
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return department[columnKey];
        }
    };

    const topContent = useMemo(
        () => (
            <div className="flex flex-col gap-4 mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Department Management</h2>
                <div className="flex justify-between items-center">
                    <div className="relative w-full sm:max-w-[44%]">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                            isClearable
                            value={search}
                            onValueChange={setSearch}
                            className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                            classNames={{
                                input: "pl-8",
                                inputWrapper: "border-0 bg-transparent",
                                clearButton: "text-gray-500"
                            }}
                            placeholder="Search by department name..."
                        />
                    </div>

                    <Button
                        className="bg-green-600 text-white hover:bg-green-700 transition-all duration-300 rounded-lg px-5 py-2.5 flex items-center gap-2"
                        startContent={<FaPlus />}
                        onClick={() => setIsAdddepartmentModalOpen(true)}
                    >
                        Add New Department
                    </Button>
                </div>
            </div>
        ),
        [search]
    );

    const bottomContent = useMemo(
        () => (
            <div className="py-3 px-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                    {pagination?.total || 0} departments in total
                </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pagination?.totalPages || 1}
                    onChange={setPage}
                    classNames={{
                        wrapper: "gap-1",
                        item: "bg-transparent text-gray-700 hover:bg-green-50",
                        cursor: "bg-green-600 text-white font-medium"
                    }}
                />
            </div>
        ),
        [page, pagination]
    );

    return (
        <SideNav>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <Table
                        aria-label="Departments table"
                        bottomContent={bottomContent}
                        topContent={topContent}
                        classNames={{
                            wrapper: "rounded-lg overflow-hidden",
                            base: "overflow-x-auto",
                            th: "bg-green-50 text-green-800 font-semibold text-xs uppercase tracking-wide py-3.5 px-4",
                            td: "py-3 px-4 text-sm",
                            tr: "border-b border-gray-100 hover:bg-green-50/30 transition-colors duration-150",
                            tbody: "divide-y divide-gray-100",
                            table: "min-w-full"
                        }}
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
                            items={departments}
                            emptyContent={
                                <div className="text-center text-gray-500 py-8">No departments found</div>
                            }
                            isLoading={loading}
                            loadingContent={
                                <div className="flex justify-center items-center py-8">
                                    <Spinner color="success" size="lg" />
                                </div>
                            }
                        >
                            {(item) => (
                                <TableRow key={item.deptcode}>
                                    {(columnKey) => (
                                        <TableCell>{renderCell(item, columnKey)}</TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {isAdddepartmentModalOpen && (
                <AddDepartment
                    isVisible={isAdddepartmentModalOpen}
                    setVisibility={() => setIsAdddepartmentModalOpen(false)}
                    refreshDepartments={fetchDepartments}
                />
            )}
            {editDepartment && (
                <UpdateDepartment
                    isVisible={editDepartment}
                    setVisibility={() => seteditDepartment(false)}
                    refreshDepartments={fetchDepartments}
                    selectdatadepartment={selectedDepartment}
                />
            )}
        </SideNav>
    );
}

export default Department;
