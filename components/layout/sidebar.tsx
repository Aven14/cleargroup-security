"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShieldCheck,
  Car,
  FileText,
  AlertTriangle,
  Lock,
  Users,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const navigation = [
  { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { name: "Prise de service", href: "/dashboard/duty", icon: ShieldCheck },
  { name: "Patrouilles", href: "/dashboard/patrols", icon: Car },
  { name: "Débriefings", href: "/dashboard/debriefings", icon: FileText },
  { name: "Alertes", href: "/dashboard/alerts", icon: AlertTriangle },
  { name: "Personnes détenues", href: "/dashboard/detained", icon: Lock },
  { name: "Agents", href: "/dashboard/agents", icon: Users },
  { name: "Planning", href: "/dashboard/planning", icon: Calendar },
  { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="fixed left-0 top-0 z-50 h-screen w-64 bg-white border-r border-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-border px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground">ClearSecurity</h1>
              <p className="text-xs text-muted-foreground">ClearGroup</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent/5 hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-border p-4">
          {session?.user && (
            <div className="mb-3 rounded-lg bg-muted/10 p-3">
              <p className="text-sm font-medium text-foreground">
                {session.user.firstName} {session.user.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}