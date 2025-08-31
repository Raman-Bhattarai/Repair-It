import React, { useEffect, useState } from "react";
import api from "../api/api";

function StaffOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [priceInputs, setPriceInputs] = useState({}); // store temporary price inputs

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/");
      setOrders(res.data);

      // initialize price inputs with current total_price
      const initialPrices = {};
      res.data.forEach((order) => {
        initialPrices[order.id] = order.total_price || "";
      });
      setPriceInputs(initialPrices);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Generic update function using FormData
  const handleUpdate = async (id, data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      const res = await api.patch(`/orders/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update the specific order in state without resetting
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, ...res.data } : order
        )
      );

      // Update local price input if total_price changed
      if (res.data.total_price !== undefined) {
        setPriceInputs((prev) => ({ ...prev, [id]: res.data.total_price }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePriceChange = (id, value) => {
    setPriceInputs({ ...priceInputs, [id]: value });
  };

  const handleSetPrice = (id) => {
    const value = Number(priceInputs[id]);
    if (isNaN(value)) return;
    handleUpdate(id, { total_price: value });
  };

  const visibleOrders = orders.filter((o) =>
    filter === "ALL" ? true : o.status === filter
  );

  const statusOptions = [
    { value: "ALL", label: "सबै" },
    { value: "PENDING", label: "चालु" },
    { value: "COMPLETED", label: "पूरा भयो" },
    { value: "CANCELLED", label: "रद्द भयो" },
    { value: "REJECTED", label: "अस्वीकृत" },
  ];

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">अर्डर व्यवस्थापन</h1>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border px-2 py-1 mb-4"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {visibleOrders.length === 0 && (
        <p className="text-gray-600">कुनै अर्डर उपलब्ध छैन।</p>
      )}

      {visibleOrders.map((order) => (
        <div key={order.id} className="bg-white p-4 mb-3 rounded shadow">
          <p>
            <strong>अर्डर #{order.id}</strong> —{" "}
            {order.customer?.username || order.customer?.email || "ग्राहक"}
          </p>
          <p>स्थिति: {order.status}</p>

          {/* Price input + button */}
          <div className="mt-1 flex items-center space-x-2">
            <input
              type="number"
              value={priceInputs[order.id] ?? ""}
              onChange={(e) => handlePriceChange(order.id, e.target.value)}
              className="border px-2 py-1 rounded w-32"
              placeholder="रु सेट गर्नुहोस्"
            />
            <button
              onClick={() => handleSetPrice(order.id)}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              मूल्य सेट गर्नुहोस्
            </button>
          </div>

          {/* Order items */}
          {order.items && order.items.length > 0 && (
            <div className="mt-2 space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="border p-2 rounded">
                  <p className="font-semibold">
                    {item.order_name} — मात्रा: {item.quantity}
                  </p>
                  <p>{item.order_details}</p>
                  {item.images && item.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.images.map((img) => (
                        <img
                          key={img.id}
                          src={img.image}
                          alt={item.order_name}
                          className="w-20 h-20 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Status buttons */}
          {order.status === "PENDING" && (
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleUpdate(order.id, { status: "REJECTED" })}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                अस्वीकृत गर्नुहोस्
              </button>
              <button
                onClick={() => handleUpdate(order.id, { status: "COMPLETED" })}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                पूरा भयो
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default StaffOrdersPage;
