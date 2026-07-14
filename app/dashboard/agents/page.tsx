"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Shield, Clock, FileText, Car, Search } from "lucide-react";

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - will be replaced with real data from database
  const agents = [
    {
      id: 1,
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@cleargroup.com",
      status: "ON_DUTY",
      totalDutyTime: 1250,
      patrolCount: 45,
      reportCount: 32,
    },
    {
      id: 2,
      firstName: "Marie",
      lastName: "Martin",
      email: "marie.martin@cleargroup.com",
      status: "ON_DUTY",
      totalDutyTime: 980,
      patrolCount: 38,
      reportCount: 28,
    },
    {
      id: 3,
      firstName: "Pierre",
      lastName: "Bernard",
      email: "pierre.bernard@cleargroup.com",
      status: "OFF_DUTY",
      totalDutyTime: 850,
      patrolCount: 30,
      reportCount: 25,
    },
    {
      id: 4,
      firstName: "Sophie",
      lastName: "Durand",
      email: "sophie.durand@cleargroup.com",
      status: "ON_DUTY",
      totalDutyTime: 1100,
      patrolCount: 42,
      reportCount: 35,
    },
    {
      id: 5,
      firstName: "Luc",
      lastName: "Petit",
      email: "luc.petit@cleargroup.com",
      status: "OFF_DUTY",
      totalDutyTime: 720,
      patrolCount: 25,
      reportCount: 20,
    },
  ];

  const filteredAgents = agents.filter(agent =>
    agent.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ON_DUTY":
        return "success";
      case "OFF_DUTY":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const formatDutyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-primary-700 to-accent-500">
          Agents
        </h1>
        <p className="text-gray-600 mt-2">
          Liste des agents et leurs statistiques
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Rechercher un agent..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12"
        />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{agents.length}</p>
                <p className="text-sm text-gray-600">Total agents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-success/10">
                <Shield className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{agents.filter(a => a.status === "ON_DUTY").length}</p>
                <p className="text-sm text-gray-600">En service</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent/10">
                <Car className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{agents.reduce((sum, a) => sum + a.patrolCount, 0)}</p>
                <p className="text-sm text-gray-600">Total patrouilles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-warning/10">
                <FileText className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{agents.reduce((sum, a) => sum + a.reportCount, 0)}</p>
                <p className="text-sm text-gray-600">Total rapports</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agents List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Liste des agents</h2>
        {filteredAgents.map((agent) => (
          <Card key={agent.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-[5px]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-lg font-bold text-primary">
                        {agent.firstName[0]}{agent.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {agent.firstName} {agent.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{agent.email}</p>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(agent.status) as any}>{agent.status}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-8 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs">Temps de service</span>
                    </div>
                    <p className="font-semibold">{formatDutyTime(agent.totalDutyTime)}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 text-gray-600">
                      <Car className="h-4 w-4" />
                      <span className="text-xs">Patrouilles</span>
                    </div>
                    <p className="font-semibold">{agent.patrolCount}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 text-gray-600">
                      <FileText className="h-4 w-4" />
                      <span className="text-xs">Rapports</span>
                    </div>
                    <p className="font-semibold">{agent.reportCount}</p>
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
