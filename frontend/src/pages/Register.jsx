import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/auth/Input";
import Button from "../components/auth/Button";
import { registerUser, loginUser, getUserProfile } from "../api/api";
import { useAuth } from "../contexts/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Prepare payload
      const payload = {
        fullname: form.fullname,
        email: form.email,
        password: form.password,
      };
      if (form.phone.trim()) payload.phone = form.phone.trim();
      if (form.address.trim()) payload.address = form.address.trim();

      // 2️⃣ Register user
      await registerUser(payload);

      // 3️⃣ Auto login (email + password)
      const loginRes = await loginUser({
        email: form.email,
        password: form.password,
      });

      const { access, refresh } = loginRes.data;

      // 4️⃣ Store tokens
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // 5️⃣ Fetch profile
      const profileRes = await getUserProfile();
      const userData = profileRes.data;

      // 6️⃣ Save in context
      login(
        {
          ...userData,
          role: userData.is_staff ? "staff" : "customer",
        },
        access,
        refresh
      );

      // 7️⃣ Redirect
      navigate("/menu");
    } catch (err) {
      console.error("Registration error:", err.response?.data || err);

      if (err.response && err.response.data) {
        const errors = err.response.data;
        if (errors.email) setError(`Email: ${errors.email[0]}`);
        else if (errors.password) setError(`Password: ${errors.password[0]}`);
        else setError("Registration failed. Try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-rose-400 shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-rose-600 mb-6">
          Register
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <Input
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
          <Input
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
          />

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-rose-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

