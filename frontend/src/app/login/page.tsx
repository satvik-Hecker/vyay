"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/input";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

const LoginPage = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.login({
        email,
        password,
      });

      localStorage.setItem("token", res.token);

      router.push("/dashboard");
    } catch (err) {
      alert("Invalid email or password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-950 p-4">
      <div className="flex w-full max-w-240 h-152 overflow-hidden rounded-md border border-stone-900 bg-stone-950 shadow-2xl">

        {/* LEFT PANEL */}

        <div className="relative hidden w-[45%] flex-col justify-center overflow-hidden p-10 md:flex">
             <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
            <Image
            src="/logo.png"
            alt="Vyay Logo"
            width={48}
            height={48}
            />
            </div>
          <div className="absolute inset-0 bg-[#88e900e3]" />

          <div className="relative z-10">
            <h1 className="mb-4 text-4xl font-bold leading-tight text-stone-950">
              Welcome Back<br />to Vyay
            </h1>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Take control of your money.<br />
              Track expenses, analyze spending,<br />
              and build smarter financial habits.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}

        <div className="flex w-full flex-col justify-center px-8 py-10 md:w-[55%] md:px-12">

          <h2 className="mb-1 text-2xl font-semibold text-white flex justify-center">
            Log In to Vyay
          </h2>

          <p className="mb-6 flex justify-center text-md text-muted-foreground">
            Enter your credentials to access your dashboard.
          </p>

          {/* OAuth Buttons (UI only for now) */}

          <div className="mb-5 flex gap-3">
            <button
              type="button"
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-stone-800  text-sm font-medium  transition-colors hover:bg-stone-900"
            >
              <GoogleIcon />
              Google
            </button>
          </div>

          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">Or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* FORM */}

          <form className="space-y-4" onSubmit={handleLogin}>

            {/* EMAIL */}

            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">
                Email
              </label>

              <Input
                type="email"
                placeholder="eg. satvik@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}

            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">
                Password
              </label>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-11 w-full items-center justify-center rounded-lg border border-foreground bg-transparent text-sm font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* SIGNUP */}

          <p className="mt-6 text-center text-sm">
            Dont have an account?{" "}
            <span
              onClick={() => router.push("/register")}
              className="cursor-pointer font-semibold underline"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default LoginPage;