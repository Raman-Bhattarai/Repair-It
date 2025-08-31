import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Attach JWT access token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 Unauthorized globally and try refreshing access token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          const res = await axios.post("http://localhost:8000/api/token/refresh/", {
            refresh: refreshToken,
          });

            const { access } = res.data;
            localStorage.setItem("access_token", access);

            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return api(originalRequest);
        } catch (err) {
          // Refresh failed, force logout
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return Promise.reject(err);
        }
      } else {
        // No refresh token, force logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// Auth endpoints
export const loginUser = (data) => api.post("/login/", data);
export const registerUser = (data) => api.post("/register/", data);
export const logoutUser = () => {
  const refreshToken = localStorage.getItem("refresh_token");
  return api.post("/logout/", { refresh: refreshToken });
};
export const forgotPassword = (email) => api.post("/forgot-password/", { email });

// Get currently logged-in user
export const getUserProfile = () => api.get("/user/me/");

// Orders
export const placeOrder = (formData) =>
  api.post("/orders/", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const getOrders = () => api.get("/orders/");
export const updateOrder = (id, formData) =>
  api.put(`/orders/${id}/`, formData, { headers: { "Content-Type": "multipart/form-data" } });
export const cancelOrder = (orderId) => api.post(`/orders/${orderId}/cancel/`);

export default api;
