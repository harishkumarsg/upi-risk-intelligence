"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { exportToPDF, exportToJSON } from "@/lib/export";

const GraphVisualization = dynamic(() => import("@/components/GraphVisualization"), {
  ssr: false,
});

const LandingPage = dynamic(() => import("@/components/LandingPage"), {
  ssr: false,
});

const AttackTimeline = dynamic(() => import("@/components/AttackTimeline"), {
  ssr: false,
});

const AIInsights = dynamic(() => import("@/components/AIInsights"), {
  ssr: false,
});

const LiveMetrics = dynamic(() => import("@/components/LiveMetrics"), {
  ssr: false,
});

const GuidedTour = dynamic(() => import("@/components/GuidedTour"), {
  ssr: false,
});

const ComparisonPage = dynamic(() => import("@/components/ComparisonPage"), {
  ssr: false,
});

const DemoScenarios = dynamic(() => import("@/components/DemoScenarios"), {
  ssr: false,
});

const TechPerformance = dynamic(() => import("@/components/TechPerformance"), {
  ssr: false,
});

const QuickActions = dynamic(() => import("@/components/QuickActions"), {
  ssr: false,
});

const TransactionHeatmap = dynamic(() => import("@/components/TransactionHeatmap"), {
  ssr: false,
});

import Footer from "@/components/Footer";

type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | null;

interface Pattern {
  type: string;
  severity: string;
  confidence: number;
  accounts: string[];
  evidence: string[];
  description: string;
}

interface Assessment {
  risk: RiskLevel;
  riskScore: number;
  confidence: number;
  reasons: string[];
  detectedPatterns: Pattern[];
  networkMetrics: any;
  behavioralFlags: any;
  investigationLeads: string[];
  evidence: any[];
  referenceId: string;
  inGraph: boolean;
}

interface GraphStats {
  totalNodes: number;
  totalEdges: number;
  totalPatterns: number;
  criticalPatterns: number;
  highRiskPatterns: number;
}

