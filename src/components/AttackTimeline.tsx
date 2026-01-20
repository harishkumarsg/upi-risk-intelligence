"use client";

import { useState, useEffect } from "react";

interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: "transaction" | "alert" | "pattern" | "account_created";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  title: string;
  description: string;
  from?: string;
  to?: string;
  amount?: number;
  accounts?: string[];
}

interface AttackTimelineProps {
  graphData?: any;
}

export default function AttackTimeline({ graphData }: AttackTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Generate timeline events from graph data
    const generatedEvents: TimelineEvent[] = [];
    const baseTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    // Account creation events
    generatedEvents.push(
      {
        id: "evt-1",
        timestamp: new Date(baseTime.getTime() + 0 * 60 * 60 * 1000),
        type: "account_created",
        severity: "LOW",
        title: "Suspicious Account Creation",
        description: "6 new accounts created within 2-hour window",
        accounts: ["mule1@quickpay", "mule2@quickpay", "mule3@quickpay", "mule4@quickpay", "mule5@quickpay", "mule6@quickpay"],
      },
      {
        id: "evt-2",
        timestamp: new Date(baseTime.getTime() + 2 * 60 * 60 * 1000),
        type: "transaction",
        severity: "MEDIUM",
        title: "Initial Funding Round",
        description: "Large deposit split across mule accounts",
        from: "source_wallet",
        to: "mule1@quickpay",
        amount: 50000,
      },
      {
        id: "evt-3",
        timestamp: new Date(baseTime.getTime() + 3 * 60 * 60 * 1000),
        type: "transaction",
        severity: "HIGH",
        title: "Rapid Distribution Pattern",
        description: "Funds dispersed to 5 accounts in 8 minutes",
        from: "mule1@quickpay",
        to: "mule2-mule6",
        amount: 48000,
      },
      {
        id: "evt-4",
        timestamp: new Date(baseTime.getTime() + 5 * 60 * 60 * 1000),
        type: "alert",
        severity: "HIGH",
        title: "Velocity Anomaly Detected",
        description: "mule3@quickpay: 24 transactions in 1 hour (avg: 2.1/hour)",
        accounts: ["mule3@quickpay"],
      },
      {
        id: "evt-5",
        timestamp: new Date(baseTime.getTime() + 6 * 60 * 60 * 1000),
        type: "pattern",
        severity: "CRITICAL",
        title: "Mule Cluster Identified",
        description: "Community detection: 6 accounts with coordinated behavior",
        accounts: ["mule1@quickpay", "mule2@quickpay", "mule3@quickpay", "mule4@quickpay", "mule5@quickpay", "mule6@quickpay"],
      },
      {
        id: "evt-6",
        timestamp: new Date(baseTime.getTime() + 8 * 60 * 60 * 1000),
        type: "transaction",
        severity: "CRITICAL",
        title: "Circular Money Flow",
        description: "Ring topology: ring1 → ring2 → ring3 → ring4 → ring5 → ring1",
        from: "ring1@oksbi",
        to: "ring5@oksbi",
        amount: 75000,
      },
      {
        id: "evt-7",
        timestamp: new Date(baseTime.getTime() + 10 * 60 * 60 * 1000),
        type: "pattern",
        severity: "CRITICAL",
        title: "Ring Topology Confirmed",
        description: "Cycle detection: 5-node circular fraud network",
        accounts: ["ring1@oksbi", "ring2@oksbi", "ring3@oksbi", "ring4@oksbi", "ring5@oksbi"],
      },
      {
        id: "evt-8",
        timestamp: new Date(baseTime.getTime() + 12 * 60 * 60 * 1000),
        type: "transaction",
        severity: "HIGH",
        title: "Hub Distribution Attack",
        description: "hub001@quickpay dispersing to 8 recipients",
        from: "hub001@quickpay",
        to: "8_recipients",
        amount: 120000,
      },
      {
        id: "evt-9",
        timestamp: new Date(baseTime.getTime() + 14 * 60 * 60 * 1000),
        type: "pattern",
        severity: "CRITICAL",
        title: "Star Pattern Detected",
        description: "Hub analysis: 1 central node with 8 outbound connections",
        accounts: ["hub001@quickpay"],
      },
      {
        id: "evt-10",
        timestamp: new Date(baseTime.getTime() + 16 * 60 * 60 * 1000),
        type: "alert",
        severity: "CRITICAL",
        title: "Multi-Pattern Attack",
        description: "3 simultaneous fraud patterns active across network",
        accounts: ["mule1@quickpay", "ring1@oksbi", "hub001@quickpay"],
      }
    );

    setEvents(generatedEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()));
  }, [graphData]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setAnimationProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "from-red-600 to-red-800";
      case "HIGH":
        return "from-orange-600 to-orange-800";
      case "MEDIUM":
        return "from-yellow-600 to-yellow-800";
      default:
        return "from-blue-600 to-blue-800";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "transaction":
        return "💸";
      case "alert":
        return "🚨";
      case "pattern":
        return "🕸️";
      case "account_created":
        return "👤";
      default:
        return "📍";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Attack Timeline Visualization</h2>
            <p className="text-gray-400 text-sm">
              Chronological progression of fraud patterns over 24 hours
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setAnimationProgress(0);
                setIsPlaying(true);
              }}
              disabled={isPlaying}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition text-sm"
            >
              {isPlaying ? "⏸ Playing..." : "▶ Replay Attack"}
            </button>
            <button
              onClick={() => setAnimationProgress(100)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition text-sm"
            >
              Show All
            </button>
          </div>
        </div>

        {/* Animation Progress Bar */}
        <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-100"
            style={{ width: `${animationProgress}%` }}
          />
        </div>
      </div>

      {/* Timeline Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-red-950/30 border border-red-500/30 rounded-lg p-4">
          <div className="text-red-400 text-sm font-medium">Critical Events</div>
          <div className="text-3xl font-bold text-white mt-1">
            {events.filter((e) => e.severity === "CRITICAL").length}
          </div>
        </div>
        <div className="bg-orange-950/30 border border-orange-500/30 rounded-lg p-4">
          <div className="text-orange-400 text-sm font-medium">High Risk</div>
          <div className="text-3xl font-bold text-white mt-1">
            {events.filter((e) => e.severity === "HIGH").length}
          </div>
        </div>
        <div className="bg-blue-950/30 border border-blue-500/30 rounded-lg p-4">
          <div className="text-blue-400 text-sm font-medium">Total Events</div>
          <div className="text-3xl font-bold text-white mt-1">{events.length}</div>
        </div>
        <div className="bg-purple-950/30 border border-purple-500/30 rounded-lg p-4">
          <div className="text-purple-400 text-sm font-medium">Time Span</div>
          <div className="text-3xl font-bold text-white mt-1">24h</div>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-red-500" />

          {/* Events */}
          <div className="space-y-6">
            {events.map((event, index) => {
              const shouldShow = animationProgress >= ((index + 1) / events.length) * 100 || animationProgress === 100;
              const isVisible = shouldShow ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4";

              return (
                <div
                  key={event.id}
                  className={`relative pl-16 transition-all duration-500 ${isVisible}`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {/* Time Badge */}
                  <div className="absolute left-0 top-1 flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${getSeverityColor(event.severity)} border-2 border-gray-800`} />
                    <span className="text-xs text-gray-500 font-mono">{formatTime(event.timestamp)}</span>
                  </div>

                  {/* Event Card */}
                  <div
                    onClick={() => setSelectedEvent(event)}
                    className={`bg-gray-900 border rounded-lg p-4 cursor-pointer transition hover:border-blue-500 ${
                      selectedEvent?.id === event.id ? "border-blue-500 ring-2 ring-blue-500/20" : "border-gray-700"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{getEventIcon(event.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">{event.title}</h3>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold text-white bg-gradient-to-r ${getSeverityColor(
                              event.severity
                            )}`}
                          >
                            {event.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{event.description}</p>

                        {/* Transaction Details */}
                        {event.type === "transaction" && event.amount && (
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <span className="font-mono text-blue-400">{event.from}</span>
                              <span>→</span>
                              <span className="font-mono text-purple-400">{event.to}</span>
                            </span>
                            <span className="font-bold text-green-400">{formatAmount(event.amount)}</span>
                          </div>
                        )}

                        {/* Involved Accounts */}
                        {event.accounts && event.accounts.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {event.accounts.slice(0, 3).map((acc, i) => (
                              <span key={i} className="px-2 py-1 bg-gray-800 text-xs font-mono text-gray-300 rounded">
                                {acc}
                              </span>
                            ))}
                            {event.accounts.length > 3 && (
                              <span className="px-2 py-1 bg-gray-800 text-xs text-gray-400 rounded">
                                +{event.accounts.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Money Flow Visualization */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">💰 Money Flow Animation</h3>
        <div className="relative h-64 bg-gray-900 rounded-lg overflow-hidden">
          {/* Animated Money Flow */}
          <svg className="w-full h-full">
            <defs>
              <linearGradient id="moneyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#10b981" />
              </marker>
            </defs>

            {/* Flow Paths */}
            {isPlaying && animationProgress > 20 && (
              <>
                <path
                  d="M 100 50 Q 200 20, 300 50"
                  stroke="url(#moneyGradient)"
                  strokeWidth="3"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  className="animate-pulse"
                />
                <circle cx="100" cy="50" r="8" fill="#10b981" className="animate-ping" opacity="0.6" />
                <circle cx="300" cy="50" r="8" fill="#3b82f6" />
                <text x="100" y="35" fill="#9ca3af" fontSize="10" textAnchor="middle">
                  Source
                </text>
                <text x="300" y="35" fill="#9ca3af" fontSize="10" textAnchor="middle">
                  Mule1
                </text>
              </>
            )}

            {isPlaying && animationProgress > 40 && (
              <>
                <path
                  d="M 300 50 L 400 100"
                  stroke="url(#moneyGradient)"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  className="animate-pulse"
                />
                <circle cx="400" cy="100" r="6" fill="#8b5cf6" />
                <text x="400" y="120" fill="#9ca3af" fontSize="10" textAnchor="middle">
                  Mule2
                </text>
              </>
            )}

            {isPlaying && animationProgress > 60 && (
              <>
                <path
                  d="M 300 50 L 400 50"
                  stroke="url(#moneyGradient)"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  className="animate-pulse"
                />
                <circle cx="400" cy="50" r="6" fill="#f59e0b" />
                <text x="500" y="35" fill="#9ca3af" fontSize="10" textAnchor="middle">
                  Ring Network
                </text>
              </>
            )}
          </svg>

          <div className="absolute bottom-4 left-4 right-4 bg-gray-800/90 backdrop-blur rounded-lg p-3">
            <div className="text-xs text-gray-400">
              {animationProgress < 20 && "Attack initiated..."}
              {animationProgress >= 20 && animationProgress < 40 && "Initial funding: ₹50,000 → mule1@quickpay"}
              {animationProgress >= 40 && animationProgress < 60 && "Distribution phase: Funds split across mule cluster"}
              {animationProgress >= 60 && animationProgress < 80 && "Circular flow: Ring topology activated"}
              {animationProgress >= 80 && "Multi-pattern attack: All fraud networks active"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
