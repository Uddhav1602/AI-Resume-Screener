import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { profileAPI } from "../../services/api";

interface ProfileStats {
  total_analyses: number;
  best_match_score: number;
  average_match_score: number;
}

interface ProfileData {
  id: number;
  name: string;
  email: string;
  created_at: string;
  stats: ProfileStats;
}

function Profile() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileAPI.getProfile();
        setProfile(response.data);
      } catch (err: any) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0d1117" }}>
      <div className="text-blue-400 text-lg">⏳ Loading profile...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0d1117" }}>
      <div className="text-red-400 text-lg">⚠ {error}</div>
    </div>
  );

  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "N/A";

  return (
    <div className="min-h-screen px-6 py-16 flex flex-col items-center" style={{ backgroundColor: "#0d1117" }}>
      <div className="w-full max-w-2xl">

        <h1 className="text-2xl font-bold text-white mb-8">My Profile</h1>

        {/* Profile card */}
        <div className="rounded-2xl p-8 mb-6" style={{ backgroundColor: "#131c27", border: "1px solid #2a3a4e" }}>

          {/* Avatar + name row */}
          <div className="flex items-start gap-6 mb-8">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", boxShadow: "0 0 24px rgba(96,165,250,0.25)" }}
            >
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <h2 className="text-white text-xl font-bold">{profile?.name}</h2>
              <p className="text-gray-500 text-sm">{profile?.email}</p>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full w-fit"
                style={{ backgroundColor: "#1e2a3d", border: "1px solid #60a5fa40", color: "#60a5fa" }}>
                ◉ User
              </span>
            </div>
          </div>

          <div className="mb-6" style={{ borderTop: "1px solid #2a3a4e" }} />

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard label="Member Since" value={joinedDate} icon="📅" />
            <InfoCard label="Total Analyses" value={String(profile?.stats.total_analyses ?? 0)} icon="📄" />
            <InfoCard label="Best Match Score" value={`${profile?.stats.best_match_score ?? 0}%`} icon="🏆" />
            <InfoCard label="Average Score" value={`${profile?.stats.average_match_score ?? 0}%`} icon="📊" />
          </div>
        </div>

        {/* Account actions */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: "#131c27", border: "1px solid #2a3a4e" }}>
          <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#6b7280" }}>Account Actions</h3>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/history")}
              className="w-full py-3 px-4 rounded-xl text-left text-sm font-medium text-gray-300 flex items-center gap-3 transition-all duration-150 hover:text-white"
              style={{ backgroundColor: "#1b2b3a" }}
            >
              📋 &nbsp;View History
            </button>
            <button
              onClick={logout}
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