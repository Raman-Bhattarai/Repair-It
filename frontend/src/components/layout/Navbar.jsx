import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import AuthContext from "../../contexts/AuthContext";

function Navbar() {
  const { logout, user, isAuthenticated } = useContext(AuthContext);
  const isStaff = user?.is_staff;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleOrdersClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      if (user.role === "staff") {
        navigate("/staff/orders");
      } else {
        navigate("/orders");
      }
    } else {
      navigate("/login");
    }
  };

  // Links for different roles
  const staffLinks = [
    { name: "Home", to: "/" },
    { name: "Dashboard", to: "/dashboard" },
    { name: "Staff Orders", to: "/staff/orders" },
    { name: "Reports", to: "/reports" },
  ];

  const customerLinks = [
    { name: "Home", to: "/" },
    { name: "Repair Orders", onClick: handleOrdersClick },
  ];

  const linksToRender = isAuthenticated
    ? isStaff
      ? staffLinks
      : customerLinks
    : [];

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between h-10 items-start py-1">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-start">
            <h1 className="text-sm font-medium text-rose-500">Repair It</h1>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 items-center">
            {linksToRender.map((link) =>
              link.to ? (
                <Link
                  key={link.name}
                  to={link.to}
                  className="text-gray-700 hover:text-rose-600"
                >
                  {link.name}
                </Link>
              ) : (
                <button
                  key={link.name}
                  onClick={link.onClick}
                  className="text-gray-700 hover:text-rose-600"
                >
                  {link.name}
                </button>
              )
            )}

            {isAuthenticated ? (
              <button
                onClick={logout}
                className="bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-rose-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-700 hover:text-rose-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden space-x-4 items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-rose-600"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="px-4 md:hidden bg-white shadow-md">
          {linksToRender.map((link) =>
            link.to ? (
              <Link
                key={link.name}
                to={link.to}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ) : (
              <button
                key={link.name}
                onClick={() => {
                  setMobileMenuOpen(false);
                  link.onClick({ preventDefault: () => {} });
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                {link.name}
              </button>
            )
          )}

          {isAuthenticated && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="w-full text-left px-4 py-2 text-white bg-red-500 hover:bg-red-600"
            >
              Logout
            </button>
          )}

          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
