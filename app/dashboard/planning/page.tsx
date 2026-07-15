"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Clock, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function PlanningPage() {
  const { data: session } = useSession();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split('T')[0],
    startTime: "",
    endTime: "",
    location: "",
    assignedUnit: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const response = await fetch("/api/planning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId: session.user.id,
          date: new Date(formData.date),
        }),
      });

      if (response.ok) {
        setShowCreateForm(false);
        setFormData({
          title: "",
          date: new Date().toISOString().split('T')[0],
          startTime: "",
          endTime: "",
          location: "",
          assignedUnit: "",
          description: "",
        });
        // Refresh planning list
      }
    } catch (error) {
      console.error("Error creating planning event:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data - will be replaced with real data from database
  const planningEvents = [
    {
      id: 1,
      title: "Formation Secourisme",
      date: new Date(Date.now() + 86400000),
      startTime: "09:00",
      endTime: "17:00",
      location: "Centre de Formation",
      assignedUnit: "Tous",
      description: "Formation obligatoire pour tous les agents",
      createdBy: "Jean Dupont",
    },
    {
      id: 2,
      title: "Réunion Mensuelle",
      date: new Date(Date.now() + 172800000),
      startTime: "14:00",
      endTime: "16:00",
      location: "Salle de Conférence",
      assignedUnit: "Unité Alpha",
      description: "Point sur les opérations du mois",
      createdBy: "Marie Martin",
    },
    {
      id: 3,
      title: "Escorte VIP",
      date: new Date(Date.now() + 259200000),
      startTime: "10:00",
      endTime: "14:00",
      location: "Hôtel de Ville",
      assignedUnit: "Unité Bravo",
      description: "Escorte de personnalité politique",
      createdBy: "Pierre Bernard",
    },
  ];

  const sortedEvents = [...planningEvents].sort((a, b) => 
    a.date.getTime() - b.date.getTime()
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-primary-700 to-accent-500">
            Planning
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez le calendrier des opérations et événements
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Nouvel événement
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Créer un nouvel événement</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Titre</label>
                  <Input
                    placeholder="Ex: Formation Secourisme"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Heure de début</label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Heure de fin</label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lieu</label>
                  <Input
                    placeholder="Ex: Centre de Formation"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Unité assignée</label>
                  <Input
                    placeholder="Ex: Tous, Unité Alpha"
                    value={formData.assignedUnit}
                    onChange={(e) => setFormData({ ...formData, assignedUnit: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Description de l'événement..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Création..." : "Créer l'événement"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Planning Events */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Événements à venir</h2>
        {sortedEvents.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-[5px]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-600">Créé par {event.createdBy}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{event.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{event.assignedUnit}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(event.date, "dd MMMM yyyy", { locale: fr })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Modifier
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Past Events */}
      <Card>
        <CardHeader>
          <CardTitle>Événements passés</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            L'historique des événements passés sera affiché ici une fois la base de données connectée.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
