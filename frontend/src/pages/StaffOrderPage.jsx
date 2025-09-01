import React, { useEffect, useState } from "react";
import api from "../api/api";

function StaffOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [priceInputs, setPriceInputs] = useState({});
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [priceUpdatingId, setPriceUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/");
      setOrders(res.data);

      const initialPrices = {};
      res.data.forEach((order) => {
        initialPrices[order.id] = order.total_price || "";
      });
      setPriceInputs(initialPrices);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // General update handler (status or price)
  const handleUpdate = async (id, data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      const res = await api.patch(`/orders/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, ...res.data } : order
        )
      );

      if (res.data.total_price !== undefined) {
        setPriceInputs((prev) => ({ ...prev, [id]: res.data.total_price }));
      }
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert(
        typeof err.response?.data === "object"
          ? JSON.stringify(err.response.data)
          : "Update failed."
      );
    }
  };

  const handlePriceChange = (id, value) => {
    setPriceInputs({ ...priceInputs, [id]: value });
  };

  const handleSetPrice = async (id) => {
    const value = Number(priceInputs[id]);
    if (isNaN(value)) return;
    setPriceUpdatingId(id);
    await handleUpdate(id, { total_price: value });
    setPriceUpdatingId(null);
  };

  const handleSetStatus = async (id, status) => {
    setStatusUpdatingId(id);
    await handleUpdate(id, { status });
    setStatusUpdatingId(null);
  };

  const visibleOrders = orders.filter((o) =>
    filter === "ALL" ? true : o.status === filter
  );

  const statusOptions = [
    { value: "ALL", label: "सबै" },
    { value: "PENDING", label: "चालु" },
    { value: "COMPLETED", label: "पूरा भयो" },
    { value: "CANCELLED", label: "रद्द भयो" },
    { value: "REJECTED", label: "अस्वीकृत" },
  ];

  return (
    <div className="p-6 pt-20 text-gray-900 min-h-screen bg-gray-50 ml-15 mr-15">
      <h1 className="text-3xl font-bold mb-6 text-rose-600">अर्डर व्यवस्थापन</h1>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 mb-6 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none bg-white"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {visibleOrders.length === 0 && (
        <p className="text-gray-500 italic">कुनै अर्डर उपलब्ध छैन।</p>
      )}

      {visibleOrders.map((order) => (
        <div
          key={order.id}
          className={`p-5 mb-5 rounded-2xl shadow hover:shadow-lg transition
            ${["COMPLETED", "CANCELLED", "REJECTED"].includes(order.status)
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-white text-gray-900"
            }`}
        >
          <p className="text-lg font-semibold">
            अर्डर #{order.id} —{" "}
            <span className={`${["COMPLETED", "CANCELLED", "REJECTED"].includes(order.status) ? "text-gray-400" : "text-rose-600"} font-medium`}>
              {order.customer?.username || order.customer?.email || "ग्राहक"}
            </span>
          </p>

          <p className="text-sm mt-1">
            स्थिति:{" "}
            <span className={`font-medium ${
              order.status === "COMPLETED" ? "text-green-600" :
              order.status === "CANCELLED" ? "text-red-600" :
              order.status === "REJECTED" ? "text-rose-500" :
              "text-blue-600"
            }`}>
              {order.status}
            </span>
          </p>

          {/* Price input + button */}
          {!["COMPLETED", "CANCELLED", "REJECTED"].includes(order.status) && (
            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                value={priceInputs[order.id] ?? ""}
                onChange={(e) => handlePriceChange(order.id, e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none w-40"
                placeholder="रु सेट गर्नुहोस्"
              />
              <button
                onClick={() => handleSetPrice(order.id)}
                disabled={priceUpdatingId === order.id}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-70"
              >
                {priceUpdatingId === order.id ? "सेट हुँदै..." : "मूल्य सेट गर्नुहोस्"}
              </button>
            </div>
          )}

          {/* Order items */}
          {order.items && order.items.length > 0 && (
            <div className="mt-4 space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 p-3 rounded-lg bg-gray-50 shadow-sm"
                >
                  <p className="font-semibold">
                    {item.order_name} — मात्रा: {item.quantity}
                  </p>
                  <p className="text-sm">{item.order_details}</p>
                  {item.images && item.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.images.map((img) => (
                        <img
                          key={img.id}
                          src={img.image}
                          alt={item.order_name}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Status buttons */}
          {order.status === "PENDING" && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => handleSetStatus(order.id, "REJECTED")}
                disabled={statusUpdatingId === order.id}
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition disabled:opacity-70"
              >
                {statusUpdatingId === order.id ? "अपडेट हुँदै..." : "अस्वीकृत गर्नुहोस्"}
              </button>
              <button
                onClick={() => handleSetStatus(order.id, "COMPLETED")}
                disabled={statusUpdatingId === order.id}
                className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition disabled:opacity-70"
              >
                {statusUpdatingId === order.id ? "अपडेट हुँदै..." : "पूरा भयो"}
              </button>
              <button
                onClick={() => handleSetStatus(order.id, "CANCELLED")}
                disabled={statusUpdatingId === order.id}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg shadow hover:bg-rose-700 transition disabled:opacity-70"
              >
                {statusUpdatingId === order.id ? "अपडेट हुँदै..." : "रद्द गर्नुहोस्"}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default StaffOrdersPage;
