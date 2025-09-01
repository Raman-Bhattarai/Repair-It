import React, { useEffect, useState } from "react";
import { getOrders } from "../api/api";

function ReportPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrders();
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const completedOrders = orders.filter((order) => order.status === "COMPLETED");

  const totalSales = completedOrders.reduce(
    (acc, order) => acc + Number(order.total_price || 0),
    0
  );

  const totalOrders = completedOrders.length;

  if (loading)
    return <p className="text-center mt-20 text-gray-700 animate-pulse">Loading report...</p>;

  return (
    <div className="p-6 pt-20 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Reports
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border text-center">
          <h2 className="text-lg font-semibold text-gray-600">Completed Orders</h2>
          <p className="text-3xl font-bold mt-3 text-gray-900">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border text-center">
          <h2 className="text-lg font-semibold text-gray-600">Total Sales</h2>
          <p className="text-3xl font-bold mt-3 text-green-600">
            Nrs.{totalSales.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left font-semibold text-gray-700">Order ID</th>
              <th className="p-4 text-left font-semibold text-gray-700">Customer</th>
              <th className="p-4 text-left font-semibold text-gray-700">Total</th>
              <th className="p-4 text-left font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {completedOrders.map((order) => (
              <tr
                key={order.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4">{order.id}</td>
                <td className="p-4">{order.customer?.username || "N/A"}</td>
                <td className="p-4">Nrs.{Number(order.total_price).toFixed(2)}</td>
                <td className="p-4">
                  <span className="px-3 py-1 text-xs rounded-full font-medium bg-green-100 text-green-700">
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
            {completedOrders.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No completed orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportPage;

