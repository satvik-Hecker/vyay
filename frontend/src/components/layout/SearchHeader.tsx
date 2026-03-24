"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  Notification03Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";

import Image from "next/image";
import { useState } from "react";

type User = {
  name?: string;
  email?: string;
};

type HeaderProps = {
  user?: User;
};

export default function SearchHeader({ user }: HeaderProps) {
  const name = user?.name ?? "Guest";
  const email = user?.email ?? "guest@vyay.app";

  const [query, setQuery] = useState("");

  const avatar = `https://api.dicebear.com/9.x/micah/png?seed=${email}&size=64`;

  return (
    <header className="w-full flex items-center justify-between gap-3 sm:gap-4 bg-zinc-900 px-3 sm:px-5 py-2 sm:py-3 rounded-xl font-sans backdrop-blur-xl
          border border-white/5">
      
      {/* 🔍 Search */}
      <div className="flex items-center gap-2 bg-zinc-800 px-3 sm:px-4 h-9 sm:h-10 rounded-full flex-1 max-w-full sm:max-w-md transition focus-within:ring-2 focus-within:ring-lime-500">
        
        <HugeiconsIcon
          icon={Search01Icon}
          size={16}
          strokeWidth={1.5}
          color="#9ca3af"
        />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search transactions..."
          className="bg-transparent outline-none text-sm text-zinc-200 flex-1 placeholder:text-zinc-400"
        />
      </div>

      {/* 🔔 Right Section */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        
        {/* Messages */}
        <button
          aria-label="Messages"
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-zinc-800 rounded-full hover:bg-zinc-700 transition focus:outline-none focus:ring-2 focus:ring-lime-500"
        >
          <HugeiconsIcon
            icon={Mail01Icon}
            size={16}
            strokeWidth={1.5}
            color="#d4d4d8"
          />
        </button>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-zinc-800 rounded-full hover:bg-zinc-700 transition focus:outline-none focus:ring-2 focus:ring-lime-500"
        >
          <HugeiconsIcon
            icon={Notification03Icon}
            size={16}
            strokeWidth={1.5}
            color="#d4d4d8"
          />
        </button>

        {/* 👤 Profile */}
        <div className="flex items-center gap-2 sm:gap-3 px-1 sm:px-2 py-1 rounded-lg">
          
          <Image
            src={avatar}
            alt="profile avatar"
            width={32}
            height={32}
            className="rounded-full border border-zinc-700"
          />

          {/* Hide text on small screens */}
          <div className="hidden md:block leading-tight">
            <p className="text-sm text-white font-medium">
              {name}
            </p>
            <p className="text-xs text-zinc-400">
              {email}
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}