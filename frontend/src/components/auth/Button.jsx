import React from "react";

function Button({ children, variant = "primary", ...props }) {
  const baseClass =
    "w-full py-2 rounded-lg text-white font-medium transition-colors";
  const variantClass =
    variant === "primary"
      ? "bg-rose-600 hover:bg-rose-700"
      : "bg-gray-500 hover:bg-gray-600";

  return (
    <button className={`${baseClass} ${variantClass}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
