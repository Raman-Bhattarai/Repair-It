import React from "react";

function Button({ children, onClick, type = "button", variant = "primary", className = "" }) {
  const baseClasses = "py-2 px-4 rounded-lg font-medium transition";
  
  const variants = {
    primary: "bg-rose-600 text-white hover:bg-rose-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
