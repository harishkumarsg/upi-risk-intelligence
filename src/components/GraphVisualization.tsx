"use client";

import { useEffect, useRef, useState } from "react";

interface Node {
  id: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  features: {
    velocity: number;
    isNewAccount: boolean;
    totalVolume: number;
  };
}

interface Edge {
  id: string;
  from: string;
  to: string;
  amount: number;
}

interface GraphVisualizationProps {
  nodes: Node[];
  edges: Edge[];
  highlightedNodes?: string[];
  onNodeClick?: (nodeId: string) => void;
}

export default function GraphVisualization({
  nodes,
  edges,
  highlightedNodes = [],
  onNodeClick,
}: GraphVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [simulation, setSimulation] = useState<{
    nodes: Node[];
    running: boolean;
  }>({ nodes: [], running: true });
  const [isFrozen, setIsFrozen] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Initialize nodes with random positions
    const simNodes: Node[] = nodes.map((node) => ({
      ...node,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: 0,
      vy: 0,
    }));

    setSimulation({ nodes: simNodes, running: true });

    // Force-directed layout simulation
    let frameId: number;
    const animate = () => {
      // Apply forces
      const alpha = 0.3;
      const linkDistance = 100;
      const linkStrength = 0.3;
      const chargeStrength = -300;
      const centerStrength = 0.05;

      // Link force
      edges.forEach((edge) => {
        const source = simNodes.find((n) => n.id === edge.from);
        const target = simNodes.find((n) => n.id === edge.to);
        if (!source || !target || !source.x || !source.y || !target.x || !target.y) return;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (distance - linkDistance) * linkStrength;

        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;

        source.vx = (source.vx || 0) + fx;
        source.vy = (source.vy || 0) + fy;
        target.vx = (target.vx || 0) - fx;
        target.vy = (target.vy || 0) - fy;
      });

      // Charge force (repulsion)
      for (let i = 0; i < simNodes.length; i++) {
        for (let j = i + 1; j < simNodes.length; j++) {
          const a = simNodes[i];
          const b = simNodes[j];
          if (!a.x || !a.y || !b.x || !b.y) continue;

          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = chargeStrength / (distance * distance);

          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;

          a.vx = (a.vx || 0) - fx;
          a.vy = (a.vy || 0) - fy;
          b.vx = (b.vx || 0) + fx;
          b.vy = (b.vy || 0) + fy;
        }
      }

      // Center force
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      simNodes.forEach((node) => {
        if (!node.x || !node.y) return;
        node.vx = (node.vx || 0) + (centerX - node.x) * centerStrength;
        node.vy = (node.vy || 0) + (centerY - node.y) * centerStrength;
      });

      // Update positions (only if not frozen)
      if (!isFrozen) {
        simNodes.forEach((node) => {
          if (!node.x || !node.y) return;
          node.vx = (node.vx || 0) * 0.8; // Damping
          node.vy = (node.vy || 0) * 0.8;
          node.x += (node.vx || 0) * alpha;
          node.y += (node.vy || 0) * alpha;

          // Boundary conditions
          node.x = Math.max(30, Math.min(canvas.width - 30, node.x));
          node.y = Math.max(30, Math.min(canvas.height - 30, node.y));
        });
      }

      // Clear canvas
      ctx.fillStyle = "#111827";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw edges
      ctx.strokeStyle = "#374151";
      ctx.lineWidth = 1;
      edges.forEach((edge) => {
        const source = simNodes.find((n) => n.id === edge.from);
        const target = simNodes.find((n) => n.id === edge.to);
        if (!source || !target || !source.x || !source.y || !target.x || !target.y) return;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      });

      // Draw nodes
      simNodes.forEach((node) => {
        if (!node.x || !node.y) return;

        const isHighlighted = highlightedNodes.includes(node.id);
        const isHighVelocity = node.features.velocity > 10;
        const isNew = node.features.isNewAccount;

        // Determine node color
        let color = "#10b981"; // Green - normal
        if (isHighlighted) {
          color = "#ef4444"; // Red - highlighted
        } else if (isHighVelocity) {
          color = "#f59e0b"; // Orange - high velocity
        } else if (isNew) {
          color = "#eab308"; // Yellow - new account
        }

        // Draw node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, isHighlighted ? 8 : 6, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();

        // Draw border for highlighted
        if (isHighlighted) {
          ctx.strokeStyle = "#fbbf24";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Draw label for highlighted nodes
        if (isHighlighted) {
          ctx.fillStyle = "#fff";
          ctx.font = "10px monospace";
          ctx.fillText(node.id.split("@")[0], node.x + 10, node.y - 10);
        }
      });

      frameId = requestAnimationFrame(animate);
    };

    animate();

    // Handle canvas click
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Find clicked node
      const clickedNode = simNodes.find((node) => {
        if (!node.x || !node.y) return false;
        const dx = x - node.x;
        const dy = y - node.y;
        return Math.sqrt(dx * dx + dy * dy) < 10;
      });

      if (clickedNode && onNodeClick) {
        onNodeClick(clickedNode.id);
      }
    };

    canvas.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(frameId);
      canvas.removeEventListener("click", handleClick);
    };
  }, [nodes, edges, highlightedNodes, onNodeClick, isFrozen]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-lg border border-gray-700 bg-gray-900"
        style={{ height: "600px" }}
      />
      <div className="absolute top-4 left-4">
        <button
          onClick={() => setIsFrozen(!isFrozen)}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            isFrozen
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isFrozen ? "▶ Resume Animation" : "⏸ Freeze Graph"}
        </button>
      </div>
      <div className="absolute top-4 right-4 bg-gray-800/90 rounded-lg p-3 text-xs space-y-2 border border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>High Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span>High Velocity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>New Account</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Normal</span>
        </div>
      </div>
    </div>
  );
}
