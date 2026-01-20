"use client";

import { useState } from "react";

interface DemoScenario {
  id: string;
  title: string;
  description: string;
  upiId: string;
  icon: string;
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
  keyFindings: string[];
}

const scenarios: DemoScenario[] = [
  {
    id: "mule-cluster",
    title: "Mule Account Network",
    description: "6 coordinated accounts with synchronized fraud behavior",
    upiId: "mule1@quickpay",
    icon: "🕸️",
    riskLevel: "HIGH",
    keyFindings: [
      "Part of 6-account fraud cluster",
      "Community detection: 94% confidence",
      "Coordinated transaction patterns",
      "Low entropy synthetic identity"
    ]
  },
  {
    id: "ring-topology",
    title: "Circular Money Laundering",
    description: "5-node ring moving funds in a closed loop",
    upiId: "ring1@oksbi",
    icon: "🔄",
    riskLevel: "HIGH",
    keyFindings: [
      "Circular flow through 5 accounts",
      "Classic layering technique",
      "₹75,000 cycled funds",
      "Cycle detection algorithm match"
    ]
  },
  {
    id: "star-pattern",
    title: "Hub Distribution Attack",
    description: "Central hub dispersing to 8+ recipients",
    upiId: "hub001@quickpay",
    icon: "⭐",
    riskLevel: "HIGH",
    keyFindings: [
      "Star topology: 1 hub → 8 recipients",
      "Phishing proceeds distribution",
      "₹1.2L total disbursement",
      "High betweenness centrality"
    ]
  },
  {
    id: "velocity-anomaly",
    title: "Velocity Anomaly",
    description: "Abnormal transaction rate indicating bot activity",
    upiId: "mule3@quickpay",
    icon: "⚡",
    riskLevel: "HIGH",
    keyFindings: [
      "24 transactions in 1 hour",
      "20x normal velocity",
      "Bot-driven activity suspected",
      "Immediate rate limiting needed"
    ]
  },
  {
    id: "normal-user",
    title: "Legitimate User",
    description: "Normal transaction patterns for comparison",
    upiId: "user001@oksbi",
    icon: "✅",
    riskLevel: "LOW",
    keyFindings: [
      "Normal transaction velocity",
      "No suspicious patterns",
      "Low risk score: 12/100",
      "Standard monitoring sufficient"
    ]
  },
  {
    id: "medium-risk",
    title: "Elevated Risk Account",
    description: "Some flags but not confirmed fraud",
    upiId: "user010@quickpay",
    icon: "⚠️",
    riskLevel: "MEDIUM",
    keyFindings: [
      "Moderate risk indicators",
      "Enhanced monitoring recommended",
      "Transaction limit suggested",
      "Requires investigation"
    ]
  }
];

interface DemoScenariosProps {
  onSelectScenario: (upiId: string) => void;
}

export default function DemoScenarios({ onSelectScenario }: DemoScenariosProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelect = (scenario: DemoScenario) => {
    setSelectedId(scenario.id);
    onSelectScenario(scenario.upiId);
    setTimeout(() => setSelectedId(null), 2000); // Reset after 2 seconds
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-lg border border-purple-500/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-xl">🎬</span>
            </div>
            <div>
              <h3 className="font-bold text-white">Demo Scenarios</h3>
              <p className="text-xs text-gray-400">Click any scenario for instant analysis</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition"
          >
            {isExpanded ? "Show Less" : "Show All"}
          </button>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${!isExpanded && 'md:grid-cols-3'}`}>
        {(isExpanded ? scenarios : scenarios.slice(0, 3)).map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => handleSelect(scenario)}
            className={`text-left bg-gray-800 rounded-lg border p-4 transition-all hover:border-blue-500 hover:shadow-lg hover:scale-105 ${
              selectedId === scenario.id
                ? "border-green-500 ring-2 ring-green-500/20 bg-green-950/20"
                : scenario.riskLevel === "HIGH"
                ? "border-red-500/30"
                : scenario.riskLevel === "MEDIUM"
                ? "border-yellow-500/30"
                : "border-gray-700"
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{scenario.icon}</span>
                <div>
                  <h4 className="font-semibold text-white text-sm">{scenario.title}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{scenario.description}</p>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  scenario.riskLevel === "HIGH"
                    ? "bg-red-600 text-white"
                    : scenario.riskLevel === "MEDIUM"
                    ? "bg-yellow-600 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {scenario.riskLevel}
              </span>
            </div>

            {/* UPI ID */}
            <div className="bg-gray-900/50 rounded px-2 py-1 mb-3">
              <p className="text-xs text-gray-500">UPI ID</p>
              <p className="text-sm font-mono text-blue-400">{scenario.upiId}</p>
            </div>

            {/* Key Findings */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-400 mb-1">Key Findings:</p>
              {scenario.keyFindings.slice(0, isExpanded ? 4 : 2).map((finding, idx) => (
                <p key={idx} className="text-xs text-gray-500 flex items-start gap-1">
                  <span className={`${scenario.riskLevel === "HIGH" ? "text-red-400" : scenario.riskLevel === "MEDIUM" ? "text-yellow-400" : "text-green-400"}`}>•</span>
                  {finding}
                </p>
              ))}
            </div>

            {/* Selected Indicator */}
            {selectedId === scenario.id && (
              <div className="mt-3 flex items-center gap-2 text-green-400 text-xs font-semibold animate-fade-in">
                <span className="animate-pulse">✓</span>
                Loading scenario...
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-950/30 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-semibold text-blue-300 text-sm mb-1">Pro Tips for Judges</h4>
            <ul className="space-y-1 text-xs text-gray-400">
              <li>• Click any scenario above for instant analysis</li>
              <li>• Compare HIGH vs LOW risk to see detection differences</li>
              <li>• Check "Mule Cluster" to see network analysis in action</li>
              <li>• Try "Ring Topology" to view circular fraud detection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
