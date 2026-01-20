import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { upiId } = await req.json();

  // Basic validation
  if (!upiId || typeof upiId !== "string") {
    return NextResponse.json(
      { error: "Invalid UPI ID" },
      { status: 400 }
    );
  }

  const value = upiId.toLowerCase().trim();
  const parts = value.split("@");
  const username = parts[0];
  const handle = parts[1];

  let risk: "LOW" | "MEDIUM" | "HIGH" = "LOW";
  let reasons: string[] = [];

  // 1. Known suspicious keywords
  if (value.includes("fraud") || value.includes("test")) {
    risk = "HIGH";
    reasons.push("Known suspicious identifier patterns");
  }

  // 2. Unknown or low-trust UPI handles
  const knownHandles = [
    "oksbi",
    "okhdfc",
    "okicici",
    "okaxis",
    "okpaytm",
    "okybl",
  ];

  if (!handle || !knownHandles.includes(handle)) {
    if (risk !== "HIGH") risk = "MEDIUM";
    reasons.push("Unrecognized or low-trust UPI handle");
  }

  // 3. Low-entropy or generic usernames
  if (username.length <= 4) {
    if (risk !== "HIGH") risk = "MEDIUM";
    reasons.push("Low-entropy identifier");
  }

  // 4. Default safe case
  if (reasons.length === 0) {
    reasons.push("No anomalous behavioral signals detected");
  }

  return NextResponse.json({
    risk,
    reasons,
    referenceId: `RISK-${new Date().getFullYear()}-${Math.floor(
      10000 + Math.random() * 90000
    )}`,
  });
}
