import { Sidebar } from "./sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-[300px] min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}