"use client";

import { Copy, FileText, Download } from "lucide-react";
import { useState } from "react";

interface OutputPanelProps {
  quote: string | any | null;
  loading: boolean;
  onCopy: () => void;
  plan: "free" | "pro";
  onCreateHTML: () => Promise<void>;
  onCreatePDF: () => Promise<void>;
  quotesRemaining?: number;
}

export default function OutputPanel({
  quote,
  loading,
  onCopy,
  plan,
  onCreateHTML,
  onCreatePDF,
  quotesRemaining = 3,
}: OutputPanelProps) {

  const [isExporting, setIsExporting] = useState(false);

  if (loading) {
    return (
      <div className="panel p-10 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-slate-600">Generating professional quote...</p>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="panel p-10 text-center text-slate-500">
        Your quote will appear here once generated
      </div>
    );
  }

  let displayContent: React.ReactNode;

  if (typeof quote === "string") {
    displayContent = (
      <div className="prose prose-slate max-w-none whitespace-pre-wrap">
        {quote}
      </div>
    );
  } else {
    displayContent = (
      <>
        <h2 className="text-2xl font-bold mb-4">{quote.projectType}</h2>
        <p className="text-slate-600 mb-6">Timeline: {quote.timeline}</p>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Scope:</h3>
          <ul className="list-disc pl-6 space-y-1">
            {quote.scope?.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            )) || <li>No scope provided</li>}
          </ul>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-3">Pricing:</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Labor:</span>
              <span>€ {quote.pricing?.labor ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Materials:</span>
              <span>€ {quote.pricing?.materials ?? "—"}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3">
              <span>Total:</span>
              <span>€ {quote.pricing?.total ?? "—"}</span>
            </div>
          </div>
        </div>

        {quote.notes && (
          <p className="mt-6 text-slate-600 italic">{quote.notes}</p>
        )}
      </>
    );
  }

  return (
    <div className="panel p-10">
      {/* Exporting Message */}
      {isExporting && (
        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 rounded-2xl p-4 text-center font-medium">
          Exporting styled quote... Please wait
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Generated Quote</h2>

        {quote && (
          <div className="flex gap-3">
            <button
              onClick={onCopy}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
            >
              <Copy size={18} />
              Copy
            </button>

            {plan === "pro" && (
              <>
                <button
                  onClick={async () => {
                    setIsExporting(true);
                    try {
                      await onCreateHTML();
                    } finally {
                      setIsExporting(false);
                    }
                  }}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-5 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <FileText size={18} />
                  {isExporting ? "Generating HTML..." : "Create HTML"}
                </button>

                <button
                  onClick={async () => {
                    setIsExporting(true);
                    try {
                      await onCreatePDF();
                    } finally {
                      setIsExporting(false);
                    }
                  }}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-5 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Download size={18} />
                  {isExporting ? "Generating PDF..." : "Create PDF"}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 min-h-[200px]">
        {displayContent}
      </div>

      {plan === "free" && (
        <p className="text-sm text-slate-500 mt-4 text-center">
          Free plan – limited quotes remaining: <strong>{quotesRemaining}</strong>
        </p>
      )}
    </div>
  );
}