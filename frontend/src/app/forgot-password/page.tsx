"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2 } from "lucide-react"; 

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const data = await response.json();
        setError(data.message || "Something went wrong. Try again.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      {/* Vyay Logo/Branding */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white tracking-tighter">
          Vyay<span className="text-lime-400">.</span>
        </h1>
      </div>

      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl backdrop-blur-sm shadow-2xl">
        {!isSubmitted ? (
          <>
            <Link 
              href="/login" 
              className="inline-flex items-center text-zinc-500 hover:text-white text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>
            
            <h2 className="text-2xl font-semibold text-white mb-2">Forgot password?</h2>
            <p className="text-zinc-400 text-sm mb-8">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-lime-400 focus:border-lime-400 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && <p className="text-red-400 text-xs italic">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-lime-400 hover:bg-lime-300 text-zinc-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-lime-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-lime-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Check your email</h2>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
              We&apos;ve sent a password reset link to <span className="text-white font-medium">{email}</span>.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="text-lime-400 hover:text-lime-300 text-sm font-medium transition-colors"
            >
              Didn&apos;t get the email? Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}