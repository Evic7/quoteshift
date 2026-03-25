"use client";

import { Crown } from "lucide-react";

export default function BottomBar({
  plan,
  remaining,
  total,
}: {
  plan: "free" | "pro";
  remaining: string | number;
  total: string | number;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-4 z-50">
      <div className="max-w-4xl mx-auto px-6 flex items-center justify-between text-sm">
        <div className="flex items-center gap-3 text-slate-500">
          <span>Free quotes remaining today</span>
          <span className="font-semibold text-slate-900">
            {remaining}/{total}
          </span>
        </div>

        {plan === "free" && (
          <button
            onClick={() => alert("Upgrade modal coming soon ✨")}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white px-6 py-2.5 rounded-2xl font-medium hover:shadow-lg transition-all active:scale-95"
            id='planview'
          >
            <Crown className="w-4 h-4" style={{ color: "yellow" }} />
           Upgrade to Pro — Unlimited Quotes, HTML + PDF Export & Custom Branding
          </button>
        )}

        {plan === "pro" && (
          <div className="text-emerald-600 font-medium flex items-center gap-2" id='planview'>
            <Crown className="w-4 h-4" style={{ color: "yellow" }} />
            Pro Plan Active
          </div>
        )}
      </div>
    </div>
  );
}