import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // uses AuthContext

  if (!isAuthenticated) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the protected page
  return children;
};

export default ProtectedRoute;
