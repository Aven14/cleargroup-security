"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  User,
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
    <div className="fixed left-0 top-0 z-50 h-screen w-64 bg-background/80 backdrop-blur-xl border-r border-border/20">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-border/20 px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-primary-700 to-accent-500">
                ClearSecurity
              </h1>
              <p className="text-xs text-muted-foreground">ClearGroup</p>
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
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:bg-accent/10 hover:text-accent"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-border/20 p-4">
          {session?.user && (
            <div className="mb-3 rounded-xl bg-muted/30 p-3">
              <p className="text-sm font-medium text-foreground">
                {session.user.firstName} {session.user.lastName}
              </p>
              <p className="text-xs text-muted-foreground">{session.user.email}</p>
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
