import { Sidebar } from "./sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-64 pl-32 pr-8 py-8">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}
