"use client";

import { useState } from "react";
import { Eye, EyeOff, Receipt, PieChart, ShieldCheck } from "lucide-react";
import { Input } from "@/components/input";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";

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
              <Link href="/forgot-password" className="hover:text-white transition-colors hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-11 w-full border-none items-center justify-center rounded-lg leading-relaxed bg-lime-500 text-md font-sans font-semibold text-zinc-950 transition-colors hover:bg-lime-700 hover:text-background"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            <div className="mt-8 text-center">
              <p className="text-sm text-[#52525b] font-medium tracking-tight">
                Don&apos;t have an account?{" "}
                <Link 
                  href="/register" 
                  className="text-[#f4f4f5] hover:text-[#a3e635] font-bold underline-offset-4 hover:underline transition-all duration-300"
                >
                  Create one for free
                </Link>
              </p>
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


export default LoginPage;