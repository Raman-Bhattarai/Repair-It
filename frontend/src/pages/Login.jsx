import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { loginUser, getUserProfile } from "../api/api";
import Input from "../components/auth/Input";
import Button from "../components/auth/Button";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1️⃣ Get JWT tokens from backend
      const response = await loginUser(credentials);
      const { access, refresh } = response.data;

      // 2️⃣ Store tokens
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // 3️⃣ Fetch user profile
      const profileRes = await getUserProfile();
      const userData = profileRes.data;

      // 4️⃣ Save in context
      login(userData, access, refresh);

      // 5️⃣ Redirect
      navigate("/menu");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-rose-400 shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-rose-600 mb-6">
          Login
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-rose-600 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

