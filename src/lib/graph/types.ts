export interface TransactionNode {
  id: string; // UPI ID
  username: string;
  handle: string;
  metadata: {
    createdAt: Date;
    lastActive: Date;
    deviceFingerprint?: string;
    location?: string;
  };
  features: {
    transactionCount: number;
    totalVolume: number;
    avgTransactionAmount: number;
    velocity: number; // transactions per hour
    entropy: number; // username complexity score
    isNewAccount: boolean;
  };
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
}

export interface TransactionEdge {
  id: string;
  from: string; // source UPI ID
  to: string; // target UPI ID
  amount: number;
  timestamp: Date;
  metadata: {
    description?: string;
    category?: string;
  };
}

export interface FraudPattern {
  type: "MULE_CLUSTER" | "RING_TOPOLOGY" | "STAR_PATTERN" | "VELOCITY_ANOMALY" | "SYNTHETIC_IDENTITY";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  confidence: number; // 0-1
  accounts: string[]; // involved UPI IDs
  evidence: string[];
  description: string;
  detectedAt: Date;
}

export interface RiskAssessment {
  upiId: string;
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  confidence: number;
  reasons: string[];
  detectedPatterns: FraudPattern[];
  networkMetrics: {
    degree: number; // number of connections
    betweenness: number; // how central in network
    clustering: number; // how connected neighbors are
    pageRank: number;
  };
  behavioralFlags: {
    highVelocity: boolean;
    lowEntropy: boolean;
    unusualTiming: boolean;
    suspiciousHandle: boolean;
    newAccount: boolean;
  };
  investigationLeads: string[];
  evidence: Evidence[];
}

export interface Evidence {
  type: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  timestamp?: Date;
  relatedAccounts?: string[];
}

export interface GraphData {
  nodes: TransactionNode[];
  edges: TransactionEdge[];
}
