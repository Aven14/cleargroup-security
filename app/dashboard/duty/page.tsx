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
    // Check if user is currently on duty
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-primary-700 to-accent-500">
          Prise de service
        </h1>
        <p className="text-gray-600 mt-2">
          Gérez vos horaires de service
        </p>
      </div>

      {/* Agent Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations agent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Nom</p>
              <p className="font-semibold">
                {session?.user?.lastName} {session?.user?.firstName}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold">{session?.user?.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-semibold">
                {format(new Date(), "dd MMMM yyyy", { locale: fr })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Duty Status Card */}
      <Card className="min-h-[300px] flex flex-col justify-center items-center">
        <CardContent className="w-full text-center space-y-8">
          <div className="flex justify-center">
            <div className={`p-8 rounded-full ${isOnDuty ? "bg-success/20" : "bg-muted/20"}`}>
              <Shield className={`h-24 w-24 ${isOnDuty ? "text-success" : "text-muted-foreground"}`} />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold">
              {isOnDuty ? "EN SERVICE" : "HORS SERVICE"}
            </h2>
            {isOnDuty && dutyStartTime && (
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>
                  Depuis {format(dutyStartTime, "HH:mm", { locale: fr })}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            {isOnDuty ? (
              <Button
                onClick={endDuty}
                variant="destructive"
                size="xl"
                disabled={loading}
                className="min-w-[250px]"
              >
                {loading ? "Traitement..." : "🔴 Fin de service"}
              </Button>
            ) : (
              <Button
                onClick={startDuty}
                variant="success"
                size="xl"
                disabled={loading}
                className="min-w-[250px]"
              >
                {loading ? "Traitement..." : "🟢 Prendre mon service"}
              </Button>
            )}
          </div>

          {isOnDuty && (
            <div className="mt-4">
              <Badge variant="success" className="text-base px-4 py-2">
                Vous apparaîtrez dans la liste des agents disponibles
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Historique des services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            L'historique des services sera affiché ici une fois la base de données connectée.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
