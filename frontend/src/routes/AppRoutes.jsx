import React from "react";
import { BrowserRouter as Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// Pages
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Orders from "../pages/Orders";
import Report from "../pages/Report";
import Customer from "../pages/Customer";
import Staff from "../pages/Staff";
import StaffOrdersPage from "../pages/StaffOrderPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Pages */}
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Report />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <Customer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff"
        element={
          <ProtectedRoute>
            <Staff />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/orders"
        element={
          <ProtectedRoute>
            <StaffOrdersPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<p className="text-center mt-20">Page Not Found</p>} />
    </Routes>
  );
}

export default AppRoutes;