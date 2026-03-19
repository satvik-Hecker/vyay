"use client";

import { useState } from "react";
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
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [open, setOpen] = useState(false);

  const handleClick = (item: string) => {
    setActiveItem(item);
    setOpen(false);
  };

  return (
    <>
      {/* Hamburger / Close Button */}
      <button
      onClick={() => setOpen(!open)}
      className={`md:hidden fixed top-5 left-4 z-50 w-11 h-11 flex items-center justify-center rounded-xl transition-colors ${
        open ? "bg-transparent" : "bg-lime-500"
      }`}
    >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="text-lime-500 " />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, scale: 0.7, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="text-black" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed md:relative
        top-0 left-0
        h-screen md:h-[calc(100vh-2rem)]
        w-64
        bg-zinc-900
        md:rounded-xl
        py-4
        flex flex-col
        font-sans
        shadow-xl
        transition-transform duration-300 ease-in-out
        z-40
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="px-6 flex items-center gap-4 mb-4 pl-16 md:pl-6">
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

          <h1 className="text-4xl font-surgena text-lime-500 drop-shadow-[0_6px_12px_rgba(0,0,0,0.25)]">
            Vyay
          </h1>
        </div>

        <div className="h-px bg-zinc-800 mx-6 mb-4" />

        <p className="px-6 text-xs tracking-wider text-zinc-400 mb-2">
          MENU
        </p>

        <nav className="space-y-1 mb-4">
          <SidebarItem
            icon={DashboardSquare02Icon}
            label="Dashboard"
            active={activeItem === "dashboard"}
            onClick={() => handleClick("dashboard")}
          />
          <SidebarItem
            icon={Task01Icon}
            label="Transactions"
            active={activeItem === "transactions"}
            onClick={() => handleClick("transactions")}
          />
          <SidebarItem
            icon={Calendar03Icon}
            label="Calendar"
            active={activeItem === "calendar"}
            onClick={() => handleClick("calendar")}
          />
          <SidebarItem
            icon={Analytics01Icon}
            label="Analytics"
            active={activeItem === "analytics"}
            onClick={() => handleClick("analytics")}
          />
          <SidebarItem
            icon={UserGroupIcon}
            label="Budgets"
            active={activeItem === "budgets"}
            onClick={() => handleClick("budgets")}
          />
        </nav>

        <div className="h-px bg-zinc-800 mx-6 mb-4" />

        <p className="px-6 text-xs tracking-wider text-zinc-400 mb-2">
          GENERAL
        </p>

        <nav className="space-y-1">
          <SidebarItem
            icon={Settings01Icon}
            label="Settings"
            active={activeItem === "settings"}
            onClick={() => handleClick("settings")}
          />
          <SidebarItem
            icon={HelpCircleIcon}
            label="Help"
            active={activeItem === "help"}
            onClick={() => handleClick("help")}
          />
          <SidebarItem
            icon={Logout01Icon}
            label="Logout"
            onClick={() => setOpen(false)}
          />
        </nav>
      </div>
    </>
  );
}

type SidebarItemProps = {
  icon: IconSvgElement;
  label: string;
  active?: boolean;
  onClick: () => void;
};

function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
}: SidebarItemProps) {
  return (
    <div
      onClick={onClick}
      className="relative flex items-center gap-3 pl-6 pr-4 py-2 cursor-pointer group"
    >
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