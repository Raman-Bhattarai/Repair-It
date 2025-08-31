import React from "react";

function Input({ label, type = "text", value, onChange, placeholder = "", className = "", ...props }) {
  return (
    <div className={`flex flex-col mb-5 ${className}`}>
      {label && (
        <label className="mb-2 text-sm font-semibold text-gray-800">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-400 focus:outline-none shadow-sm transition-all"
        {...props}
      />
    </div>
  );
}

export default Input;

