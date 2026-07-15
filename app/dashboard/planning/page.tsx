"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function PlanningPage() {
  const { data: session } = useSession();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "", date: new Date().toISOString().split('T')[0], startTime: "", endTime: "", location: "", assignedUnit: "", description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const response = await fetch("/api/planning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId: session.user.id, date: new Date(formData.date) }),
      });
      if (response.ok) {
        setShowCreateForm(false);
        setFormData({ title: "", date: new Date().toISOString().split('T')[0], startTime: "", endTime: "", location: "", assignedUnit: "", description: "" });
      }
    } catch (error) {
      console.error("Error creating planning event:", error);
    } finally {
      setLoading(false);
    }
  };

  const planningEvents = [
    { id: 1, title: "Formation Secourisme", date: new Date(Date.now() + 86400000), startTime: "09:00", endTime: "17:00", location: "Centre de Formation", assignedUnit: "Tous", description: "Formation obligatoire pour tous les agents", createdBy: "Jean Dupont" },
    { id: 2, title: "Réunion Mensuelle", date: new Date(Date.now() + 172800000), startTime: "14:00", endTime: "16:00", location: "Salle de Conférence", assignedUnit: "Unité Alpha", description: "Point sur les opérations du mois", createdBy: "Marie Martin" },
    { id: 3, title: "Escorte VIP", date: new Date(Date.now() + 259200000), startTime: "10:00", endTime: "14:00", location: "Hôtel de Ville", assignedUnit: "Unité Bravo", description: "Escorte de personnalité politique", createdBy: "Pierre Bernard" },
  ];

  const sortedEvents = [...planningEvents].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Planning</h1>
          <p className="text-sm text-muted-foreground mt-1">Gérez le calendrier des opérations et événements</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel événement
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader><CardTitle>Créer un nouvel événement</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Titre</label>
                  <Input placeholder="Ex: Formation Secourisme" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Date</label>
                  <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Heure de début</label>
                  <Input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Heure de fin</label>
                  <Input type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Lieu</label>
                  <Input placeholder="Ex: Centre de Formation" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Unité assignée</label>
                  <Input placeholder="Ex: Tous, Unité Alpha" value={formData.assignedUnit} onChange={(e) => setFormData({ ...formData, assignedUnit: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea placeholder="Description de l'événement..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} required />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>{loading ? "Création..." : "Créer l'événement"}</Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>Annuler</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Événements à venir</h2>
        {sortedEvents.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">Créé par {event.createdBy}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground">{event.description}</p>
                  <Badge variant="outline">{event.assignedUnit}</Badge>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{format(event.date, "dd MMMM yyyy", { locale: fr })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Modifier</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Événements passés</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">L'historique des événements passés sera affiché ici une fois la base de données connectée.</p>
        </CardContent>
      </Card>
    </div>
  );
}