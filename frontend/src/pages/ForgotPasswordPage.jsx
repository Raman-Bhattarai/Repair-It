import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../api/api";
import Input from "../components/auth/Input";
import Button from "../components/auth/Button";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await forgotPassword(email);
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.email || "कुनै समस्या भयो। कृपया फेरि प्रयास गर्नुहोस्।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen pt-20 bg-gradient-to-br from-rose-100 to-rose-200 p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md border-t-8 border-rose-400">
        <h2 className="text-3xl font-extrabold text-center text-rose-600 mb-6 drop-shadow-md">
          पासवर्ड रिसेट गर्नुहोस्
        </h2>

        {message ? (
          <div className="text-center space-y-4">
            <p className="text-green-500 font-medium">{message}</p>
            <Button onClick={() => navigate("/login")} variant="primary" className="mt-2 w-full">
              लगइन पृष्ठमा जानुहोस्
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-center font-medium">{error}</p>}

            <Input
              label="इमेल"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "पठाइँदै..." : "रिसेट लिंक पठाउनुहोस्"}
            </Button>
          </form>
        )}

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

export default ForgotPasswordPage;
