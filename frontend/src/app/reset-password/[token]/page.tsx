"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams(); 
  const router = useRouter();
  
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ loading: false, error: "", success: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setStatus({ ...status, error: "Passwords do not match" });
    }

    setStatus({ ...status, loading: true, error: "" });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: formData.password }),
      });

      if (response.ok) {
        setStatus({ ...status, loading: false, success: true });
        
        setTimeout(() => router.push("/login"), 3000);
      } else {
        const data = await response.json();
        setStatus({ ...status, loading: false, error: data.message || "Reset failed" });
      }
    } catch (err) {
      setStatus({ ...status, loading: false, error: "Server connection failed" });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl backdrop-blur-sm shadow-2xl">
        
        {!status.success ? (
          <>
            <Link 
              href="/login" 
              className="inline-flex items-center text-zinc-500 hover:text-white text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>
            
            <h2 className="text-2xl font-semibold text-white mb-2">Create new password</h2>
            <p className="text-zinc-400 text-sm mb-8">Your new password must be different from previous used passwords.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 text-white pl-10 pr-12 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-lime-400 transition-all"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

             
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-lime-400 transition-all"
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>

              {status.error && <p className="text-red-400 text-xs italic">{status.error}</p>}

              <button
                type="submit"
                disabled={status.loading}
                className="w-full bg-lime-400 hover:bg-lime-300 text-zinc-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center disabled:opacity-50"
              >
                {status.loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <CheckCircle2 className="w-16 h-16 text-lime-400 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-semibold text-white mb-2">Password Updated!</h2>
            <p className="text-zinc-400 text-sm mb-6">Your password has been changed successfully. Redirecting you to login...</p>
            <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
               <div className="bg-lime-400 h-full animate-progress-load"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}