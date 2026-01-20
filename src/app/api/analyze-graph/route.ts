import { NextResponse } from "next/server";
import { GraphEngine } from "@/lib/graph/engine";
import { generateFraudDataset } from "@/lib/graph/utils";

// Initialize with synthetic fraud data
const graphData = generateFraudDataset();
const graphEngine = new GraphEngine(graphData);

export async function GET() {
  try {
    // Get all fraud patterns
    const patterns = graphEngine.getAllPatterns();
    const graphDataResponse = graphEngine.getGraphData();

    return NextResponse.json({
      success: true,
      graph: {
        nodes: graphDataResponse.nodes.map(node => ({
          id: node.id,
          username: node.username,
          handle: node.handle,
          riskScore: 0, // Will be calculated
          riskLevel: "LOW",
          features: node.features,
          metadata: {
            ...node.metadata,
            createdAt: node.metadata.createdAt.toISOString(),
            lastActive: node.metadata.lastActive.toISOString(),
          },
        })),
        edges: graphDataResponse.edges.map(edge => ({
          id: edge.id,
          from: edge.from,
          to: edge.to,
          amount: edge.amount,
          timestamp: edge.timestamp.toISOString(),
          metadata: edge.metadata,
        })),
      },
      patterns: patterns.map(p => ({
        ...p,
        detectedAt: p.detectedAt.toISOString(),
      })),
      statistics: {
        totalNodes: graphDataResponse.nodes.length,
        totalEdges: graphDataResponse.edges.length,
        totalPatterns: patterns.length,
        criticalPatterns: patterns.filter(p => p.severity === "CRITICAL").length,
        highRiskPatterns: patterns.filter(p => p.severity === "HIGH").length,
      },
    });
  } catch (error) {
    console.error("Graph analysis error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    return NextResponse.json({
      success: true,
      assessment,
    });
  } catch (error) {
    console.error("Account analysis error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
