import React, { useState } from "react";
import { placeOrder } from "../../api/api";

function CreateOrder({ onClose, onOrderCreated }) {
  const [items, setItems] = useState([
    { order_name: "OTHER", order_details: "", quantity: 1, images: [] },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleItemChange = (idx, field, value) => {
    const updated = [...items];
    updated[idx][field] = value;
    setItems(updated);
  };

  const handleImageChange = (idx, files) => {
    const updated = [...items];
    updated[idx].images = [...(updated[idx].images || []), ...files];
    setItems(updated);
  };

  const handleRemoveImage = (idx, i) => {
    const updated = [...items];
    const imgs = [...updated[idx].images];
    imgs.splice(i, 1);
    updated[idx].images = imgs;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { order_name: "OTHER", order_details: "", quantity: 1, images: [] }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("status", "PENDING");

      const itemsData = items.map(item => ({
        order_name: item.order_name,
        order_details: item.order_details,
        quantity: Number(item.quantity || 1),
        price: 0,
      }));
      formData.append("items_payload", JSON.stringify(itemsData));

      items.forEach((item, idx) => {
        Array.from(item.images || []).forEach((file) => {
          formData.append(`item_images_${idx}`, file);
        });
      });

      await placeOrder(formData);
      onOrderCreated();
      onClose();
    } catch (err) {
      const data = err.response?.data;
      setError(typeof data === "object" ? JSON.stringify(data) : String(data || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-start justify-center z-50 overflow-auto p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
          title="Close"
        >
          ×
        </button>

        <h3 className="text-2xl font-bold mb-4">नयाँ अर्डर</h3>

        {error && <div className="text-red-600 mb-3 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl p-4 bg-gray-50 shadow-sm space-y-2"
            >
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">उपकरण प्रकार</label>
                <select
                  className="border rounded-lg px-2 py-1 focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  value={item.order_name}
                  onChange={(e) => handleItemChange(idx, "order_name", e.target.value)}
                  required
                >
                  <option value="FRIDGE">फ्रिज</option>
                  <option value="WASHING_MACHINE">वाशिङ मेसिन</option>
                  <option value="OVEN">अभन</option>
                  <option value="TV">टेलिभिजन</option>
                  <option value="FAN">पंखा</option>
                  <option value="OTHER">अन्य</option>
                </select>
              </div>

              <textarea
                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-rose-400 focus:outline-none"
                placeholder="समस्या विवरण"
                value={item.order_details}
                onChange={(e) => handleItemChange(idx, "order_details", e.target.value)}
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700">परिमाण</label>
                <input
                  type="number"
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                  min="1"
                />
              </div>

              {/* File input */}
              <input
                type="file"
                multiple
                className="mt-2"
                onChange={(e) => handleImageChange(idx, e.target.files)}
              />

              {/* Thumbnail previews */}
              {item.images && item.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {Array.from(item.images).map((file, i) => {
                    const url = file instanceof File ? URL.createObjectURL(file) : file;
                    return (
                      <div key={i} className="relative w-24 h-24 border rounded-lg overflow-hidden shadow-sm">
                        <img src={url} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx, i)}
                          className="absolute top-1 right-1 text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              className="bg-gray-600 text-white px-3 py-2 rounded-lg shadow hover:bg-gray-700 transition"
              onClick={addItem}
            >
              + नयाँ वस्तु
            </button>

            <div className="space-x-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition disabled:opacity-70"
              >
                {submitting ? "पठाउँदै..." : "अर्डर पठाउनुहोस्"}
              </button>
              <button
                type="button"
                className="ml-2 text-gray-600 font-semibold hover:underline"
                onClick={onClose}
              >
                बन्द गर्नुहोस्
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateOrder;
