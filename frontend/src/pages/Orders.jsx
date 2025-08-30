import React, { useEffect, useState } from "react";
import api from "../api/api";
import OrderDetails from "../components/orders/OrderDetails";
import CreateOrder from "../components/orders/CreateOrder";
import UpdateOrder from "../components/orders/UpdateOrder";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get("orders/");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-4 text-black">
      <h2 className="text-xl font-bold mb-4">मेरा अर्डरहरू</h2>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
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
        <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}

      {orders.length === 0 ? (
        <p>अहिलेसम्म कुनै अर्डर छैन। नयाँ अर्डर बनाउन सुरु गर्नुहोस्।</p>
      ) : (
        <ul className="space-y-2">
          {orders.map((order) => (
            <li
              key={order.id}
              className="border p-2 rounded cursor-pointer hover:bg-gray-100 flex justify-between"
            >
              <span onClick={() => setSelectedOrder(order)}>
                अर्डर #{order.id} | स्थिति: {order.status} | जम्मा: Rs.{" "}
                {order.total_price}
              </span>
              <button
                onClick={() => setShowUpdate(order)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                सम्पादन
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OrdersPage;
