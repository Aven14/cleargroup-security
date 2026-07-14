"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Car, Plus, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function PatrolsPage() {
  const { data: session } = useSession();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    sector: "",
    vehicle: "",
    partnerId: "",
    type: "MOBILE",
    observations: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const response = await fetch("/api/patrols", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId: session.user.id,
        }),
      });

      if (response.ok) {
        setShowCreateForm(false);
        setFormData({
          sector: "",
          vehicle: "",
          partnerId: "",
          type: "MOBILE",
          observations: "",
        });
        // Refresh patrols list
      }
    } catch (error) {
      console.error("Error creating patrol:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data - will be replaced with real data from database
  const activePatrols = [
    {
      id: 1,
      agent: "Jean Dupont",
      sector: "Zone Centre",
      type: "PATROUILLE MOBILE",
      vehicle: "V-001",
      startTime: new Date(Date.now() - 3600000),
      observations: "RAS",
    },
    {
      id: 2,
      agent: "Marie Martin",
      sector: "Zone Nord",
      type: "INTERVENTION",
      vehicle: "V-002",
      startTime: new Date(Date.now() - 7200000),
      observations: "En cours d'intervention",
    },
  ];

  const patrolTypes = [
    { value: "MOBILE", label: "Patrouille mobile" },
    { value: "INTERVENTION", label: "Intervention" },
    { value: "ESCORTE", label: "Escorte" },
    { value: "EVENT", label: "Événement" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-primary-700 to-accent-500">
            Patrouilles
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les patrouilles en cours
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle patrouille
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Créer une nouvelle patrouille</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Secteur</label>
                  <Input
                    placeholder="Ex: Zone Centre"
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Véhicule</label>
                  <Input
                    placeholder="Ex: V-001"
                    value={formData.vehicle}
                    onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    {patrolTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Coéquipier (optionnel)</label>
                  <Input
                    placeholder="ID du coéquipier"
                    value={formData.partnerId}
                    onChange={(e) => setFormData({ ...formData, partnerId: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Observations</label>
                <Textarea
                  placeholder="Notes sur la patrouille..."
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Création..." : "Créer la patrouille"}
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

      {/* Active Patrols */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Patrouilles en cours</h2>
        {activePatrols.map((patrol) => (
          <Card key={patrol.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-[5px]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-accent/10">
                      <Car className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{patrol.agent}</h3>
                      <p className="text-sm text-gray-600">{patrol.sector}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{patrol.type}</Badge>
                    <Badge variant="secondary">{patrol.vehicle}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        Depuis {format(patrol.startTime, "HH:mm", { locale: fr })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{patrol.observations}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Terminer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Past Patrols */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des patrouilles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            L'historique des patrouilles sera affiché ici une fois la base de données connectée.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
