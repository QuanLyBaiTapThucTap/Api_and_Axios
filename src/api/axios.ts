import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("🚀 Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      token: token ? "Co token" : "Khong co token",
    });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status);

    return response;
  },

  (error) => {
    const status = error.response?.status;

    console.log("❌ API Error:", status);

    if (status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    if (status === 403) {
      alert("Ban khong co quyen thuc hien thao tac nay");
    }

    if (status === 404) {
      console.log("Khong tim thay tai nguyen");
    }

    if (status === 500) {
      alert("Server dang gap loi!");
    }

    return Promise.reject(error);
  },
);

export default api;
