"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function DutyPage() {
  const { data: session } = useSession();
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [dutyStartTime, setDutyStartTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkDutyStatus();
  }, [session]);

  const checkDutyStatus = async () => {
    if (!session?.user?.id) return;
    try {
      const response = await fetch(`/api/duty/status?userId=${session.user.id}`);
      const data = await response.json();
      if (data.activeSession) {
        setIsOnDuty(true);
        setDutyStartTime(new Date(data.activeSession.startTime));
      }
    } catch (error) {
      console.error("Error checking duty status:", error);
    }
  };

  const startDuty = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const response = await fetch("/api/duty/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      });
      if (response.ok) {
        setIsOnDuty(true);
        setDutyStartTime(new Date());
      }
    } catch (error) {
      console.error("Error starting duty:", error);
    } finally {
      setLoading(false);
    }
  };

  const endDuty = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const response = await fetch("/api/duty/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      });
      if (response.ok) {
        setIsOnDuty(false);
        setDutyStartTime(null);
      }
    } catch (error) {
      console.error("Error ending duty:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Prise de service</h1>
        <p className="text-sm text-muted-foreground mt-1">Gérez vos horaires de service</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Informations agent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Nom</p>
              <p className="text-sm font-semibold text-foreground">{session?.user?.lastName} {session?.user?.firstName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-semibold text-foreground">{session?.user?.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="text-sm font-semibold text-foreground">{format(new Date(), "dd MMMM yyyy", { locale: fr })}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className={`p-6 rounded-full ${isOnDuty ? "bg-success/20" : "bg-muted/20"}`}>
                <Shield className={`h-16 w-16 ${isOnDuty ? "text-success" : "text-muted-foreground"}`} />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground">{isOnDuty ? "EN SERVICE" : "HORS SERVICE"}</h2>
              {isOnDuty && dutyStartTime && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-1">
                  <Clock className="h-4 w-4" />
                  <span>Depuis {format(dutyStartTime, "HH:mm", { locale: fr })}</span>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              {isOnDuty ? (
                <Button onClick={endDuty} variant="destructive" disabled={loading} className="min-w-[200px]">
                  {loading ? "Traitement..." : "🔴 Fin de service"}
                </Button>
              ) : (
                <Button onClick={startDuty} variant="default" disabled={loading} className="min-w-[200px]">
                  {loading ? "Traitement..." : "🟢 Prendre mon service"}
                </Button>
              )}
            </div>

            {isOnDuty && (
              <Badge variant="success" className="text-sm px-4 py-1.5">
                Vous apparaîtrez dans la liste des agents disponibles
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Historique des services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">L'historique des services sera affiché ici une fois la base de données connectée.</p>
        </CardContent>
      </Card>
    </div>
  );
}