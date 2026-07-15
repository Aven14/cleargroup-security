"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, User, Shield, Bell, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
        <p className="text-sm text-muted-foreground mt-1">Gérez votre compte et vos préférences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Informations du compte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Prénom</label>
                <Input value={session?.user?.firstName || ""} disabled />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nom</label>
                <Input value={session?.user?.lastName || ""} disabled />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input value={session?.user?.email || ""} disabled />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Pour modifier vos informations personnelles, veuillez contacter l'administrateur.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Mot de passe</label>
              <Input type="password" value="••••••••" disabled />
            </div>
            <Button variant="outline">Changer le mot de passe</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Configurez vos préférences de notification.</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Alertes en temps réel</span>
              <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Notifications par email</span>
              <div className="w-12 h-6 bg-muted rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Settings className="h-4 w-4" />
            Zone de danger
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Actions irréversibles sur votre compte.</p>
            <Button onClick={() => signOut({ callbackUrl: "/auth/login" })} variant="destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-foreground">ClearSecurity</h3>
            <p className="text-sm text-muted-foreground">Version 1.0.0</p>
            <p className="text-xs text-muted-foreground">© 2024 ClearGroup. Tous droits réservés.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}