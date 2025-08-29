import React, { useState } from "react";
import api from "../../api/api"; // your axios instance

function CreateOrder({ onOrderCreated }) {
  const [items, setItems] = useState([
    { order_name: "", order_details: "", quantity: 1 , images: null },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle item field changes
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // Add new item row
  const addItem = () => {
    setItems([...items, { order_name: "", order_details: "", quantity: 1 , images: null }]);
  };

  // Remove an item
  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Submit order
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/orders/", { items });
      if (onOrderCreated) onOrderCreated(res.data);
      setItems([{ order_name: "", order_details: "", quantity: 1 , images: null }]);
    } catch (err) {
      setError("Failed to create order. Please try again.");
      console.error(err);
      console.log(err.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Create Repair Order</h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="border p-4 rounded-xl shadow-sm space-y-2"
          >
            <div>
              <label className="block text-sm font-medium">Appliance Name</label>
              <input
                type="text"
                value={item.order_name}
                onChange={(e) =>
                  handleItemChange(index, "order_name", e.target.value)
                }
                required
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Problem Description</label>
              <textarea
                value={item.order_details}
                onChange={(e) =>
                  handleItemChange(index, "order_details", e.target.value)
                }
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Quantity</label>
              <input
                type="number"
                value={item.quantity}
                min="1"
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                className="h-30 w-30 p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Image</label>
              <input
                type="image"
                value={item.images}
                onChange={(e) =>
                  handleItemChange(index, "image", e.target.value)
                }
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-600 text-sm"
              >
                Remove Item
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          + Add Another Appliance
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Submit Order"}
        </button>
      </form>
    </div>
  );
}

export default CreateOrder;

