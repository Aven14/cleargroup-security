"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Plus, MapPin, Clock, Check } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function AlertsPage() {
  const { data: session } = useSession();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({ type: "URGENT_INTERVENTION", description: "", location: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId: session.user.id }),
      });
      if (response.ok) {
        setShowCreateForm(false);
        setFormData({ type: "URGENT_INTERVENTION", description: "", location: "" });
      }
    } catch (error) {
      console.error("Error creating alert:", error);
    } finally {
      setLoading(false);
    }
  };

  const respondToAlert = async (alertId: string) => {
    if (!session?.user?.id) return;
    try {
      const response = await fetch(`/api/alerts/${alertId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      });
      if (response.ok) { /* refresh */ }
    } catch (error) {
      console.error("Error responding to alert:", error);
    }
  };

  const activeAlerts = [
    { id: 1, agent: "Jean Dupont", type: "INTERVENTION URGENTE", description: "Bagarre en cours devant le bar", location: "Place de l'Église", status: "ACTIVE", createdAt: new Date(Date.now() - 900000) },
    { id: 2, agent: "Marie Martin", type: "MANQUE D'EFFECTIF", description: "Besoin de renfort pour contrôle d'identité", location: "Zone Commerciale", status: "IN_PROGRESS", createdAt: new Date(Date.now() - 1800000) },
  ];

  const alertTypes = [
    { value: "URGENT_INTERVENTION", label: "Intervention urgente" },
    { value: "ESCORTE", label: "Escorte" },
    { value: "EVENT", label: "Événement" },
    { value: "SHORT_STAFFED", label: "Manque d'effectif" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "destructive";
      case "IN_PROGRESS": return "warning";
      case "RESOLVED": return "success";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alertes</h1>
          <p className="text-sm text-muted-foreground mt-1">Demandez de l'aide ou répondez aux alertes en cours</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)} variant="destructive">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle alerte
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader><CardTitle>Créer une nouvelle alerte</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Type d'alerte</label>
                  <Select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                    {alertTypes.map((type) => (<option key={type.value} value={type.value}>{type.label}</option>))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Lieu</label>
                  <Input placeholder="Ex: Place de l'Église" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea placeholder="Décrivez la situation..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} required />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="destructive" disabled={loading}>{loading ? "Création..." : "Créer l'alerte"}</Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>Annuler</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Alertes actives</h2>
        {activeAlerts.map((alert) => (
          <Card key={alert.id} className="border-destructive/30">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-destructive/10">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{alert.type}</h3>
                      <p className="text-sm text-muted-foreground">Par {alert.agent}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground">{alert.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{alert.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Il y a {format(alert.createdAt, "mm", { locale: fr })} min</span>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(alert.status) as any}>{alert.status}</Badge>
                </div>
                {alert.status === "ACTIVE" && (
                  <Button onClick={() => respondToAlert(alert.id.toString())}>
                    <Check className="h-4 w-4 mr-2" />
                    Je prends l'intervention
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Alertes résolues</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">L'historique des alertes résolues sera affiché ici une fois la base de données connectée.</p>
        </CardContent>
      </Card>
    </div>
  );
}