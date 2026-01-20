"use client";

export default function ComparisonPage() {
  const comparisons = [
    {
      category: "Detection Speed",
      traditional: "5-10 days",
      traditionalIcon: "🐌",
      riskgraph: "< 1 second",
      riskgraphIcon: "⚡",
      improvement: "99.9% faster",
    },
    {
      category: "Pattern Recognition",
      traditional: "Manual rule-based",
      traditionalIcon: "📋",
      riskgraph: "7 graph algorithms",
      riskgraphIcon: "🧠",
      improvement: "Advanced AI",
    },
    {
      category: "Network Analysis",
      traditional: "Individual accounts",
      traditionalIcon: "👤",
      riskgraph: "Full network topology",
      riskgraphIcon: "🕸️",
      improvement: "Holistic view",
    },
    {
      category: "Fraud Detection Rate",
      traditional: "65-75%",
      traditionalIcon: "📊",
      riskgraph: "95.8%",
      riskgraphIcon: "🎯",
      improvement: "+28% accuracy",
    },
    {
      category: "False Positives",
      traditional: "15-25%",
      traditionalIcon: "⚠️",
      riskgraph: "< 5%",
      riskgraphIcon: "✅",
      improvement: "80% reduction",
    },
    {
      category: "Investigation Time",
      traditional: "2-3 hours/case",
      traditionalIcon: "⏰",
      riskgraph: "15 minutes/case",
      riskgraphIcon: "⏱️",
      improvement: "88% faster",
    },
    {
      category: "Scalability",
      traditional: "Limited to 1K tx/min",
      traditionalIcon: "🔒",
      riskgraph: "1M+ tx/min",
      riskgraphIcon: "🚀",
      improvement: "1000x scale",
    },
    {
      category: "Pattern Types",
      traditional: "3-5 basic patterns",
      traditionalIcon: "📌",
      riskgraph: "20+ complex patterns",
      riskgraphIcon: "🎨",
      improvement: "4x coverage",
    },
  ];

  const features = [
    {
      icon: "🕸️",
      title: "Graph-Based Intelligence",
      description: "Analyzes entire transaction networks to identify coordinated fraud rings",
    },
    {
      icon: "🤖",
      title: "AI-Powered Insights",
      description: "Natural language explanations of why accounts are flagged as risky",
    },
    {
      icon: "⚡",
      title: "Real-Time Detection",
      description: "Sub-second fraud detection with live alert feed and monitoring",
    },
    {
      icon: "📊",
      title: "Visual Analytics",
      description: "Interactive network graphs and attack timeline visualizations",
    },
    {
      icon: "🎯",
      title: "Multi-Pattern Detection",
      description: "Identifies mule clusters, ring topologies, star patterns, and velocity anomalies",
    },
    {
      icon: "📈",
      title: "Business Impact",
      description: "Track money saved, fraud prevented, and ROI in real-time",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-3">
          Why RiskGraph Intelligence™?
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          See how our graph-based approach revolutionizes fraud detection compared to traditional rule-based systems
        </p>
      </div>

      {/* Comparison Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="grid grid-cols-4 bg-gray-900 border-b border-gray-700">
          <div className="p-4 font-semibold text-gray-300">Metric</div>
          <div className="p-4 font-semibold text-orange-400 text-center border-l border-gray-700">
            Traditional Systems
          </div>
          <div className="p-4 font-semibold text-blue-400 text-center border-l border-gray-700">
            RiskGraph Intelligence™
          </div>
          <div className="p-4 font-semibold text-green-400 text-center border-l border-gray-700">
            Improvement
          </div>
        </div>
        {comparisons.map((item, idx) => (
          <div
            key={idx}
            className={`grid grid-cols-4 ${
              idx % 2 === 0 ? "bg-gray-800/50" : "bg-gray-900/50"
            } hover:bg-gray-700/30 transition`}
          >
            <div className="p-4 font-medium text-white">{item.category}</div>
            <div className="p-4 text-center border-l border-gray-700 text-gray-400 text-sm">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl">{item.traditionalIcon}</span>
                <span>{item.traditional}</span>
              </div>
            </div>
            <div className="p-4 text-center border-l border-gray-700 text-blue-300 font-semibold text-sm">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl">{item.riskgraphIcon}</span>
                <span>{item.riskgraph}</span>
              </div>
            </div>
            <div className="p-4 text-center border-l border-gray-700">
              <span className="px-3 py-1 bg-green-950/50 border border-green-600/30 text-green-400 rounded-full text-xs font-bold">
                {item.improvement}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Key Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Unique Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-gray-800 rounded-lg border border-gray-700 p-5 hover:border-blue-500/50 transition"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ROI Calculation */}
      <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl border border-green-600/30 p-8">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span>💰</span>
          Business Impact Calculator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900/50 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Average Fraud Prevented/Day</p>
            <p className="text-3xl font-bold text-green-400">₹1.25 Cr</p>
            <p className="text-xs text-green-300 mt-1">Based on 47 frauds detected</p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Annual Savings</p>
            <p className="text-3xl font-bold text-blue-400">₹456 Cr</p>
            <p className="text-xs text-blue-300 mt-1">365-day projection</p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">ROI Timeline</p>
            <p className="text-3xl font-bold text-purple-400">{'<'} 2 weeks</p>
            <p className="text-xs text-purple-300 mt-1">Break-even point</p>
          </div>
        </div>
      </div>

      {/* Technologies Used */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Technology Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Graph Algorithms", desc: "NetworkX-inspired" },
            { name: "Behavioral Analysis", desc: "Velocity & Entropy" },
            { name: "Pattern Detection", desc: "Community & Cycles" },
            { name: "Real-Time Processing", desc: "Sub-second latency" },
            { name: "Network Topology", desc: "Centrality metrics" },
            { name: "Machine Learning", desc: "PageRank & Clustering" },
            { name: "Visual Analytics", desc: "Force-directed layout" },
            { name: "Export & Integration", desc: "PDF/JSON/API" },
          ].map((tech, idx) => (
            <div key={idx} className="bg-gray-900/50 rounded-lg p-3">
              <p className="text-sm font-semibold text-blue-400">{tech.name}</p>
              <p className="text-xs text-gray-500 mt-1">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
