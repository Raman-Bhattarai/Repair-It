import React, { useState } from "react";
import api from "../../api/api";

function UpdateOrder({ order, onClose, onOrderUpdated }) {
  const [items, setItems] = useState(order.items);

  const handleItemChange = (idx, field, value) => {
    const updated = [...items];
    updated[idx][field] = value;
    setItems(updated);
  };

  const handleImageChange = (idx, files) => {
    const updated = [...items];
    updated[idx].images = Array.from(files).map((f) => ({ image: f }));
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        status: order.status,
        items: items.map((i) => ({
          order_name: i.order_name,
          order_details: i.order_details,
          quantity: i.quantity,
          price: i.price,
          images: i.images.map((img) =>
            img.image instanceof File ? { image: img.image } : { image: img.image }
          ),
        })),
      };

      await api.put(`orders/${order.id}/`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      onOrderUpdated();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="border p-4 rounded bg-gray-50 text-black">
      <h3 className="font-bold mb-2">अर्डर #{order.id} सम्पादन</h3>
      <form onSubmit={handleSubmit}>
        {items.map((item, idx) => (
          <div key={idx} className="mb-3 border p-2 rounded">
            <label>उपकरण</label>
            <select
              className="border p-1 w-full"
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
              className="border p-1 w-full mt-1"
              value={item.order_details}
              onChange={(e) => handleItemChange(idx, "order_details", e.target.value)}
            />

            <input
              type="number"
              className="border p-1 w-full mt-1"
              value={item.quantity}
              onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
              min="1"
            />

            <input
              type="file"
              multiple
              className="mt-2"
              onChange={(e) => handleImageChange(idx, e.target.files)}
            />
          </div>
        ))}
        <button type="submit" className="bg-green-500 text-white px-4 py-1 rounded">
          अपडेट गर्नुहोस्
        </button>
        <button type="button" className="ml-2 text-red-600" onClick={onClose}>
          रद्द गर्नुहोस्
        </button>
      </form>
    </div>
  );
}

export default UpdateOrder;
