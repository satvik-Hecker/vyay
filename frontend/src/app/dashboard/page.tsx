import Sidebar from "@/components/dashboard/Sidebar";
import SearchHeader from "@/components/dashboard/SearchHeader";

export default function DashboardPage() {
  return (
    <div className="flex gap-4 p-4 bg-zinc-950 min-h-screen">

      <Sidebar />

      <div className="flex-1 flex flex-col gap-4">

        <SearchHeader />

        <div className="bg-zinc-900 rounded-xl p-6">
          Dashboard content
        </div>

      </div>

    </div>
  );
}
