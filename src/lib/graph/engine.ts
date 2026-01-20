import { TransactionNode, TransactionEdge, GraphData, FraudPattern, RiskAssessment, Evidence } from "./types";

export class GraphEngine {
  private nodes: Map<string, TransactionNode> = new Map();
  private edges: TransactionEdge[] = [];
  private adjacencyList: Map<string, Set<string>> = new Map();

  constructor(data?: GraphData) {
    if (data) {
      this.loadData(data);
    }
  }

  loadData(data: GraphData) {
    this.nodes.clear();
    this.edges = [];
    this.adjacencyList.clear();

    data.nodes.forEach(node => {
      this.nodes.set(node.id, node);
      this.adjacencyList.set(node.id, new Set());
    });

    data.edges.forEach(edge => {
      this.edges.push(edge);
      this.adjacencyList.get(edge.from)?.add(edge.to);
      this.adjacencyList.get(edge.to)?.add(edge.from);
    });
  }

  // Calculate degree centrality (number of connections)
  getDegree(nodeId: string): number {
    return this.adjacencyList.get(nodeId)?.size || 0;
  }

  // Calculate clustering coefficient (how connected are neighbors)
  getClusteringCoefficient(nodeId: string): number {
    const neighbors = this.adjacencyList.get(nodeId);
    if (!neighbors || neighbors.size < 2) return 0;

    let connections = 0;
    const neighborArray = Array.from(neighbors);

    for (let i = 0; i < neighborArray.length; i++) {
      for (let j = i + 1; j < neighborArray.length; j++) {
        if (this.adjacencyList.get(neighborArray[i])?.has(neighborArray[j])) {
          connections++;
        }
      }
    }

    const maxConnections = (neighbors.size * (neighbors.size - 1)) / 2;
    return maxConnections > 0 ? connections / maxConnections : 0;
  }

  // Calculate betweenness centrality (simplified - how many shortest paths go through this node)
  getBetweenness(nodeId: string): number {
    // Simplified version - counts how many nodes this node connects indirectly
    const neighbors = this.adjacencyList.get(nodeId);
    if (!neighbors) return 0;

    let indirectConnections = 0;
    neighbors.forEach(neighbor => {
      const neighborsOfNeighbor = this.adjacencyList.get(neighbor);
      if (neighborsOfNeighbor) {
        indirectConnections += neighborsOfNeighbor.size;
      }
    });

    return indirectConnections / Math.max(this.nodes.size, 1);
  }

  // PageRank algorithm (simplified)
  getPageRank(nodeId: string, iterations = 10): number {
    const dampingFactor = 0.85;
    const ranks = new Map<string, number>();
    
    // Initialize
    this.nodes.forEach((_, id) => ranks.set(id, 1 / this.nodes.size));

    // Iterate
    for (let i = 0; i < iterations; i++) {
      const newRanks = new Map<string, number>();
      
      this.nodes.forEach((_, id) => {
        let rank = (1 - dampingFactor) / this.nodes.size;
        
        // Sum contributions from incoming edges
        this.edges.forEach(edge => {
          if (edge.to === id) {
            const sourceRank = ranks.get(edge.from) || 0;
            const sourceOutDegree = this.edges.filter(e => e.from === edge.from).length;
            rank += dampingFactor * (sourceRank / Math.max(sourceOutDegree, 1));
          }
        });
        
        newRanks.set(id, rank);
      });
      
      newRanks.forEach((rank, id) => ranks.set(id, rank));
    }

    return ranks.get(nodeId) || 0;
  }

  // Detect mule account clusters using connected components
  detectMuleClusters(): FraudPattern[] {
    const visited = new Set<string>();
    const clusters: FraudPattern[] = [];

    const dfs = (nodeId: string, cluster: Set<string>) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      cluster.add(nodeId);

      const neighbors = this.adjacencyList.get(nodeId);
      neighbors?.forEach(neighbor => {
        if (!visited.has(neighbor)) {
          dfs(neighbor, cluster);
        }
      });
    };

