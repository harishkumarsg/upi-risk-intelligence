"use client";

import { useState, useEffect } from "react";

interface LandingPageProps {
  onEnterDemo: () => void;
}

export default function LandingPage({ onEnterDemo }: LandingPageProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  
  const phrases = [
    "Detect Mule Accounts",
    "Map Fraud Networks",
    "Stop Money Laundering",
    "Protect Your Customers"
  ];

  useEffect(() => {
    const phrase = phrases[currentPhraseIndex];
    let currentIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (currentIndex <= phrase.length) {
        setDisplayText(phrase.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [currentPhraseIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold">R</span>
              </div>
              <span className="text-xl font-bold">RiskGraph Intelligence™</span>
            </div>
            <button
              onClick={onEnterDemo}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition border border-white/20"
            >
              Enter Dashboard →
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <div className="inline-block px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-sm">
              🏆 Powered by Graph AI • Built for SOC Teams
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {displayText}
              </span>
              <span className="animate-pulse">|</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Graph-powered fraud detection for UPI networks. Don't chase transactions—
              <span className="text-blue-400 font-semibold"> map entire criminal networks</span>.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={onEnterDemo}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-lg font-semibold shadow-xl shadow-blue-500/30 transition transform hover:scale-105"
              >
                Start Live Demo →
              </button>
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-lg text-lg font-semibold border border-white/20 transition">
                Watch 2-Min Overview
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400">95%</div>
                <div className="text-sm text-gray-400 mt-1">Detection Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400">60%</div>
                <div className="text-sm text-gray-400 mt-1">Fraud Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400">15min</div>
                <div className="text-sm text-gray-400 mt-1">Investigation Time</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose RiskGraph?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 hover:bg-white/10 transition">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🕸️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Graph-Native Detection</h3>
              <p className="text-gray-400">
                Analyze transaction networks with 7 graph algorithms. Detect mule clusters, rings, and hubs that traditional systems miss.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 hover:bg-white/10 transition">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Explainable AI</h3>
              <p className="text-gray-400">
                Every alert comes with evidence chains, confidence scores, and investigation leads. No black boxes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 hover:bg-white/10 transition">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">SOC-Ready Output</h3>
              <p className="text-gray-400">
                One-click PDF reports, JSON exports, and actionable recommendations. Built for enterprise security teams.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h4 className="font-semibold mb-2">Ingest Transactions</h4>
              <p className="text-sm text-gray-400">Real-time UPI transaction stream</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h4 className="font-semibold mb-2">Build Graph</h4>
              <p className="text-sm text-gray-400">Construct network from accounts and flows</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h4 className="font-semibold mb-2">Detect Patterns</h4>
              <p className="text-sm text-gray-400">Graph algorithms find fraud rings</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h4 className="font-semibold mb-2">Alert & Report</h4>
              <p className="text-sm text-gray-400">Evidence-ready investigation packages</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-12">
            <h2 className="text-4xl font-bold mb-4">Ready to See It in Action?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Experience graph-powered fraud detection. Live demo with real patterns.
            </p>
            <button
              onClick={onEnterDemo}
              className="px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-xl font-semibold shadow-2xl shadow-blue-500/40 transition transform hover:scale-105"
            >
              Launch Dashboard Now →
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-20">
          <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-400 text-sm">
            <p>© 2026 RiskGraph Intelligence™ • Built for Cybersecurity Hackathon</p>
            <p className="mt-2">Powered by Graph AI • Enterprise-Grade Fraud Detection</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
