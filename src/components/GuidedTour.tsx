"use client";

import { useState, useEffect } from "react";

interface TourStep {
  target: string;
  title: string;
  content: string;
  position: "top" | "bottom" | "left" | "right";
}

const tourSteps: TourStep[] = [
  {
    target: "landing",
    title: "Welcome to RiskGraph Intelligence™",
    content: "The most advanced graph-based fraud detection system for UPI networks. Let me show you around!",
    position: "bottom",
  },
  {
    target: "quick-demo",
    title: "⚡ Quick Demo Button",
    content: "Click this anytime to instantly analyze a high-risk account (mule1@quickpay) and see the system in action!",
    position: "bottom",
  },
  {
    target: "risk-check",
    title: "Risk Check - Individual Analysis",
    content: "Enter any UPI ID to get detailed fraud assessment with AI-powered insights, network metrics, and evidence.",
    position: "bottom",
  },
  {
    target: "dashboard",
    title: "Live Dashboard - Real-Time Monitoring",
    content: "Watch frauds being detected in real-time with live alerts, metrics showing money saved, and system performance.",
    position: "bottom",
  },
  {
    target: "patterns",
    title: "Fraud Patterns - Detection Results",
    content: "See all 9+ detected fraud patterns including mule clusters, ring topologies, and star patterns with evidence.",
    position: "bottom",
  },
  {
    target: "graph",
    title: "Network Graph - Visual Intelligence",
    content: "Interactive visualization of 60+ accounts and transactions. Click nodes to investigate. Use Freeze button for presentations!",
    position: "bottom",
  },
  {
    target: "timeline",
    title: "Attack Timeline - Chronological Analysis",
    content: "Watch how fraud attacks unfold over 24 hours with replay animation and money flow visualization.",
    position: "bottom",
  },
];

export default function GuidedTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    // Show tour prompt after 2 seconds on first visit
    const hasSeenTour = localStorage.getItem("hasSeenTour");
    if (!hasSeenTour) {
      setTimeout(() => setShowPrompt(true), 2000);
    }
  }, []);

  const startTour = () => {
    setShowPrompt(false);
    setIsActive(true);
    setCurrentStep(0);
    localStorage.setItem("hasSeenTour", "true");
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const endTour = () => {
    setIsActive(false);
    setCurrentStep(0);
  };

  const skipTour = () => {
    setShowPrompt(false);
    localStorage.setItem("hasSeenTour", "true");
  };

  if (showPrompt && !isActive) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-2xl p-6 max-w-sm border border-blue-400">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">👋</span>
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">New to RiskGraph?</h3>
              <p className="text-sm text-blue-100">
                Take a quick 2-minute guided tour to see how our fraud detection works!
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={startTour}
              className="flex-1 px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition"
            >
              Start Tour
            </button>
            <button
              onClick={skipTour}
              className="px-4 py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isActive) {
    return (
      <button
        onClick={startTour}
        className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition flex items-center gap-2 font-medium"
        title="Start Guided Tour"
      >
        <span className="text-lg">🎯</span>
        <span className="text-sm">Tour</span>
      </button>
    );
  }

  const step = tourSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={endTour} />

      {/* Tour Tooltip */}
      <div className="fixed bottom-6 right-6 z-50 max-w-md animate-fade-in">
        <div className="bg-gray-900 rounded-xl shadow-2xl border border-blue-500/50">
          {/* Progress Bar */}
          <div className="h-1 bg-gray-800 rounded-t-xl overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
            />
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💡</span>
                <h3 className="font-bold text-white text-lg">{step.title}</h3>
              </div>
              <button
                onClick={endTour}
                className="text-gray-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">{step.content}</p>

            {/* Step Counter */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>
                Step {currentStep + 1} of {tourSteps.length}
              </span>
              <div className="flex gap-1">
                {tourSteps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition ${
                      idx === currentStep ? "bg-blue-500" : "bg-gray-700"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-2">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
              >
                ← Previous
              </button>
              <button
                onClick={nextStep}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition text-sm"
              >
                {currentStep === tourSteps.length - 1 ? "Finish Tour 🎉" : "Next →"}
              </button>
            </div>

            {/* Skip Option */}
            <button
              onClick={endTour}
              className="w-full mt-2 text-xs text-gray-500 hover:text-gray-400 transition"
            >
              Skip tour
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
