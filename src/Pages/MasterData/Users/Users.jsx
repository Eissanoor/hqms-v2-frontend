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
import { FaSearch, FaTrash, FaUserPlus } from "react-icons/fa";
import { IoPersonRemove } from "react-icons/io5";
import Swal from "sweetalert2";
import SideNav from "../../../components/Sidebar/SideNav";
import newRequest from "../../../utils/newRequest";
import AddUser from "./AddUser";
import AssignRoles from "./AssignRoles";
import Removeassignrole from "./Removeassignrole";


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

function Users() {
    const [Userdata, setUserdata] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [UserAssignRoles, setUserAssignRoles] = useState(false);
    const [selectedUsers, setselectedUsers] = useState(null);
    const [removeUserAssignRoles, setremoveUserAssignRoles] = useState(false)
    const [removeselectedUsers, setremoveselectedUsers] = useState(null);
    const [showAddUser, setShowAddUser] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await newRequest.get("/api/v1/user", {
                params: { page, search },
            });
            setUserdata(response?.data?.data?.users || []);
            setPagination(response.data.data.pagination);
        } catch (error) {
            console.error("Error fetching User:", error);
        } finally {
            setLoading(false);
        }
    };

    const refreshUsersWithoutSearch = async () => {
        setLoading(true);
        try {
            const response = await newRequest.get("/api/v1/user", {
                params: { page }
            });
            setUserdata(response?.data?.data?.users || []);
            setPagination(response.data.data.pagination);
            setSearch("");
        } catch (error) {
            console.error("Error fetching User:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    const handleDelete = async (User) => {
        Swal.fire({
            title: `Are you sure to delete this record?`,
            text: `You will not be able to recover this! ${User?.name || ""}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: `Yes, Delete!`,
            cancelButtonText: `No, keep it!`,
            confirmButtonColor: "#16a34a",
            cancelButtonColor: "#FF0032",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await newRequest.delete(`/api/v1/user/${User?.id}`);
                    toast.success(response?.data?.message || "User has been deleted successfully");
                    fetchUsers();
                } catch (error) {
                    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
                    toast.error(errorMessage);
                }
            }
        });
    };

    const handleAssignrole = (department) => {
        setselectedUsers(department);
        setUserAssignRoles(true);
    };

    const handleAssignroleremove = (roles) => {
        setremoveselectedUsers(roles);
        setremoveUserAssignRoles(true);
    };

    const columns = [
        { name: "NAME", uid: "name" },
        { name: "EMAIL", uid: "email" },
        { name: "ROLE", uid: "role" },
        { name: "ACTIONS", uid: "actions" },
    ];

    const renderCell = (Roles, columnKey) => {
        switch (columnKey) {
            case "name":
                return <span className="font-medium text-gray-900">{Roles.name || ""}</span>;
            case "email":
                return <span className="text-gray-700">{Roles.email || ""}</span>;
            case "role":
                return (
                    <div className="max-w-[500px] overflow-hidden">
                        {Roles.roles && Roles.roles.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                                {Roles.roles.map((role, index) => (
                                    <span 
                                        key={index}
                                        className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200"
                                        title={role.name}
                                    >
                                        {role.name}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <span className="text-gray-400 text-sm italic">No Role Assigned</span>
                        )}
                    </div>
                );
            case "actions":
                return (
                    <div className="relative flex justify-center items-center">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light" className="text-gray-500 hover:text-green-600">
                                    <VerticalDotsIcon />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu 
                                aria-label="User actions" 
                                className="bg-white shadow-lg rounded-lg p-1 border border-gray-200"
                            >
                                <DropdownItem
                                    key="Assign"
                                    className="py-2 px-4 flex items-center gap-2 hover:bg-green-50 rounded-md text-gray-700 transition-all duration-200"
                                    startContent={<FaUserPlus className="text-green-600" />}
                                    onClick={() => handleAssignrole(Roles)}
                                >
                                    Assign Role
                                </DropdownItem>
                                <DropdownItem
                                    key="Remove"
                                    className="py-2 px-4 flex items-center gap-2 hover:bg-green-50 rounded-md text-gray-700 transition-all duration-200"
                                    startContent={<IoPersonRemove className="text-orange-500" />}
                                    onClick={() => handleAssignroleremove(Roles)}
                                >
                                    Remove Role
                                </DropdownItem>
                                <DropdownItem
                                    key="delete"
                                    className="py-2 px-4 hover:bg-red-50 rounded-md text-red-600 transition-all duration-200 flex items-center gap-2"
                                    startContent={<FaTrash />}
                                    onClick={() => handleDelete(Roles)}
                                >
                                    Delete
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return Roles[columnKey];
        }
    };

    const topContent = useMemo(
        () => (
            <div className="flex flex-col gap-4 mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">User Management</h2>
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
                            placeholder="Search by user name..."
                        />
                    </div>
                    <Button 
                        className="bg-green-600 text-white hover:bg-green-700 transition-all duration-300 rounded-lg px-5 py-2.5 flex items-center gap-2"
                        onPress={() => setShowAddUser(true)}
                    >
                        <FaUserPlus />
                        Add New User
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
                    {pagination?.total || 0} Users in total
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
                        aria-label="Users table"
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
                            items={Userdata}
                            emptyContent={
                                <div className="text-center text-gray-500 py-8">No users found</div>
                            }
                            isLoading={loading}
                            loadingContent={
                                <div className="flex justify-center items-center py-8">
                                    <Spinner color="success" size="lg" />
                                </div>
                            }
                        >
                            {(item) => (
                                <TableRow key={item.id}>
                                    {(columnKey) => (
                                        <TableCell>{renderCell(item, columnKey)}</TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {UserAssignRoles && (
                <AssignRoles
                    isVisible={UserAssignRoles}
                    setVisibility={() => setUserAssignRoles(false)}
                    refreshDepartments={fetchUsers}
                    selectdatauser={selectedUsers}
                />
            )}
            {removeUserAssignRoles && (
                <Removeassignrole
                    isVisible={removeUserAssignRoles}
                    setVisibility={() => setremoveUserAssignRoles(false)}
                    refreshuser={fetchUsers}
                    selectdatauser={removeselectedUsers}
                />
            )}
            <AddUser
                isVisible={showAddUser}
                setVisibility={setShowAddUser}
                refreshUsers={refreshUsersWithoutSearch}
            />
        </SideNav>
    );
}

export default Users;
