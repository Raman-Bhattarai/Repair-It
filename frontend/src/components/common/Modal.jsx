import React from "react";

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
        >
          ✕
        </button>
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Modal;

