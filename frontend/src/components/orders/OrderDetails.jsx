import React, { useState } from "react";

function OrderDetails({ order }) {
  const [lightbox, setLightbox] = useState({ isOpen: false, images: [], currentIndex: 0 });

  if (!order) return null;

  const openLightbox = (images, index) => {
    setLightbox({ isOpen: true, images, currentIndex: index });
  };

  const closeLightbox = () => {
    setLightbox({ isOpen: false, images: [], currentIndex: 0 });
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setLightbox((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length,
    }));
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setLightbox((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length,
    }));
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-lg mx-auto text-black relative">
      <h2 className="text-2xl font-bold mb-4">अर्डर #{order.id}</h2>
      <p className="text-gray-600 mb-2">ग्राहक: {order.customer_name || "—"}</p>
      <p className="text-gray-600 mb-4">स्थिति: {order.status_display || order.status || "—"}</p>

      <h3 className="text-lg font-semibold">उपकरणहरू:</h3>
      <ul className="divide-y mt-2">
        {order.items && order.items.length > 0 ? (
          order.items.map((item, index) => (
            <li key={index} className="py-4">
              <div className="mb-1 font-semibold text-gray-800">
                {item.order_name_display || item.order_name || "—"}
              </div>
              <div className="text-gray-700 mb-1">
                समस्या: {item.order_details || "—"}
              </div>
              <div className="text-gray-600 mb-2">
                मात्रा: {item.quantity ?? "—"}
              </div>

              {item.images && item.images.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {item.images.map((imgObj, i) => (
                    <div
                      key={i}
                      className="relative w-24 h-24 overflow-hidden rounded border cursor-pointer"
                      onClick={() => openLightbox(item.images.map(img => img.file), i)}
                    >
                      <img
                        src={imgObj.file}  // Use .file (or .url depending on your serializer)
                        alt={item.order_name || "image"}
                        className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-125"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400">छवि छैन</span>
              )}

            </li>
          ))
        ) : (
          <li className="py-4 text-gray-400">अर्डर आइटमहरू छैनन्</li>
        )}
      </ul>

      <div className="mt-4 flex justify-between font-bold text-gray-800">
        <span>कुल मूल्य:</span>
        <span>
          {order.total_price && Number(order.total_price) > 0
            ? `Nrs. ${order.total_price}`
            : "—"}
        </span>
      </div>

      {lightbox.isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={closeLightbox}
        >
          <button
            className="absolute left-5 text-white text-3xl font-bold"
            onClick={prevImage}
          >
            ‹
          </button>
          <img
            src={lightbox.images[lightbox.currentIndex]}
            alt="Preview"
            className="max-h-full max-w-full rounded-lg shadow-lg"
          />
          <button
            className="absolute right-5 text-white text-3xl font-bold"
            onClick={nextImage}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderDetails;
