"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react"; 
import { Linkedin01Icon, Github01Icon } from "@hugeicons/core-free-icons";

const footerLinks = [
  { name: "GitHub", href: "https://github.com/satvik-Hecker", icon: Github01Icon },
  { name: "LinkedIn", href: "https://linkedin.com/in/satvik04", icon: Linkedin01Icon },
];

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "The Core", href: "#core" },
  { label: "How it works", href: "#how" },
  { label: "Security", href: "#security" },
];

const features = [
  {
    icon: "📊",
    title: "Smart Expense Tracking",
    desc: "Auto-categorize every transaction instantly. Know exactly where every rupee goes without lifting a finger.",
  },
  {
    icon: "🤖",
    title: "AI Financial Assistant",
    desc: "Chat with your finances. Ask anything — get instant, personalized insights powered by advanced AI.",
  },
  {
    icon: "📈",
    title: "Visual Analytics",
    desc: "Beautiful charts that turn complex data into clear trends. Spot patterns before they become problems.",
  },
  {
    icon: "🔒",
    title: "Privacy First",
    desc: "Your data stays yours. End-to-end encrypted with zero third-party sharing. Always.",
  },
];

const aiPoints = [
  { text: "Instant answers — \"How much did I spend on food this month?\" answered in seconds." },
  { text: "Proactive alerts — Get notified when your spending spikes or budgets are at risk." },
  { text: "Smart suggestions — Personalized tips to save more, spend smarter every month." },
];

const steps = [
  { num: "01", title: "Add Transactions", desc: "Log expenses manually or connect your accounts. Vyay auto-categorizes everything in real time." },
  { num: "02", title: "Track Spending", desc: "Your dashboard updates instantly. Visual charts and breakdowns make patterns obvious at a glance." },
  { num: "03", title: "Get Insights", desc: "Vyay's AI surfaces what matters — alerts, savings opportunities, and personalized recommendations." },
];

const stats = [
  { num: "24/7", label: "AI Insights", sub: "Continuous pattern analysis & anomaly detection." },
  { num: "0 %", label: "Tamper Risk", sub: "Immutable blockchain ledger ensures data integrity." },
  { num: "<2s", label: "Sync Latency", sub: "Ultra-low delay between node propagation." },
  { num: "-80%", label: "Manual Entry", sub: "Significant reduction in repetitive data input." },
];

const monthlySpending = [45, 62, 38, 75, 55, 48, 68, 42, 80, 58, 65, 72];
const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const sparkBars = [35, 55, 40, 70, 45, 88, 60];