    this.nodes.forEach((node, nodeId) => {
      if (!visited.has(nodeId)) {
        const cluster = new Set<string>();
        dfs(nodeId, cluster);

        // Flag clusters with suspicious characteristics
        if (cluster.size >= 3) {
          const accounts = Array.from(cluster);
          const totalVolume = accounts.reduce((sum, id) => {
            return sum + (this.nodes.get(id)?.features.totalVolume || 0);
          }, 0);

          const avgVelocity = accounts.reduce((sum, id) => {
            return sum + (this.nodes.get(id)?.features.velocity || 0);
          }, 0) / accounts.length;

          const evidence = [];
          let severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" = "MEDIUM";

          if (cluster.size >= 5) {
            evidence.push(`Large cluster of ${cluster.size} connected accounts`);
            severity = "HIGH";
          }
          if (avgVelocity > 10) {
            evidence.push(`High transaction velocity: ${avgVelocity.toFixed(1)} tx/hour`);
            severity = "CRITICAL";
          }
          if (totalVolume > 100000) {
            evidence.push(`High total volume: ₹${totalVolume.toLocaleString()}`);
            severity = severity === "CRITICAL" ? "CRITICAL" : "HIGH";
          }

          if (evidence.length > 0) {
            clusters.push({
              type: "MULE_CLUSTER",
              severity,
              confidence: Math.min(0.6 + (cluster.size / 10) * 0.3, 0.95),
              accounts,
              evidence,
              description: `Detected cluster of ${cluster.size} potentially colluding accounts with coordinated transaction patterns`,
              detectedAt: new Date(),
            });
          }
        }
      }
    });

