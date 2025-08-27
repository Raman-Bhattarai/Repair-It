import React, { useEffect, useState } from "react";
import api from "../api/api";
import CreateOrder from "../components/order/CreateOrder";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (id) => {
    try {
      await api.post(`/orders/${id}/cancel/`);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const truncateDesc = (desc) =>
    desc.split(" ").slice(0, 15).join(" ") + (desc.split(" ").length > 15 ? "..." : "");

  if (loading) return <p className="mt-20 text-center">Loading orders...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">My Orders</h1>

      {/* Create Order Component */}
      <CreateOrder onOrderCreated={fetchOrders} />

      {/* List of orders */}
      {orders.length === 0 && <p className="text-center text-gray-500">No orders yet.</p>}

      {orders.map((order) => (
        <div key={order.id} className="bg-white shadow p-4 rounded-xl">
          <h2 className="text-lg font-semibold">Order #{order.id}</h2>
          <p className="text-sm text-gray-500">
            Created: {new Date(order.created_at).toLocaleDateString()}
          </p>

          {order.items.map((item) => (
            <p key={item.id} className="mt-2 text-gray-700">
              <strong>{item.order_name}</strong> — {truncateDesc(item.order_details)}
              {item.images && (<>
                <br />
                <img
                  src={item.images}
                  alt={item.order_name}
                  className="h-10 w-10 object-cover rounded mt-1"
                />
              </>)}
            </p>
          ))}

          <p className="mt-2">
            <span className="font-semibold">Status:</span> {order.status}
          </p>
          <p>
            <span className="font-semibold">Price:</span>{" "}
            {Number(order.total_price) > 0 ? `Nrs.${order.total_price}` : "—"}
          </p>

          {order.status === "ON_GOING" && (
            <button
              onClick={() => handleCancel(order.id)}
              className="mt-3 px-3 py-1 bg-red-500 text-white rounded"
            >
              Cancel
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default OrdersPage;

