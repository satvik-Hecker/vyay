"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  Notification03Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";

import Image from "next/image";

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

  const avatar = `https://api.dicebear.com/9.x/micah/png?seed=${email}&size=64&backgroundType=gradientLinear&baseColor=ac6651,f9c9b6&hairColor=000000,77311d,9287ff,ac6651,d2eff3,e0ddff,f4d150,f9c9b6,fc909f,ffeba4,ffedef,ffffff,6bd9e9&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&earringsProbability=100`;

  return (
    <header className="flex items-center justify-between gap-4 bg-zinc-900 px-5 h-12 rounded-xl font-sans ml-[60px] md:ml-0">
      
      {/* Search */}
      <div className="flex items-center gap-2 bg-zinc-800 px-3 h-8 rounded-full w-full max-w-md">
        <HugeiconsIcon
          icon={Search01Icon}
          size={16}
          strokeWidth={1.5}
          color="#9ca3af"
        />

        <input
          type="text"
          placeholder="Search"
          className="bg-transparent outline-none text-sm text-zinc-200 flex-1 placeholder:text-zinc-400"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        
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

        {/* Profile */}
        <div className="flex items-center gap-2 sm:gap-3 px-2 py-1 rounded-lg">
          <Image
            src={avatar}
            alt="profile avatar"
            width={32}
            height={32}
            className="rounded-full border border-zinc-700"
          />

          <div className="hidden sm:block leading-tight">
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