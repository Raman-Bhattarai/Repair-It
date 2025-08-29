import React, { useEffect, useState } from "react";
import api from "../api/api";
import CreateOrder from "../components/orders/CreateOrder";
import OrderDetails from "../components/orders/OrderDetails"; // new component

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

      {/* Create Order Button */}
      <div className="text-center">
        <button
          onClick={() => {
            setShowCreateOrder(!showCreateOrder);
            setSelectedOrder(null); // hide details when creating new
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        >
          {showCreateOrder ? "Close Create Order" : "Create New Order"}
        </button>
      </div>

      {/* Create Order Component */}
      {showCreateOrder && <CreateOrder onOrderCreated={fetchOrders} />}

      {/* No Orders Yet */}
      {orders.length === 0 && !showCreateOrder && (
        <p className="text-center text-gray-600 mt-6">
          Get started by placing your first order! <br />
          Click <span className="font-semibold">"Create New Order"</span> to create your
          repair order with details and images.
        </p>
      )}

      {/* Order Details View */}
      {selectedOrder ? (
        <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      ) : (
        /* Orders List */
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow p-4 rounded-xl cursor-pointer hover:bg-gray-50"
            onClick={() => {
              setSelectedOrder(order);
              setShowCreateOrder(false); // hide create form if viewing order
            }}
          >
            <h2 className="text-lg font-semibold">Order #{order.id}</h2>
            <p className="text-sm text-gray-500">
              Created: {new Date(order.created_at).toLocaleDateString()}
            </p>

            {order.items.map((item) => (
              <p key={item.id} className="mt-2 text-gray-700">
                <strong>{item.order_name}</strong> — {truncateDesc(item.order_details)}
                {item.images && (
                  <>
                    <br />
                    <img
                      src={item.images}
                      alt={item.order_name}
                      className="h-10 w-10 object-cover rounded mt-1"
                    />
                  </>
                )}
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
                onClick={(e) => {
                  e.stopPropagation(); // prevent opening details
                  handleCancel(order.id);
                }}
                className="mt-3 px-3 py-1 bg-red-500 text-white rounded"
              >
                Cancel
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default OrdersPage;
