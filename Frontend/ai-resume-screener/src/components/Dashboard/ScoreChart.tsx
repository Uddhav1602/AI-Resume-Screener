import {
  RadialBarChart, RadialBar, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart,
  Radar, PolarGrid, PolarRadiusAxis,
  LineChart, Line, Legend
} from "recharts";

// ─── Circular Score Gauge ─────────────────────────────────────
export function ScoreGauge({ score }: { score: number }) {
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f97316" : "#ef4444";
  const label = score >= 70 ? "Strong Match" : score >= 40 ? "Moderate Match" : "Weak Match";
  const data = [{ value: score, fill: color }];

  return (
    <div className="flex flex-col items-center">
      <div style={{ width: 220, height: 220, position: "relative" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="70%"
            outerRadius="100%"
            data={data}
            startAngle={90}
            endAngle={90 - (360 * score) / 100}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "#1e2d3d" }} />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
          <div className="text-4xl font-black" style={{ color }}>{score}%</div>
          <div className="text-xs text-gray-500 mt-1">{label}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Keywords Bar Chart ───────────────────────────────────────
export function KeywordsBarChart({
  matched,
  missing
}: {
  matched: string[];
  missing: string[];
}) {
  const data = [
    {
      name: "Keywords",
      Matched: matched.length,
      Missing: missing.length,
    }
  ];

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a3a4e" />
        <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} />
        <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
        <Tooltip
          contentStyle={{ backgroundColor: "#131c27", border: "1px solid #2a3a4e", borderRadius: "8px", color: "#fff" }}
        />
        <Legend wrapperStyle={{ color: "#6b7280", fontSize: 12 }} />
        <Bar dataKey="Matched" fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Missing" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Skills Radar Chart ───────────────────────────────────────
export function SkillsRadar({ aiResponse }: { aiResponse: any }) {
  const allSections = ["Skills", "Experience", "Summary", "Education", "Projects"];
  const sectionScores: Record<string, number> = {};
  allSections.forEach(s => { sectionScores[s] = 80; });

  if (aiResponse.recommendations) {
    aiResponse.recommendations.forEach((rec: any) => {
      const section = rec.section || "General";
      const key = allSections.find(s =>
        section.toLowerCase().includes(s.toLowerCase())
      ) || "Skills";
      sectionScores[key] = Math.max(20, (sectionScores[key] || 80) - 25);
    });
  }

  const data = Object.entries(sectionScores).map(([section, score]) => ({
    section,
    score,
    fullMark: 100
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data}>
        <PolarGrid stroke="#2a3a4e" />
        <PolarAngleAxis dataKey="section" tick={{ fill: "#6b7280", fontSize: 11 }} />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          name="Resume"
          dataKey="score"
          stroke="#60a5fa"
          fill="#60a5fa"
          fillOpacity={0.2}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "#131c27", border: "1px solid #2a3a4e", borderRadius: "8px", color: "#fff" }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// ─── History Line Chart ───────────────────────────────────────
export function HistoryLineChart({ historyData }: { historyData: any[] }) {
  const data = historyData
    .slice()
    .reverse()
    .map((item, index) => ({
      name: `#${index + 1}`,
      score: item.match_score,
      file: item.filename
    }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a3a4e" />
        <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} />
        <YAxis domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 12 }} />
        <Tooltip
          contentStyle={{ backgroundColor: "#131c27", border: "1px solid #2a3a4e", borderRadius: "8px", color: "#fff" }}
          formatter={(value: any, _name: any, props: any) => [`${value}%`, props.payload.file]}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#60a5fa"
          strokeWidth={2}
          dot={{ fill: "#60a5fa", r: 4 }}
          activeDot={{ r: 6, fill: "#a78bfa" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}