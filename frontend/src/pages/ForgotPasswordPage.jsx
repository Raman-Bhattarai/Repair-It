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
      setError(
        err.response?.data?.email || "कुनै समस्या भयो। कृपया फेरि प्रयास गर्नुहोस्।"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-rose-400 shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-rose-600 mb-6">
          पासवर्ड रिसेट गर्नुहोस्
        </h2>

        {message ? (
          <div className="text-center space-y-4">
            <p className="text-green-500">{message}</p>
            <Button
              onClick={() => navigate("/login")}
              variant="primary"
              className="mt-2"
            >
              लगइन पृष्ठमा जानुहोस्
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-center">{error}</p>}

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
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
