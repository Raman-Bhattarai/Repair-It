import React, { useEffect, useState } from "react";
import api from "../api/api";

function StaffOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ON_GOING");

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdate = async (id, data) => {
    try {
      await api.patch(`/orders/${id}/`, data);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const visibleOrders = orders.filter(
    (o) => (filter === "ALL" ? true : o.status === filter)
  );

  const statusOptions = [
    { value: "ALL", label: "सबै" },
    { value: "ON_GOING", label: "चालु" },
    { value: "COMPLETED", label: "पूरा भयो" },
    { value: "CANCELLED", label: "रद्द भयो" },
    { value: "REJECTED", label: "अस्वीकृत" },
  ];

  return (
    <div className="p-6">
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
            <strong>अर्डर #{order.id}</strong> — {order.customer_name}
          </p>
          <p>स्थिति: {order.status_display || order.status}</p>
          <p>
            मूल्य:{" "}
            {Number(order.total_price) > 0 ? `Nrs.${order.total_price}` : "—"}
          </p>

          {/* Order items with multiple images */}
          {order.items && order.items.length > 0 && (
            <div className="mt-2 space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="border p-2 rounded">
                  <p className="font-semibold">
                    {item.order_name_display || item.order_name} — मात्रा: {item.quantity}
                  </p>
                  <p>{item.order_details}</p>
                  {item.images && item.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
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

          {order.status === "ON_GOING" && (
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
              <input
                type="number"
                placeholder="मूल्य सेट गर्नुहोस्"
                onBlur={(e) =>
                  handleUpdate(order.id, { total_price: e.target.value })
                }
                className="border px-2 py-1 rounded"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default StaffOrdersPage;
