import React from "react";

function Button({ children, onClick, type = "button", variant = "primary", className = "" }) {
  const baseClasses =
    "py-2.5 px-5 rounded-xl font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-400",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-400",
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

