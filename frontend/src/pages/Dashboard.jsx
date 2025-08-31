import React, { useEffect, useState } from "react";
import { getOrders } from "../api/api";
import api from "../api/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await getOrders();
        const customersRes = await api.get("users/customers/");
        const staffRes = await api.get("users/staff/");

        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
        setCustomers(Array.isArray(customersRes.data) ? customersRes.data : []);
        setStaff(Array.isArray(staffRes.data) ? staffRes.data : []);
      } catch (err) {
        console.error(err);
        setOrders([]);
        setCustomers([]);
        setStaff([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedOrders = orders.filter((o) => o.status === "COMPLETED");

  const totalSales = completedOrders.reduce(
    (acc, order) => acc + Number(order.total_price || 0),
    0
  );

  const salesByDate = Object.values(
    completedOrders.reduce((acc, order) => {
      const date = new Date(order.created_at).toLocaleDateString();
      acc[date] = acc[date] || { date, total: 0 };
      acc[date].total += Number(order.total_price || 0);
      return acc;
    }, {})
  );

  const orderStatusData = [
    { name: "On Going", value: orders.filter((o) => o.status === "ON_GOING").length },
    { name: "Completed", value: orders.filter((o) => o.status === "COMPLETED").length },
    { name: "Cancelled", value: orders.filter((o) => o.status === "CANCELLED").length },
  ];

  const COLORS = ["#facc15", "#22c55e", "#ef4444"];

  if (loading)
    return <p className="text-center mt-20 text-gray-700 animate-pulse">Loading dashboard...</p>;

  return (
    <div className="p-6 pt-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-lg border text-center">
          <h2 className="text-lg font-semibold text-gray-600">Total Orders</h2>
          <p className="text-3xl font-bold mt-3 text-gray-900">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border text-center">
          <h2 className="text-lg font-semibold text-gray-600">Total Sales</h2>
          <p className="text-3xl font-bold mt-3 text-green-600">
            Nrs.{totalSales.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border text-center">
          <h2 className="text-lg font-semibold text-gray-600">Customers</h2>
          <p className="text-3xl font-bold mt-3 text-gray-900">{customers.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border text-center">
          <h2 className="text-lg font-semibold text-gray-600">Staff</h2>
          <p className="text-3xl font-bold mt-3 text-gray-900">{staff.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Sales Trend</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={salesByDate}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Order Status</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={orderStatusData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {orderStatusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-700">Order ID</th>
                <th className="p-4 text-left font-semibold text-gray-700">Customer</th>
                <th className="p-4 text-left font-semibold text-gray-700">Order Name</th>
                <th className="p-4 text-left font-semibold text-gray-700">Total</th>
                <th className="p-4 text-left font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr
                  key={order.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4">{order.id}</td>
                  <td className="p-4">{order.customer?.username || "N/A"}</td>
                  <td className="p-4">{order.order_name || "—"}</td>
                  <td className="p-4">Nrs.{Number(order.total_price).toFixed(2)}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        order.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : order.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    No recent orders available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

