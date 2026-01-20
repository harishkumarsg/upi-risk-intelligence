import { NextResponse } from "next/server";
import { GraphEngine } from "@/lib/graph/engine";
import { generateFraudDataset, generateIncidentReport } from "@/lib/graph/utils";

// Initialize with synthetic fraud data
const graphData = generateFraudDataset();
const graphEngine = new GraphEngine(graphData);

export async function POST(req: Request) {
  try {
    const { upiId } = await req.json();

    if (!upiId) {
      return NextResponse.json(
        { error: "UPI ID required" },
        { status: 400 }
      );
    }

    const assessment = graphEngine.analyzeAccount(upiId);

    if (!assessment) {
      return NextResponse.json(
        { error: "Account not found in transaction graph" },
        { status: 404 }
      );
    }

    const report = generateIncidentReport(assessment);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
