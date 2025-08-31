import React, { useEffect, useState } from "react";
import { getOrders } from "../api/api";
import OrderDetails from "../components/orders/OrderDetails";
import CreateOrder from "../components/orders/CreateOrder";
import UpdateOrder from "../components/orders/UpdateOrder";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-6 text-gray-900 mx-auto max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">मेरा अर्डरहरू</h2>

      <button
        className="bg-rose-600 text-white px-5 py-2 rounded-lg shadow hover:bg-rose-700 transition mb-6"
        onClick={() => setShowCreate(true)}
      >
        नयाँ अर्डर बनाउनुहोस्
      </button>

      {showCreate && (
        <CreateOrder
          onClose={() => setShowCreate(false)}
          onOrderCreated={fetchOrders}
        />
      )}

      {showUpdate && (
        <UpdateOrder
          order={showUpdate}
          onClose={() => setShowUpdate(null)}
          onOrderUpdated={fetchOrders}
        />
      )}

      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {loading ? (
        <p className="text-gray-600">लोड हुँदै...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">
          अहिलेसम्म कुनै अर्डर छैन। नयाँ अर्डर बनाउन सुरु गर्नुहोस्।
        </p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="border border-gray-200 p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition flex justify-between items-center"
            >
              <span
                onClick={() => setSelectedOrder(order)}
                className="text-gray-800 font-medium"
              >
                अर्डर #{order.id} | स्थिति:{" "}
                <span className="font-semibold">{order.status}</span> | जम्मा: Rs.{" "}
                {order.total_price ?? 0}
              </span>
              {["PENDING"].includes(order.status) && (
                <button
                  onClick={() => setShowUpdate(order)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-600 transition"
                >
                  सम्पादन
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OrdersPage;

