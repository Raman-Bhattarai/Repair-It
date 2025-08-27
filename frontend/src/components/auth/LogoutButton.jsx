import React from "react";

function LogoutButton({ onLogout }) {
  return (
    <button
      onClick={onLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
    >
      Logout
    </button>
  );
}

export default LogoutButton;
