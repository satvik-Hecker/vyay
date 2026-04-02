"use client";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Receipt, PieChart, ShieldCheck } from "lucide-react";
import { Input } from "@/components/input";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

const RegisterPage = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await api.register({
        name,
        email,
        password,
      });

      toast.success("Account created successfully");

      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Registration failed");
      }
    } finally {
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

            <div className="text-zinc-200 mt-5 flex gap-4 font-sans">
              <div className="flex-1 rounded-sm bg-zinc-900 px-3 py-3 min-h-28">
                <div className="mb-3">
                  <Receipt className="h-5 w-5" />
                </div>
                <p className="text-sm">Track all your expenses</p>
              </div>

              <div className="flex-1 rounded-sm bg-zinc-900 px-3 py-3 min-h-28">
                <div className="mb-3">
                  <PieChart className="h-5 w-5" />
                </div>
                <p className="text-sm">Analyze your spending</p>
              </div>

              <div className="flex-1 rounded-sm bg-zinc-900 px-3 py-3 min-h-28">
                <div className="mb-3">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <p className="text-sm">Take control of your money</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col justify-center px-8 py-10 md:w-[55%] md:px-12">

          <h2 className="mb-1 text-4xl font-semibold text-white flex font-inklap justify-center">
            Create Account
          </h2>

          <p className="mb-4 flex justify-center text-md text-zinc-300">
            Start tracking your expenses today.
          </p>

          <form
            className="space-y-4 max-w-md mx-auto w-full text-zinc-200"
            onSubmit={handleRegister}
          >

            <div className="">
              <label className="mb-1.5 block text-sm text-white">
                Name
              </label>

              <Input
                className=" text-zinc-200 bg-zinc-900 border-none focus-visible:ring-1"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-white">
                Email
              </label>

              <Input
                className="bg-zinc-900 border-none focus-visible:ring-1"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-white">
                Password
              </label>

              <div className="relative">
                <Input
                  className="bg-zinc-900 border-none focus-visible:ring-1"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-white/45"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-white">
                Confirm Password
              </label>

              <div className="relative">
                <Input
                  className="bg-zinc-900 border-none focus-visible:ring-1"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-white/45"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-11 w-full items-center justify-center rounded-lg bg-lime-500 text-md font-semibold text-zinc-950 hover:bg-lime-700"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <div className="mt-8 flex flex-col items-center justify-center gap-2">
            
            <p className="text-sm text-[#52525b] font-medium tracking-tight">
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="text-[#f4f4f5] hover:text-[#a3e635] font-semibold underline-offset-4 hover:underline transition-all duration-300"
              >
                Sign in
              </Link>
            </p>
            
            
            <div className="w-full h-px bg-linear-to-r from-transparent via-white/5 to-transparent mt-4" />
          </div>

          </form>

          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="cursor-pointer font-semibold underline"
            >
              Log In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;