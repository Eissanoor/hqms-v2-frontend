import React from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  useDisclosure,
} from "@heroui/react";
import { VscSettings } from "react-icons/vsc";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { useSearchParams } from "react-router-dom";

function PickerFilter({ onFilterChange }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [searchParams, setSearchParams] = useSearchParams();

  // Local state for tracking changes before applying
  const [localFilters, setLocalFilters] = React.useState({
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    state: searchParams.get("state") || "",
    status: searchParams.get("status") || "",
    sex: searchParams.get("sex") || "",
    departmentId: searchParams.get("departmentId") || "",
    "age[min]": searchParams.get("age[min]") || "",
    "age[max]": searchParams.get("age[max]") || "",
    hasVitalSigns: searchParams.get("hasVitalSigns") || "",
    hasBed: searchParams.get("hasBed") || "",
  });

  const stateOptions = [
    { name: "Select State", uid: "" },
    { name: "State 0", uid: "0" },
    { name: "State 1", uid: "1" },
    { name: "State 2", uid: "2" },
    { name: "State 3", uid: "3" }
  ];

  const statusOptions = [
    { name: "Select Status", uid: "" },
    { name: "Non-Urgent", uid: "non-urgent" },
    { name: "Urgent", uid: "urgent" },
    { name: "Critical", uid: "critical" }
  ];

  const sexOptions = [
    { name: "Select Sex", uid: "" },
    { name: "Male", uid: "M" },
    { name: "Female", uid: "F" }
  ];

  const booleanOptions = [
    { name: "Select", uid: "" },
    { name: "Yes", uid: "true" },
    { name: "No", uid: "false" }
  ];

  const handleFilterChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
    // Remove the immediate onFilterChange call
  };

  const handleApplyFilters = () => {
    // Only send non-empty values to parent component
    const activeFilters = Object.entries(localFilters).reduce((acc, [key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    onFilterChange?.(activeFilters);
    onOpenChange(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = Object.keys(localFilters).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {});
    setLocalFilters(clearedFilters);
    onFilterChange?.({});  // Send empty object to clear all filters
  };

  return (
    <>
      <Button
        onPress={onOpen}
        variant="bordered"
        startContent={<VscSettings className="text-lg" />}
        className="capitalize bg-gray-50 text-gray-600 ms-5 hover:bg-gray-600 hover:text-gray-50 rounded-md"
      >
        Filter
      </Button>

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        className="bg-white rounded-lg shadow-lg"
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Filter Patients</h2>
              </div>
              <ModalBody className="gap-6 p-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Date Range */}
                  <div className="col-span-2 flex gap-4">
                    <Input
                      type="date"
                      label="Start Date"
                      value={localFilters.startDate}
                      onChange={(e) => handleFilterChange("startDate", e.target.value)}
                      className="flex-1"
                      classNames={{
                        input: "bg-gray-50",
                        label: "text-gray-600"
                      }}
                    />
                    <Input
                      type="date"
                      label="End Date"
                      value={localFilters.endDate}
                      onChange={(e) => handleFilterChange("endDate", e.target.value)}
                      className="flex-1"
                      classNames={{
                        input: "bg-gray-50",
                        label: "text-gray-600"
                      }}
                    />
                  </div>

                  {/* State and Status */}
                  <Select
                    label="State"
                    value={localFilters.state}
                    onChange={(e) => handleFilterChange("state", e.target.value)}
                    className="w-full"
                    classNames={{
                      trigger: "bg-gray-50",
                      label: "text-gray-600"
                    }}
                  >
                    {stateOptions.map((item) => (
                      <SelectItem key={item.uid} value={item.uid}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </Select>

                  <Select
                    label="Status"
                    value={localFilters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className="w-full"
                    classNames={{
                      trigger: "bg-gray-50",
                      label: "text-gray-600"
                    }}
                  >
                    {statusOptions.map((item) => (
                      <SelectItem key={item.uid} value={item.uid}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </Select>

                  {/* Sex and Department */}
                  <Select
                    label="Gender"
                    value={localFilters.sex}
                    onChange={(e) => handleFilterChange("sex", e.target.value)}
                    className="w-full"
                    classNames={{
                      trigger: "bg-gray-50",
                      label: "text-gray-600"
                    }}
                  >
                    {sexOptions.map((item) => (
                      <SelectItem key={item.uid} value={item.uid}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    label="Department ID"
                    value={localFilters.departmentId}
                    onChange={(e) => handleFilterChange("departmentId", e.target.value)}
                    className="w-full"
                    classNames={{
                      input: "bg-gray-50",
                      label: "text-gray-600"
                    }}
                  />

                  {/* Age Range */}
                  <div className="col-span-2 flex gap-4">
                    <Input
                      type="number"
                      label="Min Age"
                      value={localFilters["age[min]"]}
                      onChange={(e) => handleFilterChange("age[min]", e.target.value)}
                      className="flex-1"
                      classNames={{
                        input: "bg-gray-50",
                        label: "text-gray-600"
                      }}
                    />
                    <Input
                      type="number"
                      label="Max Age"
                      value={localFilters["age[max]"]}
                      onChange={(e) => handleFilterChange("age[max]", e.target.value)}
                      className="flex-1"
                      classNames={{
                        input: "bg-gray-50",
                        label: "text-gray-600"
                      }}
                    />
                  </div>

                  {/* Boolean Filters */}
                  <Select
                    label="Has Vital Signs"
                    value={localFilters.hasVitalSigns}
                    onChange={(e) => handleFilterChange("hasVitalSigns", e.target.value)}
                    className="w-full"
                    classNames={{
                      trigger: "bg-gray-50",
                      label: "text-gray-600"
                    }}
                  >
                    {booleanOptions.map((item) => (
                      <SelectItem key={item.uid} value={item.uid}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </Select>

                  <Select
                    label="Has Bed"
                    value={localFilters.hasBed}
                    onChange={(e) => handleFilterChange("hasBed", e.target.value)}
                    className="w-full"
                    classNames={{
                      trigger: "bg-gray-50",
                      label: "text-gray-600"
                    }}
                  >
                    {booleanOptions.map((item) => (
                      <SelectItem key={item.uid} value={item.uid}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </ModalBody>
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleClearFilters}
                  className="px-4 py-2"
                >
                  Clear Filters
                </Button>
                <Button
                  color="primary"
                  onPress={handleApplyFilters}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                >
                  Apply Filters
                </Button>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default PickerFilter;
