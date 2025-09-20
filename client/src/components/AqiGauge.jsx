import React from "react";

export default function AqiGauge({ aqi }) {
  // AQI ranges from 0–500
  const radius = 90; // bigger radius
  const strokeWidth = 18; // thicker ring
  const circumference = 2 * Math.PI * radius;
  const normalized = Math.min(aqi, 500);
  const offset = circumference - (normalized / 500) * circumference;

  // pick color by AQI category
  function colorByAQI(val) {
    if (val <= 50) return "#22c55e";   // green
    if (val <= 100) return "#eab308";  // yellow
    if (val <= 150) return "#f97316";  // orange
    if (val <= 200) return "#ef4444";  // red
    if (val <= 300) return "#8b5cf6";  // purple
    return "#6b7280";                  // gray fallback
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <svg
        className="w-56 h-56 -rotate-90 drop-shadow-lg"
        viewBox="0 0 220 220"
      >
        {/* Background ring */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="transparent"
          stroke="#1e293b" // dark slate background
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="transparent"
          stroke={colorByAQI(aqi)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
        {/* Marker dot at the end of arc */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="transparent"
          stroke="white"
          strokeWidth="4"
          strokeDasharray="1 565" // just one dot
          strokeDashoffset={offset}
          pathLength="565"
        />
      </svg>
      <div className="mt-4 text-center">
        <div className="text-5xl font-extrabold tracking-wide text-slate-100">
          {aqi}
        </div>
        <div className="text-slate-400 text-lg font-medium">Air Quality Index</div>
      </div>
    </div>
  );
}
