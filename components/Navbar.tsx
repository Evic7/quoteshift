"use client";

import { Settings, User } from "lucide-react";
export default function Navbar({ 
  plan, 
  onSettings 
}: { 
  plan: "free" | "pro"; 
  onSettings: () => void;
}) {
  return (
    <nav className="h-16 border-b bg-white/80 backdrop-blur-xl flex items-center px-6 sticky top-0 z-50">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow">
            <img src="/logo.svg" alt="Logo" className="w-5 h-5" width={50} height={50} />
          </div>
          <div className="font-semibold text-3xl tracking-tighter">Quote<span style={{ color: "blue" }}>Shift</span></div>
        </div>

        <div className="flex items-center gap-6">
          <div className={`px-5 py-2 text-xs font-semibold  ${plan === "pro" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-amber-100 text-amber-700 border-amber-200"}`}>
            {plan.toUpperCase()} PLAN
          </div>

          <button onClick={onSettings} className="p-3 hover:bg-slate-100 rounded-2xl transition" id='navbutton'>
            <Settings size={22} />
          </button>

          <a href="/signup" className="p-3 hover:bg-slate-100 rounded-2xl transition" id='navbutton' style={{width: '22px',padding: '3px',margin: '6px',borderRadius: '6px'}}>
            <User size={22} />
          </a>
        </div>
      </div>
    </nav>
  );
}