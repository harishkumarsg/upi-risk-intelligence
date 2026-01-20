"use client";

import { useState } from "react";

type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | null;

export default function Home() {
  const [upiId, setUpiId] = useState("");
  const [risk, setRisk] = useState<RiskLevel>(null);

  const assessRisk = async () => {
  if (!upiId) {
    setRisk(null);
    return;
  }

  try {
    const res = await fetch("/api/check-risk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ upiId }),
    });

    const data = await res.json();
    setRisk(data.risk);
  } catch (error) {
    console.error("Risk API error:", error);
    setRisk(null);
  }
};


  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-8">

        <h1 className="text-2xl font-semibold text-gray-900 text-center">
          Risk Intelligence
        </h1>
        <p className="text-sm text-gray-600 text-center mt-1">
          Pre-transaction UPI Financial Risk Assessment
        </p>
        <p className="text-xs text-gray-500 text-center mt-1">
          Designed for integration at bank and payment-network level
        </p>

        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700">
            UPI ID
          </label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="username@bankname"
            className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <p className="text-xs text-gray-500 mt-2">
            Format: username@bankname or email@upiservice.com
          </p>
        </div>

        <button
          onClick={assessRisk}
          className="mt-6 w-full bg-black text-white py-2 rounded-md text-sm font-medium hover:bg-gray-900"
        >
          Assess Risk
        </button>

        {/* Risk Result */}
        {risk && (
          <div
            className={`mt-6 rounded-md border p-4 ${
              risk === "HIGH"
                ? "border-red-200 bg-red-50"
                : risk === "MEDIUM"
                ? "border-yellow-200 bg-yellow-50"
                : "border-green-200 bg-green-50"
            }`}
          >
            <p
              className={`text-sm font-semibold ${
                risk === "HIGH"
                  ? "text-red-700"
                  : risk === "MEDIUM"
                  ? "text-yellow-700"
                  : "text-green-700"
              }`}
            >
              {risk === "HIGH"
                ? "High Risk – Suspicious Pattern Detected"
                : risk === "MEDIUM"
                ? "Medium Risk – Unusual Activity Observed"
                : "Low Risk – No Suspicious Patterns Detected"}
            </p>

            <p className="text-xs mt-1 text-gray-600">
              Advisory based on behavioral and network indicators. Proceed with
              appropriate caution.
            </p>

            <p className="text-xs text-gray-500 mt-2">
              Reference ID: RISK-{new Date().getFullYear()}-
              {Math.floor(10000 + Math.random() * 90000)}
            </p>
          </div>
        )}

        <p className="text-xs text-gray-400 text-center mt-6">
          Advisory only. This assessment does not block transactions and is
          subject to verification by authorized systems.
        </p>
      </div>
    </main>
  );
}
