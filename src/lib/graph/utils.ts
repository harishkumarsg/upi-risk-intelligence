import { TransactionNode, TransactionEdge, GraphData } from "./types";

// Calculate username entropy (complexity score)
export function calculateEntropy(username: string): number {
  if (!username || username.length === 0) return 0;

  const charTypes = {
    lowercase: /[a-z]/.test(username),
    uppercase: /[A-Z]/.test(username),
    numbers: /[0-9]/.test(username),
    special: /[^a-zA-Z0-9]/.test(username),
  };

  const typeCount = Object.values(charTypes).filter(Boolean).length;
  const lengthScore = Math.min(username.length / 15, 1);
  const diversityScore = typeCount / 4;

  // Check for patterns
  const hasRepeatingChars = /(.)\1{2,}/.test(username);
  const hasSequentialNumbers = /\d{4,}/.test(username);
  const patternPenalty = (hasRepeatingChars || hasSequentialNumbers) ? 0.3 : 0;

  return Math.max((lengthScore * 0.4 + diversityScore * 0.6) - patternPenalty, 0);
}

// Generate synthetic fraud dataset
export function generateFraudDataset(): GraphData {
  const nodes: TransactionNode[] = [];
  const edges: TransactionEdge[] = [];

  const handles = ["oksbi", "okhdfc", "okicici", "okaxis", "okpaytm", "okybl", "paytm", "phonepe"];
  const suspiciousHandles = ["quickpay", "fastcash", "ezcash"];

  // Helper to create node
  const createNode = (
    id: string,
    options: {
      isNew?: boolean;
      velocity?: number;
      volume?: number;
      isSuspicious?: boolean;
    } = {}
  ): TransactionNode => {
    const parts = id.split("@");
    const username = parts[0];
    const handle = parts[1] || handles[Math.floor(Math.random() * handles.length)];

    return {
      id,
      username,
      handle: options.isSuspicious
        ? suspiciousHandles[Math.floor(Math.random() * suspiciousHandles.length)]
        : handle,
      metadata: {
        createdAt: options.isNew
          ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Last 7 days
          : new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Last year
        lastActive: new Date(),
        deviceFingerprint: `device-${Math.random().toString(36).substring(7)}`,
        location: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata"][Math.floor(Math.random() * 5)],
      },
      features: {
        transactionCount: options.velocity ? Math.floor(options.velocity * 24) : Math.floor(Math.random() * 50),
        totalVolume: options.volume || Math.floor(Math.random() * 50000),
        avgTransactionAmount: 0,
        velocity: options.velocity || Math.random() * 5,
        entropy: calculateEntropy(username),
        isNewAccount: options.isNew || false,
      },
      riskScore: 0,
      riskLevel: "LOW",
    };
  };

  // 1. LEGITIMATE USERS (baseline)
  for (let i = 0; i < 20; i++) {
    const username = `user${String(i + 1).padStart(3, "0")}`;
    const handle = handles[Math.floor(Math.random() * handles.length)];
    nodes.push(createNode(`${username}@${handle}`));
  }

  // 2. MULE CLUSTER (5-7 connected accounts with high velocity)
  const muleCluster: string[] = [];
  for (let i = 0; i < 6; i++) {
    const id = `mule${i + 1}@${suspiciousHandles[i % suspiciousHandles.length]}`;
    muleCluster.push(id);
    nodes.push(
      createNode(id, {
        isNew: true,
        velocity: 15 + Math.random() * 10,
        volume: 80000 + Math.random() * 50000,
        isSuspicious: true,
      })
    );
  }

  // Connect mule cluster (high transaction volume between them)
  for (let i = 0; i < muleCluster.length; i++) {
    for (let j = i + 1; j < muleCluster.length; j++) {
      if (Math.random() > 0.3) {
        edges.push({
          id: `edge-mule-${i}-${j}`,
          from: muleCluster[i],
          to: muleCluster[j],
          amount: 5000 + Math.random() * 20000,
          timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
          metadata: { category: "transfer" },
        });
      }
    }
  }

  // 3. RING TOPOLOGY (circular fraud)
  const ringAccounts: string[] = [];
  for (let i = 0; i < 5; i++) {
    const id = `ring${i + 1}@${handles[i % handles.length]}`;
    ringAccounts.push(id);
    nodes.push(
      createNode(id, {
        isNew: false,
        velocity: 8 + Math.random() * 5,
        volume: 60000,
      })
    );
  }

  // Create circular flow
  for (let i = 0; i < ringAccounts.length; i++) {
    const from = ringAccounts[i];
    const to = ringAccounts[(i + 1) % ringAccounts.length];
    edges.push({
      id: `edge-ring-${i}`,
      from,
      to,
      amount: 12000 + Math.random() * 3000,
      timestamp: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000),
      metadata: { category: "transfer" },
    });
  }

  // 4. STAR PATTERN (fund distribution hub)
  const hubAccount = "hub001@quickpay";
  nodes.push(
    createNode(hubAccount, {
      isNew: true,
      velocity: 25,
      volume: 200000,
      isSuspicious: true,
    })
  );

  const starRecipients: string[] = [];
  for (let i = 0; i < 8; i++) {
    const id = `recv${i + 1}@${handles[i % handles.length]}`;
    starRecipients.push(id);
    nodes.push(
      createNode(id, {
        isNew: true,
        velocity: 3,
        volume: 15000,
      })
    );

    // Hub distributes similar amounts to all
    edges.push({
      id: `edge-star-${i}`,
      from: hubAccount,
      to: id,
      amount: 8000 + Math.random() * 500, // Similar amounts
      timestamp: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000),
      metadata: { category: "split" },
    });
  }

  // 5. NORMAL TRANSACTIONS (random connections)
  for (let i = 0; i < 30; i++) {
    const fromIdx = Math.floor(Math.random() * 20);
    const toIdx = Math.floor(Math.random() * 20);
    if (fromIdx !== toIdx) {
      edges.push({
        id: `edge-normal-${i}`,
        from: nodes[fromIdx].id,
        to: nodes[toIdx].id,
        amount: 100 + Math.random() * 5000,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        metadata: { category: "payment" },
      });
    }
  }

  // Calculate avg transaction amounts
  nodes.forEach(node => {
    const nodeEdges = edges.filter(e => e.from === node.id || e.to === node.id);
    if (nodeEdges.length > 0) {
      node.features.avgTransactionAmount =
        nodeEdges.reduce((sum, e) => sum + e.amount, 0) / nodeEdges.length;
      node.features.transactionCount = nodeEdges.length;
    }
  });

  return { nodes, edges };
}

