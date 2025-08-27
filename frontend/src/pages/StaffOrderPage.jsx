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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border px-2 py-1 mb-4"
      >
        <option value="ALL">All</option>
        <option value="ON_GOING">On Going</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
        <option value="REJECTED">Rejected</option>
      </select>

      {visibleOrders.map((order) => (
        <div key={order.id} className="bg-white p-4 mb-3 rounded shadow">
          <p>
            <strong>Order #{order.id}</strong> — {order.customer_name}
          </p>
          <p>Status: {order.status}</p>
          <p>
            Price:{" "}
            {Number(order.total_price) > 0 ? `Nrs.${order.total_price}` : "—"}
          </p>

          {order.status === "ON_GOING" && (
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleUpdate(order.id, { status: "REJECTED" })}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Reject
              </button>
              <button
                onClick={() => handleUpdate(order.id, { status: "COMPLETED" })}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Mark Completed
              </button>
              <input
                type="number"
                placeholder="Set Price"
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

