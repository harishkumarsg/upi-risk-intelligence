import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { upiId } = await req.json();

  if (!upiId || typeof upiId !== "string") {
    return NextResponse.json(
      { error: "Invalid UPI ID" },
      { status: 400 }
    );
  }

  const value = upiId.toLowerCase();

  let risk: "LOW" | "MEDIUM" | "HIGH" = "LOW";

  if (value.includes("fraud") || value.includes("test")) {
    risk = "HIGH";
  } else if (value.length < 10) {
    risk = "MEDIUM";
  }

  return NextResponse.json({
    risk,
    referenceId: `RISK-${new Date().getFullYear()}-${Math.floor(
      10000 + Math.random() * 90000
    )}`,
    advisory:
      "Advisory based on behavioral and network indicators. This does not block transactions.",
  });
}
