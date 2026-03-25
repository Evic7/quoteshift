"use client";

import { Send, Sparkles } from "lucide-react";

interface InputPanelProps {
  inputText: string;
  setInputText: (text: string) => void;
  onGenerate: () => void;
  loading: boolean;
}

export default function InputPanel({ inputText, setInputText, onGenerate, loading }: InputPanelProps) {
  return (
    <div className="panel p-10" id='inputpanel'>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-11 h-11 bg-indigo-100 rounded-3xl flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-3xl font-semibold">Paste Client Request</h2>
          <p className="text-slate-600 mt-1">Describe the job — we’ll turn it into a professional quote</p>
        </div>
      </div>

      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Paste client message here...

Example:
Hey, I need a new water heater installed in my garage. It's a 50 gallon unit..."
        className="textarea w-full h-64 focus:outline-none"
      />

      <button
        onClick={onGenerate}
        disabled={loading || !inputText.trim()}
        className="btn-primary w-full mt-8 flex items-center justify-center gap-3"
      >
        {loading ? (
          <>Generating professional quote...</>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Generate Quote Now
          </>
        )}
      </button>
    </div>
  );
}