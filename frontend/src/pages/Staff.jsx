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

  if (loading) return <p className="text-center mt-20">Loading staff...</p>;
  if (staff.length === 0) return <p className="text-center mt-20">No staff found.</p>;

  return (
    <div className="p-6 pt-16">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Staff Members</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-emerald-500 rounded-xl shadow">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Is Staff</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="p-3">{s.username}</td>
                <td className="p-3">{s.email}</td>
                <td className="p-3">{s.phone}</td>
                <td className="p-3">{s.is_staff ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StaffPage;
