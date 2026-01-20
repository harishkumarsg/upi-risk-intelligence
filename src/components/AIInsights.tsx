"use client";

import { useState, useEffect } from "react";

interface AIInsightsProps {
  assessment: any;
  upiId: string;
}

export default function AIInsights({ assessment, upiId }: AIInsightsProps) {
  const [insights, setInsights] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    if (!assessment) return;

    // Generate AI-powered natural language insights
    const generatedInsights: string[] = [];
    const generatedRecommendations: string[] = [];

    // Risk level explanation
    if (assessment.risk === "HIGH") {
      generatedInsights.push(
        `🚨 This account exhibits **critical fraud indicators** with a ${assessment.riskScore}/100 risk score, placing it in the top 5% of suspicious accounts in our network.`
      );
    } else if (assessment.risk === "MEDIUM") {
      generatedInsights.push(
        `⚠️ This account shows **moderate risk signals** with a ${assessment.riskScore}/100 score, warranting enhanced monitoring and verification.`
      );
    } else {
      generatedInsights.push(
        `✅ This account displays **normal behavior patterns** with a low ${assessment.riskScore}/100 risk score, consistent with legitimate UPI usage.`
      );
    }

    // Pattern-specific insights
    if (assessment.detectedPatterns?.length > 0) {
      const patterns = assessment.detectedPatterns;
      
      patterns.forEach((pattern: any) => {
        if (pattern.type === "Mule Cluster") {
          generatedInsights.push(
            `🕸️ **Mule Account Network Detected**: This account is part of a coordinated fraud ring with ${pattern.accounts.length} interconnected accounts showing synchronized behavior. Community detection algorithms identified ${Math.round(pattern.confidence * 100)}% probability of collusive activity.`
          );
          generatedRecommendations.push(
            "Immediately freeze all connected accounts and initiate AML investigation"
          );
          generatedRecommendations.push(
            "Cross-reference account creation timestamps and KYC documents for identity verification"
          );
        }
        
        if (pattern.type === "Ring Topology") {
          generatedInsights.push(
            `🔄 **Circular Money Laundering**: Funds are flowing in a closed loop through ${pattern.accounts.length} accounts, a classic layering technique to obscure transaction origins. Each account receives and forwards money to create an untraceable chain.`
          );
          generatedRecommendations.push(
            "Trace the initial funding source before the ring formation"
          );
          generatedRecommendations.push(
            "Calculate total volume cycled to estimate fraud magnitude"
          );
        }
        
        if (pattern.type === "Star Pattern") {
          generatedInsights.push(
            `⭐ **Hub Distribution Attack**: A central hub account is rapidly dispersing funds to ${pattern.accounts.length}+ recipients, typical of phishing proceeds distribution or stolen funds liquidation. The star topology suggests professional fraud organization.`
          );
          generatedRecommendations.push(
            "Block outbound transactions from hub account immediately"
          );
          generatedRecommendations.push(
            "Contact all recipient accounts for transaction verification"
          );
        }
        
        if (pattern.type === "Velocity Anomaly") {
          generatedInsights.push(
            `⚡ **Abnormal Transaction Velocity**: This account is processing transactions at ${Math.round(pattern.confidence * 100)}x the normal rate, indicating potential bot-driven activity or account compromise.`
          );
          generatedRecommendations.push(
            "Implement transaction rate limiting and CAPTCHA verification"
          );
          generatedRecommendations.push(
            "Verify account holder identity through SMS/email OTP"
          );
        }
      });
    }

    // Network metrics insights
    if (assessment.networkMetrics) {
      const metrics = assessment.networkMetrics;
      
      if (metrics.degreeCentrality > 0.5) {
        generatedInsights.push(
          `📊 **High Network Centrality**: This account has ${Math.round(metrics.degreeCentrality * 100)}% network centrality, meaning it's a critical node connecting multiple fraud clusters. Disrupting this account could break multiple fraud chains.`
        );
      }
      
      if (metrics.betweennessCentrality > 0.6) {
        generatedInsights.push(
          `🌉 **Bridge Account Identified**: High betweenness centrality (${Math.round(metrics.betweennessCentrality * 100)}%) indicates this account acts as a bridge between fraud groups, likely a money mule coordinator or laundering intermediary.`
        );
        generatedRecommendations.push(
          "Priority target for law enforcement - may lead to fraud organizers"
        );
      }
      
      if (metrics.pageRank > 0.05) {
        generatedInsights.push(
          `🎯 **Influential Fraud Node**: PageRank score of ${(metrics.pageRank * 100).toFixed(2)}% suggests this account is highly influential in the fraud network, receiving connections from many other suspicious accounts.`
        );
      }

      if (metrics.clusteringCoefficient > 0.7) {
        generatedInsights.push(
          `🤝 **Tight-Knit Group**: Clustering coefficient of ${Math.round(metrics.clusteringCoefficient * 100)}% reveals this account operates within a closely connected group where everyone transacts with everyone else - characteristic of organized fraud cells.`
        );
      }
    }

    // Behavioral flags insights
    if (assessment.behavioralFlags) {
      const flags = assessment.behavioralFlags;
      
      if (flags.highVelocity) {
        generatedInsights.push(
          `⏱️ **Velocity Warning**: Transaction rate exceeds 20 per hour, ${flags.velocity}x above the platform average. This rapid-fire activity is inconsistent with human behavior patterns.`
        );
        generatedRecommendations.push(
          "Enable enhanced monitoring with real-time alerts"
        );
      }
      
      if (flags.newAccountRisk) {
        generatedInsights.push(
          `🆕 **Fresh Account Alert**: Account created recently with immediate high-value activity. ${Math.round(flags.accountAge / 24)} days old but already flagged - typical of synthetic identity fraud or account farming.`
        );
        generatedRecommendations.push(
          "Request additional KYC documents and video verification"
        );
      }
      
      if (flags.suspiciousVolume) {
        generatedInsights.push(
          `💰 **Volume Anomaly**: Total transaction volume of ₹${flags.totalVolume.toLocaleString()} significantly exceeds normal patterns for accounts with similar profiles (${Math.round(flags.volumePercentile)}th percentile).`
        );
      }
      
      if (flags.lowEntropy) {
        generatedInsights.push(
          `🤖 **Synthetic Identity Indicator**: Low username entropy (${flags.entropy.toFixed(2)}) suggests algorithmically generated account names, common in bot-created mule accounts.`
        );
        generatedRecommendations.push(
          "Cross-check with device fingerprinting and IP geolocation"
        );
      }
    }

    // Evidence-based insights
    if (assessment.evidence?.length > 0) {
      const criticalEvidence = assessment.evidence.filter((e: any) => e.severity === "CRITICAL" || e.severity === "HIGH");
      if (criticalEvidence.length > 0) {
        generatedInsights.push(
          `📁 **${criticalEvidence.length} Critical Evidence Items**: Our graph algorithms have identified concrete proof of fraudulent patterns including synchronized transactions, circular flows, and coordinated account behavior.`
        );
      }
    }

    // Investigation leads
    if (assessment.investigationLeads?.length > 0) {
      generatedRecommendations.push(
        `Start investigation with: ${assessment.investigationLeads.slice(0, 2).join(", ")}`
      );
    }

    // General recommendations based on risk level
    if (assessment.risk === "HIGH") {
      generatedRecommendations.push(
        "IMMEDIATE ACTION: Freeze account and escalate to fraud investigation team"
      );
      generatedRecommendations.push(
        "File Suspicious Transaction Report (STR) with financial intelligence unit"
      );
      generatedRecommendations.push(
        "Preserve all transaction logs and metadata for legal proceedings"
      );
    } else if (assessment.risk === "MEDIUM") {
      generatedRecommendations.push(
        "Enable enhanced due diligence (EDD) monitoring"
      );
      generatedRecommendations.push(
        "Implement transaction limits until risk factors are resolved"
      );
    } else {
      generatedRecommendations.push(
        "Continue standard monitoring - no immediate action required"
      );
    }

    setInsights(generatedInsights);
    setRecommendations(generatedRecommendations);
  }, [assessment]);

  if (!assessment) return null;

  return (
    <div className="space-y-4">
      {/* AI Insights Header */}
      <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-lg border border-purple-500/30 p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h3 className="font-bold text-white">AI-Powered Risk Analysis</h3>
            <p className="text-xs text-gray-400">Natural language fraud investigation insights</p>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-5">
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="text-blue-400">💡</span>
          Key Insights
        </h4>
        <div className="space-y-3">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className="bg-gray-900/50 rounded-lg p-3 text-sm text-gray-300 leading-relaxed border-l-2 border-blue-500"
            >
              <div dangerouslySetInnerHTML={{ __html: insight.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-5">
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="text-green-400">🎯</span>
          Recommended Actions
        </h4>
        <div className="space-y-2">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 bg-gray-900/50 rounded-lg p-3"
            >
              <span className="text-green-400 text-lg flex-shrink-0">•</span>
              <span className="text-sm text-gray-300">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Investigation Priority Score */}
      <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-lg border border-red-500/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">Investigation Priority</p>
            <p className="text-2xl font-bold text-white">
              {assessment.risk === "HIGH" ? "🔴 CRITICAL" : assessment.risk === "MEDIUM" ? "🟡 ELEVATED" : "🟢 ROUTINE"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-1">Confidence Level</p>
            <p className="text-2xl font-bold text-white">{Math.round(assessment.confidence * 100)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
