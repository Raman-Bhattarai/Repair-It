import React, { useState, useMemo } from "react";

function OrderDetails({ order, onClose }) {
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  const allImages = useMemo(() => {
    const imgs = [];
    (order.items || []).forEach((item) => {
      (item.images || []).forEach((img) => imgs.push(img.image));
    });
    return imgs;
  }, [order]);

  const openLightbox = (index) => setLightbox({ open: true, index });
  const closeLightbox = () => setLightbox({ open: false, index: 0 });
  const prevImage = (e) => {
    e.stopPropagation();
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index - 1 + allImages.length) % allImages.length,
    }));
  };
  const nextImage = (e) => {
    e.stopPropagation();
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index + 1) % allImages.length,
    }));
  };

  const totalItems = (order.items || []).reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50 overflow-auto p-4 pt-20">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
          title="Close"
        >
          ×
        </button>

        <div className="mb-4 border-b border-gray-200 pb-3 flex flex-wrap justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">अर्डर #{order.id}</h2>
            <p className="text-gray-700">
              <span className="font-semibold">स्थिति:</span>{" "}
              <span
                className={`font-bold ${
                  order.status === "CANCELLED"
                    ? "text-red-600"
                    : order.status === "COMPLETED"
                    ? "text-green-600"
                    : "text-gray-800"
                }`}
              >
                {order.status}
              </span>{" "}
              | <span className="font-semibold">कुल वस्तु:</span> {totalItems}
            </p>
          </div>
          <p className="text-gray-800 font-semibold text-lg">
            जम्मा: Rs. {order.total_price ?? 0}
          </p>
        </div>

        <div className="space-y-4">
          {(order.items || []).map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50 shadow-sm">
              <p>
                <span className="font-semibold">प्रकार:</span> {item.order_name}
              </p>
              <p>
                <span className="font-semibold">विवरण:</span> {item.order_details}
              </p>
              <p>
                <span className="font-semibold">परिमाण:</span> {item.quantity}
              </p>
              <p>
                <span className="font-semibold">मूल्य:</span> Rs. {item.price}
              </p>

              {item.images && item.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.images.map((img, idx) => {
                    const imageIndex = allImages.indexOf(img.image);
                    return (
                      <img
                        key={img.id}
                        src={img.image}
                        alt="order item"
                        className="w-24 h-24 object-cover border rounded-lg shadow-sm cursor-pointer hover:ring-2 hover:ring-rose-400"
                        onClick={() => openLightbox(imageIndex)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            बन्द गर्नुहोस्
          </button>
        </div>
      </div>

      {lightbox.open && allImages.length > 0 && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={prevImage}
            className="absolute left-4 text-white text-3xl font-bold z-50"
          >
            ‹
          </button>
          <img
            src={allImages[lightbox.index]}
            alt="preview"
            className="max-h-full max-w-full rounded-lg shadow-lg"
          />
          <button
            onClick={nextImage}
            className="absolute right-4 text-white text-3xl font-bold z-50"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderDetails;
