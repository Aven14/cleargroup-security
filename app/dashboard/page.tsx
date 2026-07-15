import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Car, AlertTriangle, Lock, FileText, Users, Clock } from "lucide-react";

export default function DashboardPage() {
  // Mock data - will be replaced with real data from database
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
    <div className="space-y-[5px]">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-primary-700 to-accent-500">
          Tableau de bord
        </h1>
        <p className="text-gray-600 mt-2">
          Vue d'ensemble des opérations de sécurité
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[5px]">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[5px]">
        {/* Recent Debriefings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-[5px]">
              <FileText className="h-5 w-5" />
              Débriefings récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-[5px]">
              {recentDebriefings.map((debriefing) => (
                <div
                  key={debriefing.id}
                  className="flex items-start justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-[5px]">
                    <p className="font-medium">{debriefing.title}</p>
                    <p className="text-sm text-gray-600">
                      Par {debriefing.author}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-[5px]">
                    <Badge variant="outline">{debriefing.type}</Badge>
                    <p className="text-xs text-gray-500">{debriefing.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-[5px]">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Alertes actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-[5px]">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start justify-between p-4 rounded-xl bg-destructive/10 hover:bg-destructive/20 transition-colors"
                >
                  <div className="space-y-[5px]">
                    <p className="font-medium text-destructive">{alert.type}</p>
                    <p className="text-sm text-gray-600">{alert.location}</p>
                  </div>
                  <div className="flex flex-col items-end gap-[5px]">
                    <Badge variant="destructive">{alert.status}</Badge>
                    <p className="text-xs text-gray-500 flex items-center gap-[5px]">
                      <Clock className="h-3 w-3" />
                      {alert.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-[5px]">
            <Users className="h-5 w-5" />
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
                className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <p className="text-sm">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
