import React, { useEffect, useState } from "react";
import { getOrders } from "../api/api";
import api from "../api/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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

        // ✅ Use .data to get array
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

  // Filter only completed orders for total sales
  const completedOrders = orders.filter(order => order.status === "COMPLETED");

  const totalSales = completedOrders.reduce(
    (acc, order) => acc + Number(order.total_price || 0),
    0
  );

  // --- Chart Data ---
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

  if (loading) return <p className="text-center mt-20 text-black">Loading dashboard...</p>;

  return (
    <div className="p-6 mt-16 pt-16">
      <h1 className="text-3xl font-bold text-black mb-6 text-center">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-100 p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold text-black">Total Orders</h2>
          <p className="text-2xl font-bold mt-2 text-black">{orders.length}</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold text-black">Total Sales</h2>
          <p className="text-2xl font-bold mt-2 text-black">Nrs.{totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold text-black">Customers</h2>
          <p className="text-2xl font-bold mt-2 text-black">{customers.length}</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold text-black">Staff</h2>
          <p className="text-2xl font-bold mt-2 text-black">{staff.length}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Trend */}
        <div className="bg-gray-100 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-black">Sales Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesByDate}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-gray-100 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-black">Order Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={orderStatusData} dataKey="value" nameKey="name" outerRadius={100} fill="#8884d8" label>
                {orderStatusData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-100 p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4 text-black">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-50 rounded-xl">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left text-black">Order ID</th>
                <th className="p-3 text-left text-black">Customer</th>
                <th className="p-3 text-left text-black">Order Name</th>
                <th className="p-3 text-left text-black">Total</th>
                <th className="p-3 text-left text-black">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-100">
                  <td className="p-3 text-black">{order.id}</td>
                  <td className="p-3 text-black">{order.customer?.username}</td>
                  <td className="p-3 text-black">{order.order_name}</td>
                  <td className="p-3 text-black">Nrs.{Number(order.total_price).toFixed(2)}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-white ${
                        order.status === "COMPLETED"
                          ? "bg-green-600"
                          : order.status === "PENDING"
                          ? "bg-yellow-500"
                          : "bg-red-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
