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
import { useRouter, usePathname } from "next/navigation";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleClick = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className={`md:hidden fixed top-6 left-5 z-50 w-11 h-11 flex items-center justify-center rounded-xl transition ${
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
              <X className="text-lime-500" />
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
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-30 md:hidden"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={`
          fixed md:sticky
          top-3 md:top-4
          left-3 md:left-4
          h-[calc(100vh-1.5rem)] md:h-[calc(100vh-2rem)]
          w-[85%] max-w-70 md:w-64
          bg-zinc-900/95 backdrop-blur-xl
          border border-white/5 md:border-r
          rounded-2xl
          py-4
          flex flex-col
          font-sans
          shadow-2xl
          transition-all duration-300 ease-in-out
          z-40
          ${
            open
              ? "translate-x-0 opacity-100"
              : "-translate-x-[110%] md:translate-x-0 md:opacity-100"
          }
        `}
      >
        <div className="flex flex-col h-full px-2 md:px-0">

          {/* Logo */}
          <div className="px-4 md:px-6 flex items-center gap-3 mb-4 pl-12 md:pl-6 shrink-0">
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

            <h1 className="text-2xl md:text-3xl font-surgena text-lime-500">
              Vyay
            </h1>
          </div>

          <div className="h-px bg-zinc-800 mx-4 md:mx-6 mb-4 shrink-0" />

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">

            {/* MENU */}
            <p className="px-4 md:px-6 text-xs tracking-wider text-zinc-400 mb-2">
              MENU
            </p>

            <nav className="space-y-1 mb-4">
              <SidebarItem
                icon={DashboardSquare02Icon}
                label="Dashboard"
                active={pathname === "/dashboard"}
                onClick={() => handleClick("/dashboard")}
              />
              <SidebarItem
                icon={Task01Icon}
                label="Transactions"
                active={pathname.startsWith("/transactions")}
                onClick={() => handleClick("/transactions")}
              />
              <SidebarItem
                icon={Calendar03Icon}
                label="Calendar"
                active={pathname === "/calendar"}
                onClick={() => handleClick("/calendar")}
              />
              <SidebarItem
                icon={Analytics01Icon}
                label="Analytics"
                active={pathname === "/analytics"}
                onClick={() => handleClick("/analytics")}
              />
              <SidebarItem
                icon={UserGroupIcon}
                label="Budgets"
                active={pathname === "/budgets"}
                onClick={() => handleClick("/budgets")}
              />
            </nav>

            <div className="h-px bg-zinc-800 mx-4 md:mx-6 my-4" />

            {/* GENERAL */}
            <p className="px-4 md:px-6 text-xs tracking-wider text-zinc-400 mb-2">
              GENERAL
            </p>

            <nav className="space-y-1">
              <SidebarItem
                icon={Settings01Icon}
                label="Settings"
                active={pathname === "/settings"}
                onClick={() => handleClick("/settings")}
              />
              <SidebarItem
                icon={HelpCircleIcon}
                label="About Vyay"
                active={pathname === "/help"}
                onClick={() => handleClick("/help")}
              />
              <SidebarItem
                icon={Logout01Icon}
                label="Logout"
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                }}
              />
            </nav>
          </div>
        </div>
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
      className="relative flex items-center gap-3 pl-4 md:pl-6 pr-4 py-2 cursor-pointer group hover:bg-white/5 active:scale-[0.98] rounded-md transition"
    >
      {active && (
        <motion.span
          layoutId="active-pill"
          className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-lime-500 rounded-r-md"
        />
      )}

      <HugeiconsIcon
        icon={icon}
        size={20}
        strokeWidth={1.5}
        color={active ? "#84cc16" : "#9ca3af"}
      />

      <span
        className={`text-base ${
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