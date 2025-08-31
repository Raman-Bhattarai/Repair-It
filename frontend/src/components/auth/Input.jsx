import React from "react";

function Input({ label, type = "text", ...props }) {
  return (
    <div className="mb-5">
      <label className="block mb-2 text-sm font-semibold text-gray-800">
        {label}
      </label>
      <input
        type={type}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-400 focus:outline-none shadow-sm transition-all"
        {...props}
      />
    </div>
  );
}

export default Input;

