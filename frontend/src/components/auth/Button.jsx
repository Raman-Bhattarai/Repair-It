import React from "react";

function Button({ children, variant = "primary", ...props }) {
  const baseClass =
    "w-full py-2.5 px-4 rounded-xl font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClass =
    variant === "primary"
      ? "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-400"
      : "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-400";

  return (
    <button className={`${baseClass} ${variantClass}`} {...props}>
      {children}
    </button>
  );
}

export default Button;

