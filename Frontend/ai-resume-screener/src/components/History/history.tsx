import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { historyAPI } from "../../services/api";
import { HistoryLineChart } from "../Dashboard/ScoreChart";
import { RewriteSuggestions } from "../Dashboard/RewriteSuggestions";

interface HistoryItem {
  id: number;
  resume_id: number;
  filename: string;
  match_score: number;
  created_at: string;
}

interface AnalysisDetail {
  id: number;
  filename: string;
  job_description: string;
  match_score: number;
  ai_response: {
    match_score: number;
    matched_keywords: string[];
    missing_keywords: string[];
    recommendations: { section: string; issue: string; suggestion: string }[];
    overall_summary: string;
  };
  created_at: string;
}

function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selected, setSelected] = useState<AnalysisDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await historyAPI.getAll();
      setHistory(response.data);
    } catch {
      setError("Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id: number) => {
    setDetailLoading(true);
    try {
      const response = await historyAPI.getOne(id);
      setSelected(response.data);
    } catch {
      setError("Failed to load analysis details.");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await historyAPI.delete(id);
      setHistory(history.filter(h => h.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch {
      setError("Failed to delete analysis.");
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const getScoreColor = (score: number) =>
    score >= 70 ? "#22c55e" : score >= 40 ? "#f97316" : "#ef4444";

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0d1117" }}>
      <div className="text-blue-400 text-lg">⏳ Loading history...</div>
    </div>
  );

  return (
    <div className="min-h-screen px-6 py-16" style={{ backgroundColor: "#0d1117" }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Analysis History</h1>
            <p className="text-gray-500 text-sm mt-1">{history.length} analyses total</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
          >
            + New Analysis
          </button>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl text-red-400 text-sm" style={{ backgroundColor: "#2a1e1e", border: "1px solid #ef444430" }}>
            ⚠ {error}
          </div>
        )}

        {/* Score Trend Chart */}
        {history.length > 1 && (
        <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: "#131c27", border: "1px solid #2a3a4e" }}>
            <h3 className="text-white font-semibold text-sm mb-4">📈 Score Trend</h3>
            <HistoryLineChart historyData={history} />
        </div>
        )}

        {history.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 rounded-2xl" style={{ backgroundColor: "#131c27", border: "1px solid #2a3a4e" }}>
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-white font-semibold text-lg mb-2">No analyses yet</h3>
            <p className="text-gray-500 text-sm mb-6">Upload a resume and analyze it against a job description to get started</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-xl text-white text-sm font-medium"
              style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
            >
              Start Analyzing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* History List */}
            <div className="flex flex-col gap-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleView(item.id)}
                  className="rounded-xl p-4 cursor-pointer transition-all duration-150 hover:brightness-110"
                  style={{
                    backgroundColor: selected?.id === item.id ? "#1e2d3d" : "#131c27",
                    border: `1px solid ${selected?.id === item.id ? "#60a5fa50" : "#2a3a4e"}`
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">📄 {item.filename}</p>
                      <p className="text-gray-500 text-xs mt-1">{formatDate(item.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-bold" style={{ color: getScoreColor(item.match_score) }}>
                        {item.match_score}%
                      </span>
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="text-gray-600 hover:text-red-400 text-xs transition-colors p-1"
                      >
                        🗑
                      </button>
                    </div>
                  </div>

                  {/* Mini score bar */}
                  <div className="mt-3 w-full rounded-full h-1.5" style={{ backgroundColor: "#0d1117" }}>
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${item.match_score}%`,
                        backgroundColor: getScoreColor(item.match_score)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Detail Panel */}
            <div className="rounded-2xl p-6 h-fit sticky top-24" style={{ backgroundColor: "#131c27", border: "1px solid #2a3a4e" }}>
              {detailLoading ? (
                <div className="flex items-center justify-center py-12 text-blue-400">⏳ Loading...</div>
              ) : selected ? (
                <div className="flex flex-col gap-5">

                  {/* Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-bold text-base">📄 {selected.filename}</h3>
                      <span className="text-2xl font-black" style={{ color: getScoreColor(selected.match_score) }}>
                        {selected.match_score}%
                      </span>
                    </div>
                    <div className="w-full rounded-full h-2" style={{ backgroundColor: "#0d1117" }}>
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${selected.match_score}%`, backgroundColor: getScoreColor(selected.match_score) }}
                      />
                    </div>
                    <p className="text-gray-400 text-xs mt-3">{selected.ai_response.overall_summary}</p>
                  </div>

                  <div style={{ borderTop: "1px solid #2a3a4e" }} />

                  {/* Matched */}
                  <div>
                    <p className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-2">
                      ✓ Matched ({selected.ai_response.matched_keywords.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.ai_response.matched_keywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full text-xs text-green-400" style={{ backgroundColor: "#1e2d1e", border: "1px solid #22c55e30" }}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing */}
                  <div>
                    <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">
                      ✗ Missing ({selected.ai_response.missing_keywords.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.ai_response.missing_keywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full text-xs text-red-400" style={{ backgroundColor: "#2a1e1e", border: "1px solid #ef444430" }}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid #2a3a4e" }} />

                  {/* Recommendations */}
                  <div>
                    <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
                      💡 Recommendations
                    </p>
                    <div className="flex flex-col gap-3">
                      {selected.ai_response.recommendations.map((rec, i) => (
                        <div key={i} className="rounded-lg p-3" style={{ backgroundColor: "#0d1117", border: "1px solid #2a3a4e" }}>
                          <span className="text-xs font-semibold text-blue-400">{rec.section}</span>
                          <p className="text-red-400 text-xs mt-1">⚠ {rec.issue}</p>
                          <p className="text-green-400 text-xs mt-1">→ {rec.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rewrite Suggestions */}
                  {selected.ai_response.rewrite_suggestions &&
                    selected.ai_response.rewrite_suggestions.length > 0 && (
                    <RewriteSuggestions
                      suggestions={selected.ai_response.rewrite_suggestions}
                    />
                  )}

                  {/* Date */}
                  <p className="text-gray-600 text-xs text-right">{formatDate(selected.created_at)}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-4xl mb-3">👈</div>
                  <p className="text-gray-500 text-sm">Click any analysis to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;