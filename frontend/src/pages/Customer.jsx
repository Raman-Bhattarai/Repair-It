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

  if (loading) return <p className="text-center mt-20">Loading customers...</p>;
  if (customers.length === 0) return <p className="text-center mt-20">No customers found.</p>;

  return (
    <div className="p-6  pt-16">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Customers</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-sky-300 rounded-xl shadow">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Address</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="p-3">{c.username}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.phone}</td>
                <td className="p-3">{c.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerPage;
