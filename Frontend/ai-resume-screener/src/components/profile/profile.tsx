import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Mock logged-in user — replace with real auth context/state
const mockUser = {
  username: "john_doe",
  email: "john.doe@example.com",
  role: "admin", // "admin" or "user"
  joinedDate: "January 2024",
  resumesScreened: 142,
  lastActive: "Today",
};

function Profile() {
  const navigate = useNavigate();
  const [user] = useState(mockUser);

  const isAdmin = user.role === "admin";

  const handleLogout = () => {
    // Clear auth state here
    navigate("/login");
  };

  return (
    <div className="min-h-screen px-6 py-16 flex flex-col items-center" style={{ backgroundColor: "#0d1117" }}>
      <div className="w-full max-w-2xl">

        {/* Page title */}
        <h1 className="text-2xl font-bold text-white mb-8">My Profile</h1>

        {/* Profile card */}
        <div className="rounded-2xl p-8 mb-6" style={{ backgroundColor: "#131c27", border: "1px solid #2a3a4e" }}>

          {/* Avatar + name row */}
          <div className="flex items-start gap-6 mb-8">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", boxShadow: "0 0 24px rgba(96,165,250,0.25)" }}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>

            {/* Name + role badge */}
            <div className="flex flex-col gap-2 pt-1">
              <h2 className="text-white text-xl font-bold leading-none">{user.username}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>

              {/* Role badge below username */}
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5"
                  style={{
                    backgroundColor: isAdmin ? "#1e2d1e" : "#1e2a3d",
                    border: `1px solid ${isAdmin ? "#22c55e40" : "#60a5fa40"}`,
                    color: isAdmin ? "#22c55e" : "#60a5fa",
                  }}
                >
                  <span style={{ fontSize: "10px" }}>{isAdmin ? "⬡" : "◉"}</span>
                  {isAdmin ? "Admin" : "User"}
                </span>
                {isAdmin && (
                  <span className="text-gray-600 text-xs">· Full access</span>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mb-6" style={{ borderTop: "1px solid #2a3a4e" }} />

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard label="Member Since" value={user.joinedDate} icon="📅" />
            <InfoCard label="Last Active" value={user.lastActive} icon="🕐" />
            <InfoCard label="Resumes Screened" value={String(user.resumesScreened)} icon="📄" />
            <InfoCard label="Account Type" value={isAdmin ? "Administrator" : "Standard User"} icon={isAdmin ? "🔑" : "👤"} />
          </div>
        </div>

        {/* Account actions */}
        <div className="rounded-2xl p-6 mb-4" style={{ backgroundColor: "#131c27", border: "1px solid #2a3a4e" }}>
          <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest" style={{ color: "#6b7280" }}>Account Actions</h3>
          <div className="flex flex-col gap-3">
            <button
              className="w-full py-3 px-4 rounded-xl text-left text-sm font-medium text-gray-300 flex items-center gap-3 transition-all duration-150 hover:text-white"
              style={{ backgroundColor: "#1b2b3a" }}
            >
              ✎ &nbsp;Edit Profile
            </button>
            <button
              className="w-full py-3 px-4 rounded-xl text-left text-sm font-medium text-gray-300 flex items-center gap-3 transition-all duration-150 hover:text-white"
              style={{ backgroundColor: "#1b2b3a" }}
            >
              🔒 &nbsp;Change Password
            </button>
            {isAdmin && (
              <button
                onClick={() => navigate("/admin")}
                className="w-full py-3 px-4 rounded-xl text-left text-sm font-medium flex items-center gap-3 transition-all duration-150 hover:brightness-110"
                style={{ backgroundColor: "#1e2d1e", color: "#22c55e", border: "1px solid #22c55e30" }}
              >
                ⬡ &nbsp;Go to Admin Panel
              </button>
            )}
            <button
              onClick={handleLogout}
              className="w-full py-3 px-4 rounded-xl text-left text-sm font-medium flex items-center gap-3 transition-all duration-150 hover:brightness-110"
              style={{ backgroundColor: "#2a1e1e", color: "#f87171", border: "1px solid #ef444430" }}
            >
              ⇥ &nbsp;Logout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function InfoCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ backgroundColor: "#0d1117", border: "1px solid #2a3a4e" }}>
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-gray-600 text-xs mb-0.5">{label}</p>
        <p className="text-gray-200 text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export default Profile;