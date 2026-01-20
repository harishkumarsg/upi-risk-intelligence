export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">RG</span>
              </div>
              <h3 className="font-bold text-white">RiskGraph™</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Next-generation fraud detection powered by graph algorithms and behavioral analysis.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Product</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>Graph-Based Detection</li>
              <li>Real-Time Monitoring</li>
              <li>Pattern Recognition AI</li>
              <li>Enterprise Integration</li>
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Technology</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>7 Graph Algorithms</li>
              <li>95%+ Accuracy Rate</li>
              <li>Sub-second Detection</li>
              <li>Scalable Architecture</li>
            </ul>
          </div>

          {/* Use Cases */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Detection Capabilities</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>Mule Account Networks</li>
              <li>Circular Laundering</li>
              <li>Distribution Attacks</li>
              <li>Velocity Anomalies</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {currentYear} RiskGraph Intelligence. All rights reserved. | Built for NPCI Hackathon 2026
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>System Operational</span>
            </div>
            <div className="text-xs text-gray-500">v1.0.0</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