    return clusters;
  }

  // Detect ring/circular fraud patterns
  detectRingTopology(): FraudPattern[] {
    const rings: FraudPattern[] = [];
    const visited = new Set<string>();

    const findCycle = (start: string, current: string, path: string[], pathSet: Set<string>): boolean => {
      if (path.length > 10) return false; // Limit cycle length

      const neighbors = this.adjacencyList.get(current);
      if (!neighbors) return false;

      for (const neighbor of neighbors) {
        if (neighbor === start && path.length >= 3) {
          // Found a cycle
          const totalAmount = this.edges
            .filter(e => pathSet.has(e.from) && pathSet.has(e.to))
            .reduce((sum, e) => sum + e.amount, 0);

          rings.push({
            type: "RING_TOPOLOGY",
            severity: path.length >= 5 ? "CRITICAL" : "HIGH",
            confidence: 0.85,
            accounts: [...path, start],
            evidence: [
              `Circular money flow detected through ${path.length} accounts`,
              `Total amount in ring: ₹${totalAmount.toLocaleString()}`,
              `Classic money laundering pattern`,
            ],
            description: `Ring topology detected: Funds flow in circular pattern through ${path.length} accounts, indicating money laundering`,
            detectedAt: new Date(),
          });
          return true;
        }

        if (!pathSet.has(neighbor)) {
          pathSet.add(neighbor);
          path.push(neighbor);
          if (findCycle(start, neighbor, path, pathSet)) {
            return true;
          }
          path.pop();
          pathSet.delete(neighbor);
        }
      }

      return false;
    };

    this.nodes.forEach((_, nodeId) => {
      if (!visited.has(nodeId)) {
        findCycle(nodeId, nodeId, [nodeId], new Set([nodeId]));
        visited.add(nodeId);
      }
    });

    return rings;
  }

  // Detect star pattern (one account sending to many)
  detectStarPattern(): FraudPattern[] {
    const stars: FraudPattern[] = [];

    this.nodes.forEach((node, nodeId) => {
      const outgoing = this.edges.filter(e => e.from === nodeId);
      const uniqueRecipients = new Set(outgoing.map(e => e.to));

      if (uniqueRecipients.size >= 5) {
        const totalAmount = outgoing.reduce((sum, e) => sum + e.amount, 0);
        const avgAmount = totalAmount / outgoing.length;

        // Check if amounts are similar (split pattern)
        const amounts = outgoing.map(e => e.amount);
        const variance = amounts.reduce((sum, amt) => sum + Math.pow(amt - avgAmount, 2), 0) / amounts.length;
        const isSplitPattern = variance < avgAmount * 0.3; // Low variance = similar amounts

        if (isSplitPattern) {
          stars.push({
            type: "STAR_PATTERN",
            severity: uniqueRecipients.size >= 10 ? "CRITICAL" : "HIGH",
            confidence: 0.78,
            accounts: [nodeId, ...Array.from(uniqueRecipients)],
            evidence: [
              `Account distributing funds to ${uniqueRecipients.size} recipients`,
              `Total distributed: ₹${totalAmount.toLocaleString()}`,
              `Similar transaction amounts suggest coordinated splitting`,
              `Classic fund distribution to mule accounts`,
            ],
            description: `Star pattern detected: Central account ${nodeId} distributing funds to ${uniqueRecipients.size} accounts with similar amounts`,
            detectedAt: new Date(),
          });
        }
      }
    });

    return stars;
  }

  // Analyze a specific UPI ID
  analyzeAccount(upiId: string): RiskAssessment | null {
    const node = this.nodes.get(upiId);
    if (!node) return null;

    const degree = this.getDegree(upiId);
    const betweenness = this.getBetweenness(upiId);
    const clustering = this.getClusteringCoefficient(upiId);
    const pageRank = this.getPageRank(upiId);

    const reasons: string[] = [];
    const evidence: Evidence[] = [];
    const behavioralFlags = {
      highVelocity: node.features.velocity > 10,
      lowEntropy: node.features.entropy < 0.3,
      unusualTiming: false, // Would check timestamp patterns
      suspiciousHandle: !["oksbi", "okhdfc", "okicici", "okaxis", "okpaytm", "okybl"].includes(node.handle),
      newAccount: node.features.isNewAccount,
    };

    // Calculate risk score
    let riskScore = 0;

    if (behavioralFlags.highVelocity) {
      riskScore += 25;
      reasons.push(`High transaction velocity: ${node.features.velocity.toFixed(1)} tx/hour`);
      evidence.push({
        type: "VELOCITY_ANOMALY",
        description: `Account shows abnormally high transaction frequency`,
        severity: "HIGH",
      });
    }

    if (behavioralFlags.lowEntropy) {
      riskScore += 15;
      reasons.push(`Low-entropy username pattern`);
      evidence.push({
        type: "IDENTITY_PATTERN",
        description: `Username complexity suggests automated/bulk account creation`,
        severity: "MEDIUM",
      });
    }

    if (behavioralFlags.suspiciousHandle) {
      riskScore += 10;
      reasons.push(`Unrecognized or low-trust UPI handle`);
    }

    if (behavioralFlags.newAccount) {
      riskScore += 15;
      reasons.push(`Newly created account with immediate activity`);
      evidence.push({
        type: "SYNTHETIC_IDENTITY",
        description: `Account created recently, typical of disposable mule accounts`,
        severity: "MEDIUM",
      });
    }

    if (degree >= 10) {
      riskScore += 20;
      reasons.push(`High network connectivity: ${degree} connections`);
      evidence.push({
        type: "NETWORK_ANOMALY",
        description: `Unusually high number of transaction partners`,
        severity: "HIGH",
      });
    }

    if (betweenness > 0.5) {
      riskScore += 15;
      reasons.push(`Central position in transaction network (hub account)`);
      evidence.push({
        type: "STRUCTURAL_ANOMALY",
        description: `Account acts as intermediary in transaction chains`,
        severity: "HIGH",
      });
    }

    // Detect patterns involving this account
    const detectedPatterns: FraudPattern[] = [];
    const muleClusters = this.detectMuleClusters();
    const rings = this.detectRingTopology();
    const stars = this.detectStarPattern();

    [...muleClusters, ...rings, ...stars].forEach(pattern => {
      if (pattern.accounts.includes(upiId)) {
        detectedPatterns.push(pattern);
        riskScore += 20;
        reasons.push(`Involved in ${pattern.type.replace(/_/g, " ").toLowerCase()}`);
      }
    });

    const riskLevel: "LOW" | "MEDIUM" | "HIGH" = riskScore >= 70 ? "HIGH" : riskScore >= 40 ? "MEDIUM" : "LOW";

    const investigationLeads = Array.from(this.adjacencyList.get(upiId) || [])
      .slice(0, 5)
      .map(id => `Check connected account: ${id}`);

    if (reasons.length === 0) {
      reasons.push("No anomalous behavioral signals detected");
    }

    return {
      upiId,
      riskScore: Math.min(riskScore, 100),
      riskLevel,
      confidence: detectedPatterns.length > 0 ? 0.85 : 0.65,
      reasons,
      detectedPatterns,
      networkMetrics: {
        degree,
        betweenness,
        clustering,
        pageRank,
      },
      behavioralFlags,
      investigationLeads,
      evidence,
    };
  }

  getGraphData(): GraphData {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: this.edges,
    };
  }

  getAllPatterns(): FraudPattern[] {
    return [
      ...this.detectMuleClusters(),
      ...this.detectRingTopology(),
      ...this.detectStarPattern(),
    ];
  }
}
