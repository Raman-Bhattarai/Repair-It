import React, { useEffect, useState } from "react";
import api from "../api/api";

function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get("users/customers/"); // create endpoint in Django
        setCustomers(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (loading) return <p className="text-center mt-20 text-gray-600">Loading customers...</p>;
  if (customers.length === 0) return <p className="text-center mt-20 text-gray-600">No customers found.</p>;

  return (
    <div className="p-6 pt-16">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
        Customers
      </h1>

      <div className="overflow-x-auto">
        <div className="bg-gradient-to-r from-sky-200 to-sky-400 rounded-2xl shadow-xl overflow-hidden">
          <table className="min-w-full text-left text-gray-800">
            <thead className="bg-sky-500 text-white">
              <tr>
                <th className="p-4 font-semibold">Username</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Phone</th>
                <th className="p-4 font-semibold">Address</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-sky-300 hover:bg-sky-100 transition"
                >
                  <td className="p-4">{c.username}</td>
                  <td className="p-4">{c.email}</td>
                  <td className="p-4">{c.phone}</td>
                  <td className="p-4">{c.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CustomerPage;

