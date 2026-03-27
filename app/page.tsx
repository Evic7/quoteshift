"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import InputPanel from "@/components/InputPanel";
import OutputPanel from "@/components/OutputPanel";
import BottomBar from "@/components/BottomBar";
import SettingsModal from "@/components/SettingsModal";
import { createClient } from "@/lib/supabase/client";
import { validUser } from '@/lib/auth';
import { useRouter } from "next/navigation";

// ────────────────────────────────────────────────
// YOUR MAIN QUOTE PROMPT
// ────────────────────────────────────────────────
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;

const quoteprompt = `
You are a professional quote/invoice generator for freelancers, small businesses, and service providers.

─── USER PREFERENCES (NEVER OVERRIDE) ─────────────────────────────────────────
Base Price:        {{basePrice}}  use € if no currency type is provided
Default Timeline:  {{defaultTimeline}}
Pricing Rules:     {{pricingRules}}
Footer Message:    {{footerMessage}}  ← paste verbatim, zero edits
Style/Layout:      {{customLooks}}    ← ignore colors
Quote Format:      {{quoteFormat}}    ← see FORMAT LIBRARY below
────────────────────────────────────────────────────────────────────────────────

CLIENT REQUEST:
"""
{{client_message}}
"""

─── CORE RULES (APPLY TO ALL FORMATS) ──────────────────────────────────────────

TONE
- Professional, friendly, concise. No fluff, no explanations.

TITLE
- One short, specific project/service title derived from the client request.

SCOPE
- 3–7 bullet points. Real deliverables only. No padding, no invented extras.

TIMELINE
- Default to {{defaultTimeline}}.
- Adjust only if the request explicitly requires it.
- If adjusted, append reason in one word (e.g., "Timeline: 5 days — rush").

PRICING
- Start from {{basePrice}} €, apply {{pricingRules}}.
- Split: Service/Labor | Materials/Products (omit Materials if none).
- Fair, realistic numbers only. No arbitrary markups. No invented costs.

FOOTER
- Paste {{footerMessage}} exactly. No rewording. No additions.

QUALITY BAR
- Every line must earn its place. If a field is empty or irrelevant, omit it.
- Scope items must be specific to THIS client request, never generic.
- Pricing must visibly reflect the rules — a reviewer should see the logic.

OUTPUT
- Return ONLY the formatted quote. Zero commentary. Zero extra lines.

─── FORMAT LIBRARY ─────────────────────────────────────────────────────────────
Read {{quoteFormat}} and render the matching format below.
If {{quoteFormat}} is blank,unrecognized or unsuitable for the client request, default to FORMAT-1 or any format suitable for the client request from the list below.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMAT-1 · CLEAN MINIMAL
Best for: freelancers, creatives, solo consultants
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[QUOTE TITLE HERE]
[Business Name] · [Date] · Ref: [QT-YYYYMMDD]

To: [Client Name]

Service: [title]

Deliverables:
- ...

Timeline:  ...
Total:     € ___  (VAT incl. if applicable)

[{{footerMessage}}]
Payment: 50% deposit · balance on completion · valid 30 days
[Name | Email | Phone]


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMAT-2 · ITEMIZED PROFESSIONAL
Best for: small businesses, tradespeople, multi-service jobs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[INVOICE / QUOTE TITLE HERE (or just write INVOICE if the client request matches an invoice)]                               Ref: [QT-YYYYMMDD]
[Business Name]                               Date: [Date]
[Address · Phone · Email]

Bill To:
  [Client Name]
  [Client Contact if known]

Project: [title]

Scope of Work:
  • ...
  • ...

Timeline: ...

─────────────────────────────────────────────
ITEM                          QTY    UNIT €    TOTAL €
─────────────────────────────────────────────
[Service/Labor description]    1     ___        ___
[Materials/Products]           —     ___        ___   ← omit if none
─────────────────────────────────────────────
                              Subtotal:         € ___
                              VAT (if appl.):   € ___
                              TOTAL:            € ___
─────────────────────────────────────────────

[{{footerMessage}}]
Payment Terms: 50% deposit, balance on completion
Validity: 30 days
Thank you for your business!


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMAT-3 · FORMAL CORPORATE
Best for: agencies, B2B, high-value contracts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [COMMERCIAL QUOTATION TITLE HERE]
  [Business Name] | Reg. No. ___ | VAT No. ___
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Quotation Ref:   QT-[YYYYMMDD]
  Date Issued:     [Date]
  Valid Until:     [Date + 30 days]
  Prepared By:     [Name, Title]

  Prepared For:
    Company/Name:  [Client]
    Contact:       [if known]

──────────────────────────────────────────────────────
  1. PROJECT OVERVIEW
──────────────────────────────────────────────────────
  [title] — one sentence description of the engagement.

──────────────────────────────────────────────────────
  2. SCOPE OF WORK
──────────────────────────────────────────────────────
  • ...
  • ...

──────────────────────────────────────────────────────
  3. DELIVERY SCHEDULE
──────────────────────────────────────────────────────
  Estimated Timeline: ...
  Key Milestone:      [if applicable]

──────────────────────────────────────────────────────
  4. COMMERCIAL SUMMARY
──────────────────────────────────────────────────────
  Service / Labour:          € ___
  Materials / Products:      € ___   ← omit if none
  ─────────────────────────────────
  Net Total:                 € ___
  VAT (if applicable):       € ___
  ─────────────────────────────────
  TOTAL PAYABLE:             € ___

──────────────────────────────────────────────────────
  5. TERMS & CONDITIONS
──────────────────────────────────────────────────────
  [{{footerMessage}}]

  Payment:   50% deposit required to commence work.
             Balance due upon completion.
  Validity:  This quotation is valid for 30 days from date of issue.

──────────────────────────────────────────────────────
  Authorised By: [Name] · [Title] · [Date]
  [Email | Phone | Website]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMAT-4 · ESTIMATE CARD
Best for: quick jobs, on-site estimates, mobile-first
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────┐
│  [ESTIMATE CARD TITLE]              │
│  [Business Name]         [Date]     │
│  Ref: QT-[YYYYMMDD]                 │
├─────────────────────────────────────┤
│  For:      [Client Name]            │
│  Job:      [title]                  │
├─────────────────────────────────────┤
│  WHAT'S INCLUDED                    │
│  • ...                              │
│  • ...                              │
├─────────────────────────────────────┤
│  Timeline: ...                      │
├─────────────────────────────────────┤
│  Labour:   € ___                    │
│  Parts:    € ___   (omit if none)   │
│  ─────────────────────────────────  │
│  TOTAL:    € ___                    │
├─────────────────────────────────────┤
│  [{{footerMessage}}]                │
│  50% deposit · valid 30 days        │
└─────────────────────────────────────┘
[Name | Phone | Email]
`;

