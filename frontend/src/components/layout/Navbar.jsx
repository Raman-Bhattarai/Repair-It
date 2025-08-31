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
    : customerLinks;

  return (
    <nav className="bg-gradient-to-r from-blue-50 to-indigo-100 shadow-md fixed top-0 left-0 right-0 z-50 border-b border-indigo-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-14 items-center">
      {/* Logo */}
      <div className="flex-shrink-0 flex items-center">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 tracking-tight">
          Repair<span className="font-extrabold">It</span>
        </h1>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-6 items-center">
        {linksToRender.map((link) =>
          link.to ? (
            <Link
              key={link.name}
              to={link.to}
              className="text-gray-700 hover:text-indigo-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-indigo-100"
            >
              {link.name}
            </Link>
          ) : (
            <button
              key={link.name}
              onClick={link.onClick}
              className="text-gray-700 hover:text-indigo-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-indigo-100"
            >
              {link.name}
            </button>
          )
        )}

        {isAuthenticated ? (
          <button
            onClick={logout}
            className="bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 rounded-lg text-white text-sm font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-200 shadow-sm"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-indigo-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-indigo-100"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 rounded-lg text-white text-sm font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-sm"
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
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </div>
  </div>


      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="px-4 md:hidden bg-gray-400 backdrop-blur-lg border-t border-indigo-400/30">
          <div className="pt-2 pb-3 space-y-1">
            {linksToRender.map((link) =>
              link.to ? (
                <Link
                  key={link.name}
                  to={link.to}
                  className="block px-4 py-3 text-gray-200 hover:text-white hover:bg-indigo-700/50 rounded-md transition-all duration-200"
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
                  className="block w-full text-left px-4 py-3 text-gray-200 hover:text-white hover:bg-indigo-700/50 rounded-md transition-all duration-200"
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
                className="block w-full text-left px-4 py-3 text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-md transition-all duration-200 mt-2"
              >
                Logout
              </button>
            )}

            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-3 text-gray-200 hover:text-white hover:bg-indigo-700/50 rounded-md transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-md transition-all duration-200 mt-2"
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
