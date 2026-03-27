"use client";

import { useState } from "react";
import { Eye, EyeOff, Receipt, PieChart, ShieldCheck } from "lucide-react";
import { Input } from "@/components/input";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

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
        localStorage.setItem(
        "user",
        JSON.stringify({
          name: res.user?.name,
          email: res.user?.email,
        })
      );
      toast.success("Login successful");

      router.push("/dashboard");
    } catch (err: unknown) {
        if (err instanceof Error) {
            toast.error(err.message);
        } else {
            toast.error("Login failed");
        }
        }finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex font-sans min-h-screen items-center justify-center bg-stone-950 p-4">
      <div className="flex w-full max-w-240 h-152 overflow-hidden rounded-md border border-stone-900 bg-stone-950 shadow-2xl">

        <div className="relative hidden w-[45%] flex-col justify-end overflow-hidden p-10 md:flex">
          <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Vyay Logo"
              width={48}
              height={48}
            />
          </div>

          <div className="absolute inset-0 bg-linear-to-br from-[#a6ff3b] via-[#88e900] to-[#3a5200]" />

          <div className="relative z-10">
            <h1 className="text-7xl font-surgena text-stone-950 justify-start flex">
              Vyay
            </h1>

            <p className="text-zinc-950 text-lg font-medium leading-relaxed">
              A simple way to track your spending
            </p>

            <div className="mt-5 flex text-zinc-200 gap-4 font-sans">
              <div className="flex-1 rounded-sm bg-zinc-900 px-3 py-3 min-h-28">
                <div className="mb-3">
                  <Receipt className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm">Track all your expenses</p>
                </div>
              </div>

              <div className="flex-1 rounded-sm bg-zinc-900 px-3 py-3 min-h-28">
                <div className="mb-3">
                  <PieChart className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm">Analyze your spending</p>
                </div>
              </div>

              <div className="flex-1 rounded-sm bg-zinc-900 px-3 py-3 min-h-28">
                <div className="mb-3">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm">Take control of your money</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col justify-center px-8 py-10 md:w-[55%] md:px-12">
          <h2 className="mb-1 text-4xl font-semibold text-white flex font-inklap justify-center">
            Welcome Back
          </h2>

          <p className="mb-12 flex justify-center text-md text-zinc-300">
            Enter your credentials to access your dashboard.
          </p>

          <form
            className="space-y-4 text-zinc-200 max-w-md mx-auto w-full"
            onSubmit={handleLogin}
          >
            <div>
              <label className="mb-1.5 block text-sm text-white font-sans">
                Email
              </label>

              <Input
                className="bg-zinc-900 placeholder:font-sans border-none focus-visible:ring-1"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-white font-sans">
                Password
              </label>

              <div className="relative">
                <Input
                  className="bg-zinc-900 placeholder:font-sans border-none focus-visible:ring-1"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-white/45 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end text-xs text-muted-foreground">
              <button className="hover:text-white transition-colors hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-11 w-full border-none items-center justify-center rounded-lg leading-relaxed bg-lime-500 text-md font-sans font-semibold text-zinc-950 transition-colors hover:bg-lime-700 hover:text-background"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            <div className="mb-5 flex gap-3">
              <button
                type="button"
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg leading-relaxed border border-none bg-white text-md text-zinc-950 font-semibold transition-colors hover:bg-white/70"
              >
                <GoogleIcon />
                Log in with Google
              </button>
            </div>
          </form>

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
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default LoginPage;