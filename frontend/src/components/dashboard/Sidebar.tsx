"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  DashboardSquare02Icon,
  Task01Icon,
  Calendar03Icon,
  Analytics01Icon,
  UserGroupIcon,
  Settings01Icon,
  HelpCircleIcon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";

export default function Sidebar() {
  return (
    <div className="w-64 h-186 bg-zinc-900 rounded-xl py-4 flex flex-col shadow-sm font-sans">

      {/* Logo */}
      <div className="px-6 flex items-center gap-4 mb-8">
        <div className="w-9 h-9 relative rounded-md flex items-center justify-center bg-linear-to-br from-lime-400 to-lime-600">
          <div className="absolute inset-0 bg-white/20 rounded-md blur-md opacity-30"></div>

          <Image
            src="/logo.png"
            alt="Vyay Logo"
            width={26}
            height={26}
            className="relative z-10"
          />
        </div>

        <h1
          className="text-4xl font-surgena text-lime-500
          drop-shadow-[0_6px_12px_rgba(0,0,0,0.25)]"
        >
          Vyay
        </h1>
      </div>

      {/* MENU */}
      <p className="px-6 text-xs tracking-wider text-zinc-400 mb-3">
        MENU
      </p>

      <nav className="space-y-1">
        <SidebarItem icon={DashboardSquare02Icon} label="Dashboard" active />
        <SidebarItem icon={Task01Icon} label="Transactions" />
        <SidebarItem icon={Calendar03Icon} label="Calendar" />
        <SidebarItem icon={Analytics01Icon} label="Analytics" />
        <SidebarItem icon={UserGroupIcon} label="Budgets" />
      </nav>

      {/* GENERAL */}
      <p className="px-6 text-xs tracking-wider text-zinc-400 mt-8 mb-3">
        GENERAL
      </p>

      <nav className="space-y-1">
        <SidebarItem icon={Settings01Icon} label="Settings" />
        <SidebarItem icon={HelpCircleIcon} label="Help" />
        <SidebarItem icon={Logout01Icon} label="Logout" />
      </nav>

    </div>
  );
}

type SidebarItemProps = {
  icon: IconSvgElement;
  label: string;
  active?: boolean;
};

function SidebarItem({ icon, label, active = false }: SidebarItemProps) {
  return (
    <div className="relative flex items-center gap-3 pl-6 pr-4 py-2 cursor-pointer group">
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-lime-500 rounded-r-md" />
      )}

      <HugeiconsIcon
        icon={icon}
        size={20}
        strokeWidth={1.5}
        color={active ? "#84cc16" : "#9ca3af"}
      />

      <span
        className={`text-lg ${
          active
            ? "font-semibold text-white"
            : "text-zinc-400 group-hover:text-zinc-200"
        }`}
      >
        {label}
      </span>
    </div>
  );
}