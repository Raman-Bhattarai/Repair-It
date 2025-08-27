import React from "react";

function Input({ label, type = "text", ...props }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 text-gray-700 font-medium">{label}</label>
      <input
        type={type}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
        {...props}
      />
    </div>
  );
}

export default Input;
