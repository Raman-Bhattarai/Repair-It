import React, { useEffect, useState } from "react";
import api from "../api/api";
import CreateOrder from "../components/orders/CreateOrder";
import OrderDetails from "../components/orders/OrderDetails";

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
    <div className="p-6 max-w-3xl mx-auto space-y-6 text-black">
      <h1 className="text-3xl font-bold text-center">मेरो अर्डरहरू</h1>

      <div className="text-center">
        <button
          onClick={() => {
            setShowCreateOrder(!showCreateOrder);
            setSelectedOrder(null);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        >
          {showCreateOrder ? "Create Order बन्द गर्नुहोस्" : "नयाँ अर्डर सिर्जना गर्नुहोस्"}
        </button>
      </div>

      {showCreateOrder && <CreateOrder onOrderCreated={fetchOrders} />}

      {orders.length === 0 && !showCreateOrder && (
        <p className="text-center text-gray-600 mt-6">
          आफ्नो पहिलो अर्डर राखेर सुरु गर्नुहोस्। <br />
          <span className="font-semibold">"नयाँ अर्डर सिर्जना गर्नुहोस्"</span> क्लिक गरेर
          मर्मत अर्डर विवरण र छविसहित बनाउनुहोस्।
        </p>
      )}

      {selectedOrder ? (
        <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow p-4 rounded-xl cursor-pointer hover:bg-gray-50"
            onClick={() => {
              setSelectedOrder(order);
              setShowCreateOrder(false);
            }}
          >
            <h2 className="text-lg font-semibold">अर्डर #{order.id}</h2>
            <p className="text-sm text-gray-500">
              सिर्जना मिति: {new Date(order.created_at).toLocaleDateString()}
            </p>

            {order.items.map((item) => (
              <p key={item.id} className="mt-2 text-gray-700">
                <strong>{item.order_name_display || item.order_name}</strong> — {truncateDesc(item.order_details)}
                {item.images && item.images.length > 0 && (
                  <br />
                )}
                {item.images && item.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={item.order_name}
                    className="inline-block h-10 w-10 object-cover rounded mt-1 mr-1"
                  />
                ))}
              </p>
            ))}

            <p className="mt-2">
              <span className="font-semibold">स्थिति:</span> {order.status_display || order.status}
            </p>
            <p>
              <span className="font-semibold">मूल्य:</span>{" "}
              {Number(order.total_price) > 0 ? `Nrs.${order.total_price}` : "—"}
            </p>

            {order.status === "ON_GOING" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel(order.id);
                }}
                className="mt-3 px-3 py-1 bg-red-500 text-white rounded"
              >
                रद्द गर्नुहोस्
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default OrdersPage;
