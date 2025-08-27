import React from "react";

function OrderDetails({ order }) {
  if (!order) return null;

  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Order #{order.id}</h2>
      <p className="text-gray-600 mb-2">Customer: {order.customer_name}</p>
      <p className="text-gray-600 mb-4">Status: {order.status}</p>

      <h3 className="text-lg font-semibold">Items:</h3>
      <ul className="divide-y mt-2">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between py-2">
            <span>
              {item.order_name} — {item.order_details}
            </span>
            <span>
              {item.quantity} × {Number(item.price).toFixed(2)}
            </span>
            <span>
              {item.images ? (
                <img
                  src={item.images}
                  alt={item.order_name}
                  className="h-25 w-25 object-cover rounded"
                />
              ) : ("—")}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex justify-between font-bold">
        <span>Total:</span>
        <span>
          {Number(order.total_price) > 0 ? `Nrs.${order.total_price}` : "—"}
        </span>
      </div>
    </div>
  );
}

export default OrderDetails;

