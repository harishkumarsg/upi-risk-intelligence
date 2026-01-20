import { jsPDF } from "jspdf";

export function exportToPDF(assessment: any) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(30, 58, 138); // Blue
  doc.text("RiskGraph Intelligence™", pageWidth / 2, y, { align: "center" });
  
  y += 8;
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text("Fraud Investigation Report", pageWidth / 2, y, { align: "center" });

  y += 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, y, pageWidth - 20, y);
  y += 10;

  // Reference ID
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Reference: ${assessment.referenceId}`, 20, y);
  y += 5;
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, y);
  y += 10;

  // Risk Score
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Risk Assessment", 20, y);
  y += 8;

  doc.setFontSize(11);
  const riskColor = assessment.risk === "HIGH" ? [220, 38, 38] : assessment.risk === "MEDIUM" ? [245, 158, 11] : [16, 185, 129];
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.text(`Risk Level: ${assessment.risk}`, 25, y);
  y += 6;
  doc.setTextColor(0, 0, 0);
  doc.text(`Risk Score: ${assessment.riskScore}/100`, 25, y);
  y += 6;
  doc.text(`Confidence: ${Math.round(assessment.confidence * 100)}%`, 25, y);
  y += 10;

  // Findings
  if (assessment.reasons && assessment.reasons.length > 0) {
    doc.setFontSize(14);
    doc.text("Detection Findings", 20, y);
    y += 8;

    doc.setFontSize(10);
    assessment.reasons.forEach((reason: string, idx: number) => {
      const lines = doc.splitTextToSize(`${idx + 1}. ${reason}`, pageWidth - 50);
      doc.text(lines, 25, y);
      y += lines.length * 5;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    y += 5;
  }

  // Detected Patterns
  if (assessment.detectedPatterns && assessment.detectedPatterns.length > 0) {
    if (y > 220) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.text("Detected Fraud Patterns", 20, y);
    y += 8;

    assessment.detectedPatterns.forEach((pattern: any, idx: number) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(11);
      doc.setTextColor(220, 38, 38);
      doc.text(`${idx + 1}. ${pattern.type.replace(/_/g, " ")}`, 25, y);
      y += 6;

      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      const descLines = doc.splitTextToSize(pattern.description, pageWidth - 55);
      doc.text(descLines, 30, y);
      y += descLines.length * 4;

      doc.setTextColor(0, 0, 0);
      doc.text(`Severity: ${pattern.severity} | Confidence: ${Math.round(pattern.confidence * 100)}%`, 30, y);
      y += 5;

      pattern.evidence.forEach((ev: string) => {
        const evLines = doc.splitTextToSize(`• ${ev}`, pageWidth - 60);
        doc.text(evLines, 35, y);
        y += evLines.length * 4;
      });
      y += 5;
    });
  }

  // Network Metrics
  if (assessment.networkMetrics) {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Network Analysis", 20, y);
    y += 8;

    doc.setFontSize(10);
    doc.text(`Connections: ${assessment.networkMetrics.degree}`, 25, y);
    y += 5;
    doc.text(`Centrality: ${assessment.networkMetrics.betweenness.toFixed(3)}`, 25, y);
    y += 5;
    doc.text(`Clustering Coefficient: ${assessment.networkMetrics.clustering.toFixed(3)}`, 25, y);
    y += 5;
    doc.text(`PageRank: ${assessment.networkMetrics.pageRank.toFixed(4)}`, 25, y);
    y += 10;
  }

  // Investigation Leads
  if (assessment.investigationLeads && assessment.investigationLeads.length > 0) {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.text("Investigation Leads", 20, y);
    y += 8;

    doc.setFontSize(10);
    assessment.investigationLeads.forEach((lead: string, idx: number) => {
      doc.text(`${idx + 1}. ${lead}`, 25, y);
      y += 5;
    });
  }

  // Footer
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `RiskGraph Intelligence™ - Confidential - Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Save
  doc.save(`fraud-report-${assessment.referenceId}.pdf`);
}

export function exportToJSON(assessment: any) {
  const dataStr = JSON.stringify(assessment, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `fraud-report-${assessment.referenceId}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
