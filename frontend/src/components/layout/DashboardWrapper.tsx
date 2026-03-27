"use client";

import Sidebar from "@/components/layout/Sidebar";
import SearchHeader from "@/components/layout/SearchHeader";

export default function DashboardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 p-4 bg-zinc-950 min-h-screen">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Right Section */}
      <div className="flex-1 flex flex-col gap-4">
        <SearchHeader />
        {children}
      </div>
    </div>
  );
}