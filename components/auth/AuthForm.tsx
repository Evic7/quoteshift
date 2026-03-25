"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AuthFormProps {
  mode: "login" | "signup";
}

interface Profile {
  username: string;
  plan: string;
  number_of_quotes_used: number;
  quotes_remaining: number;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const supabase = createClient();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Logged-in user state
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  // NEW: Prevents flash of login form while checking session
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Check session once on mount
  useEffect(() => {
    const initialize = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Fetch profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, plan, number_of_quotes_used, quotes_remaining")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setCurrentProfile(profile);
        }

        setUserEmail(session.user.email || "Not available");
      }

      setIsCheckingSession(false);
    };

    initialize();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username } },
        });
        if (error) throw error;

        alert("Account created! Check your email for a verification code.");
        router.push("/login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserEmail(user.email || "Not available");

          const { data: profile } = await supabase
            .from("profiles")
            .select("username, plan, number_of_quotes_used, quotes_remaining")
            .eq("id", user.id)
            .single();

          if (profile) setCurrentProfile(profile);
        }

        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking if user is already logged in
  if (isCheckingSession) {
    return (
      <div className="w-full max-w-md">
        <div className="panel p-10 text-center">
          <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-slate-600">Checking session...</p>
        </div>
      </div>
    );
  }

  // Logged-in user card (your modern card - unchanged)
  if (currentProfile) {
    const initials = currentProfile.username
      ? currentProfile.username.slice(0, 2).toUpperCase()
      : "QS";

    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@600;800&family=DM+Sans:wght@400;500;700&display=swap');

          @keyframes gradientShift {
            0%   { background-position: 0% 50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 18px 4px rgba(56,189,248,.5); }
            50%       { box-shadow: 0 0 32px 8px rgba(139,92,246,.6); }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          .qs-page {
            text-align: center;
            font-family: 'DM Sans', sans-serif;
            padding: 32px 16px;
            background: #07071a;
            min-height: 100vh;
            width:50%;
          }
          @media screen and (max-width: 800px) {
            .qs-page { width: 100%; }
          }
          .qs-heading {
            font-family: 'Oxanium', sans-serif;
            font-size: 1rem;
            font-weight: 600;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #64748b;
            margin-bottom: 20px;
          }
          .qs-card {
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
            max-width: 300px;
            margin: auto;
            text-align: center;
            font-family: 'DM Sans', sans-serif;
            background: #0d0d1a;
            border: 1px solid rgba(139,92,246,.25);
            border-radius: 6px;
            overflow: hidden;
            animation: fadeUp .5s ease both;
          }
          .qs-banner {
            width: 100%;
            height: 148px;
            background: linear-gradient(270deg, #6366f1, #38bdf8, #a855f7, #ec4899);
            background-size: 400% 400%;
            animation: gradientShift 8s ease infinite;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .qs-avatar {
            width: 84px;
            height: 84px;
            border-radius: 50%;
            background: rgba(13,13,26,.8);
            border: 3px solid rgba(255,255,255,.2);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulseGlow 3s ease-in-out infinite;
          }
          .qs-initials {
            font-family: 'Oxanium', sans-serif;
            font-size: 2rem;
            font-weight: 800;
            color: #f1f5f9;
            letter-spacing: -1px;
          }
          .qs-card h1 {
            font-family: 'Oxanium', sans-serif;
            font-size: 1.4rem;
            font-weight: 800;
            color: #f1f5f9;
            margin: 16px 0 0;
            letter-spacing: -0.5px;
          }
          .qs-card .title {
            color: rgba(148,163,184,.75);
            font-size: 0.83rem;
            margin: 6px 0 0;
            font-weight: 400;
          }
          .qs-plan {
            color: #818cf8;
            font-family: 'Oxanium', sans-serif;
            font-size: 0.95rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            margin: 14px 0 0;
          }
          .qs-stats {
            margin: 14px 20px 0;
            padding: 12px 16px;
            background: rgba(99,102,241,.08);
            border: 1px solid rgba(99,102,241,.2);
            border-radius: 4px;
            display: flex;
            justify-content: space-around;
          }
          .qs-stat-label {
            display: block;
            font-size: 0.6rem;
            color: rgba(148,163,184,.6);
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 3px;
          }
          .qs-stat-value {
            display: block;
            font-family: 'Oxanium', sans-serif;
            font-size: 1rem;
            font-weight: 700;
            color: #e2e8f0;
          }
          .qs-stat-value.unlimited { color: #34d399; }
          .qs-badge-row { margin: 18px 0; }
          .qs-badge {
            display: inline-block;
            padding: 4px 18px;
            border-radius: 999px;
            font-family: 'Oxanium', sans-serif;
            font-size: 0.68rem;
            font-weight: 700;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            background: linear-gradient(90deg, #6366f1, #38bdf8);
            color: #fff;
          }
          .qs-card button {
            border: none;
            outline: 0;
            display: inline-block;
            padding: 13px 0;
            color: white;
            background: linear-gradient(90deg, #6366f1, #38bdf8);
            text-align: center;
            cursor: pointer;
            width: 100%;
            font-size: 1rem;
            font-family: 'Oxanium', sans-serif;
            font-weight: 700;
            letter-spacing: 0.05em;
            transition: opacity .2s;
          }
          .qs-card button:hover  { opacity: 0.75; }
          .qs-card button:active { transform: scale(.98); }
        `}</style>

        <div className="qs-page">
          <h2 className="qs-heading">User Profile</h2>

          <div className="qs-card">
            <div className="qs-banner">
              <div className="qs-avatar">
                <span className="qs-initials">{initials}</span>
              </div>
            </div>

            <h1>{currentProfile.username}</h1>
            <p className="title">{userEmail}</p>
            <p className="qs-plan">{currentProfile.plan.toUpperCase()}</p>

            <div className="qs-stats">
              <div>
                <span className="qs-stat-label">Quotes Used</span>
                <span className="qs-stat-value">
                  {currentProfile.number_of_quotes_used}
                </span>
              </div>
              <div>
                <span className="qs-stat-label">Remaining</span>
                <span className={`qs-stat-value${currentProfile.plan === "pro" ? " unlimited" : ""}`}>
                  {currentProfile.plan === "pro" ? "Unlimited" : currentProfile.quotes_remaining}
                </span>
              </div>
            </div>

            <div className="qs-badge-row">
              <span className="qs-badge">{currentProfile.plan} plan</span>
            </div>

            <p style={{ margin: 0 }}>
              <button onClick={() => router.push("/")}>Go to Dashboard</button>
            </p>
          </div>
        </div>
      </>
    );
  }

  // Original Login / Signup Form (completely untouched)
  return (
    <div className="w-full max-w-md">
      <div className="panel p-10">
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-3xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>

        <h2 className="text-4xl font-semibold tracking-tighter text-center mb-2">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h2>
        <p className="text-slate-600 text-center mb-10">
          {mode === "signup"
            ? "Start generating quotes in seconds"
            : "Sign in to continue"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Display Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="portalfield w-full bg-white border border-slate-200 focus:border-indigo-400 rounded-3xl px-6 py-4 text-lg focus:outline-none transition-all"
                placeholder="Alex Rivera"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="portalfield w-full bg-white border border-slate-200 focus:border-indigo-400 rounded-3xl px-6 py-4 text-lg focus:outline-none transition-all"
              placeholder="you@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="shwpsw relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="portalfield w-full bg-white border border-slate-200 focus:border-indigo-400 rounded-3xl px-6 py-4 text-lg focus:outline-none transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="portalfield w-full bg-white border border-slate-200 focus:border-indigo-400 rounded-3xl px-6 py-4 text-lg focus:outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          )}

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <br /> <br />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-lg disabled:opacity-70 flex items-center justify-center gap-3"
          >
            {loading ? "Processing..." : mode === "signup" ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-8">
          {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
          <a
            href={mode === "signup" ? "/login" : "/signup"}
            className="text-indigo-600 hover:underline font-medium"
          >
            {mode === "signup" ? "Sign in" : "Create one"}
          </a>
        </p>
      </div>
    </div>
  );
}