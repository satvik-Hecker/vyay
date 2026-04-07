"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  Notification03Icon,
  Search01Icon,
  Menu01Icon, // Added Menu icon for the green button in your image
} from "@hugeicons/core-free-icons";

import Image from "next/image";
import { useState, useEffect } from "react";

type User = {
  name?: string;
  email?: string;
};

export default function SearchHeader() {
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  const [user] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const name = user?.name ?? "Guest";
  const email = user?.email ?? "guest@vyay.app";
  const avatar = `https://api.dicebear.com/9.x/micah/png?seed=${encodeURIComponent(email)}&size=64`;

  return (
    <header className="w-full flex items-center justify-between gap-2 sm:gap-4 bg-zinc-900 px-2 sm:px-5 py-2 sm:py-3 rounded-xl font-sans backdrop-blur-xl border border-white/5">
      
      {/* 🟢 Mobile Menu Toggle (The green button from your image) */}
      <button className="lg:hidden flex shrink-0 items-center justify-center w-10 h-10 bg-lime-500 rounded-xl text-zinc-900 hover:bg-lime-400 transition">
        <HugeiconsIcon icon={Menu01Icon} size={20} strokeWidth={2} />
      </button>

      {/* 🔍 Search - Added 'hidden xs:flex' or reduced width logic */}
      <div className="flex items-center gap-2 bg-zinc-800 px-3 h-10 rounded-full flex-1 min-w-10 sm:msm:min-w-50-w-md transition focus-within:ring-2 focus-within:ring-lime-500">
        <HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={1.5} color="#9ca3af" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="bg-transparent outline-none text-sm text-zinc-200 w-full placeholder:text-zinc-400 hidden xsm:block" 
        />
        {/* Note: I added 'hidden xsm:block' to the input text so only the icon shows on ultra-small screens if space is tight */}
      </div>

      {/* 🔔 Right Section */}
      <div className="flex items-center gap-1 sm:gap-3 shrink-0">
        <button className="w-9 h-9 flex items-center justify-center bg-zinc-800 rounded-full hover:bg-zinc-700 transition">
          <HugeiconsIcon icon={Mail01Icon} size={18} strokeWidth={1.5} color="#d4d4d8" />
        </button>

        <button className="w-9 h-9 flex items-center justify-center bg-zinc-800 rounded-full hover:bg-zinc-700 transition">
          <HugeiconsIcon icon={Notification03Icon} size={18} strokeWidth={1.5} color="#d4d4d8" />
        </button>

        {/* 👤 Profile - Simplified on mobile */}
        <div className="flex items-center gap-2 pl-1 sm:pl-2">
          <Image
            src={avatar}
            alt="profile"
            width={34}
            height={34}
            className="rounded-full border border-zinc-700 shrink-0"
          />
          {/* Keep name/email hidden on mobile to save massive space */}
          <div className="hidden lg:block leading-tight">
            <p className="text-sm text-white font-medium truncate max-w-25">
              {name}
            </p>
            <p className="text-xs text-zinc-400 truncate max-w-25">
              {email}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}   