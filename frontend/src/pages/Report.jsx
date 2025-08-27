import React, { useEffect, useState } from "react";
import { getOrders } from "../api/api";

function ReportPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrders();
        setOrders(Array.isArray(res.data) ? res.data : []); // ensure array
      } catch (err) {
        console.error(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter only completed orders
  const completedOrders = orders.filter(order => order.status === "COMPLETED");

  const totalSales = completedOrders.reduce(
    (acc, order) => acc + Number(order.total_price || 0),
    0
  );

  const totalOrders = completedOrders.length;

  if (loading) return <p className="text-center mt-20 text-black">Loading report...</p>;

  return (
    <div className="p-6 pt-16">
      <h1 className="text-3xl font-bold text-black mb-6 text-center">Reports</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-100 p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold text-black">Total Orders</h2>
          <p className="text-2xl font-bold mt-2 text-black">{totalOrders}</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold text-black">Total Sales</h2>
          <p className="text-2xl font-bold mt-2 text-black">Nrs.{totalSales.toFixed(2)}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-50 rounded-xl shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left text-black">Order ID</th>
              <th className="p-3 text-left text-black">Customer</th>
              <th className="p-3 text-left text-black">Total</th>
              <th className="p-3 text-left text-black">Status</th>
            </tr>
          </thead>
          <tbody>
            {completedOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-100">
                <td className="p-3 text-black">{order.id}</td>
                <td className="p-3 text-black">{order.customer?.username}</td>
                <td className="p-3 text-black">Nrs.{Number(order.total_price).toFixed(2)}</td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded-full text-white bg-green-600">
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
            {completedOrders.length === 0 && (
              <tr>
                <td colSpan="4" className="p-3 text-center text-black">
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
