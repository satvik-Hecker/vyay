import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardPage() {
  return (
    <div className="flex p-4">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </main>
    </div>
  );
}
