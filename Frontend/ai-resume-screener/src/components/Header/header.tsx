import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "History", path: "/history" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-8 h-16 bg-slate-900 border-b border-white/10 shadow-lg shadow-black/30">

      <button onClick={() => navigate("/")} className="flex items-center gap-3 group shrink-0 bg-transparent border-none cursor-pointer">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-blue-500/40 group-hover:shadow-blue-500/60 transition-shadow duration-300">
          AI
        </div>
        <span className="text-white font-bold text-base tracking-tight leading-none">
          Resume<span className="text-blue-400">Screener</span>
        </span>
      </button>

      <nav className="flex items-center gap-1 ml-auto">
        {isAuthenticated ? (
          <>
            {navItems.map(({ label, path }) => (
              <NavLink
                key={label}
                to={path}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-white bg-blue-500/15"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="w-px h-6 bg-white/10 mx-3" />
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-400 bg-red-400/10 border border-red-400/20 hover:bg-red-400/20 transition-all duration-200"
            >
              ⇥ Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-200"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200"
              style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
            >
              Get Started
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;