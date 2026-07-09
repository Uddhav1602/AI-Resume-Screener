import { useState } from "react";

interface RewriteItem {
  section: string;
  project_name?: string;
  original: string;
  rewritten: string;
  reason: string;
}

interface Props {
  suggestions: RewriteItem[];
}

const ALLOWED_SECTIONS = ["summary", "experience", "projects"];

export function RewriteSuggestions({ suggestions }: Props) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const filtered = suggestions.filter(s =>
    ALLOWED_SECTIONS.includes(s.section.toLowerCase())
  );

  if (!filtered || filtered.length === 0) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getTabLabel = (item: RewriteItem) => {
    if (item.section.toLowerCase() === "projects" && item.project_name) {
      return item.project_name;
    }
    return item.section;
  };

  const getSectionIcon = (section: string) => {
    const s = section.toLowerCase();
    if (s.includes("summary")) return "👤";
    if (s.includes("experience")) return "💼";
    if (s.includes("project")) return "🚀";
    return "✍️";
  };

  // Format text with bullet points nicely
  const formatText = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n').filter(line => line.trim());
    return (
      <div className="flex flex-col gap-1.5">
        {lines.map((line, i) => {
          const isBullet = line.trim().startsWith('•') ||
                          line.trim().startsWith('-') ||
                          line.trim().startsWith('*');
          return (
            <div key={i} className={`flex gap-2 ${isBullet ? 'items-start' : ''}`}>
              {isBullet && (
                <span className="text-gray-500 mt-0.5 shrink-0">•</span>
              )}
              <span className={isBullet ? 'text-sm leading-relaxed' : 'text-sm font-medium leading-relaxed'}>
                {line.replace(/^[•\-\*]\s*/, '')}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="rounded-2xl p-6" style={{ backgroundColor: "#131c27", border: "1px solid #2a3a4e" }}>

      {/* Header */}
      <div className="mb-5">
        <h3 className="text-white font-semibold flex items-center gap-2 mb-1">
          ✍️ Smart Resume Rewrites
          <span className="ml-auto text-xs text-gray-500">{filtered.length} sections</span>
        </h3>
        <p className="text-gray-500 text-xs">
          Your existing projects and experience reframed to match this specific job role.
          Every bullet point rewritten — copy and paste directly!
        </p>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {filtered.map((item, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5"
            style={{
              backgroundColor: activeIndex === i ? "#1e2d3d" : "#0d1117",
              border: `1px solid ${activeIndex === i ? "#60a5fa" : "#2a3a4e"}`,
              color: activeIndex === i ? "#60a5fa" : "#6b7280"
            }}
          >
            {getSectionIcon(item.section)} {getTabLabel(item)}
          </button>
        ))}
      </div>

      {/* Active Suggestion */}
      {filtered[activeIndex] && (
        <div className="flex flex-col gap-4">

          {/* Reason banner */}
          <div className="px-4 py-3 rounded-xl flex items-start gap-2"
            style={{ backgroundColor: "#1a2535", border: "1px solid #60a5fa20" }}>
            <span className="text-blue-400 shrink-0 mt-0.5">💡</span>
            <p className="text-blue-300 text-sm">{filtered[activeIndex].reason}</p>
          </div>

          {/* Before / After */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Original */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 shrink-0"></span>
                <span className="text-red-400 text-xs font-semibold uppercase tracking-wider">
                  Current Version
                </span>
              </div>
              <div
                className="rounded-xl p-4 text-gray-400 overflow-y-auto"
                style={{
                  backgroundColor: "#1a1010",
                  border: "1px solid #ef444430",
                  minHeight: "200px",
                  maxHeight: "400px"
                }}
              >
                {filtered[activeIndex].original &&
                 filtered[activeIndex].original !== "Not found"
                  ? formatText(filtered[activeIndex].original)
                  : <span className="text-gray-600 italic text-sm">
                      This section was not found in your resume.
                    </span>
                }
              </div>
            </div>

            {/* Rewritten */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 shrink-0"></span>
                  <span className="text-green-400 text-xs font-semibold uppercase tracking-wider">
                    Reframed for This Role
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(filtered[activeIndex].rewritten, activeIndex)}
                  className="text-xs px-3 py-1 rounded-lg transition-all duration-150 flex items-center gap-1"
                  style={{
                    backgroundColor: copiedIndex === activeIndex ? "#1e2d1e" : "#1e2d3d",
                    color: copiedIndex === activeIndex ? "#22c55e" : "#60a5fa",
                    border: `1px solid ${copiedIndex === activeIndex ? "#22c55e40" : "#60a5fa30"}`
                  }}
                >
                  {copiedIndex === activeIndex ? "✓ Copied!" : "📋 Copy"}
                </button>
              </div>
              <div
                className="rounded-xl p-4 text-gray-200 overflow-y-auto"
                style={{
                  backgroundColor: "#0d1a0d",
                  border: "1px solid #22c55e30",
                  minHeight: "200px",
                  maxHeight: "400px"
                }}
              >
                {formatText(filtered[activeIndex].rewritten)}
              </div>
            </div>
          </div>

          {/* Pro tip */}
          <div className="rounded-xl px-4 py-3 flex items-start gap-3"
            style={{ backgroundColor: "#0d1117", border: "1px solid #2a3a4e" }}>
            <span className="text-yellow-400 text-sm shrink-0">⚡</span>
            <p className="text-gray-400 text-xs leading-relaxed">
              <span className="text-white font-medium">Pro tip: </span>
              These bullet points are rewritten to emphasize the skills and
              experience most relevant to this job role. The core facts remain
              the same — only the focus and framing changes.
            </p>
          </div>

          {/* Navigation */}
          {filtered.length > 1 && (
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
                className="px-4 py-2 rounded-lg text-sm text-gray-400 transition-all hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#0d1117", border: "1px solid #2a3a4e" }}
              >
                ← Previous
              </button>
              <span className="text-gray-600 text-xs">
                {activeIndex + 1} of {filtered.length}
              </span>
              <button
                onClick={() => setActiveIndex(Math.min(filtered.length - 1, activeIndex + 1))}
                disabled={activeIndex === filtered.length - 1}
                className="px-4 py-2 rounded-lg text-sm text-gray-400 transition-all hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#0d1117", border: "1px solid #2a3a4e" }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
// ```

// ---

// ## 💡 What Changes Now
// ```
// Before:
// ────────
// Projects tab → vague suggestion about adding keywords

// After:
// ────────
// Entrify tab → shows ALL original bullets vs ALL rewritten bullets
//               tailored for the specific job role

// Example for Frontend role:

// Original bullet:
// "Integrated MongoDB with Mongoose for structured 
//  user data storage and schema modeling"

// Rewritten bullet:
// "Implemented efficient frontend data fetching patterns
//  with optimistic UI updates and local state caching
//  for seamless user experience"

// Same project → completely reframed! ✅