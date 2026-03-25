"use client";

import { X, Save } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";

export default function SettingsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // Core settings state
  const [basePrice, setBasePrice] = useState(150);
  const [defaultTimeline, setDefaultTimeline] = useState("2-3 days");
  const [pricingRules, setPricingRules] = useState(
    "Emergency / After-hours = +$85\nWeekend work = 1.5× rate\nMaterial markup = 15%"
  );
  const [footerMessage, setFooterMessage] = useState("Includes 1-year warranty on parts and labor.");
  const [customLooks, setCustomLooks] = useState("");

  const [footerCount, setFooterCount] = useState(48);
  const [looksCount, setLooksCount] = useState(0);

  useEffect(() => {
  if (isOpen) {
    const saved = localStorage.getItem("quoteshift_settings");
    if (saved) {
      const s = JSON.parse(saved);
      setBasePrice(s.basePrice ?? 150);
      setDefaultTimeline(s.defaultTimeline ?? "2-3 days");
      setPricingRules(s.pricingRules ?? "");
      setFooterMessage(s.footerMessage ?? "");
      setCustomLooks(s.customLooks ?? "");
    }
  }
  }, [isOpen]);
  if (!isOpen) return null;

  const handleFooterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value.slice(0, 100);
    setFooterMessage(text);
    setFooterCount(text.length);
  };

  const handleLooksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value.slice(0, 200);
    setCustomLooks(text);
    setLooksCount(text.length);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-[100] p-6">
      <div
        id="settingsmodal"
        className="settings-modal w-full max-w-lg"
      >
        {/* Header */}
        <div className="settings-header">
          <h3 className="text-3xl font-semibold tracking-tighter text-white">Settings</h3>
          <p className="text-indigo-100/90 text-sm mt-1">AI-powered quoting configuration</p>
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-white hover:bg-white/20 p-3 rounded-2xl transition-all closemodal"
          >
            <X size={26} />
          </button>
        </div>

        <div className="p-10 space-y-12">
          
          {/* SECTION 1: Core Pricing */}
          <div className="settings-section">
            <h4 className="settings-section-title">Core Pricing</h4>
            <div className="space-y-6">
              <div>
                <label className="settings-label">Default Base Price</label>
                <div className="flex items-center bg-white border border-slate-200 focus-within:border-indigo-400 rounded-3xl overflow-hidden">
                  <div className="bg-indigo-50 text-indigo-600 px-6 py-4 text-2xl font-bold">$</div>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="flex-1 bg-transparent px-6 py-4 text-3xl font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="settings-label">Default Timeline</label>
                <input
                  type="text"
                  value={defaultTimeline}
                  onChange={(e) => setDefaultTimeline(e.target.value)}
                  className="settings-input"
                  placeholder="2-3 days"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Rules Engine */}
          <div className="settings-section">
            <h4 className="settings-section-title">Feature Pricing Rules</h4>
            <textarea
              value={pricingRules}
              onChange={(e) => setPricingRules(e.target.value)}
              rows={5}
              className="settings-textarea font-mono"
              placeholder="One rule per line"
            />
            <p className="text-xs text-slate-500 mt-2">Applied automatically during quote generation</p>
          </div>

          {/* SECTION 3: Quote Footer */}
          <div className="settings-section">
            <div className="flex justify-between mb-3">
              <h4 className="settings-section-title">Quote Footer Message</h4>
              <span className="text-xs text-slate-500">{footerCount}/100</span>
            </div>
            <textarea
              value={footerMessage}
              onChange={handleFooterChange}
              maxLength={100}
              rows={3}
              className="settings-textarea"
            />
          </div>

          {/* SECTION 4: Custom Looks & Layout */}
          <div className="settings-section">
            <div className="flex justify-between mb-3">
              <h4 className="settings-section-title">Custom Looks &amp; Layout. Note: Custon colors and Professional styling and layout will not be applied on a free plan</h4>
              <span className="text-xs text-slate-500">{looksCount}/200</span>
            </div>
            <textarea
              value={customLooks}
              onChange={handleLooksChange}
              maxLength={200}
              rows={4}
              className="settings-textarea"
              placeholder="Add company logo at top • Show tax breakdown • Use modern blue theme • Include phone &amp; email at bottom..."
            />
            <p className="text-xs text-slate-500 mt-2">This is where the majic happens. Use this to personalize every quote</p>
          </div>

          {/* Future-Ready Placeholder Section */}
          <div className="settings-section border-t pt-8">
            <h4 className="settings-section-title">AI Preferences (Coming Soon)</h4>
            <div className="text-sm text-slate-500 italic">Toggles for tone, verbosity, and smart suggestions will appear here</div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-white px-8 py-6 flex gap-4">
          <button onClick={onClose} className="setbutton flex-1">Cancel</button>
          <button
          onClick={() => {
  const settingsData = {
    basePrice,
    defaultTimeline,
    pricingRules,
    footerMessage,
    customLooks,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem("quoteshift_settings", JSON.stringify(settingsData));
  alert("Settings saved successfully!");
  onClose();
}}
            className="setbutton flex-1 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white"
          >
            <Save size={19} className="mr-2" />
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
}