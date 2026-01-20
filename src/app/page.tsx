export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-8">

        <h1 className="text-2xl font-semibold text-gray-900 text-center">
          Risk Intelligence
        </h1>
        <p className="text-sm text-gray-600 text-center mt-1">
          Pre-transaction UPI Financial Risk Assessment
        </p>

        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700">
            UPI ID
          </label>
          <input
            type="text"
            placeholder="username@bankname"
            className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <p className="text-xs text-gray-500 mt-2">
            Format: username@bankname or email@upiservice.com
          </p>
        </div>

        <button className="mt-6 w-full bg-black text-white py-2 rounded-md text-sm font-medium hover:bg-gray-900">
          Assess Risk
        </button>

        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">
            High Risk – Suspicious Pattern Detected
          </p>
          <p className="text-xs text-red-600 mt-1">
            Advisory based on behavioral and network indicators. Proceed with caution.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Reference ID: RISK-2026-00124
          </p>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          Advisory only. This assessment does not block transactions and is subject
          to verification by authorized systems.
        </p>
      </div>
    </main>
  );
}