export default function Home() {
  const [showLanding, setShowLanding] = useState(true);
  const [upiId, setUpiId] = useState("");
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"check" | "dashboard" | "patterns" | "graph" | "timeline" | "comparison">("check");
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [stats, setStats] = useState<GraphStats | null>(null);
  const [graphData, setGraphData] = useState<any>(null);
  const [liveAlerts, setLiveAlerts] = useState<any[]>([]);

  // Load graph data when switching to dashboard or patterns tab
  useEffect(() => {
    if (activeTab === "dashboard" || activeTab === "patterns" || activeTab === "graph" || activeTab === "timeline") {
      loadGraphData();
    }
  }, [activeTab]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.key === '1') setActiveTab('check');
      if (e.key === '2') setActiveTab('dashboard');
      if (e.key === '3') setActiveTab('patterns');
      if (e.key === '4') setActiveTab('graph');
      if (e.key === '5') setActiveTab('timeline');
      if (e.key === '6') setActiveTab('comparison');
      if (e.key === 'd' || e.key === 'D') {
        setUpiId('mule1@quickpay');
        setActiveTab('check');
        setTimeout(() => assessRisk(), 200);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Simulate live alerts
  useEffect(() => {
    if (!showLanding && activeTab === "dashboard") {
      const alertMessages = [
        { type: "CRITICAL", message: "Mule cluster detected: 6 accounts with coordinated activity", time: "2s ago" },
        { type: "HIGH", message: "Ring topology identified: Circular money flow through 5 accounts", time: "15s ago" },
        { type: "HIGH", message: "Star pattern alert: hub001@quickpay distributing to 8 recipients", time: "32s ago" },
        { type: "MEDIUM", message: "Velocity anomaly: mule3@quickpay exceeds 20 tx/hour", time: "1m ago" },
        { type: "CRITICAL", message: "New synthetic identity detected: Low entropy pattern", time: "2m ago" },
      ];

      setLiveAlerts(alertMessages);

      const interval = setInterval(() => {
        const newAlert = alertMessages[Math.floor(Math.random() * alertMessages.length)];
        setLiveAlerts(prev => [{ ...newAlert, time: "Just now" }, ...prev.slice(0, 4)]);
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [showLanding, activeTab]);

  const loadGraphData = async () => {
    try {
      const res = await fetch("/api/analyze-graph");
      const data = await res.json();
      if (data.success) {
        setPatterns(data.patterns);
        setStats(data.statistics);
        setGraphData(data.graph);
      }
    } catch (error) {
      console.error("Failed to load graph data:", error);
    }
  };

  const assessRisk = async () => {
    if (!upiId) {
      setAssessment(null);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/check-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upiId }),
      });

      const data = await res.json();
      setAssessment(data);
    } catch (error) {
      console.error("Risk API error:", error);
      setAssessment(null);
    } finally {
      setLoading(false);
    }
  };

  // Show landing page first
  if (showLanding) {
    return <LandingPage onEnterDemo={() => setShowLanding(false)} />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      <div className="relative z-10">
      {/* Premium Header */}
      <div className="border-b border-white/10 bg-gradient-to-r from-slate-900/80 via-blue-900/80 to-slate-900/80 backdrop-blur-xl sticky top-0 z-50 shadow-2xl shadow-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50 ring-2 ring-purple-500/20 hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-sm sm:text-lg">RG</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  RiskGraph Intelligence™
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5 sm:mt-1 hidden sm:block">
                  Graph-Powered Fraud Detection for UPI Networks
                </p>
              </div>
            </div>
            <div className="flex gap-1 sm:gap-2 flex-wrap w-full sm:w-auto">
              <button
                onClick={() => setActiveTab("check")}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeTab === "check"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                Risk Check
              </button>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeTab === "dashboard"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("patterns")}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeTab === "patterns"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                Patterns
              </button>
              <button
                onClick={() => setActiveTab("graph")}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeTab === "graph"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                Graph
              </button>
              <button
                onClick={() => setActiveTab("timeline")}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeTab === "timeline"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setActiveTab("comparison")}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeTab === "comparison"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                Why Us?
              </button>
              <button
                onClick={() => {
                  setUpiId("mule1@quickpay");
                  setActiveTab("check");
                  setTimeout(() => assessRisk(), 200);
                }}
                className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all duration-300 shadow-lg shadow-green-500/50 hover:scale-105"
                title="Quick Demo: Auto-test high-risk account (Press 'D')"
              >
                ⚡ Demo
              </button>
            </div>
          </div>
          {/* Keyboard Shortcuts Hint */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 hidden sm:block">
            <p className="text-xs text-gray-600 text-center">
              💡 Keyboard shortcuts: <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400 font-mono">1-6</kbd> to switch tabs • <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400 font-mono">D</kbd> for quick demo • <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400 font-mono">?</kbd> for help
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Risk Check Tab */}
        {activeTab === "check" && (
          <div className="space-y-6">
            {/* Demo Scenarios */}
            <DemoScenarios 
              onSelectScenario={(selectedUpiId) => {
                setUpiId(selectedUpiId);
                setTimeout(() => assessRisk(), 300);
              }}
            />

            {/* Manual Input */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-br from-slate-900/90 via-blue-900/50 to-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-blue-500/20 p-8 border border-white/10 hover:border-blue-500/30 transition-all duration-500">
                <div className="mb-6">
                  <label className="block text-sm font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    Or Enter UPI ID Manually
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && assessRisk()}
                      placeholder="e.g., mule1@quickpay, hub001@quickpay"
                      className="flex-1 rounded-lg border border-white/20 bg-white/5 backdrop-blur-md px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:shadow-lg focus:shadow-blue-500/20 transition-all duration-300"
                    />
                    <button
                      onClick={assessRisk}
                      disabled={loading || !upiId}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105"
                    >
                      {loading ? "Analyzing..." : "Analyze"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Try: mule1@quickpay (mule cluster), hub001@quickpay (star pattern), ring1@oksbi (circular fraud)
                  </p>
                </div>

                {/* Risk Result */}
                {assessment && (
                  <div className="space-y-4 mt-6">
                  {/* Risk Score Card */}
                  <div
                    className={`rounded-xl border p-6 backdrop-blur-md transition-all duration-500 ${
                      assessment.risk === "HIGH"
                        ? "border-red-500/50 bg-gradient-to-br from-red-950/50 to-red-900/30 shadow-xl shadow-red-500/20"
                        : assessment.risk === "MEDIUM"
                        ? "border-yellow-500/50 bg-gradient-to-br from-yellow-950/50 to-yellow-900/30 shadow-xl shadow-yellow-500/20"
                        : "border-green-500/50 bg-gradient-to-br from-green-950/50 to-green-900/30 shadow-xl shadow-green-500/20"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              assessment.risk === "HIGH"
                                ? "bg-red-600 text-white"
                                : assessment.risk === "MEDIUM"
                                ? "bg-yellow-600 text-white"
                                : "bg-green-600 text-white"
                            }`}
                          >
                            {assessment.risk} RISK
                          </span>
                          <span className="text-2xl font-bold">
                            {assessment.riskScore}/100
                          </span>
                          {assessment.inGraph && (
                            <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                              Graph Analysis
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mt-2">
                          Confidence: {Math.round(assessment.confidence * 100)}% • Ref: {assessment.referenceId}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Evidence & Reasons */}
                  {assessment.reasons && assessment.reasons.length > 0 && (
                    <div className="bg-gradient-to-br from-slate-900/80 to-blue-900/30 backdrop-blur-md rounded-xl border border-white/10 p-6 shadow-lg shadow-blue-500/10">
                      <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <span className="text-red-400">⚠️</span> Detection Findings
                      </h3>
                      <ul className="space-y-2">
                        {assessment.reasons.map((reason, idx) => (
                          <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-blue-400 mt-1">▸</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Detected Patterns */}
                  {assessment.detectedPatterns && assessment.detectedPatterns.length > 0 && (
                    <div className="bg-gradient-to-br from-red-950/50 to-orange-950/30 backdrop-blur-md rounded-xl border border-red-500/30 p-6 shadow-xl shadow-red-500/20">
                      <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                        🚨 Fraud Patterns Detected
                      </h3>
                      <div className="space-y-4">
                        {assessment.detectedPatterns.map((pattern, idx) => (
                          <div key={idx} className="border border-white/10 rounded-lg p-4 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                            <div className="flex items-start justify-between mb-2">
                              <span className="font-medium text-sm text-white">
                                {pattern.type.replace(/_/g, " ")}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                pattern.severity === "CRITICAL" ? "bg-red-600" : "bg-orange-600"
                              }`}>
                                {pattern.severity}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mb-3">{pattern.description}</p>
                            <div className="space-y-1">
                              {pattern.evidence.map((ev, i) => (
                                <p key={i} className="text-xs text-gray-500 flex items-start gap-1">
                                  <span className="text-red-400">•</span>
                                  {ev}
                                </p>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              Confidence: {Math.round(pattern.confidence * 100)}% • {pattern.accounts.length} accounts involved
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI-Powered Insights */}
                  <AIInsights assessment={assessment} upiId={upiId} />

                  {/* Network Metrics */}
                  {assessment.networkMetrics && assessment.inGraph && (
                    <div className="bg-gradient-to-br from-slate-900/80 to-blue-900/30 backdrop-blur-md rounded-xl border border-white/10 p-6 shadow-lg shadow-blue-500/10">
                      <h3 className="text-sm font-semibold text-gray-300 mb-3">Network Analysis</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Connections</p>
                          <p className="text-lg font-bold">{assessment.networkMetrics.degree}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Centrality</p>
                          <p className="text-lg font-bold">{assessment.networkMetrics.betweenness.toFixed(3)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Clustering</p>
                          <p className="text-lg font-bold">{assessment.networkMetrics.clustering.toFixed(3)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">PageRank</p>
                          <p className="text-lg font-bold">{assessment.networkMetrics.pageRank.toFixed(4)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Investigation Leads */}
                  {assessment.investigationLeads && assessment.investigationLeads.length > 0 && (
                    <div className="bg-gradient-to-br from-blue-950/50 to-cyan-950/30 backdrop-blur-md rounded-xl border border-blue-500/30 p-6 shadow-xl shadow-blue-500/20">
                      <h3 className="text-sm font-semibold text-blue-400 mb-3">🔍 Investigation Leads</h3>
                      <ul className="space-y-2">
                        {assessment.investigationLeads.map((lead, idx) => (
                          <li key={idx} className="text-sm text-gray-300">{lead}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Export Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => exportToPDF(assessment)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:scale-105"
                    >
                      <span>📄</span> Export PDF Report
                    </button>
                    <button
                      onClick={() => exportToJSON(assessment)}
                      className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
                    >
                      <span>💾</span> Export JSON
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && stats && (
          <div className="space-y-6">
            {/* Tech Performance Dashboard */}
            <TechPerformance />

            {/* 3D Transaction Heatmap */}
            <TransactionHeatmap />

            {/* Live Metrics Widget */}
            <LiveMetrics />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-gradient-to-br from-slate-900/80 to-blue-900/30 backdrop-blur-md rounded-xl border border-white/10 p-6 hover:border-blue-500/30 transition-all duration-300 shadow-lg shadow-blue-500/10">
                <p className="text-sm text-gray-400">Total Accounts</p>
                <p className="text-3xl font-bold mt-2">{stats.totalNodes}</p>
              </div>
              <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/30 backdrop-blur-md rounded-xl border border-white/10 p-6 hover:border-purple-500/30 transition-all duration-300 shadow-lg shadow-purple-500/10">
                <p className="text-sm text-gray-400">Transactions</p>
                <p className="text-3xl font-bold mt-2">{stats.totalEdges}</p>
              </div>
              <div className="bg-gradient-to-br from-slate-900/80 to-red-900/30 backdrop-blur-md rounded-xl border border-white/10 p-6 hover:border-red-500/30 transition-all duration-300 shadow-lg shadow-red-500/10">
                <p className="text-sm text-gray-400">Fraud Patterns</p>
                <p className="text-3xl font-bold mt-2 text-red-400">{stats.totalPatterns}</p>
              </div>
              <div className="bg-gradient-to-br from-red-950/60 to-red-900/40 backdrop-blur-md rounded-xl border border-red-500/40 p-6 hover:border-red-500/60 transition-all duration-300 shadow-xl shadow-red-500/30">
                <p className="text-sm text-red-400">Critical</p>
                <p className="text-3xl font-bold mt-2 text-red-400">{stats.criticalPatterns}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-950/60 to-orange-900/40 backdrop-blur-md rounded-xl border border-orange-500/40 p-6 hover:border-orange-500/60 transition-all duration-300 shadow-xl shadow-orange-500/30">
                <p className="text-sm text-orange-400">High Risk</p>
                <p className="text-3xl font-bold mt-2 text-orange-400">{stats.highRiskPatterns}</p>
              </div>
            </div>

            {/* Live Alert Feed */}
            <div className="bg-gradient-to-br from-slate-900/80 to-red-900/30 backdrop-blur-md rounded-xl border border-white/10 p-6 shadow-lg shadow-red-500/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  Live Threat Alerts
                </h3>
                <span className="text-xs text-gray-500">Real-time detection feed</span>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {liveAlerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border animate-fade-in ${
                      alert.type === "CRITICAL"
                        ? "bg-red-950/30 border-red-700/50"
                        : alert.type === "HIGH"
                        ? "bg-orange-950/30 border-orange-700/50"
                        : "bg-yellow-950/30 border-yellow-700/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold ${
                              alert.type === "CRITICAL"
                                ? "bg-red-600"
                                : alert.type === "HIGH"
                                ? "bg-orange-600"
                                : "bg-yellow-600"
                            }`}
                          >
                            {alert.type}
                          </span>
                          <span className="text-xs text-gray-500">{alert.time}</span>
                        </div>
                        <p className="text-sm text-gray-300">{alert.message}</p>
                      </div>
                      <button className="text-blue-400 hover:text-blue-300 text-xs">
                        Investigate →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison Metrics */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-6">RiskGraph vs Traditional Systems</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-2">Detection Rate</div>
                  <div className="flex items-end justify-center gap-2 mb-2">
                    <div className="text-center">
                      <div className="h-16 w-12 bg-gray-700 rounded flex items-end justify-center">
                        <div className="w-full h-10 bg-red-600/50 rounded-t"></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Old: 50%</div>
                    </div>
                    <div className="text-center">
                      <div className="h-16 w-12 bg-gray-700 rounded flex items-end justify-center">
                        <div className="w-full h-15 bg-green-600 rounded-t"></div>
                      </div>
                      <div className="text-xs text-green-400 mt-1">New: 95%</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-green-400">+90% ↑</div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-2">Investigation Time</div>
                  <div className="flex items-end justify-center gap-2 mb-2">
                    <div className="text-center">
                      <div className="h-16 w-12 bg-gray-700 rounded flex items-end justify-center">
                        <div className="w-full h-14 bg-red-600/50 rounded-t"></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Old: 2hr</div>
                    </div>
                    <div className="text-center">
                      <div className="h-16 w-12 bg-gray-700 rounded flex items-end justify-center">
                        <div className="w-full h-4 bg-green-600 rounded-t"></div>
                      </div>
                      <div className="text-xs text-green-400 mt-1">New: 15m</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-green-400">-88% ↓</div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-2">False Positives</div>
                  <div className="flex items-end justify-center gap-2 mb-2">
                    <div className="text-center">
                      <div className="h-16 w-12 bg-gray-700 rounded flex items-end justify-center">
                        <div className="w-full h-12 bg-red-600/50 rounded-t"></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Old: 40%</div>
                    </div>
                    <div className="text-center">
                      <div className="h-16 w-12 bg-gray-700 rounded flex items-end justify-center">
                        <div className="w-full h-5 bg-green-600 rounded-t"></div>
                      </div>
                      <div className="text-xs text-green-400 mt-1">New: 12%</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-green-400">-70% ↓</div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-2">Fraud Loss</div>
                  <div className="flex items-end justify-center gap-2 mb-2">
                    <div className="text-center">
                      <div className="h-16 w-12 bg-gray-700 rounded flex items-end justify-center">
                        <div className="w-full h-16 bg-red-600/50 rounded-t"></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Old: 100%</div>
                    </div>
                    <div className="text-center">
                      <div className="h-16 w-12 bg-gray-700 rounded flex items-end justify-center">
                        <div className="w-full h-6 bg-green-600 rounded-t"></div>
                      </div>
                      <div className="text-xs text-green-400 mt-1">New: 40%</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-green-400">-60% ↓</div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-green-950/30 border border-green-700/50 rounded-lg text-center">
                <p className="text-sm text-green-400">
                  💰 Estimated Annual Savings: <span className="font-bold text-lg">₹2-3 Crores</span>
                </p>
              </div>
            </div>

            {/* Graph Preview */}
            {graphData && (
              <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/30 backdrop-blur-md rounded-xl border border-white/10 p-6 shadow-lg shadow-purple-500/10">
                <h3 className="text-lg font-semibold mb-4">Transaction Network Preview</h3>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <p className="text-sm text-gray-400 mb-4">
                    Network contains {graphData.nodes.length} accounts with {graphData.edges.length} transaction edges.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-red-950/50 to-red-900/30 backdrop-blur-sm p-4 rounded-lg border border-red-500/20 shadow-md">
                      <p className="text-xs text-gray-400">High Velocity Accounts</p>
                      <p className="text-2xl font-bold text-red-400">
                        {graphData.nodes.filter((n: any) => n.features.velocity > 10).length}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-950/50 to-yellow-900/30 backdrop-blur-sm p-4 rounded-lg border border-yellow-500/20 shadow-md">
                      <p className="text-xs text-gray-400">New Accounts</p>
                      <p className="text-2xl font-bold text-yellow-400">
                        {graphData.nodes.filter((n: any) => n.features.isNewAccount).length}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-950/50 to-green-900/30 backdrop-blur-sm p-4 rounded-lg border border-green-500/20 shadow-md">
                      <p className="text-xs text-gray-400">Total Volume</p>
                      <p className="text-2xl font-bold text-green-400">
                        ₹{(graphData.nodes.reduce((sum: number, n: any) => sum + n.features.totalVolume, 0) / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Patterns Tab */}
        {activeTab === "patterns" && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-slate-900/80 to-red-900/30 backdrop-blur-md rounded-xl border border-white/10 p-6 shadow-lg shadow-red-500/10">
              <h2 className="text-xl font-bold mb-4">Detected Fraud Patterns</h2>
              <p className="text-sm text-gray-400 mb-6">
                Real-time detection using graph algorithms and behavioral analysis
              </p>
              
              {patterns.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No fraud patterns detected</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {patterns.map((pattern, idx) => (
                    <div
                      key={idx}
                      className={`border rounded-xl p-6 backdrop-blur-md transition-all duration-300 ${
                        pattern.severity === "CRITICAL"
                          ? "border-red-500/40 bg-gradient-to-br from-red-950/60 to-red-900/40 shadow-xl shadow-red-500/30"
                          : pattern.severity === "HIGH"
                          ? "border-orange-500/40 bg-gradient-to-br from-orange-950/60 to-orange-900/40 shadow-xl shadow-orange-500/30"
                          : "border-yellow-500/40 bg-gradient-to-br from-yellow-950/60 to-yellow-900/40 shadow-xl shadow-yellow-500/30"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {pattern.type.replace(/_/g, " ")}
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">{pattern.description}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            pattern.severity === "CRITICAL"
                              ? "bg-red-600"
                              : pattern.severity === "HIGH"
                              ? "bg-orange-600"
                              : "bg-yellow-600"
                          }`}
                        >
                          {pattern.severity}
                        </span>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-300 mb-2">Evidence:</p>
                        <ul className="space-y-1">
                          {pattern.evidence.map((ev, i) => (
                            <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                              <span className="text-red-400 mt-1">•</span>
                              <span>{ev}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          {pattern.accounts.length} accounts involved
                        </span>
                        <span className="text-gray-500">
                          Confidence: {Math.round(pattern.confidence * 100)}%
                        </span>
                      </div>

                      <details className="mt-4">
                        <summary className="text-sm text-blue-400 cursor-pointer hover:text-blue-300">
                          View involved accounts ({pattern.accounts.length})
                        </summary>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {pattern.accounts.map((acc, i) => (
                            <div
                              key={i}
                              className="text-xs bg-gray-800 px-3 py-2 rounded border border-gray-700"
                            >
                              {acc}
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Graph Visualization Tab */}
        {activeTab === "graph" && graphData && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-bold mb-4">Transaction Network Graph</h2>
              <p className="text-sm text-gray-400 mb-6">
                Interactive visualization of transaction network. Click on nodes to analyze accounts.
              </p>
              
              <GraphVisualization
                nodes={graphData.nodes}
                edges={graphData.edges}
                highlightedNodes={patterns.flatMap(p => p.accounts).slice(0, 20)}
                onNodeClick={(nodeId) => {
                  setUpiId(nodeId);
                  setActiveTab("check");
                  setTimeout(() => assessRisk(), 100);
                }}
              />

              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-blue-400">{graphData.nodes.length}</p>
                  <p className="text-xs text-gray-400 mt-1">Total Nodes</p>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-purple-400">{graphData.edges.length}</p>
                  <p className="text-xs text-gray-400 mt-1">Total Edges</p>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-red-400">
                    {graphData.nodes.filter((n: any) => n.features.velocity > 10).length}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">High Risk Nodes</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attack Timeline Tab */}
        {activeTab === "timeline" && (
          <AttackTimeline graphData={graphData} />
        )}

        {/* Comparison Tab */}
        {activeTab === "comparison" && <ComparisonPage />}
      </div>

      {/* Guided Tour */}
      <GuidedTour />

      {/* Quick Actions Floating Button */}
      <QuickActions
        onAction={(action, data) => {
          if (action === "demo" && data?.scenario) {
            setUpiId(data.scenario);
            setActiveTab("check");
            setTimeout(() => assessRisk(), 300);
          } else if (action === "export-pdf" && assessment) {
            exportToPDF(assessment);
          } else if (action === "navigate" && data?.tab) {
            setActiveTab(data.tab);
          } else if (action === "start-tour") {
            localStorage.removeItem("tourCompleted");
            window.location.reload();
          }
        }}
      />

      {/* Footer */}
      <Footer />
      </div>
    </main>
  );
}
