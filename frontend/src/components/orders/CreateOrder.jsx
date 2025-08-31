import React, { useState } from "react";
import { placeOrder } from "../../api/api";

function CreateOrder({ onClose, onOrderCreated }) {
  const [items, setItems] = useState([
    { order_name: "", order_details: "", quantity: 1, images: [] },
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
    updated[idx].images = files;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { order_name: "", order_details: "", quantity: 1, images: [] }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("status", "PENDING");

      // Convert items (without files) to JSON string
      const itemsData = items.map(() => ({})); // indexes matter, payload below fills values
      items.forEach((item, idx) => {
        itemsData[idx] = {
          order_name: item.order_name,
          order_details: item.order_details,
          quantity: Number(item.quantity || 1),
          price: 0,
        };
      });
      formData.append("items_payload", JSON.stringify(itemsData));

      // Append files separately per item index
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
      console.error("Order creation failed:", data || err.message);
      setError(typeof data === "object" ? JSON.stringify(data) : String(data || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border p-6 rounded-xl bg-white shadow-sm">
  <h3 className="text-lg font-bold mb-4">नयाँ अर्डर</h3>
  {error && <div className="text-red-600 mb-3 text-sm">{error}</div>}
  <form onSubmit={handleSubmit} className="space-y-4">
    {items.map((item, idx) => (
      <div key={idx} className="p-4 border rounded-lg bg-gray-50 shadow-sm space-y-2">
        <label className="block text-sm font-semibold text-gray-700">उपकरण प्रकार</label>
        <select
          className="border rounded-lg w-full px-3 py-2 focus:ring-2 focus:ring-rose-400 focus:outline-none"
          value={item.order_name}
          onChange={(e) => handleItemChange(idx, "order_name", e.target.value)}
          required
        >
          <option value="">छान्नुहोस्</option>
          <option value="FRIDGE">फ्रिज</option>
          <option value="WASHING_MACHINE">वाशिङ मेसिन</option>
          <option value="OVEN">अभन</option>
          <option value="TV">टेलिभिजन</option>
          <option value="FAN">पंखा</option>
          <option value="OTHER">अन्य</option>
        </select>

        <textarea
          className="border rounded-lg w-full px-3 py-2 mt-1 focus:ring-2 focus:ring-rose-400 focus:outline-none"
          placeholder="समस्या विवरण"
          value={item.order_details}
          onChange={(e) => handleItemChange(idx, "order_details", e.target.value)}
        />

        <input
          type="number"
          className="border rounded-lg w-full px-3 py-2 mt-1 focus:ring-2 focus:ring-rose-400 focus:outline-none"
          value={item.quantity}
          onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
          min="1"
        />

        <input
          type="file"
          multiple
          className="mt-2 text-sm"
          onChange={(e) => handleImageChange(idx, e.target.files)}
        />
      </div>
    ))}

    <div className="flex items-center space-x-2">
      <button
        type="button"
        className="bg-gray-600 text-white px-3 py-2 rounded-lg shadow-sm hover:bg-gray-700 transition"
        onClick={addItem}
      >
        + थप्नुहोस्
      </button>
      <button
        type="submit"
        disabled={submitting}
        className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-sm hover:bg-green-700 transition disabled:opacity-70"
      >
        {submitting ? "पठाउँदै..." : "अर्डर पठाउनुहोस्"}
      </button>
      <button type="button" className="ml-2 text-red-600 font-semibold hover:underline" onClick={onClose}>
        रद्द गर्नुहोस्
      </button>
    </div>
  </form>
</div>

  );
}

export default CreateOrder;
