import { NextResponse } from "next/server";
import { GraphEngine } from "@/lib/graph/engine";
import { generateFraudDataset, generateIncidentReport } from "@/lib/graph/utils";

// Initialize with synthetic fraud data
const graphData = generateFraudDataset();
const graphEngine = new GraphEngine(graphData);

export async function POST(req: Request) {
  try {
    const { upiId } = await req.json();

    // Basic validation
    if (!upiId || typeof upiId !== "string") {
      return NextResponse.json(
        { error: "Invalid UPI ID" },
        { status: 400 }
      );
    }

    const value = upiId.toLowerCase().trim();

    // Perform graph-based analysis
    const assessment = graphEngine.analyzeAccount(value);

    if (!assessment) {
      // Account not in graph - basic validation
      const parts = value.split("@");
      const username = parts[0];
      const handle = parts[1];

      let risk: "LOW" | "MEDIUM" | "HIGH" = "LOW";
      let reasons: string[] = [];

      const knownHandles = ["oksbi", "okhdfc", "okicici", "okaxis", "okpaytm", "okybl"];

      if (value.includes("fraud") || value.includes("test")) {
        risk = "HIGH";
        reasons.push("Known suspicious identifier patterns");
      } else if (!handle || !knownHandles.includes(handle)) {
        risk = "MEDIUM";
        reasons.push("Unrecognized or low-trust UPI handle");
      } else if (username.length <= 4) {
        risk = "MEDIUM";
        reasons.push("Low-entropy identifier");
      } else {
        reasons.push("No anomalous behavioral signals detected");
      }

      return NextResponse.json({
        risk,
        reasons,
        referenceId: `RISK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        inGraph: false,
      });
    }

    // Return full assessment with graph analysis
    return NextResponse.json({
      risk: assessment.riskLevel,
      riskScore: assessment.riskScore,
      confidence: assessment.confidence,
      reasons: assessment.reasons,
      detectedPatterns: assessment.detectedPatterns,
      networkMetrics: assessment.networkMetrics,
      behavioralFlags: assessment.behavioralFlags,
      investigationLeads: assessment.investigationLeads,
      evidence: assessment.evidence,
      referenceId: `RISK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      inGraph: true,
      fullAssessment: assessment,
    });
  } catch (error) {
    console.error("Risk assessment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
