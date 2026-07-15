import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Car, AlertTriangle, Lock, FileText, Users, Clock } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Agents en service",
      value: "8",
      icon: Shield,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Patrouilles en cours",
      value: "3",
      icon: Car,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Alertes actives",
      value: "2",
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Personnes détenues",
      value: "5",
      icon: Lock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  const recentDebriefings = [
    {
      id: 1,
      title: "Intervention Centre-Ville",
      author: "Jean Dupont",
      date: "Il y a 2 heures",
      type: "INTERVENTION",
    },
    {
      id: 2,
      title: "Patrouille Zone Nord",
      author: "Marie Martin",
      date: "Il y a 4 heures",
      type: "PATROUILLE",
    },
    {
      id: 3,
      title: "Escorte VIP",
      author: "Pierre Bernard",
      date: "Il y a 6 heures",
      type: "ESCORTE",
    },
  ];

  const activeAlerts = [
    {
      id: 1,
      type: "INTERVENTION URGENTE",
      location: "Place de l'Église",
      time: "Il y a 15 min",
      status: "ACTIVE",
    },
    {
      id: 2,
      type: "MANQUE D'EFFECTIF",
      location: "Zone Commerciale",
      time: "Il y a 30 min",
      status: "ACTIVE",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Vue d'ensemble des opérations de sécurité
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Débriefings récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-[5px]">
              {recentDebriefings.map((debriefing) => (
                <div
                  key={debriefing.id}
                  className="flex items-start justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{debriefing.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Par {debriefing.author}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline" className="text-xs">{debriefing.type}</Badge>
                    <p className="text-xs text-muted-foreground">{debriefing.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Alertes actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-[5px]">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start justify-between p-3 rounded-lg bg-destructive/5 hover:bg-destructive/10 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-destructive">{alert.type}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{alert.location}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="destructive" className="text-xs">{alert.status}</Badge>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Activité récente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-[5px]">
            {[
              { action: "Jean Dupont a commencé son service", time: "Il y a 5 min" },
              { action: "Marie Martin a créé une patrouille", time: "Il y a 15 min" },
              { action: "Pierre Bernard a rédigé un débriefing", time: "Il y a 2 heures" },
              { action: "Sophie Durand a placé une personne en cellule", time: "Il y a 3 heures" },
              { action: "Luc Petit a terminé son service", time: "Il y a 4 heures" },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <p className="text-sm text-foreground">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}