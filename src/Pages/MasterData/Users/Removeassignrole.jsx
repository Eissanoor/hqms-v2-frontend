import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import newRequest from "../../../utils/newRequest";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import toast from "react-hot-toast";

const Removeassignrole = ({
  isVisible,
  setVisibility,
  selectdatauser,
  refreshuser,
}) => {
  const [allRoles, setAllRoles] = useState([]); // All roles from the API
  const [selectedRoles, setSelectedRoles] = useState([]); // Roles currently assigned
  const { t } = useTranslation();
  const modalRef = useRef(null);

  if (!isVisible) return null;

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        // Fetch all roles
        const response = await newRequest.get(`/api/v1/roles/all`);
        // setAllRoles(response?.data?.data || []);
        // Pre-select roles for the user
        if (selectdatauser?.roles) {
          setAllRoles( // setSelectedRoles
            selectdatauser.roles.map((role) => ({
              id: role.id,
              name: role.name,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, [selectdatauser]);

  const handleRemoveRoles = async () => {
    try {
      const roleIdsToRemove = selectedRoles.map((role) => role.id);
      const response = await newRequest.delete(
        `/api/v1/roles/remove/${selectdatauser?.id}/${roleIdsToRemove}`
      );
      if (response.status >= 200) {
        toast.success(
          response?.data?.message || t("Roles have been removed successfully")
        );
        refreshuser();
        setVisibility(false);
      } else {
        throw new Error(response?.data?.message || t("Unexpected error"));
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || t("Failed to remove roles");
      toast.error(errorMessage);
    }
  };

  // Filter available roles (roles not already selected)
  const availableRoles = allRoles.filter(
    (role) => !selectedRoles.some((selectedRole) => selectedRole.id === role.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Container */}
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg w-full max-w-lg"
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ backgroundColor: "#5B4DF5" }}
        >
          <h2 className="text-white text-xl font-semibold">
            {t("UnAssign Roles")}
          </h2>
          <button onClick={() => setVisibility(false)}>
            <CloseIcon style={{ color: "white" }} />
          </button>
        </div>

        {/* Modal Content */}

        <div className="p-6">
          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="roles"
                className="text-lg font-medium text-gray-700"
              >
                {t("Roles")}
              </label>
              <Autocomplete
                multiple
                disablePortal
                options={availableRoles} // Available roles for selection
                getOptionLabel={(option) => option.name}
                value={selectedRoles} // Pre-selected roles
                onChange={(event, newValue) => setSelectedRoles(newValue)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("Select Roles to Remove")}
                    className="w-full mt-2 p-3 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-300"
                  />
                )}
                sx={{ width: "100%", mt: 2 }}
              />
              {/* <Autocomplete
                              multiple
                              disablePortal
                              options={selectedRoles.filter((role) => !role.selected)}
                              getOptionLabel={(option) => option.name} // Display role name
                              value={selectedRoles.filter((role) => role.selected)}
                              onChange={(event, newValue) => {
                                setSelectedRoles((prevRoles) =>
                                  prevRoles.map((role) => ({
                                    ...role,
                                    selected: newValue.some(
                                      (selectedRole) =>
                                        selectedRole.id === role.id
                                    ),
                                  }))
                                );
                              }}
                              isOptionEqualToValue={(option, value) => option.id === value.id} // Ensure correct selection
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label={t("Select Roles")}
                                  className="w-full mt-2 p-3 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-300"
                                />
                              )}
                              sx={{ width: "100%", mt: 2 }}
                            /> */}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-gray-400"
              onClick={() => setVisibility(false)}
            >
              {t("Cancel")}
            </button>
            <Button
              variant="contained"
              style={{ backgroundColor: "#13BA88", color: "#ffffff" }}
              onClick={handleRemoveRoles}
            >
              {t("UnAssign")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Removeassignrole;
