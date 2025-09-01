import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import Input from "../components/auth/Input";
import Button from "../components/auth/Button";

function ResetPasswordPage() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post(`/reset-password/${uid}/${token}/`, {
        new_password: password,
        confirm_password: confirmPassword,
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "कुनै समस्या भयो। कृपया फेरि प्रयास गर्नुहोस्।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen pt-20 bg-gradient-to-br from-rose-100 to-rose-200 p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md border-t-8 border-rose-400">
        <h2 className="text-3xl font-extrabold text-center text-rose-600 mb-6 drop-shadow-md">
          नयाँ पासवर्ड सेट गर्नुहोस्
        </h2>

        {message && <p className="text-green-500 mb-4 text-center font-medium">{message}</p>}
        {error && <p className="text-red-500 mb-4 text-center font-medium">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="नयाँ पासवर्ड"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            label="पासवर्ड पुष्टि गर्नुहोस्"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "सेट गर्दै..." : "पासवर्ड परिवर्तन गर्नुहोस्"}
          </Button>
        </form>

        {/* Home button */}
        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium shadow hover:from-rose-600 hover:to-pink-700 transition"
        >
          🏠 Homepage फर्किनुहोस्
        </button>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
