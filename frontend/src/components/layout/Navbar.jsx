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
    : customerLinks;

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-3xl font-bold text-indigo-600 tracking-tight">
                Repair<span className="font-extrabold text-indigo-800">It</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {linksToRender.map((link) =>
              link.to ? (
                <Link
                  key={link.name}
                  to={link.to}
                  className="text-gray-700 hover:text-indigo-700 px-4 py-2 rounded-md text-base font-medium transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ) : (
                <button
                  key={link.name}
                  onClick={link.onClick}
                  className="text-gray-700 hover:text-indigo-700 px-4 py-2 rounded-md text-base font-medium transition-colors duration-200"
                >
                  {link.name}
                </button>
              )
            )}

            {isAuthenticated ? (
              <button
                onClick={logout}
                className="bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-2 rounded-lg text-white text-base font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-200 shadow-sm"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-700 px-4 py-2 rounded-md text-base font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-2 rounded-lg text-white text-base font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-indigo-700 p-2 rounded-lg hover:bg-indigo-100 transition-all duration-200"
            >
              <Menu className="h-7 w-7" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="px-4 md:hidden bg-gray-100 border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-2">
            {linksToRender.map((link) =>
              link.to ? (
                <Link
                  key={link.name}
                  to={link.to}
                  className="block px-4 py-3 text-gray-700 hover:text-indigo-700 hover:bg-indigo-100 rounded-md text-base font-medium transition-all duration-200"
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
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:text-indigo-700 hover:bg-indigo-100 rounded-md text-base font-medium transition-all duration-200"
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
                className="block w-full text-left px-4 py-3 text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-md transition-all duration-200 mt-2 text-base font-semibold"
              >
                Logout
              </button>
            )}

            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-3 text-gray-700 hover:text-indigo-700 hover:bg-indigo-100 rounded-md text-base font-medium transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-md transition-all duration-200 mt-2 text-base font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