// Generate mock incident report data
export function generateIncidentReport(assessment: any) {
  return {
    reportId: `INC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
    generatedAt: new Date().toISOString(),
    summary: {
      upiId: assessment.upiId,
      riskLevel: assessment.riskLevel,
      riskScore: assessment.riskScore,
      confidence: assessment.confidence,
    },
    findings: assessment.reasons,
    detectedPatterns: assessment.detectedPatterns,
    evidence: assessment.evidence,
    networkAnalysis: assessment.networkMetrics,
    recommendations: generateRecommendations(assessment.riskLevel),
    investigationLeads: assessment.investigationLeads,
  };
}

function generateRecommendations(riskLevel: string): string[] {
  const recommendations = {
    HIGH: [
      "IMMEDIATE ACTION: Flag account for manual review",
      "Block further transactions pending investigation",
      "Analyze connected accounts in network cluster",
      "Review transaction history for past 30 days",
      "Escalate to fraud investigation team",
      "Consider account suspension",
    ],
    MEDIUM: [
      "Enhanced monitoring: Track account for 48 hours",
      "Request additional verification documents",
      "Review transaction patterns for anomalies",
      "Check for linked accounts or devices",
      "Set transaction velocity limits",
    ],
    LOW: [
      "Continue standard monitoring",
      "No immediate action required",
      "Maintain in watch list for pattern changes",
    ],
  };

  return recommendations[riskLevel as keyof typeof recommendations] || recommendations.LOW;
}
