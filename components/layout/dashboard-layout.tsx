import { Sidebar } from "./sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-64 pl-12 pr-8 py-8">
        <div className="max-w-5xl ml-auto mr-8">{children}</div>
      </main>
    </div>
  );
}
