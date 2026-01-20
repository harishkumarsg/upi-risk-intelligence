"use client";

import { useState } from "react";

interface QuickActionsProps {
  onAction: (action: string, data?: any) => void;
}

export default function QuickActions({ onAction }: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      id: "demo-mule",
      label: "Demo: Mule Cluster",
      description: "Show coordinated fraud network",
      icon: "🎯",
      color: "from-red-600 to-orange-600",
      action: () => onAction("demo", { scenario: "mule1@quickpay" }),
    },
    {
      id: "demo-ring",
      label: "Demo: Ring Topology",
      description: "Circular money laundering",
      icon: "🔄",
      color: "from-purple-600 to-pink-600",
      action: () => onAction("demo", { scenario: "ring1@oksbi" }),
    },
    {
      id: "export-pdf",
      label: "Export Report",
      description: "Generate PDF analysis",
      icon: "📄",
      color: "from-blue-600 to-cyan-600",
      action: () => onAction("export-pdf"),
    },
    {
      id: "view-graph",
      label: "Network Graph",
      description: "Visual network analysis",
      icon: "🕸️",
      color: "from-green-600 to-emerald-600",
      action: () => onAction("navigate", { tab: "graph" }),
    },
    {
      id: "guided-tour",
      label: "Take Tour",
      description: "Feature walkthrough",
      icon: "🎓",
      color: "from-indigo-600 to-violet-600",
      action: () => onAction("start-tour"),
    },
    {
      id: "live-metrics",
      label: "Live Metrics",
      description: "Real-time dashboard",
      icon: "📊",
      color: "from-yellow-600 to-orange-600",
      action: () => onAction("navigate", { tab: "dashboard" }),
    },
  ];

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-transform duration-200 group"
        aria-label="Quick Actions"
      >
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${
            isOpen ? "rotate-45" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
        </span>
      </button>

      {/* Quick Actions Menu */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 space-y-3 animate-in slide-in-from-bottom-4 fade-in duration-300">
          {actions.map((action, idx) => (
            <div
              key={action.id}
              className="animate-in slide-in-from-right fade-in duration-300"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <button
                onClick={() => {
                  action.action();
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 bg-gradient-to-r ${action.color} text-white rounded-xl px-4 py-3 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 w-64 group`}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                  {action.icon}
                </span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm">{action.label}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
                <svg
                  className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
