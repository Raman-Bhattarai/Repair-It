import React from "react";

function OrderDetails({ order, onClose }) {
  return (
    <div className="p-6 border rounded-xl bg-white shadow-md text-gray-900">
  <h3 className="text-xl font-bold mb-3">अर्डर #{order.id} विवरण</h3>
  <p className="mb-1"><span className="font-semibold">स्थिति:</span> {order.status}</p>
  <p className="mb-3"><span className="font-semibold">जम्मा:</span> Rs. {order.total_price ?? 0}</p>

  <h4 className="text-lg font-semibold mb-2">वस्तुहरू:</h4>
  {(order.items || []).map((item) => (
    <div key={item.id} className="border p-4 rounded-lg bg-gray-50 shadow-sm mb-3">
      <p>प्रकार: {item.order_name}</p>
      <p>विवरण: {item.order_details}</p>
      <p>परिमाण: {item.quantity}</p>
      <p>मूल्य: Rs. {item.price}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {(item.images || []).map((img) => (
          <img
            key={img.id}
            src={img.image}
            alt="order item"
            className="w-20 h-20 object-cover border rounded-lg shadow-sm"
          />
        ))}
      </div>
    </div>
  ))}
  <button className="mt-4 text-indigo-600 font-semibold hover:underline" onClick={onClose}>
    बन्द गर्नुहोस्
  </button>
</div>

  );
}

export default OrderDetails;
