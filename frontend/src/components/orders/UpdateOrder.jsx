import React, { useState } from "react";
import { updateOrder } from "../../api/api";

function UpdateOrder({ order, onClose, onOrderUpdated }) {
  const [items, setItems] = useState(
    (order.items || []).map((i) => ({ ...i, new_files: [] }))
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleItemChange = (idx, field, value) => {
    const updated = [...items];
    updated[idx][field] = value;
    setItems(updated);
  };

  const handleImageAdd = (idx, files) => {
    const updated = [...items];
    updated[idx].new_files = [...(updated[idx].new_files || []), ...files];
    setItems(updated);
  };

  const handleRemoveExistingImage = (idx, imageId) => {
    const updated = [...items];
    const item = updated[idx];
    item.remove_image_ids = Array.from(
      new Set([...(item.remove_image_ids || []), imageId])
    );
    setItems(updated);
  };

  const handleRemoveNewImage = (idx, i) => {
    const updated = [...items];
    const imgs = [...updated[idx].new_files];
    imgs.splice(i, 1);
    updated[idx].new_files = imgs;
    setItems(updated);
  };

  const addNewItem = () => {
    setItems([
      ...items,
      {
        id: undefined,
        order_name: "OTHER",
        order_details: "",
        quantity: 1,
        images: [],
        new_files: [],
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();

      const payload = items.map((i) => ({
        id: i.id,
        order_name: i.order_name,
        order_details: i.order_details,
        quantity: Number(i.quantity || 1),
        remove_image_ids: i.remove_image_ids || [],
      }));

      formData.append("items_payload", JSON.stringify(payload));

      items.forEach((item, idx) => {
        Array.from(item.new_files || []).forEach((file) => {
          formData.append(`item_images_${idx}`, file);
        });
      });

      await updateOrder(order.id, formData);
      onOrderUpdated();
      onClose();
    } catch (err) {
      const data = err.response?.data;
      console.error("Order update failed:", data || err.message);
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

        <h3 className="text-2xl font-bold mb-4">अर्डर #{order.id} सम्पादन</h3>

        {error && <div className="text-red-600 mb-3 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl p-4 bg-gray-50 shadow-sm space-y-2"
            >
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">उपकरण</label>
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
                value={item.order_details}
                onChange={(e) => handleItemChange(idx, "order_details", e.target.value)}
              />

              <div className="grid grid-cols-2 gap-3">
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

                <div>
                  <label className="block text-sm font-semibold text-gray-700">मूल्य</label>
                  <input
                    type="number"
                    className="border rounded-lg px-3 py-2 w-full bg-gray-100 cursor-not-allowed"
                    value={item.price || 0}
                    disabled
                  />
                </div>
              </div>

              {/* Existing images */}
              {item.images && item.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.images.map((img) => (
                    <div key={img.id} className="relative w-24 h-24 border rounded-lg overflow-hidden shadow-sm">
                      <img src={img.image} alt="existing" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(idx, img.id)}
                        className="absolute top-1 right-1 text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* New images */}
              {item.new_files && item.new_files.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {Array.from(item.new_files).map((file, i) => {
                    const url = file instanceof File ? URL.createObjectURL(file) : file;
                    return (
                      <div key={i} className="relative w-24 h-24 border rounded-lg overflow-hidden shadow-sm">
                        <img src={url} alt="new" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(idx, i)}
                          className="absolute top-1 right-1 text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <input
                type="file"
                multiple
                className="mt-2"
                onChange={(e) => handleImageAdd(idx, e.target.files)}
              />
            </div>
          ))}

          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              className="bg-gray-600 text-white px-3 py-2 rounded-lg shadow hover:bg-gray-700 transition"
              onClick={addNewItem}
            >
              + नयाँ वस्तु
            </button>

            <div className="space-x-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition disabled:opacity-70"
              >
                {submitting ? "सेभ हुँदै..." : "सेभ गर्नुहोस्"}
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

export default UpdateOrder;
