"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import SearchHeader from "./SearchHeader";

export default function DashboardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAIPage = pathname.startsWith("/vy-ai"); 


  return (
    <div className="flex gap-4 p-4 bg-zinc-950 min-h-screen">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Right Section */}
      <div className="flex-1 flex flex-col gap-4">
        
        {/* Hide on AI page */}
        {!isAIPage && <SearchHeader />}

        {children}
      </div>
    </div>
  );
}