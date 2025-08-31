import React from "react";

function LogoutButton({ onLogout }) {
  return (
    <button
      onClick={onLogout}
      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition-all duration-200"
    >
      Logout
    </button>
  );
}

export default LogoutButton;