// ────────────────────────────────────────────────
// HTML STYLING PROMPT FOR EXPORT
// ────────────────────────────────────────────────
const quotetohtml = `
You are an expert front-end designer specializing in premium business document styling.
Your sole task: take a plain quote and wrap it in beautiful, professional HTML+CSS.
You are a STYLIST, not an editor. The content and structure are already perfect.

─── USER DESIGN INSTRUCTIONS (HIGHEST PRIORITY) ────────────────────────────────
{{customLooks}}
If blank → apply the DEFAULT DESIGN SYSTEM defined below.
If provided → extend the default system, never replace its structural rules.
────────────────────────────────────────────────────────────────────────────────

─── INPUT QUOTE ────────────────────────────────────────────────────────────────
"""
{{generated_quote}}
"""
────────────────────────────────────────────────────────────────────────────────


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
I. CONTENT LAW — ABSOLUTE, NO EXCEPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR ONLY JOB IS TO STYLE THE QUOTE. NOT REDESIGN IT.

PRESERVE:  Every word, number, label, bullet, section, and line — exactly as written.
FORBIDDEN: Rewording · Removing · Merging · Reordering · Adding any content.
ALLOWED:   Wrapping existing content in HTML/CSS · applying visual styling only.

The input quote has a structure. That structure is the final structure.
Sections appear in the input in a specific order — that order is locked.
You are painting a wall, not rebuilding the house.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
II. HOW TO STYLE (without changing structure)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Read the input quote top to bottom.
For each line or section you encounter, apply styling only:

  Plain text line       → wrap in a styled <p> or <span>
  Section label         → wrap in a styled <div class="section-label">
  Bullet list           → convert to styled <ul><li> — same items, same order
  Pricing rows          → convert to styled table rows — same numbers, same labels
  Footer / terms block  → wrap in a styled <div class="footer-block">
  Title / header lines  → wrap in a styled header <div> — same text, no additions

Do NOT invent new labels.
Do NOT split or merge existing lines.
Do NOT add decorative placeholder text.
Do NOT change a single character of the actual content.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
III. LAYOUT LAW — STATIC DESKTOP ONLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Fixed-width centered container: 860px. All widths in px.
- NO media queries. NO %. NO vw/vh. NO fluid or responsive units.
- Body background must differ from card background to create depth.
- Designed for desktop viewing and PDF/print export.
- One Google Font loaded via <link> in <head>. Two weights max.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IV. DEFAULT DESIGN SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Apply these tokens unless {{customLooks}} overrides them.

TOKENS
  --bg-page:        #F0F2F5
  --bg-card:        #FFFFFF
  --bg-header:      #0F1117
  --bg-section:     #F8F9FB
  --accent:         #4F6EF7
  --accent-light:   rgba(79,110,247,.08)
  --text-primary:   #0F1117
  --text-secondary: #5A6272
  --text-muted:     #9BA3AF
  --text-on-dark:   #FFFFFF
  --border:         #E4E7ED
  --radius-card:    16px
  --radius-inner:   10px
  --shadow-card:    0 4px 32px rgba(0,0,0,.09)
  --font:           'Inter', system-ui, sans-serif
  --font-mono:      'JetBrains Mono', monospace

TYPOGRAPHY SCALE
  Document type label  : 11px · 600 · uppercase · letter-spacing .18em · --text-on-dark
  Business name        : 22px · 700 · --text-on-dark
  Section label        : 10px · 700 · uppercase · letter-spacing .14em · --text-muted
  Section value        : 15px · 500 · --text-primary
  Body / scope items   : 14px · 400 · --text-primary · line-height 1.7
  Price line items     : 14px · 500 · --text-secondary · monospace
  Total amount         : 20px · 700 · --accent
  Footer / legal text  : 12px · 400 · --text-muted · line-height 1.6
  Reference numbers    : 11px · --font-mono · --text-muted

VISUAL RULES
  - Card: bg-card · border-radius: var(--radius-card) · shadow: var(--shadow-card)
  - Header block (first section of quote): bg-header · padding 40px 48px · top rounded corners
  - Alternating section backgrounds: bg-card and bg-section to create visual rhythm
  - Accent left-border (3px solid --accent) on scope/deliverables block
  - Pricing total row: 2px solid --accent top border · bold · --accent color
  - Footer block: bg-section · bottom rounded corners · verbatim content in a blockquote style
  - All section padding: 28px 48px
  - Bullet <li>: custom dot in --accent color · 8px gap between items


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
V. QUALITY CHECKLIST (self-verify before outputting)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ Read back the input quote line by line — every line exists in the output, unchanged
□ Section order matches the input exactly
□ Zero invented fields, labels, or placeholder text
□ No words were reworded, not even slightly
□ All widths in px — no %, vw, or fluid units anywhere
□ No media queries in the file
□ Font loaded via <link> in <head>
□ Total row is visually dominant in the pricing block
□ Footer content is verbatim — not paraphrased, not summarised
□ Body background differs from card background
□ File is a complete valid HTML document


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VI. OUTPUT RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Output ONLY the raw HTML file. Nothing before <!DOCTYPE html>. Nothing after </html>.
- All CSS inside a single <style> block in <head>. No external stylesheets.
- No JavaScript.
- No explanations, no commentary, no markdown fences.
`;

