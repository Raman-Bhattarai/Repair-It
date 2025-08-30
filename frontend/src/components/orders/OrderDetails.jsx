import React from "react";

function OrderDetails({ order, onClose }) {
  return (
    <div className="p-4 border rounded bg-white mt-4 text-black">
      <h3 className="text-lg font-bold">अर्डर #{order.id} विवरण</h3>
      <p>स्थिति: {order.status}</p>
      <p>जम्मा: Rs. {order.total_price}</p>
      <h4 className="mt-2 font-semibold">वस्तुहरू:</h4>
      {order.items.map((item) => (
        <div key={item.id} className="border p-2 rounded mt-2">
          <p>प्रकार: {item.order_name}</p>
          <p>विवरण: {item.order_details}</p>
          <p>परिमाण: {item.quantity}</p>
          <p>मूल्य: Rs. {item.price}</p>
          <div className="flex space-x-2 mt-2">
            {item.images.map((img) => (
              <img
                key={img.id}
                src={img.image}
                alt="order item"
                className="w-20 h-20 object-cover border"
              />
            ))}
          </div>
        </div>
      ))}
      <button className="mt-3 text-blue-500 underline" onClick={onClose}>
        बन्द गर्नुहोस्
      </button>
    </div>
  );
}

export default OrderDetails;
