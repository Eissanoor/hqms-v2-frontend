import React, { useEffect, useState, useCallback } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { IoArrowDownOutline, IoArrowUpOutline } from "react-icons/io5";
import { BsSortDown } from "react-icons/bs";

const sortOptions = [
  { key: "createdAt", label: "Created Date" },
  { key: "firstCallTime", label: "first Call Time" },
  { key: "vitalTime", label: "vital Time" },
  { key: "assignDeptTime", label: "Department Assigned" },
  { key: "secondCallTime", label: "Dept. Call" },
  { key: "beginTime", label: "Treatment Began" },
  { key: "endTime", label: "Treatment End" },
];

function PickerSort({ onSort, currentSortBy = "createdAt", currentSortOrder = "desc" }) {
  const [sortBy, setSortBy] = useState(currentSortBy);
  const [sortOrder, setSortOrder] = useState(currentSortOrder);

  // Sync state when props change
  useEffect(() => {
    setSortBy(currentSortBy);
    setSortOrder(currentSortOrder);
  }, [currentSortBy, currentSortOrder]);

  const handleSort = useCallback(
    (field) => {
      const isSameField = field === sortBy;
      const newOrder = isSameField ? (sortOrder === "asc" ? "desc" : "asc") : "desc";

      setSortBy(field);
      setSortOrder(newOrder);
      onSort?.({ sortBy: field, sortOrder: newOrder });
    },
    [sortBy, sortOrder, onSort]
  );

  return (
    <Dropdown className="bg-white shadow-xl">
      <DropdownTrigger aria-label="Sort Options">
        <Button
          variant="bordered"
          startContent={<BsSortDown className="text-lg" />}
          className="capitalize bg-gray-50 text-gray-600 ms-5 hover:bg-gray-600 hover:text-gray-50 rounded-md"
        >
          Sort
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Sorting options">
        {sortOptions.map(({ key, label }) => (
          <DropdownItem
            key={key}
            onClick={() => handleSort(key)}
            className="my-2"
          >
            <div className="flex my-auto">
              <p className="my-auto">
                {" "}
                {sortBy === key ? (
                  sortOrder === "asc" ? (
                    <IoArrowUpOutline />
                  ) : (
                    <IoArrowDownOutline />
                  )
                ) : null}
              </p>
              <p className="ms-2"> {label}</p>
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

export default PickerSort;
