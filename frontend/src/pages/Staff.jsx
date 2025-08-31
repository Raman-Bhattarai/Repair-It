import React, { useEffect, useState } from "react";
import api from "../api/api";

function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await api.get("users/staff/"); // create endpoint in Django
        setStaff(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  if (loading) return <p className="text-center mt-20 text-gray-600">Loading staff...</p>;
  if (staff.length === 0) return <p className="text-center mt-20 text-gray-600">No staff found.</p>;

  return (
    <div className="p-6 pt-16">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
        Staff Members
      </h1>

      <div className="overflow-x-auto">
        <div className="bg-gradient-to-r from-emerald-200 to-emerald-400 rounded-2xl shadow-xl overflow-hidden">
          <table className="min-w-full text-left text-gray-800">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="p-4 font-semibold">Username</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Phone</th>
                <th className="p-4 font-semibold">Is Staff</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-emerald-300 hover:bg-emerald-100 transition"
                >
                  <td className="p-4">{s.username}</td>
                  <td className="p-4">{s.email}</td>
                  <td className="p-4">{s.phone}</td>
                  <td className="p-4">{s.is_staff ? "✅ Yes" : "❌ No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StaffPage;

