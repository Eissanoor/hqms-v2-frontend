import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { RolesContext } from "../App";
import Spinner from "../components/spinner/spinner";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRoles = useContext(RolesContext);

  // Check if the user roles have been fetched or are available
  if (!userRoles || userRoles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    ); // Show spinner while fetching roles
  }
  // Check if any of the user's roles match the allowed roles
  const isAuthorized = allowedRoles.some((role) => userRoles.includes(role));

  if (!isAuthorized) {
    return <Navigate to="/NotFound" replace />;
  }
  return children;
};

export default ProtectedRoute;
