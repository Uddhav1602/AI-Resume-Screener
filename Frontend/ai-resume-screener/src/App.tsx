import { ScoreGauge, KeywordsBarChart, SkillsRadar } from "./components/Dashboard/ScoreChart";
import { useState, useRef, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { resumeAPI, analysisAPI } from "./services/api";
import Header from "./components/Header/header";
import Footer from "./components/Footer/footer";
import Login from "./components/auth/login/login";
import Signup from "./components/auth/signup/signup";
import Profile from "./components/profile/profile";
import History from "./components/History/history";
import { RewriteSuggestions } from "./components/Dashboard/RewriteSuggestions";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen text-white" style={{backgroundColor: "#0d1117"}}>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function HomePage() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === "application/pdf") setFile(dropped);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "application/pdf") setFile(selected);
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleAnalyze = async () => {
    if (!file || !jobDescription.trim()) return;
    setAnalyzing(true);
    setAnalysis(null);
    setError("");
    try {
      // Step 1: Upload resume
      const uploadRes = await resumeAPI.upload(file);
      const resumeId = uploadRes.data.id;

      // Step 2: Analyze
      const analysisRes = await analysisAPI.analyze(resumeId, jobDescription);
      setAnalysis(analysisRes.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const canAnalyze = file && jobDescription.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-16" style={{ backgroundColor: "#0d1117" }}>

      {/* Hero */}
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-5xl font-extrabold text-white leading-tight mb-4">
          Screen Resumes with{" "}
          <span style={{ background: "linear-gradient(90deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Precision
          </span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Upload a resume and paste a job description — our AI will instantly analyze the fit and surface key insights.
        </p>
      </div>

      {/* Upload + JD Section */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Upload Resume */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md flex items-center justify-center text-blue-400 text-sm font-bold" style={{ backgroundColor: "#1e2d3d" }}>☁</div>
              <span className="text-white font-semibold text-base">Upload Resume</span>
            </div>
            <span className="text-gray-500 text-sm">PDF only</span>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onClick={handleUploadClick}
            className="flex flex-col items-center justify-center cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200"
            style={{ minHeight: "220px", backgroundColor: dragging ? "#1a2535" : "#131c27", borderColor: dragging ? "#60a5fa" : file ? "#22c55e50" : "#2a3a4e" }}
          >
            <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-2xl" style={{ backgroundColor: "#1e2d3d" }}>
              {file ? "✓" : "↑"}
            </div>
            {file ? (
              <>
                <p className="text-green-400 font-medium text-sm">{file.name}</p>
                <p className="text-gray-500 text-xs mt-1">{(file.size / 1024).toFixed(1)} KB · PDF</p>
                <button onClick={(e) => { e.stopPropagation(); setFile(null); setAnalysis(null); }} className="text-gray-500 hover:text-red-400 text-xs mt-3 transition-colors duration-150">
                  Remove file
                </button>
              </>
            ) : (
              <>
                <p className="text-white font-semibold text-sm mb-1">Drop your resume here</p>
                <p className="text-gray-500 text-xs mb-3">or click to browse files</p>
                <span className="text-xs text-gray-400 px-3 py-1 rounded-full" style={{ backgroundColor: "#1e2d3d" }}>.pdf files only</span>
              </>
            )}
          </div>
        </div>

        {/* Job Description */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md flex items-center justify-center text-purple-400 text-sm font-bold" style={{ backgroundColor: "#2a1e3d" }}>✎</div>
              <span className="text-white font-semibold text-base">Job Description</span>
            </div>
            <span className="text-gray-500 text-sm">{jobDescription.length} chars</span>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => { setJobDescription(e.target.value); setAnalysis(null); }}
            placeholder={"Paste the job description here...\n\ne.g. We are looking for a Senior React Developer..."}
            className="flex-1 rounded-xl p-4 text-gray-300 text-sm resize-none outline-none transition-all duration-150 placeholder-gray-600"
            style={{ backgroundColor: "#131c27", border: "1px solid #2a3a4e", minHeight: "220px" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#60a5fa")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#2a3a4e")}
          />
          <button onClick={() => { setJobDescription(""); setAnalysis(null); }} disabled={!jobDescription} className="w-full py-3 rounded-xl text-gray-400 font-medium text-sm flex items-center justify-center gap-2 transition-all duration-150 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed" style={{ backgroundColor: "#1b2b3a" }}>
            🗑 Clear Description
          </button>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="mt-8 flex flex-col items-center gap-2 w-full max-w-5xl">
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze || analyzing}
          className="px-12 py-4 rounded-2xl text-white font-semibold text-base flex items-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95"
          style={{ background: canAnalyze && !analyzing ? "linear-gradient(135deg, #2563eb, #7c3aed)" : "#1e2d3d", boxShadow: canAnalyze && !analyzing ? "0 0 24px rgba(96, 165, 250, 0.25)" : "none" }}
        >
          {analyzing ? "⏳ Analyzing Resume..." : "⌕ Analyze Resume"}
        </button>

        {error && (
          <div className="mt-2 px-4 py-3 rounded-xl text-red-400 text-sm" style={{ backgroundColor: "#2a1e1e", border: "1px solid #ef444430" }}>
            ⚠ {error}
          </div>
        )}
      </div>

      {/* ─── RESULTS SECTION ─────────────────────────────────── */}
      {analysis && (
        <div className="w-full max-w-5xl mt-12 flex flex-col gap-6">

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px" style={{ backgroundColor: "#2a3a4e" }} />
            <span className="text-gray-500 text-sm font-medium">Analysis Results</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "#2a3a4e" }} />
          </div>

          {/* ── Row 1: Score Gauge + Bar Chart + Radar ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Score Gauge */}
            <div className="rounded-2xl p-6 flex flex-col items-center" style={{ backgroundColor: "#131c27", border: "1px solid #2a3a4e" }}>
              <h3 className="text-white font-semibold text-sm mb-4 self-start">Match Score</h3>
              <ScoreGauge score={analysis.ai_response.match_score} />
            </div>

            {/* Keywords Bar Chart */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: "#131c27", border: "1px solid #2a3a4e" }}>
              <h3 className="text-white font-semibold text-sm mb-4">Keywords Overview</h3>
              <KeywordsBarChart
                matched={analysis.ai_response.matched_keywords}
                missing={analysis.ai_response.missing_keywords}
              />
            </div>

            {/* Radar Chart */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: "#131c27", border: "1px solid #2a3a4e" }}>
              <h3 className="text-white font-semibold text-sm mb-4">Resume Sections</h3>
              <SkillsRadar aiResponse={analysis.ai_response} />
            </div>
          </div>

          {/* ── Row 2: Summary ── */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: "#131c27", border: "1px solid #2a3a4e" }}>
            <h3 className="text-white font-semibold mb-3">📝 Overall Summary</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{analysis.ai_response.overall_summary}</p>
          </div>

          {/* ── Row 3: Keywords Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Matched Keywords */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: "#131c27", border: "1px solid #2a3a4e" }}>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="text-green-400">✓</span> Matched Keywords
                <span className="ml-auto text-xs text-gray-500">{analysis.ai_response.matched_keywords.length} found</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.ai_response.matched_keywords.map((kw: string, i: number) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-medium text-green-400"
                    style={{ backgroundColor: "#1e2d1e", border: "1px solid #22c55e30" }}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: "#131c27", border: "1px solid #2a3a4e" }}>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="text-red-400">✗</span> Missing Keywords
                <span className="ml-auto text-xs text-gray-500">{analysis.ai_response.missing_keywords.length} missing</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.ai_response.missing_keywords.map((kw: string, i: number) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-medium text-red-400"
                    style={{ backgroundColor: "#2a1e1e", border: "1px solid #ef444430" }}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Row 4: Recommendations ── */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: "#131c27", border: "1px solid #2a3a4e" }}>
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
              💡 Recommendations
              <span className="ml-auto text-xs text-gray-500">
                {analysis.ai_response.recommendations.length} suggestions
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.ai_response.recommendations.map((rec: any, i: number) => (
                <div key={i} className="rounded-xl p-4" style={{ backgroundColor: "#0d1117", border: "1px solid #2a3a4e" }}>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-blue-400"
                    style={{ backgroundColor: "#1e2d3d", border: "1px solid #60a5fa30" }}>
                    {rec.section}
                  </span>
                  <p className="text-red-400 text-sm mt-2">⚠ {rec.issue}</p>
                  <p className="text-green-400 text-sm mt-1">→ {rec.suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Rewrite Suggestions ── */}
          {analysis.ai_response.rewrite_suggestions &&
            analysis.ai_response.rewrite_suggestions.length > 0 && (
            <RewriteSuggestions
              suggestions={analysis.ai_response.rewrite_suggestions}
            />
          )}

          {/* ── New Analysis Button ── */}
          <button
            onClick={() => { setFile(null); setJobDescription(""); setAnalysis(null); }}
            className="w-full py-3 rounded-xl text-gray-400 font-medium text-sm transition-all duration-150 hover:text-white"
            style={{ backgroundColor: "#1b2b3a" }}
          >
            🔄 Start New Analysis
          </button>

        </div>
      )}
    </div>
  );
}

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex-1 flex items-center justify-center text-gray-500 text-lg font-medium" style={{ minHeight: "60vh" }}>
    {title} — coming soon
  </div>
);

function App() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0d1117" }}>
      <Header />
        <Routes>
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute>< History /></ProtectedRoute>} />
          <Route path="/admin" element={<PlaceholderPage title="Admin" />} />
          <Route path="/about" element={<PlaceholderPage title="About" />} />
          <Route path="/blog" element={<PlaceholderPage title="Blog" />} />
          <Route path="/careers" element={<PlaceholderPage title="Careers" />} />
          <Route path="/press" element={<PlaceholderPage title="Press" />} />
          <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" />} />
          <Route path="/terms" element={<PlaceholderPage title="Terms of Service" />} />
          <Route path="/cookies" element={<PlaceholderPage title="Cookie Policy" />} />
        </Routes>
      <Footer />
    </div>
  );
}

export default App;