import { useState, useRef, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/header";
import Footer from "./components/Footer/footer";
import Login from "./components/auth/login/login"
import Signup from "./components/auth/signup/signup";
import Profile from "./components/profile/profile";

function HomePage() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
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

  const handleAnalyze = () => {
    if (!file || !jobDescription.trim()) return;
    setAnalyzing(true);
    setAnalyzed(false);
    setTimeout(() => { setAnalyzing(false); setAnalyzed(true); }, 2200);
  };

  const canAnalyze = file && jobDescription.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16" style={{ backgroundColor: "#0d1117" }}>

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
                <button onClick={(e) => { e.stopPropagation(); setFile(null); setAnalyzed(false); }} className="text-gray-500 hover:text-red-400 text-xs mt-3 transition-colors duration-150">
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

          <button onClick={handleUploadClick} className="w-full py-3 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 transition-all duration-150 hover:opacity-90 active:scale-95" style={{ backgroundColor: "#1b2b3a" }}>
            ↑ {file ? "Replace Resume" : "Upload Resume"}
          </button>
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
            onChange={(e) => { setJobDescription(e.target.value); setAnalyzed(false); }}
            placeholder={"Paste the job description here...\n\ne.g. We are looking for a Senior React Developer with 5+ years of experience..."}
            className="flex-1 rounded-xl p-4 text-gray-300 text-sm resize-none outline-none transition-all duration-150 placeholder-gray-600"
            style={{ backgroundColor: "#131c27", border: "1px solid #2a3a4e", minHeight: "220px" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#60a5fa")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#2a3a4e")}
          />

          <button onClick={() => { setJobDescription(""); setAnalyzed(false); }} disabled={!jobDescription} className="w-full py-3 rounded-xl text-gray-400 font-medium text-sm flex items-center justify-center gap-2 transition-all duration-150 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed" style={{ backgroundColor: "#1b2b3a" }}>
            🗑 Clear Description
          </button>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze || analyzing}
          className="px-12 py-4 rounded-2xl text-white font-semibold text-base flex items-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95"
          style={{ background: canAnalyze && !analyzing ? "linear-gradient(135deg, #2563eb, #7c3aed)" : "#1e2d3d", boxShadow: canAnalyze && !analyzing ? "0 0 24px rgba(96, 165, 250, 0.25)" : "none" }}
        >
          {analyzing ? "⏳ Analyzing Resume..." : "⌕ Analyze Resume"}
        </button>
        {!canAnalyze && (
          <p className="text-gray-600 text-xs">
            {!file && !jobDescription ? "Upload a resume and add a job description to begin" : !file ? "Upload a PDF resume to continue" : "Add a job description to continue"}
          </p>
        )}
        {analyzed && <p className="text-green-400 text-sm font-medium mt-1">✓ Analysis complete! Results are ready.</p>}
      </div>
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
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<PlaceholderPage title="History" />} />
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