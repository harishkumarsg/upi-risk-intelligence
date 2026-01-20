"use client";

import { useEffect, useRef, useState } from "react";

interface HeatmapProps {
  data?: any;
}

export default function TransactionHeatmap({ data }: HeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredCell, setHoveredCell] = useState<{ hour: number; day: string; value: number } | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<"volume" | "velocity" | "risk">("volume");

  // Generate heatmap data: 24 hours x 7 days with transaction patterns
  const generateHeatmapData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const heatmapData: number[][] = [];

    for (let day = 0; day < 7; day++) {
      const dayData: number[] = [];
      for (let hour = 0; hour < 24; hour++) {
        // Simulate transaction patterns
        let value = Math.random() * 30; // Base random value

        // Normal business hours (9 AM - 6 PM) have higher volume
        if (hour >= 9 && hour <= 18) {
          value += Math.random() * 70;
        }

        // Late night suspicious activity (1 AM - 5 AM)
        if (hour >= 1 && hour <= 5) {
          value += Math.random() * 40; // Suspicious late-night spikes
        }

        // Weekend patterns differ
        if (day >= 5) {
          value *= 0.7; // Lower weekend activity
        }

        // Add some fraud spikes (red zones)
        if (
          (day === 2 && hour >= 2 && hour <= 4) || // Wed 2-4 AM: Mule activity
          (day === 4 && hour >= 22) || // Fri late night: Money laundering
          (day === 6 && hour >= 14 && hour <= 16) // Sun afternoon: Coordinated fraud
        ) {
          value = 90 + Math.random() * 10; // Critical fraud spike
        }

        dayData.push(Math.round(value));
      }
      heatmapData.push(dayData);
    }

    return heatmapData;
  };

  const [heatmapData] = useState(generateHeatmapData());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellWidth = 35;
    const cellHeight = 30;
    const marginLeft = 50;
    const marginTop = 40;

    canvas.width = cellWidth * 24 + marginLeft + 20;
    canvas.height = cellHeight * 7 + marginTop + 40;

    // Clear canvas
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw heatmap cells
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    heatmapData.forEach((dayData, dayIndex) => {
      dayData.forEach((value, hourIndex) => {
        const x = marginLeft + hourIndex * cellWidth;
        const y = marginTop + dayIndex * cellHeight;

        // Color based on value (0-100)
        let color: string;
        if (value >= 90) {
          color = "#dc2626"; // Critical red
        } else if (value >= 70) {
          color = "#ea580c"; // High orange
        } else if (value >= 50) {
          color = "#f59e0b"; // Medium yellow
        } else if (value >= 30) {
          color = "#10b981"; // Low green
        } else {
          color = "#1f2937"; // Minimal gray
        }

        ctx.fillStyle = color;
        ctx.fillRect(x, y, cellWidth - 2, cellHeight - 2);

        // Add value text for high values
        if (value >= 70) {
          ctx.fillStyle = "#ffffff";
          ctx.font = "10px monospace";
          ctx.textAlign = "center";
          ctx.fillText(value.toString(), x + cellWidth / 2, y + cellHeight / 2 + 3);
        }
      });
    });

    // Draw day labels
    ctx.fillStyle = "#9ca3af";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "right";
    days.forEach((day, index) => {
      ctx.fillText(day, marginLeft - 10, marginTop + index * cellHeight + cellHeight / 2 + 4);
    });

    // Draw hour labels
    ctx.textAlign = "center";
    for (let hour = 0; hour < 24; hour++) {
      if (hour % 3 === 0) {
        // Show every 3 hours
        ctx.fillText(
          `${hour}:00`,
          marginLeft + hour * cellWidth + cellWidth / 2,
          marginTop - 10
        );
      }
    }

    // Draw legend
    const legendX = marginLeft;
    const legendY = canvas.height - 30;
    const legendWidth = 200;
    const legendHeight = 15;

    const gradient = ctx.createLinearGradient(legendX, legendY, legendX + legendWidth, legendY);
    gradient.addColorStop(0, "#1f2937");
    gradient.addColorStop(0.3, "#10b981");
    gradient.addColorStop(0.5, "#f59e0b");
    gradient.addColorStop(0.7, "#ea580c");
    gradient.addColorStop(1, "#dc2626");

    ctx.fillStyle = gradient;
    ctx.fillRect(legendX, legendY, legendWidth, legendHeight);

    ctx.fillStyle = "#9ca3af";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Low", legendX, legendY + legendHeight + 12);
    ctx.textAlign = "right";
    ctx.fillText("Critical", legendX + legendWidth, legendY + legendHeight + 12);
  }, [heatmapData, selectedMetric]);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            🔥 3D Transaction Heatmap
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Behavioral fingerprint analysis: 24x7 transaction patterns
          </p>
        </div>

        {/* Metric Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedMetric("volume")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              selectedMetric === "volume"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Volume
          </button>
          <button
            onClick={() => setSelectedMetric("velocity")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              selectedMetric === "velocity"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Velocity
          </button>
          <button
            onClick={() => setSelectedMetric("risk")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              selectedMetric === "risk"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Risk Score
          </button>
        </div>
      </div>

      {/* Canvas Heatmap */}
      <div className="overflow-x-auto">
        <canvas
          ref={canvasRef}
          className="mx-auto"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>

      {/* Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Anomaly Detection */}
        <div className="bg-red-950/30 border border-red-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🚨</span>
            <h4 className="text-sm font-semibold text-red-400">Critical Anomalies</h4>
          </div>
          <ul className="space-y-1 text-xs text-gray-300">
            <li>• Wed 2-4 AM: Mule cluster activity</li>
            <li>• Fri 22:00+: Ring topology detected</li>
            <li>• Sun 14-16: Coordinated fraud spike</li>
          </ul>
        </div>

        {/* Behavioral Patterns */}
        <div className="bg-blue-950/30 border border-blue-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🧬</span>
            <h4 className="text-sm font-semibold text-blue-400">Behavioral Fingerprint</h4>
          </div>
          <ul className="space-y-1 text-xs text-gray-300">
            <li>• Peak hours: 9 AM - 6 PM (normal)</li>
            <li>• Late-night spikes: Suspicious</li>
            <li>• Weekend drop: Expected pattern</li>
          </ul>
        </div>

        {/* Mule Detection */}
        <div className="bg-orange-950/30 border border-orange-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🎯</span>
            <h4 className="text-sm font-semibold text-orange-400">Mule Detection</h4>
          </div>
          <ul className="space-y-1 text-xs text-gray-300">
            <li>• Velocity clustering algorithm</li>
            <li>• Time-based pattern matching</li>
            <li>• Cross-account correlation</li>
          </ul>
        </div>
      </div>

      {/* How Mule Detection Works */}
      <div className="mt-4 bg-gray-900/50 border border-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <span>🔬</span> How We Detect Mules
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-300">
          <div>
            <p className="font-medium text-blue-400 mb-1">1. Community Detection Algorithm</p>
            <p>Identifies clusters of 5+ accounts with coordinated transaction patterns. Uses graph modularity to find tightly connected groups.</p>
          </div>
          <div>
            <p className="font-medium text-blue-400 mb-1">2. Velocity Fingerprinting</p>
            <p>Tracks transactions per hour. Mules show synchronized bursts (10+ tx/hr) across multiple accounts simultaneously.</p>
          </div>
          <div>
            <p className="font-medium text-blue-400 mb-1">3. Temporal Pattern Analysis</p>
            <p>Heatmap reveals suspicious timing: late-night (1-5 AM) and coordinated weekend spikes indicate mule networks.</p>
          </div>
          <div>
            <p className="font-medium text-blue-400 mb-1">4. Volume Correlation</p>
            <p>Total cluster volume exceeding ₹1L triggers high severity. Combined with velocity = CRITICAL mule cluster alert.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
