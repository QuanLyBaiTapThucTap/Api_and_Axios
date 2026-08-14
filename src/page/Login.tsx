import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await authService.login({
        username,
        password,
      });
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("user", JSON.stringify(result.data.user));
      navigate("/products");
    } catch (error: any) {
      setError(error.response?.data?.message || "Dang nhap that bai");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-3xl font-bold"> Product Management</h1>
        <p className="mb-6 text-slate-500"> Đăng nhập hệ thống</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border p-3  outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-2 block font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="w-full rounded-lg border p-3 ouline-none focus:ring focus:ring-blue-500"
            />
          </div>
          {error && (
            <div className="rouned-lg bg-red-50 p-3 text-red-600">{error}</div>
          )}
          <button
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Dang dang nhap" : "Dang nhap"}
          </button>
        </form>
        <div className="mt-5 rounded-lg bg-slate-50 p-3 text-sm">
          <p>Demo account:</p>
          <p>Username: admin</p>
          <p>Password: 123456</p>
        </div>
      </div>
    </div>
  );
}
