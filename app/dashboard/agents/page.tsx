"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Shield, Clock, FileText, Car, Search } from "lucide-react";

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const agents = [
    { id: 1, firstName: "Jean", lastName: "Dupont", email: "jean.dupont@cleargroup.com", status: "ON_DUTY", totalDutyTime: 1250, patrolCount: 45, reportCount: 32 },
    { id: 2, firstName: "Marie", lastName: "Martin", email: "marie.martin@cleargroup.com", status: "ON_DUTY", totalDutyTime: 980, patrolCount: 38, reportCount: 28 },
    { id: 3, firstName: "Pierre", lastName: "Bernard", email: "pierre.bernard@cleargroup.com", status: "OFF_DUTY", totalDutyTime: 850, patrolCount: 30, reportCount: 25 },
    { id: 4, firstName: "Sophie", lastName: "Durand", email: "sophie.durand@cleargroup.com", status: "ON_DUTY", totalDutyTime: 1100, patrolCount: 42, reportCount: 35 },
    { id: 5, firstName: "Luc", lastName: "Petit", email: "luc.petit@cleargroup.com", status: "OFF_DUTY", totalDutyTime: 720, patrolCount: 25, reportCount: 20 },
  ];

  const filteredAgents = agents.filter(agent =>
    agent.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ON_DUTY": return "success";
      case "OFF_DUTY": return "secondary";
      default: return "secondary";
    }
  };

  const formatDutyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Agents</h1>
        <p className="text-sm text-muted-foreground mt-1">Liste des agents et leurs statistiques</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Rechercher un agent..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{agents.length}</p>
                <p className="text-xs text-muted-foreground">Total agents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Shield className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{agents.filter(a => a.status === "ON_DUTY").length}</p>
                <p className="text-xs text-muted-foreground">En service</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Car className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{agents.reduce((sum, a) => sum + a.patrolCount, 0)}</p>
                <p className="text-xs text-muted-foreground">Total patrouilles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <FileText className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{agents.reduce((sum, a) => sum + a.reportCount, 0)}</p>
                <p className="text-xs text-muted-foreground">Total rapports</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Liste des agents</h2>
        {filteredAgents.map((agent) => (
          <Card key={agent.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-bold text-primary">{agent.firstName[0]}{agent.lastName[0]}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{agent.firstName} {agent.lastName}</h3>
                      <p className="text-sm text-muted-foreground">{agent.email}</p>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(agent.status) as any}>{agent.status}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-xs">Temps</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{formatDutyTime(agent.totalDutyTime)}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Car className="h-3.5 w-3.5" />
                      <span className="text-xs">Patrouilles</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{agent.patrolCount}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" />
                      <span className="text-xs">Rapports</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{agent.reportCount}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}