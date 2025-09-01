import React, { useEffect, useState } from "react";
import { getOrders, cancelOrder } from "../api/api";
import OrderDetails from "../components/orders/OrderDetails";
import CreateOrder from "../components/orders/CreateOrder";
import UpdateOrder from "../components/orders/UpdateOrder";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
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

  const handleCancelOrder = async (orderId) => {
    try {
      setCancelingId(orderId);
      await cancelOrder(orderId);
      fetchOrders();
    } catch (err) {
      console.error("Order cancel failed:", err.response?.data || err.message);
      alert(
        typeof err.response?.data === "object"
          ? Object.values(err.response.data).flat().join("\n")
          : "अर्डर रद्द गर्न असफल भयो।"
      );
    } finally {
      setCancelingId(null);
      setConfirmCancel(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">प्रक्रियामा</span>;
      case "COMPLETED":
        return <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">पूरा भएको</span>;
      case "REJECTED":
        return <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">अस्वीकृत</span>;
      case "CANCELLED":
        return <span className="bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">रद्द गरिएको</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <div className="p-6 pt-20 text-gray-900 mx-auto max-w-4xl">
      <h2 className="text-3xl font-bold mb-6 text-center">मेरा अर्डरहरू</h2>

      <button
        className="bg-rose-600 text-white px-6 py-2 rounded-lg shadow hover:bg-rose-700 transition mb-6"
        onClick={() => setShowCreate(true)}
      >
        नयाँ अर्डर बनाउनुहोस्
      </button>

      {showCreate && (
        <CreateOrder onClose={() => setShowCreate(false)} onOrderCreated={fetchOrders} />
      )}

      {showUpdate && (
        <UpdateOrder
          order={showUpdate}
          onClose={() => setShowUpdate(null)}
          onOrderUpdated={fetchOrders}
        />
      )}

      {selectedOrder && (
        <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}

      {loading ? (
        <p className="text-gray-600">लोड हुँदै...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">अहिलेसम्म कुनै अर्डर छैन।</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => {
            const isEditable = order.status === "PENDING";
            const firstImage = order.items?.[0]?.images?.[0]?.image; // first image if exists

            return (
              <li
                key={order.id}
                className="border border-gray-200 p-4 rounded-lg shadow hover:shadow-md transition flex justify-between items-center"
              >
                <div
                  className="cursor-pointer flex items-center space-x-3"
                  onClick={() => setSelectedOrder(order)}
                >
                  {firstImage && (
                    <img
                      src={firstImage}
                      alt="order thumbnail"
                      className="w-16 h-16 object-cover border rounded-lg shadow-sm"
                    />
                  )}
                  <div className="flex flex-col">
                    <span>अर्डर #{order.id} | जम्मा: Rs. {order.total_price ?? 0}</span>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {isEditable && (
                    <>
                      <button
                        onClick={() => setShowUpdate(order)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-600 transition"
                      >
                        सम्पादन
                      </button>

                      <button
                        onClick={() => setConfirmCancel(order.id)}
                        disabled={cancelingId === order.id}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg shadow hover:bg-red-700 transition disabled:opacity-70"
                      >
                        {cancelingId === order.id ? "रद्द हुँदै..." : "रद्द गर्नुहोस्"}
                      </button>
                    </>
                  )}
                </div>

                {/* Confirmation Modal */}
                {confirmCancel === order.id && (
                  <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center space-y-4 pointer-events-auto border border-gray-300">
                      <p className="font-semibold text-gray-800">के तपाईं साँच्चै यो अर्डर रद्द गर्न चाहनुहुन्छ?</p>
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
                        >
                          हो, रद्द गर्नुहोस्
                        </button>
                        <button
                          onClick={() => setConfirmCancel(null)}
                          className="bg-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-400 transition"
                        >
                          बन्द गर्नुहोस्
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default OrdersPage;
