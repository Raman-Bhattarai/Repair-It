import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { loginUser } from "../api/api";
import Input from "../components/auth/Input";
import Button from "../components/auth/Button";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1️⃣ Get JWT tokens + user from backend
      const response = await loginUser(credentials);
      const { access, refresh, user } = response.data;

      // 2️⃣ Store tokens in localStorage
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // 3️⃣ Save user + tokens in context
      login(user, access, refresh);

      // 4️⃣ Redirect to home page
      navigate("/");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(
        err.response?.data?.detail || "अमान्य प्रयोगकर्ता नाम वा पासवर्ड"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-rose-400 shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-rose-600 mb-6">
          लगइन गर्नुहोस्
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <Input
            label="प्रयोगकर्ता नाम"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
          <Input
            label="पासवर्ड"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "लगइन गर्दै..." : "लगइन"}
          </Button>
        </form>

        <div className="text-center mt-4 space-y-2">
          <p className="text-sm text-gray-600">
            खाता छैन?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-rose-600 cursor-pointer hover:underline"
            >
              दर्ता गर्नुहोस्
            </span>
          </p>
          <p className="text-sm text-gray-600">
            पासवर्ड बिर्सिनुभयो?{" "}
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-rose-600 cursor-pointer hover:underline"
            >
              यहाँ क्लिक गर्नुहोस्
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
