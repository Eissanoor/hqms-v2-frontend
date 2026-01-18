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
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import SideNav from "../../../components/Sidebar/SideNav";
import newRequest from "../../../utils/newRequest";
import AddRoles from "./AddRoles";
import UpdatedRoles from "./UpdatedRoles";

function Roless() {
  const [AllRoles, setAllRoles] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isAddRolesModalOpen, setisAddRolesModalOpen] = useState(false);
  const [editDepartment, seteditDepartment] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const fetchAllRoles = async () => {
    setLoading(true);
    try {
      const response = await newRequest.get("/api/v1/roles", {
        params: { page, search },
      });
      setAllRoles(response?.data?.data || []);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error("Error fetching Role:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRoles();
  }, [page, search]);

  const handleDelete = async (Roless) => {
    Swal.fire({
      title: `Are you sure to delete this record?`,
      text: `You will not be able to recover this! ${Roless?.name || ""}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, Delete!`,
      cancelButtonText: `No, keep it!`,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#FF0032",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await newRequest.delete(
            `/api/v1/roles/${Roless?.id}`
          );
          toast.success(
            response?.data?.message || "Role has been deleted successfully"
          );
          fetchAllRoles();
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "An unexpected error occurred";
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
    { name: "ROLE NAME", uid: "name" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = (Roless, columnKey) => {
    switch (columnKey) {
      case "name":
        return (
          <span className="font-medium text-gray-900">{Roless.name || ""}</span>
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
                  <BsThreeDotsVertical size={20} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="Role actions" 
                className="bg-white shadow-lg rounded-lg p-1 border border-gray-200"
              >
                <DropdownItem
                  key="edit"
                  className="py-2 px-4 flex items-center gap-2 hover:bg-green-50 rounded-md text-gray-700 transition-all duration-200"
                  startContent={<FaEdit className="text-green-600" />}
                  onClick={() => handleedit(Roless)}
                >
                  Edit Role
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="py-2 px-4 hover:bg-red-50 rounded-md text-red-600 transition-all duration-200 flex items-center gap-2"
                  startContent={<FaTrash />}
                  onClick={() => handleDelete(Roless)}
                >
                  Delete Role
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return Roless[columnKey];
    }
  };

  const topContent = useMemo(
    () => (
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Role Management</h2>
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
              placeholder="Search by role name..."
            />
          </div>

          <Button
            className="bg-green-600 text-white hover:bg-green-700 transition-all duration-300 rounded-lg px-5 py-2.5 flex items-center gap-2"
            startContent={<FaPlus />}
            onClick={() => setisAddRolesModalOpen(true)}
          >
            Add New Role
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
          {AllRoles?.length || 0} Roles in total
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
    [page, pagination, AllRoles]
  );

  return (
    <SideNav>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <Table
            aria-label="Roles table"
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
              items={AllRoles}
              emptyContent={
                <div className="text-center text-gray-500 py-8">No roles found</div>
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
      {isAddRolesModalOpen && (
        <AddRoles
          isVisible={isAddRolesModalOpen}
          setVisibility={() => setisAddRolesModalOpen(false)}
          refreshroles={fetchAllRoles}
        />
      )}
      {editDepartment && (
        <UpdatedRoles
          isVisible={editDepartment}
          setVisibility={() => seteditDepartment(false)}
          refreshroles={fetchAllRoles}
          selectdataroles={selectedDepartment}
        />
      )}
    </SideNav>
  );
}

export default Roless;
