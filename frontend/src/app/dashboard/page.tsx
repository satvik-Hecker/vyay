"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import SearchHeader from "@/components/dashboard/SearchHeader";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardMain from "@/components/dashboard/DashboardMain";

const BASE_URL = "http://localhost:5000";


type User = {
  name: string;
  email: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.replace("/login");
          return;
        }

        const res = await fetch(`${BASE_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          router.replace("/login");
          return;
        }

        const data = await res.json();
        console.log(data)

        setUser(data.user);

        
      } catch (error) {
        console.error("Dashboard fetch error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-zinc-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex gap-4 p-4 bg-zinc-950 min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col gap-4">
        <SearchHeader user={user ?? undefined} />

        <DashboardMain></DashboardMain>
      </div>
    </div>
  );
}