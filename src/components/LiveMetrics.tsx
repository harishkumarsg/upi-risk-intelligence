"use client";

import { useEffect, useState } from "react";

export default function LiveMetrics() {
  const [metrics, setMetrics] = useState({
    fraudsDetected24h: 0,
    moneySaved: 0,
    averageDetectionTime: 0,
    accountsMonitored: 0,
    activeAlerts: 0,
    accuracyRate: 0,
  });

  useEffect(() => {
    // Simulate real-time metrics
    const targetMetrics = {
      fraudsDetected24h: 47,
      moneySaved: 12500000,
      averageDetectionTime: 847,
      accountsMonitored: 68423,
      activeAlerts: 12,
      accuracyRate: 95.8,
    };

    // Animate numbers counting up
    let frame = 0;
    const frames = 60;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / frames;
      
      setMetrics({
        fraudsDetected24h: Math.round(targetMetrics.fraudsDetected24h * progress),
        moneySaved: Math.round(targetMetrics.moneySaved * progress),
        averageDetectionTime: Math.round(targetMetrics.averageDetectionTime * progress),
        accountsMonitored: Math.round(targetMetrics.accountsMonitored * progress),
        activeAlerts: Math.round(targetMetrics.activeAlerts * progress),
        accuracyRate: Number((targetMetrics.accuracyRate * progress).toFixed(1)),
      });

      if (frame >= frames) {
        clearInterval(interval);
        // Start live updates
        setInterval(() => {
          setMetrics(prev => ({
            ...prev,
            fraudsDetected24h: prev.fraudsDetected24h + (Math.random() > 0.7 ? 1 : 0),
            activeAlerts: Math.max(5, prev.activeAlerts + (Math.random() > 0.5 ? 1 : -1)),
          }));
        }, 5000);
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Frauds Detected */}
      <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 rounded-lg border border-red-500/30 p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 text-6xl opacity-10">🚨</div>
        <div className="relative z-10">
          <p className="text-xs text-red-300 font-medium mb-1">Frauds Detected (24h)</p>
          <p className="text-3xl font-bold text-white mb-1">{metrics.fraudsDetected24h}</p>
          <p className="text-xs text-green-400">↑ 12% vs yesterday</p>
        </div>
      </div>

      {/* Money Saved */}
      <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-lg border border-green-500/30 p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 text-6xl opacity-10">💰</div>
        <div className="relative z-10">
          <p className="text-xs text-green-300 font-medium mb-1">Fraud Prevented (24h)</p>
          <p className="text-3xl font-bold text-white mb-1">{formatCurrency(metrics.moneySaved)}</p>
          <p className="text-xs text-green-400">Real-time savings tracker</p>
        </div>
      </div>

      {/* Detection Speed */}
      <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-lg border border-blue-500/30 p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 text-6xl opacity-10">⚡</div>
        <div className="relative z-10">
          <p className="text-xs text-blue-300 font-medium mb-1">Avg Detection Time</p>
          <p className="text-3xl font-bold text-white mb-1">{metrics.averageDetectionTime}ms</p>
          <p className="text-xs text-blue-400">Graph analysis speed</p>
        </div>
      </div>

      {/* Accounts Monitored */}
      <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-lg border border-purple-500/30 p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 text-6xl opacity-10">👥</div>
        <div className="relative z-10">
          <p className="text-xs text-purple-300 font-medium mb-1">Accounts Monitored</p>
          <p className="text-3xl font-bold text-white mb-1">{metrics.accountsMonitored.toLocaleString()}</p>
          <p className="text-xs text-purple-400">Active network nodes</p>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 rounded-lg border border-orange-500/30 p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 text-6xl opacity-10">🔔</div>
        <div className="relative z-10">
          <p className="text-xs text-orange-300 font-medium mb-1">Active Alerts</p>
          <p className="text-3xl font-bold text-white mb-1 pulse-glow">{metrics.activeAlerts}</p>
          <p className="text-xs text-orange-400">Requires investigation</p>
        </div>
      </div>

      {/* Accuracy Rate */}
      <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 rounded-lg border border-cyan-500/30 p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 text-6xl opacity-10">🎯</div>
        <div className="relative z-10">
          <p className="text-xs text-cyan-300 font-medium mb-1">Detection Accuracy</p>
          <p className="text-3xl font-bold text-white mb-1">{metrics.accuracyRate}%</p>
          <p className="text-xs text-green-400">Industry-leading precision</p>
        </div>
      </div>
    </div>
  );
}
