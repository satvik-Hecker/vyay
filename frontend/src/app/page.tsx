"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {motion, Variants} from 'framer-motion'
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
  { 
    num: "01", 
    title: "On-Chain Identity", 
    desc: "Create your secure account. Your identity and financial data are anchored with blockchain-level encryption from day one." 
  },
  { 
    num: "02", 
    title: "Secure CRUD Ops", 
    desc: "Log and manage transactions with peace of mind. Every record is encrypted on an immutable ledger for total integrity." 
  },
  { 
    num: "03", 
    title: "Visual Intelligence", 
    desc: "Access pro-grade analytics and transaction pages designed for maximum clarity and instant visual insights." 
  },
  { 
    num: "04", 
    title: "Consult Vy-AI", 
    desc: "Chat with your personal finance strategist for hyper-personalized insights, savings tips, and real-time wealth advice." 
  },
];

const stats = [
  { num: "24/7", label: "AI Insights", sub: "Continuous pattern analysis & anomaly detection." },
  { num: "0 %", label: "Tamper Risk", sub: "Immutable blockchain ledger ensures data integrity." },
  { num: "<2s", label: "Sync Latency", sub: "Ultra-low delay between node propagation." },
  { num: "-80%", label: "Manual Entry", sub: "Significant reduction in repetitive data input." },
];

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
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-17 px-6 md:px-12 lg:px-20 bg-[rgba(9,9,11,.85)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.07)]"
      >
        {/* Logo */}
        <Link href="/" className="flex gap-3">
          <div className="
          shrink-0 w-10 h-10  rounded-lg sm:rounded-xl 
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
        <div className="absolute -top-52 -left-52 w-175 h-175 rounded-full bg-[radial-gradient(circle,rgba(163,230,53,0.07),transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-125 h-125 rounded-full bg-[radial-gradient(circle,rgba(163,230,53,0.04),transparent_70%)] pointer-events-none" />
        <div className="max-w-315 mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="fade-up inline-flex items-center gap-2 bg-[rgba(163,230,53,0.08)] border border-[rgba(163,230,53,0.2)] text-[#a3e635] px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6">
              <span className="w-1.5 h-1.5 bg-[#a3e635] rounded-full animate-[pulse_2s_infinite]" />
              AI-Powered Finance
            </div>
            <h1 className="fade-up font-['Syne',sans-serif] text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-[#f4f4f5] mb-5">
              Understand Your Money.<br /><em className="not-italic text-[#a3e635]">Effortlessly.</em>
            </h1>
            <p className="fade-up text-[#a1a1aa] text-base md:text-lg max-w-105 leading-relaxed font-light mb-10">
              Track expenses, analyze spending, and get AI-powered financial insights — all in one beautifully simple app.
            </p>
            <div className="fade-up flex gap-4 flex-wrap">
              <a href="#cta" className="bg-[#a3e635] text-[#09090b] border-none py-3 px-8 rounded-full text-base font-semibold no-underline inline-block hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(163,230,53,0.3)] transition-all">
                Get Started
              </a>
              <a href="#ai" className="bg-transparent text-[#f4f4f5] border border-[rgba(255,255,255,0.07)] py-3 px-8 rounded-full text-base font-medium no-underline inline-block hover:border-white/20 hover:bg-white/3 transition-all">
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
        <div className="max-w-315 mx-auto">
          <div className="fade-up text-center mb-14">
            <div className="text-[#a3e635] text-xs font-bold tracking-[0.14em] uppercase mb-3">Features</div>
            <h2 className="font-['Syne',sans-serif] text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Everything you need to master your finances
            </h2>
            <p className="text-[#a1a1aa] text-base font-light max-w-120 mx-auto leading-relaxed">
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-[radial-gradient(ellipse,rgba(163,230,53,0.06),transparent_70%)] pointer-events-none" />
        <div className="max-w-315 mx-auto grid lg:grid-cols-2 gap-20 items-center relative">
          <div className="fade-up">
            <div className="text-[#a3e635] text-xs font-bold tracking-[0.14em] uppercase mb-3">AI Assistant</div>
            <h2 className="font-['Syne',sans-serif] text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Your money, finally explained.
            </h2>
            <p className="text-[#a1a1aa] text-base font-light leading-relaxed mb-8">
             Have a question? Just ask. Vyay’s AI translates your complex financial data into plain, actionable advice.
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
      <section 
      id="dashboard" 
      className="relative px-6 md:px-12 lg:px-20 py-24 md:py-32 border-t border-white/5 bg-zinc-950 overflow-hidden"
    >
      {/* Decorative Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 md:w-250 md:h-125 bg-lime-500/10 blur-[100px] md:blur-[150px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10">
        
        {/* Header Text Area */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="text-lime-400 text-xs md:text-sm font-bold tracking-[0.15em] uppercase mb-4">
            Dashboard
          </div>
          <h2 className="font-['Syne',sans-serif] text-3xl md:text-5xl  font-extrabold tracking-tight text-white mb-6">
            Your finances at a glance
          </h2>
          <p className="text-zinc-400 text-base   font-light max-w-2xl mx-auto leading-relaxed">
            A clean, powerful dashboard that gives you full visibility into your financial life. Track spending, monitor goals, and grow your wealth.
          </p>
        </motion.div>

        {/* Dashboard Component Wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
         
          <div className="relative rounded-2xl ring-1 max-w-5xl mx-auto ring-white/10 ring-offset-4 ring-offset-zinc-950/50 shadow-[0_0_100px_rgba(163,230,53,0.05)]">
            <DashboardPreview />
          </div>
        </motion.div>

      </div>
    </section>
  

      <section id="how" className="px-6 md:px-12 lg:px-20 py-18 md:py-20 border-t border-[rgba(255,255,255,0.07)]">
  <div className="max-w-315 mx-auto">
    <div className="fade-up text-center mb-14">
      <div className="text-[#a3e635] text-xs font-bold tracking-[0.14em] uppercase mb-3">The Protocol</div>
      <h2 className="font-['Syne',sans-serif] text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
        Four steps to <span className="text-[#a3e635]">absolute</span> clarity
      </h2>
      <p className="text-[#a1a1aa] text-base font-light max-w-120 mx-auto leading-relaxed">
        From secure account creation to AI-powered wealth strategy in minutes.
      </p>
    </div>

    {/* STEPS GRID */}
    <div className="steps-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
      {/* Connector Line for Desktop */}
      <div className="absolute top-12 left-[10%] right-[10%] h-px bg-[linear-gradient(90deg,transparent,rgba(163,230,53,0.2),transparent)] hidden lg:block" />
      
      {steps.map((s) => (
        <div 
          key={s.num} 
          className="fade-up group bg-[#111113] border border-[rgba(255,255,255,0.05)] rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:border-[#a3e635]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]"
        >
          {/* Step Number with Neon Glow on Hover */}
          <div className="font-['Syne',sans-serif] text-[2.5rem] font-extrabold text-[rgba(163,230,53,0.1)] tracking-tight leading-none mb-6 group-hover:text-[#a3e635] group-hover:drop-shadow-[0_0_10px_rgba(163,230,53,0.4)] transition-all duration-500">
            {s.num}
          </div>
          
          <h3 className="font-['Syne',sans-serif] text-xl font-bold mb-3 text-[#f4f4f5] group-hover:text-[#a3e635] transition-colors">
            {s.title}
          </h3>
          
          <p className="text-[#52525b] group-hover:text-[#a1a1aa] text-sm font-light leading-relaxed transition-colors">
            {s.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

      
      {/* STATS */}
      <section id="stats" className="px-6 md:px-12 lg:px-18 py-18 md:py-20 border-t border-[rgba(255,255,255,0.07)]">
        <div className="max-w-315 mx-auto">
          <div className="fade-up text-center mb-16">
      <h2 className="font-['Syne',sans-serif] text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
        Built for <span className="text-[#a3e635]">performance</span>.
      </h2>
      <p className="text-[#a1a1aa] text-base font-light max-w-125 mx-auto leading-relaxed">
        Technical benchmarks that power a secure and intelligent financial ecosystem.
      </p>
    </div>
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
        <span className="font-['Syne',sans-serif] text-xs font-bold text-[#a1a1aa] tracking-widest uppercase">Overview</span>
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
          <div className="text-sm font-semibold">Vy-AI</div>
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
  const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  }
};
  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  
  const transactions = [
    { 
      id: 1,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.999 2.999 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.999 2.999 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />,
      bg: "bg-orange-500/10", 
      iconColor: "stroke-orange-500",
      name: "Swiggy Order", 
      category: "Food & Dining",
      date: "Today, 1:24 PM", 
      amount: "−₹340", 
      color: "text-red-400" 
    },
    { 
      id: 2,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V5.25c0-.754-.726-1.294-1.453-1.096a60.07 60.07 0 01-15.797 2.101c-.727.198-1.453-.342-1.453-1.096V18.75c0 .754.726 1.294 1.453 1.096zM12 13.5a3 3 0 100-6 3 3 0 000 6z" />,
      bg: "bg-lime-500/10", 
      iconColor: "stroke-lime-500",
      name: "Salary Credit", 
      category: "Income",
      date: "Mar 28, 9:00 AM", 
      amount: "+₹85,000", 
      color: "text-lime-400" 
    },
    { 
      id: 3,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />,
      bg: "bg-purple-500/10", 
      iconColor: "stroke-purple-500",
      name: "Amazon Prime", 
      category: "Shopping",
      date: "Mar 26, 4:30 PM", 
      amount: "−₹1,299", 
      color: "text-red-400" 
    },
    { 
      id: 4,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />,
      bg: "bg-blue-500/10", 
      iconColor: "stroke-blue-500",
      name: "IndiGo Flight", 
      category: "Travel",
      date: "Mar 25, 11:15 AM", 
      amount: "−₹4,200", 
      color: "text-red-400" 
    },
  ];

  // Animation Variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-5xl mx-auto bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)] font-sans text-zinc-100"
    >
      
      {/* Window Controls Header */}
      <header className="bg-zinc-900/50 border-b border-white/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.3 }} className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" />
          <motion.div whileHover={{ scale: 1.3 }} className="w-3 h-3 rounded-full bg-amber-500/80 cursor-pointer" />
          <motion.div whileHover={{ scale: 1.3 }} className="w-3 h-3 rounded-full bg-green-500/80 cursor-pointer" />
        </div>
        <div className="text-xs font-medium text-zinc-400 tracking-wide">FINANCIAL DASHBOARD</div>
        <div className="w-12" />
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="p-6 md:p-8 flex flex-col gap-8"
      >
        
        {/* Top Key Metrics Row */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <motion.article variants={item} whileHover={{ y: -5, transition: { duration: 0.2 } }} className="bg-linear-to-br from-lime-400/10 to-lime-400/5 border border-lime-400/20 rounded-xl p-5 cursor-default">
            <div className="text-xs text-zinc-400 uppercase tracking-widest mb-2">Net Balance</div>
            <div className="text-3xl font-extrabold text-lime-400 tracking-tight">₹1,24,850</div>
            <div className="text-xs text-lime-400/80 mt-2 flex items-center gap-1">
              <motion.span initial={{ y: 5 }} animate={{ y: 0 }} transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}>↗</motion.span> 8.3% this month
            </div>
          </motion.article>
          
          <motion.article variants={item} whileHover={{ y: -5, transition: { duration: 0.2 } }} className="bg-zinc-900 border border-white/5 rounded-xl p-5 cursor-default">
            <div className="text-xs text-zinc-400 uppercase tracking-widest mb-2">Total Spent</div>
            <div className="text-3xl font-extrabold tracking-tight">₹18,420</div>
            <div className="text-xs text-zinc-500 mt-2">March 2026</div>
          </motion.article>

          <motion.article variants={item} whileHover={{ y: -5, transition: { duration: 0.2 } }} className="bg-zinc-900 border border-white/5 rounded-xl p-5 cursor-default">
            <div className="text-xs text-zinc-400 uppercase tracking-widest mb-2">Top Category</div>
            <div className="text-xl font-bold tracking-tight mt-1">Food & Dining</div>
            <div className="text-xs text-zinc-500 mt-3">₹4,200 · 22.8% of spend</div>
          </motion.article>

          <motion.article variants={item} whileHover={{ y: -5, transition: { duration: 0.2 } }} className="bg-zinc-900 border border-white/5 rounded-xl p-5 cursor-default">
            <div className="text-xs text-zinc-400 uppercase tracking-widest mb-2">Savings Rate</div>
            <div className="text-3xl font-extrabold tracking-tight">38.4%</div>
            <div className="text-xs text-lime-400 mt-2 flex items-center gap-1">
              <span>↗</span> 3.1% vs last month
            </div>
          </motion.article>
        </section>

        {/* Charts and Transactions Area */}
        <section className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
          
          {/* Main Chart Area */}
          <motion.article variants={item} className="bg-zinc-900 border border-white/5 rounded-xl p-6 flex flex-col">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100 mb-1">Cash Flow Overview</h3>
                <p className="text-xs text-zinc-500">Income vs Expenses (Apr 2025 - Mar 2026)</p>
              </div>
              <select className="bg-zinc-950 border border-white/10 text-xs text-zinc-300 rounded-lg px-3 py-1.5 outline-none focus:border-lime-400/50 transition-colors cursor-pointer">
                <option>Last 12 Months</option>
                <option>This Year</option>
              </select>
            </div>

            <div className="relative w-full h-48 mt-auto">
              <svg viewBox="0 0 1000 200" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a3e635" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a3e635" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <path d="M0 50 L1000 50 M0 100 L1000 100 M0 150 L1000 150" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                
                {/* Area Fill Animation */}
                <motion.path 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 1 }}
                  d="M0 160 C100 140, 150 180, 272 130 C363 90, 454 150, 545 100 C636 50, 727 120, 818 70 C909 20, 950 50, 1000 40 L1000 200 L0 200 Z" 
                  fill="url(#colorSpend)" 
                />
                
                {/* Stroke Path Drawing Animation */}
                <motion.path 
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                  d="M0 160 C100 140, 150 180, 272 130 C363 90, 454 150, 545 100 C636 50, 727 120, 818 70 C909 20, 950 50, 1000 40" 
                  fill="none" 
                  stroke="#a3e635" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
              </svg>
              
              <div className="absolute inset-x-0 -bottom-6 flex justify-between text-[10px] font-medium text-zinc-500">
                {months.map((month, i) => (
                  <span key={month} className={i === 11 ? "text-lime-400" : ""}>{month}</span>
                ))}
              </div>
            </div>
          </motion.article>

          {/* Recent Transactions */}
          <motion.article variants={item} className="bg-zinc-900 border border-white/5 rounded-xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-semibold text-zinc-100">Recent Transactions</h3>
              <motion.button whileHover={{ x: 3 }} className="text-xs text-lime-400 hover:text-lime-300 transition-colors font-medium">View All →</motion.button>
            </div>
            
            <div className="flex flex-col gap-1">
              {transactions.map((t) => (
                <motion.div 
                  key={t.id} 
                  whileHover={{ x: 6, backgroundColor: "rgba(255,255,255,0.04)" }}
                  className="group flex items-center justify-between p-3 -mx-3 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <motion.div whileHover={{ rotate: 10, scale: 1.1 }} className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${t.bg}`}>
                      <svg className={`w-5 h-5 ${t.iconColor}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                        {t.icon}
                      </svg>
                    </motion.div>
                    <div>
                      <div className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">{t.name}</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">{t.category} · {t.date}</div>
                    </div>
                  </div>
                  <div className={`text-sm font-bold tracking-tight ${t.color}`}>
                    {t.amount}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.article>

        </section>
      </motion.div>
    </motion.div>
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
