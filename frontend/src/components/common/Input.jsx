import React from "react";

function Input({ label, type = "text", value, onChange, placeholder = "", className = "", ...props }) {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      {label && <label className="mb-1 font-medium text-gray-700">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
        {...props}
      />
    </div>
  );
}

export default Input;