// ────────────────────────────────────────────────

export default function Home() {
  const supabase = createClient();

  const [inputText, setInputText] = useState("");
  const [quote, setQuote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false); // global export state
  const [showSettings, setShowSettings] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [quotesRemaining, setQuotesRemaining] = useState<number>(3);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const router = useRouter();
  const [settings, setSettings] = useState<any>(null);

  // Load user profile & settings
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoadingUser(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUserId(session.user.id);
        const { data: profile } = await supabase
          .from("profiles")
          .select("plan, quotes_remaining")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setPlan(profile.plan as "free" | "pro");
          setQuotesRemaining(profile.quotes_remaining ?? 3);
        }
      } else {
        setPlan("free");
        setQuotesRemaining(3);
      }
      setIsLoadingUser(false);
    };

    fetchUser();

    const saved = localStorage.getItem("quoteshift_settings");
    if (saved) setSettings(JSON.parse(saved));
  }, []);




  // Reload settings every time SettingsModal is closed
useEffect(() => {
  if (!showSettings) {
    const saved = localStorage.getItem("quoteshift_settings");
    if (saved) {
      setSettings(JSON.parse(saved));
      //alert("New settings detected and saved");
    }
  }
}, [showSettings]);

  //verify user 
 

const verifyUserBeforeGenerate = async () => {
  const user = await validUser();
  if (!user) {
    //alert("Session expired. Please log in again.");
    router.push("/login");   // or window.location.href = "/login"
    return false;
  }
  return true;
};


  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    // Check user validity before generating
    const isValid = await verifyUserBeforeGenerate();
    if (!isValid) return;

  if (!inputText.trim()) return; 
    if (plan === "free" && quotesRemaining <= 0) {
      alert("No free quotes left. Upgrade to Pro.");
      return;
    }
    
    setLoading(true);
    setQuote(null);

    try {
      let finalPrompt = quoteprompt;

      finalPrompt = finalPrompt
        .replace("{{basePrice}}", settings?.basePrice ?? "150")
        .replace("{{defaultTimeline}}", settings?.defaultTimeline ?? "2-3 days")
        .replace("{{pricingRules}}", settings?.pricingRules ?? "")
        .replace("{{footerMessage}}", settings?.footerMessage ?? "")
        .replace("{{customLooks}}", settings?.customLooks ?? "");

      const randomNum = Math.floor(Math.random() * 4) + 1;
      finalPrompt = finalPrompt.replace("{{quoteFormat}}", `FORMAT-${randomNum}`);

      finalPrompt = finalPrompt.replace("{{client_message}}", inputText.trim());

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`, // ← YOUR FULL KEY HERE
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: finalPrompt }],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_tokens: 1500,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || `Server error ${res.status}`);
      }

      const data = await res.json();
      const generatedText = data.choices?.[0]?.message?.content?.trim() || "No quote generated.";
      setQuote(generatedText);

      if (plan === "free" && userId) {
        const newRemaining = quotesRemaining - 1;
        await supabase
          .from("profiles")
          .update({
            quotes_remaining: newRemaining,
            number_of_quotes_used: (current: number | null) => (current ?? 0) + 1,
          })
          .eq("id", userId);

        setQuotesRemaining(newRemaining);
      }
    } catch (err: any) {
      console.error("Quote generation failed:", err);
      alert("Error generating quote: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (quote) {
      navigator.clipboard.writeText(quote);
      alert("Quote copied!");
    }
  };

  // ────────────────────────────────────────────────
  // HTML GENERATION (used by both HTML & PDF buttons)
  // ────────────────────────────────────────────────
  const generateStyledHTML = async () => {
    if (!quote || !settings?.customLooks) {
      alert("Custom Looks setting is required for styled export.");
      return "";
    }

    let prompt = quotetohtml
      .replace("{{customLooks}}", settings.customLooks)
      .replace("{{generated_quote}}", quote);

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`, // ← YOUR FULL KEY HERE
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || "HTML generation failed");
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || "";
  };

  // ────────────────────────────────────────────────
  // Create HTML Download
  // ────────────────────────────────────────────────
  const handleCreateHTML = async () => {
    setIsExporting(true);
    try {
      const html = await generateStyledHTML();
      if (!html) return;

      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quoteshift-quote.html";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("HTML export failed:", err);
      alert("Failed to generate HTML");
    } finally {
      setIsExporting(false);
    }
  };

  // ────────────────────────────────────────────────
  // Create PDF Download
  // ────────────────────────────────────────────────
  const handleCreatePDF = async () => {
    setIsExporting(true);
    try {
      const html = await generateStyledHTML();
      if (!html) return;

      const html2pdf = (await import("html2pdf.js")).default;
      const element = document.createElement("div");
      element.innerHTML = html;

      await html2pdf()
        .from(element)
        .set({
          margin: 15,
          filename: "quoteshift-quote.pdf",
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .save();
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Failed to generate PDF");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoadingUser) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar plan={plan} onSettings={() => setShowSettings(true)} />

      <main className="max-w-4xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-5 py-2 shadow-sm mb-6">
            <div className="text-2xl">⚡</div>
            <span className="font-medium text-sm tracking-wide text-slate-600">AI-POWERED • BUSINESS APPROVED</span>
          </div>

          <h1 className="text-6xl font-bold tracking-tighter text-slate-900 mb-4">
            Quotes in seconds.<br />Not hours.
          </h1>
          <p className="text-2xl text-slate-600 max-w-2xl mx-auto">
            Paste what the client wants. Get a beautiful, branded quote instantly.
          </p>
        </div>

        <InputPanel
          inputText={inputText}
          setInputText={setInputText}
          onGenerate={handleGenerate}
          loading={loading}
        />

        {(quote || loading) && (
          <div className="mt-12 fade-in">
            <OutputPanel
              quote={quote}
              loading={loading}
              onCopy={handleCopy}
              plan={plan}
              onCreateHTML={handleCreateHTML}
              onCreatePDF={handleCreatePDF}
              quotesRemaining={quotesRemaining}
            />
          </div>
        )}
      </main>

      <BottomBar
        plan={plan}
        remaining={plan === "pro" ? "Unlimited" : quotesRemaining}
        total={plan === "pro" ? "∞" : 3}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}