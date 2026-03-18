import { useState } from "react";

interface RewriteItem {
  section: string;
  original: string;
  rewritten: string;
  reason: string;
}

interface Props {
  suggestions: RewriteItem[];
}

export function RewriteSuggestions({ suggestions }: Props) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!suggestions || suggestions.length === 0) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="rounded-2xl p-6" style={{ backgroundColor: "#131c27", border: "1px solid #2a3a4e" }}>

      {/* Header */}
      <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
        ✍️ Resume Rewrite Suggestions
        <span className="ml-auto text-xs text-gray-500">{suggestions.length} sections</span>
      </h3>
      <p className="text-gray-500 text-xs mb-5">
        AI-powered rewrites tailored to match the job description. Click to copy!
      </p>

      {/* Section Tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {suggestions.map((item, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
            style={{
              backgroundColor: activeIndex === i ? "#1e2d3d" : "#0d1117",
              border: `1px solid ${activeIndex === i ? "#60a5fa" : "#2a3a4e"}`,
              color: activeIndex === i ? "#60a5fa" : "#6b7280"
            }}
          >
            {item.section}
          </button>
        ))}
      </div>

      {/* Active Suggestion */}
      {suggestions[activeIndex] && (
        <div className="flex flex-col gap-4">

          {/* Reason */}
          <div className="px-4 py-3 rounded-xl text-blue-400 text-sm"
            style={{ backgroundColor: "#1e2d3d", border: "1px solid #60a5fa20" }}>
            💡 {suggestions[activeIndex].reason}
          </div>

          {/* Before / After */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Original */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-red-400 text-xs font-semibold uppercase tracking-wider">
                  ✗ Original
                </span>
              </div>
              <div
                className="rounded-xl p-4 text-gray-400 text-sm leading-relaxed h-full"
                style={{ backgroundColor: "#1a1010", border: "1px solid #ef444430", minHeight: "120px" }}
              >
                {suggestions[activeIndex].original || "Section not found in resume"}
              </div>
            </div>

            {/* Rewritten */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-green-400 text-xs font-semibold uppercase tracking-wider">
                  ✓ Rewritten
                </span>
                <button
                  onClick={() => handleCopy(suggestions[activeIndex].rewritten, activeIndex)}
                  className="text-xs px-2 py-1 rounded-lg transition-all duration-150"
                  style={{
                    backgroundColor: copiedIndex === activeIndex ? "#1e2d1e" : "#1e2d3d",
                    color: copiedIndex === activeIndex ? "#22c55e" : "#60a5fa",
                    border: `1px solid ${copiedIndex === activeIndex ? "#22c55e30" : "#60a5fa30"}`
                  }}
                >
                  {copiedIndex === activeIndex ? "✓ Copied!" : "Copy"}
                </button>
              </div>
              <div
                className="rounded-xl p-4 text-gray-200 text-sm leading-relaxed h-full"
                style={{ backgroundColor: "#0d1a0d", border: "1px solid #22c55e30", minHeight: "120px" }}
              >
                {suggestions[activeIndex].rewritten}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="px-4 py-2 rounded-lg text-sm text-gray-400 transition-all hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#0d1117", border: "1px solid #2a3a4e" }}
            >
              ← Previous
            </button>
            <span className="text-gray-600 text-xs">
              {activeIndex + 1} of {suggestions.length}
            </span>
            <button
              onClick={() => setActiveIndex(Math.min(suggestions.length - 1, activeIndex + 1))}
              disabled={activeIndex === suggestions.length - 1}
              className="px-4 py-2 rounded-lg text-sm text-gray-400 transition-all hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#0d1117", border: "1px solid #2a3a4e" }}
            >
              Next →
            </button>
          </div>

        </div>
      )}
    </div>
  );
}