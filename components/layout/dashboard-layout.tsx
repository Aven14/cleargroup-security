import { Sidebar } from "./sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-72 p-8">
        <div className="max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
