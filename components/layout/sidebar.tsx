"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Shield,
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
  { name: "Tableau de bord", href: "/dashboard", icon: Home },
  { name: "Prise de service", href: "/dashboard/duty", icon: Shield },
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
    <div className="fixed left-0 top-0 z-50 h-screen w-64 border-r bg-background">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">ClearSecurity</h1>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t p-4">
          {session?.user && (
            <div className="mb-3 rounded-md bg-muted p-3">
              <p className="text-sm font-medium">
                {session.user.firstName} {session.user.lastName}
              </p>
              <p className="text-xs text-muted-foreground">{session.user.email}</p>
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
