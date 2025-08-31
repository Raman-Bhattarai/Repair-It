import React from "react";

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
        >
          ✕
        </button>
        {title && <h2 className="text-2xl font-bold mb-4 text-gray-900">{title}</h2>}
        <div className="text-gray-700">{children}</div>
      </div>
    </div>
  );
}

export default Modal;

