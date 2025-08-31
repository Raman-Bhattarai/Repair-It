import React, { useState } from "react";
import { updateOrder } from "../../api/api";

function UpdateOrder({ order, onClose, onOrderUpdated }) {
  const [items, setItems] = useState(
    (order.items || []).map((i) => ({ ...i, new_files: [] }))
  );
  const [status, setStatus] = useState(order.status);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleItemChange = (idx, field, value) => {
    const updated = [...items];
    updated[idx][field] = value;
    setItems(updated);
  };

  const handleImageAdd = (idx, files) => {
    const updated = [...items];
    updated[idx].new_files = files;
    setItems(updated);
  };

  const handleRemoveExistingImage = (idx, imageId) => {
    const updated = [...items];
    const item = updated[idx];
    item.remove_image_ids = Array.from(new Set([...(item.remove_image_ids || []), imageId]));
    setItems(updated);
  };

  const addNewItem = () => {
    setItems([
      ...items,
      { id: undefined, order_name: "OTHER", order_details: "", quantity: 1, price: 0, images: [], new_files: [] },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("status", status);

      const payload = items.map((i) => ({
        id: i.id,
        order_name: i.order_name,
        order_details: i.order_details,
        quantity: Number(i.quantity || 1),
        price: Number(i.price || 0),
        remove_image_ids: i.remove_image_ids || [],
      }));

      formData.append("items_payload", JSON.stringify(payload));

      // attach new files per item index (match payload order)
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
    <div className="border p-6 rounded-xl bg-white shadow-sm">
  <h3 className="text-lg font-bold mb-4">अर्डर #{order.id} सम्पादन</h3>
  {error && <div className="text-red-600 mb-3 text-sm">{error}</div>}

  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700">स्थिति</label>
    <select
      className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-rose-400 focus:outline-none"
      value={status}
      onChange={(e) => setStatus(e.target.value)}
    >
      <option value="PENDING">प्रक्रियामा</option>
      <option value="COMPLETED">पूरा भएको</option>
      <option value="REJECTED">अस्वीकृत</option>
      <option value="CANCELLED">रद्द गरिएको</option>
    </select>
  </div>

  <form onSubmit={handleSubmit} className="space-y-4">
    {items.map((item, idx) => (
      <div key={idx} className="p-4 border rounded-lg bg-gray-50 shadow-sm space-y-2">
        <label className="block text-sm font-semibold text-gray-700">उपकरण</label>
        <select
          className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-rose-400 focus:outline-none"
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
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-rose-400 focus:outline-none"
              value={item.price}
              onChange={(e) => handleItemChange(idx, "price", e.target.value)}
              min="0"
            />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-sm font-semibold text-gray-700 mb-1">पहिलेका फोटोहरू</div>
          <div className="flex flex-wrap gap-2">
            {(item.images || []).map((img) => (
              <div key={img.id} className="relative">
                <img
                  src={img.image}
                  alt=""
                  className="w-20 h-20 object-cover border rounded-lg shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(idx, img.id)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow"
                  title="हटाउनुहोस्"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <input
          type="file"
          multiple
          className="mt-2 text-sm"
          onChange={(e) => handleImageAdd(idx, e.target.files)}
        />
      </div>
    ))}

    <div className="flex items-center space-x-2">
      <button
        type="button"
        className="bg-gray-600 text-white px-3 py-2 rounded-lg shadow-sm hover:bg-gray-700 transition"
        onClick={addNewItem}
      >
        + नयाँ वस्तु
      </button>
      <button
        type="submit"
        disabled={submitting}
        className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-sm hover:bg-green-700 transition disabled:opacity-70"
      >
        {submitting ? "अपडेट हुँदै..." : "अपडेट गर्नुहोस्"}
      </button>
      <button type="button" className="ml-2 text-red-600 font-semibold hover:underline" onClick={onClose}>
        रद्द गर्नुहोस्
      </button>
    </div>
  </form>
</div>

  );
}

export default UpdateOrder;
