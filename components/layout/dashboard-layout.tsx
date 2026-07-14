import { Sidebar } from "./sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