export default function Home() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));

    const staggerContainers = document.querySelectorAll(".features-grid, .steps-grid, .stats-grid");
    staggerContainers.forEach((grid) => {
      Array.from(grid.children).forEach((c, i) => {
        (c as HTMLElement).style.transitionDelay = `${i * 0.1}s`;
      });
    });

    const handleScroll = () => {
      if (navRef.current) {
        navRef.current.style.background = window.scrollY > 20 ? "rgba(9,9,11,.95)" : "rgba(9,9,11,.85)";
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#09090b] text-[#f4f4f5] font-sans overflow-x-hidden">
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
        rel="stylesheet"
      />

      {/* NAV */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-[68px] px-6 md:px-12 lg:px-20 bg-[rgba(9,9,11,.85)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.07)]"
      >
        {/* Logo */}
        <Link href="/" className="flex gap-3">
          <div className="
          shrink-0 w-6 h-6 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl 
          flex items-center justify-center p-1.5 sm:p-2
          bg-linear-to-br from-lime-300 via-lime-400 to-lime-600
          border border-lime-200/60
          shadow-[0_6px_12px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.7),inset_0_-2px_6px_rgba(0,0,0,0.2)]
          transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.7),inset_0_-2px_6px_rgba(0,0,0,0.2)] active:translate-y-0 active:shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.2)]
        ">
          <Image
            src="/logo.png"
            alt="vyay logo"
            width={36}
            height={36}
            className="w-full h-full object-contain drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]"
          />
        </div>
        <p className=" font-surgena text-3xl font-extrabold tracking-widest text-[#f4f4f5] pt-1">
          Vyay<span className="text-[#a3e635]">.</span>
        </p>
        </Link>
        <ul className="hidden md:flex items-center gap-8 list-none">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[#a1a1aa] text-md font-medium tracking-wide hover:text-[#f4f4f5] transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="#cta">
        <Button
          className="relative px-5 py-5 rounded-full text-md font-semibold cursor-pointer transition-all duration-300 bg-[#a3e635] text-[#09090b] border-none
          /* 3D Depth & Internal Lighting */
          shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),inset_0_-4px_6px_rgba(0,0,0,0.2),0_10px_20px_-5px_rgba(163,230,53,0.4)] 
          /* Hover Effects */
          hover:scale-105 
          hover:shadow-[0_0_30px_rgba(163,230,53,0.6),inset_0_2px_2px_rgba(255,255,255,0.8)]
          /* Active/Press Effect */
          active:scale-95 active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.3)]"
        >
          Get Started
        </Button>
        </Link>
      </nav>

      {/* HERO */}
      <section id="hero" className="min-h-screen flex items-center px-6 md:px-12 lg:px-20 py-24 relative overflow-hidden">
        <div className="absolute -top-52 -left-52 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(163,230,53,0.07),transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(163,230,53,0.04),transparent_70%)] pointer-events-none" />
        <div className="max-w-[1260px] mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="fade-up inline-flex items-center gap-2 bg-[rgba(163,230,53,0.08)] border border-[rgba(163,230,53,0.2)] text-[#a3e635] px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6">
              <span className="w-1.5 h-1.5 bg-[#a3e635] rounded-full animate-[pulse_2s_infinite]" />
              AI-Powered Finance
            </div>
            <h1 className="fade-up font-['Syne',sans-serif] text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-[#f4f4f5] mb-5">
              Understand Your Money.<br /><em className="not-italic text-[#a3e635]">Effortlessly.</em>
            </h1>
            <p className="fade-up text-[#a1a1aa] text-base md:text-lg max-w-[420px] leading-relaxed font-light mb-10">
              Track expenses, analyze spending, and get AI-powered financial insights — all in one beautifully simple app.
            </p>
            <div className="fade-up flex gap-4 flex-wrap">
              <a href="#cta" className="bg-[#a3e635] text-[#09090b] border-none py-3 px-8 rounded-full text-base font-semibold no-underline inline-block hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(163,230,53,0.3)] transition-all">
                Get Started
              </a>
              <a href="#ai" className="bg-transparent text-[#f4f4f5] border border-[rgba(255,255,255,0.07)] py-3 px-8 rounded-full text-base font-medium no-underline inline-block hover:border-white/20 hover:bg-white/[0.03] transition-all">
                View Demo
              </a>
            </div>
          </div>
          <div className="fade-up hidden lg:block animate-[float_6s_ease-in-out_infinite]">
            <HeroDashboard />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t border-[rgba(255,255,255,0.07)]">
        <div className="max-w-[1260px] mx-auto">
          <div className="fade-up text-center mb-14">
            <div className="text-[#a3e635] text-xs font-bold tracking-[0.14em] uppercase mb-3">Features</div>
            <h2 className="font-['Syne',sans-serif] text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Everything you need to master your finances
            </h2>
            <p className="text-[#a1a1aa] text-base font-light max-w-[480px] mx-auto leading-relaxed">
              Built for people who want clarity, not complexity.
            </p>
          </div>
          <div className="features-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* AI SECTION */}
      <section id="ai" className="px-6 md:px-12 lg:px-20 py-20 md:py-28 relative bg-[linear-gradient(180deg,transparent_0%,rgba(163,230,53,0.03)_30%,rgba(163,230,53,0.05)_50%,rgba(163,230,53,0.03)_70%,transparent_100%)] border-y border-[rgba(255,255,255,0.07)]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(163,230,53,0.06),transparent_70%)] pointer-events-none" />
        <div className="max-w-315 mx-auto grid lg:grid-cols-2 gap-20 items-center relative">
          <div className="fade-up">
            <div className="text-[#a3e635] text-xs font-bold tracking-[0.14em] uppercase mb-3">AI Assistant</div>
            <h2 className="font-['Syne',sans-serif] text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Your money, finally explained.
            </h2>
            <p className="text-[#a1a1aa] text-base font-light leading-relaxed mb-8">
              Just ask. Vyay&apos;s AI understands your financial patterns and answers in plain language — no jargon, no confusion.
            </p>
            <div className="flex flex-col gap-3.5">
              {aiPoints.map((p, i) => (
                <div key={i} className="flex items-start gap-3.5 p-4 bg-[#111113] border border-[rgba(255,255,255,0.07)] rounded-xl">
                  <div className="w-2 h-2 bg-[#a3e635] rounded-full mt-2 shrink-0" />
                  <p className="text-[#a1a1aa] text-sm font-light">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="fade-up">
            <ChatMock />
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section id="dashboard" className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t border-[rgba(255,255,255,0.07)]">
        <div className="max-w-315 mx-auto">
          <div className="fade-up text-center mb-14">
            <div className="text-[#a3e635] text-xs font-bold tracking-[0.14em] uppercase mb-3">Dashboard</div>
            <h2 className="font-['Syne',sans-serif] text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Your finances at a glance
            </h2>
            <p className="text-[#a1a1aa] text-base font-light max-w-[480px] mx-auto leading-relaxed">
              A clean, powerful dashboard that gives you full visibility into your financial life.
            </p>
          </div>
          <DashboardPreview />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t border-[rgba(255,255,255,0.07)]">
        <div className="max-w-[1260px] mx-auto">
          <div className="fade-up text-center mb-14">
            <div className="text-[#a3e635] text-xs font-bold tracking-[0.14em] uppercase mb-3">How it works</div>
            <h2 className="font-['Syne',sans-serif] text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Three steps to financial clarity
            </h2>
            <p className="text-[#a1a1aa] text-base font-light max-w-[480px] mx-auto leading-relaxed">
              Getting started takes under two minutes. No spreadsheets. No complexity.
            </p>
          </div>
          <div className="steps-grid grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="absolute top-8 left-[16.67%] right-[16.67%] h-px bg-[linear-gradient(90deg,transparent,rgba(163,230,53,0.3),transparent)] hidden md:block" />
            {steps.map((s) => (
              <div key={s.num} className="fade-up bg-[#111113] border border-[rgba(255,255,255,0.07)] rounded-2xl p-8 transition-all hover:-translate-y-1 hover:border-[rgba(163,230,53,0.2)]">
                <div className="font-['Syne',sans-serif] text-[2.5rem] font-extrabold text-[rgba(163,230,53,0.15)] tracking-tight leading-none mb-4">
                  {s.num}
                </div>
                <h3 className="font-['Syne',sans-serif] text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-[#a1a1aa] text-sm font-light leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      {/* STATS */}
      <section id="stats" className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t border-[rgba(255,255,255,0.07)]">
        <div className="max-w-315 mx-auto">
          <div className="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div 
                key={s.label} 
                className="fade-up group relative p-8 rounded-2xl bg-[#111113] border border-[rgba(255,255,255,0.03)] 
                shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_30px_-10px_rgba(0,0,0,0.5)]
                hover:border-[#a3e635]/20 hover:shadow-[0_0_30px_rgba(163,230,53,0.05)] transition-all duration-500"
              >
                {/* Subtle Glow behind the number */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(163,230,53,0.03),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className="font-['Syne',sans-serif] text-3xl md:text-5xl font-extrabold text-[#a3e635] tracking-tight drop-shadow-[0_0_15px_rgba(163,230,53,0.3)]">
                    {s.num}
                  </div>
                  <div className="text-[#52525b] group-hover:text-[#a1a1aa] text-xs md:text-sm mt-2 uppercase tracking-widest font-bold transition-colors">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="px-6 md:px-12 lg:px-20 py-20 md:py-28 border-t border-[rgba(255,255,255,0.07)] text-center relative overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(163,230,53,0.06),transparent_70%)]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-['Syne',sans-serif] text-[8rem] md:text-[18rem] font-extrabold text-[rgba(163,230,53,0.025)] tracking-tight leading-none whitespace-nowrap pointer-events-none select-none">
          VYAY
        </div>
        <div className="max-w-160 mx-auto relative">
          <div className="fade-up text-[#a3e635] text-xs font-bold tracking-[0.14em] uppercase mb-3">Join Vyay</div>
          <h2 className="fade-up font-['Syne',sans-serif] text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">
            The Future of Finance
          </h2>
          <p className="fade-up text-[#a1a1aa] text-base font-light leading-relaxed mb-10">
            Experience the power of AI-driven insights and blockchain security. 
            Start your journey toward true financial clarity today.
          </p>
          <div className="fade-up flex justify-center gap-4 flex-wrap">
            <Link href="/register">
            <Button
              className="relative px-8 py-6 rounded-full text-md font-semibold cursor-pointer transition-all duration-300 bg-[#a3e635] text-[#09090b] border-none
              /* 3D Depth & Internal Lighting */
              shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),inset_0_-4px_6px_rgba(0,0,0,0.2),0_10px_20px_-5px_rgba(163,230,53,0.4)] 
              /* Hover Effects */
              hover:scale-105 
              hover:shadow-[0_0_30px_rgba(163,230,53,0.6),inset_0_2px_2px_rgba(255,255,255,0.8)]
              /* Active/Press Effect */
              active:scale-95 active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.3)]"
            >
              Get Started
            </Button>
            </Link>
              <Link href="#features">
            <Button
              className="relative px-8 py-6 rounded-full text-md font-medium cursor-pointer transition-all duration-300 
              bg-[#111113] text-[#f4f4f5] border border-[rgba(255,255,255,0.07)]
              /* 3D Depth for Dark Button */
              shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-2px_4px_rgba(0,0,0,0.6),0_10px_20px_-5px_rgba(0,0,0,0.5)]
              /* Hover Effects */
              hover:scale-105 
              hover:border-white/20 hover:bg-[#161618]
              hover:shadow-[0_0_20px_rgba(255,255,255,0.05),inset_0_1px_1px_rgba(255,255,255,0.2)]
              /* Active/Press Effect */
              active:scale-95"
            >
              Learn More
            </Button>
          </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 md:px-12 lg:px-20 py-10 border-t border-[rgba(255,255,255,0.07)]">
        <div className="max-w-315 mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[16px] text-[#52525b]">
            Made with ❤️ by Satvik
          </div>
          <div className="text-[#52525b] text-[16px]">© 2026 Vyay. All rights reserved.</div>
          <div className="flex items-center gap-8">
            {footerLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="group flex items-center transition-all duration-300"
              >
                {link.icon ? (
                  <HugeiconsIcon 
                    icon={link.icon} // 
                    size={28}  
                    className="text-[#52525b] transition-all duration-300 group-hover:text-[#a3e635] group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(163,230,53,0.5)]"
                  />
                ) : (
                  <span className="text-[15px] text-[#52525b] hover:text-[#f4f4f5] transition-colors tracking-wide">
                    {link.name}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}

function HeroDashboard() {
  const transactions = [
    { icon: "🍜", bg: "rgba(251,146,60,.12)", name: "Swiggy Order", cat: "Food · Today", amount: "−₹340", type: "debit" },
    { icon: "💰", bg: "rgba(34,197,94,.1)", name: "Salary Credit", cat: "Income · Mar 28", amount: "+₹85,000", type: "credit" },
    { icon: "🛍️", bg: "rgba(139,92,246,.1)", name: "Amazon", cat: "Shopping · Mar 26", amount: "−₹1,299", type: "debit" },
    { icon: "✈️", bg: "rgba(59,130,246,.1)", name: "IndiGo Flight", cat: "Travel · Mar 25", amount: "−₹4,200", type: "debit" },
  ];

  return (
    <div className="bg-[#111113] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6 shadow-[0_40px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.07)]">
      <div className="flex items-center justify-between mb-5">
        <span className="font-['Syne',sans-serif] text-xs font-bold text-[#a1a1aa] tracking-[0.1em] uppercase">Overview</span>
        <span className="text-xs text-[#52525b] bg-[#161618] px-3 py-1 rounded-full border border-[rgba(255,255,255,0.07)]">March 2026</span>
      </div>
      <div className="bg-[linear-gradient(135deg,rgba(163,230,53,0.1),rgba(163,230,53,0.03))] border border-[rgba(163,230,53,0.15)] rounded-xl p-5 mb-5">
        <div className="text-[10px] text-[#52525b] tracking-[0.07em] uppercase mb-2">Total Balance</div>
        <div className="font-['Syne',sans-serif] text-2xl font-extrabold tracking-tight">₹1,24,850</div>
        <div className="text-xs text-[#a3e635] mt-1">↑ 8.3% from last month</div>
      </div>
      <div className="flex flex-col gap-2.5 mb-5">
        {transactions.map((t) => (
          <div key={t.name} className="flex items-center gap-3.5 p-3 bg-[#161618] rounded-xl border border-[rgba(255,255,255,0.07)]">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0" style={{ background: t.bg }}>
              {t.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{t.name}</div>
              <div className="text-[10px] text-[#52525b]">{t.cat}</div>
            </div>
            <div className={`font-['Syne',sans-serif] text-sm font-bold ${t.type === "debit" ? "text-red-400" : "text-[#a3e635]"}`}>
              {t.amount}
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="text-[10px] text-[#52525b] mb-2">Spending this week</div>
        <div className="flex items-end gap-1 h-10">
          {sparkBars.map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm transition-colors cursor-pointer ${i === 5 ? "bg-[#a3e635]" : "bg-[rgba(163,230,53,0.15)] hover:bg-[rgba(163,230,53,0.4)]"}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatMock() {
  return (
    <div className="bg-[#111113] border border-[rgba(163,230,53,0.15)] rounded-2xl p-6 shadow-[0_0_60px_rgba(163,230,53,0.07),0_40px_60px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-3 pb-5 border-b border-[rgba(255,255,255,0.07)] mb-5">
        <div className="w-8 h-8 rounded-full bg-[linear-gradient(135deg,#a3e635,#65a30d)] flex items-center justify-center font-['Syne',sans-serif] text-xs font-extrabold text-[#09090b]">
          V
        </div>
        <div>
          <div className="text-sm font-semibold">Vyay AI</div>
          <div className="text-xs text-[#a3e635] flex items-center gap-1">
            <span className="w-1 h-1 bg-[#a3e635] rounded-full" />
            Online
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 mb-5">
        <div className="self-end max-w-[88%]">
          <div className="bg-[rgba(163,230,53,0.12)] border border-[rgba(163,230,53,0.2)] text-[#f4f4f5] p-3 rounded-2xl rounded-br-sm text-sm leading-relaxed">
            Where did I spend the most this month?
          </div>
          <div className="text-[10px] text-[#52525b] mt-1 text-right">2:14 PM</div>
        </div>
        <div className="self-start max-w-[88%]">
          <div className="bg-[#161618] border border-[rgba(255,255,255,0.07)] text-[#a1a1aa] p-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed">
            Here are your top spending categories this month:
            <div className="flex gap-2 mt-3">
              <div className="bg-[#111113] border border-[rgba(255,255,255,0.07)] rounded-lg p-2 flex-1">
                <div className="text-[10px]">🍜 Food</div>
                <div className="font-['Syne',sans-serif] text-sm font-bold">₹4,200</div>
                <div className="text-[10px] text-red-400">↑ 12% vs last month</div>
              </div>
              <div className="bg-[#111113] border border-[rgba(255,255,255,0.07)] rounded-lg p-2 flex-1">
                <div className="text-[10px]">🛍️ Shopping</div>
                <div className="font-['Syne',sans-serif] text-sm font-bold">₹2,800</div>
                <div className="text-[10px] text-[#a3e635]">↓ 5% vs last month</div>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-[#52525b] mt-1">2:14 PM</div>
        </div>
        <div className="self-end max-w-[88%]">
          <div className="bg-[rgba(163,230,53,0.12)] border border-[rgba(163,230,53,0.2)] text-[#f4f4f5] p-3 rounded-2xl rounded-br-sm text-sm leading-relaxed">
            How can I cut down on food expenses?
          </div>
          <div className="text-[10px] text-[#52525b] mt-1 text-right">2:15 PM</div>
        </div>
        <div className="self-start max-w-[88%]">
          <div className="bg-[#161618] border border-[rgba(255,255,255,0.07)] text-[#a1a1aa] p-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed">
            Cooking 3 meals a week at home could save you ~₹1,400/month. Want a weekly meal budget plan?
          </div>
          <div className="text-[10px] text-[#52525b] mt-1">2:15 PM</div>
        </div>
      </div>
      <div className="flex items-center gap-2.5 bg-[#161618] border border-[rgba(255,255,255,0.07)] rounded-full p-2 pl-4">
        <span className="flex-1 text-xs text-[#52525b]">Ask anything about your finances...</span>
        <button className="w-8 h-8 rounded-full bg-[#a3e635] border-none cursor-pointer flex items-center justify-center hover:scale-110 transition-transform">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#09090b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function DashboardPreview() {
  const transactions = [
    { icon: "🍜", bg: "rgba(251,146,60,.12)", name: "Swiggy Order", date: "Today", amount: "−₹340", color: "text-red-400" },
    { icon: "💰", bg: "rgba(34,197,94,.1)", name: "Salary Credit", date: "Mar 28", amount: "+₹85,000", color: "text-[#a3e635]" },
    { icon: "🛍️", bg: "rgba(139,92,246,.1)", name: "Amazon", date: "Mar 26", amount: "−₹1,299", color: "text-red-400" },
    { icon: "✈️", bg: "rgba(59,130,246,.1)", name: "IndiGo Flight", date: "Mar 25", amount: "−₹4,200", color: "text-red-400" },
  ];

  return (
    <div className="fade-up bg-[#111113] border border-[rgba(255,255,255,0.07)] rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
      <div className="bg-[#161618] border-b border-[rgba(255,255,255,0.07)] p-4 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
      </div>
      <div className="p-6 grid lg:grid-cols-[260px_1fr] gap-5">
        <div className="flex flex-col gap-4">
          <div className="bg-[linear-gradient(135deg,rgba(163,230,53,0.12),rgba(163,230,53,0.04))] border border-[rgba(163,230,53,0.2)] rounded-xl p-4">
            <div className="text-[10px] text-[#52525b] uppercase tracking-[0.08em] mb-2">Net Balance</div>
            <div className="font-['Syne',sans-serif] text-xl font-extrabold text-[#a3e635] tracking-tight">₹1,24,850</div>
            <div className="text-[10px] text-[#52525b] mt-1">↑ 8.3% this month</div>
          </div>
          <div className="bg-[#161618] border border-[rgba(255,255,255,0.07)] rounded-xl p-4">
            <div className="text-[10px] text-[#52525b] uppercase tracking-[0.08em] mb-2">Total Spent</div>
            <div className="font-['Syne',sans-serif] text-xl font-extrabold tracking-tight">₹18,420</div>
            <div className="text-[10px] text-[#52525b] mt-1">March 2026</div>
          </div>
          <div className="bg-[#161618] border border-[rgba(255,255,255,0.07)] rounded-xl p-4">
            <div className="text-[10px] text-[#52525b] uppercase tracking-[0.08em] mb-2">Top Category</div>
            <div className="font-['Syne',sans-serif] text-base font-extrabold tracking-tight">🍜 Food</div>
            <div className="text-[10px] text-[#52525b] mt-1">₹4,200 · 22.8%</div>
          </div>
          <div className="bg-[#161618] border border-[rgba(255,255,255,0.07)] rounded-xl p-4">
            <div className="text-[10px] text-[#52525b] uppercase tracking-[0.08em] mb-2">Savings Rate</div>
            <div className="font-['Syne',sans-serif] text-xl font-extrabold tracking-tight">38.4%</div>
            <div className="text-[10px] text-[#52525b] mt-1">↑ 3% vs last month</div>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="bg-[#161618] border border-[rgba(255,255,255,0.07)] rounded-xl p-5">
            <div className="text-xs font-semibold text-[#a1a1aa] mb-4 tracking-[0.04em]">MONTHLY SPENDING — 2025–26</div>
            <div className="flex items-end gap-1 h-20 mb-6">
              {monthlySpending.map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-sm transition-colors cursor-pointer ${i === 11 ? "bg-[rgba(163,230,53,0.38)]" : "bg-white/[0.06]"} hover:bg-[rgba(163,230,53,0.28)] relative`}
                  style={{ height: `${h}%` }}
                >
                  <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-[#52525b] whitespace-nowrap">
                    {months[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#161618] border border-[rgba(255,255,255,0.07)] rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xs font-semibold text-[#a1a1aa] tracking-[0.04em]">RECENT TRANSACTIONS</div>
              <span className="text-xs text-[#a3e635] cursor-pointer">See all →</span>
            </div>
            {transactions.map((t) => (
              <div key={t.name} className="flex items-center gap-3 py-3 border-b border-[rgba(255,255,255,0.07)] last:border-0">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0" style={{ background: t.bg }}>
                  {t.icon}
                </div>
                <div className="flex-1 text-sm font-medium">{t.name}</div>
                <div className="text-[10px] text-[#52525b]">{t.date}</div>
                <div className={`font-['Syne',sans-serif] text-sm font-bold ${t.color}`}>{t.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="fade-up group bg-[#111113] border border-[rgba(255,255,255,0.07)] rounded-2xl p-8 transition-all hover:-translate-y-1 hover:border-[rgba(163,230,53,0.22)] hover:shadow-[0_24px_48px_rgba(0,0,0,0.35)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(163,230,53,0.12),transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-11 h-11 bg-[rgba(163,230,53,0.1)] border border-[rgba(163,230,53,0.2)] rounded-xl flex items-center justify-center text-xl mb-5 relative">
        {icon}
      </div>
      <h3 className="font-['Syne',sans-serif] text-lg font-bold mb-2 relative">{title}</h3>
      <p className="text-[#a1a1aa] text-sm font-light leading-relaxed relative">{desc}</p>
    </div>
  );
}
