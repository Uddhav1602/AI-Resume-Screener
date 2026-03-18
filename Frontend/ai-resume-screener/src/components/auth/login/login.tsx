import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#0d1117" }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-blue-500/40">
              AI
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Resume<span className="text-blue-400">Screener</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm">Sign in to your account to continue</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ backgroundColor: "#131c27", border: "1px solid #2a3a4e" }}>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-red-400 text-sm" style={{ backgroundColor: "#2a1e1e", border: "1px solid #ef444430" }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl text-gray-200 text-sm outline-none placeholder-gray-600 transition-all duration-150"
                style={{ backgroundColor: "#0d1117", border: "1px solid #2a3a4e" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#60a5fa")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#2a3a4e")}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-gray-400 text-sm font-medium">Password</label>
                <a href="#" className="text-blue-400 text-xs hover:text-blue-300 transition-colors">Forgot password?</a>
              </div>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl text-gray-200 text-sm outline-none placeholder-gray-600 transition-all duration-150"
                style={{ backgroundColor: "#0d1117", border: "1px solid #2a3a4e" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#60a5fa")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#2a3a4e")}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", boxShadow: "0 0 20px rgba(96,165,250,0.2)" }}
            >
              {loading ? "⏳ Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;