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
      const response = await loginUser(credentials);
      const { access, refresh, user } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      login(user, access, refresh);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.detail || "अमान्य प्रयोगकर्ता नाम वा पासवर्ड"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen pt-10 bg-gradient-to-br from-rose-100 to-rose-200 p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md border-t-8 border-rose-400">
        <h2 className="text-3xl font-extrabold text-center text-rose-600 mb-6 drop-shadow-md">
          लगइन गर्नुहोस्
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="text-center mt-6 space-y-2 text-gray-600 text-sm">
          <p>
            खाता छैन?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-rose-600 cursor-pointer hover:underline font-medium"
            >
              दर्ता गर्नुहोस्
            </span>
          </p>
          <p>
            पासवर्ड बिर्सिनुभयो?{" "}
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-rose-600 cursor-pointer hover:underline font-medium"
            >
              यहाँ क्लिक गर्नुहोस्
            </span>
          </p>

          {/* ✅ Home button */}
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 w-full rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium shadow hover:from-rose-600 hover:to-pink-700 transition"
          >
            🏠 Homepage फर्किनुहोस्
          </button>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;

