"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Lock, Plus, Clock, User, MapPin, Search } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function DetainedPage() {
  const { data: session } = useSession();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    reason: "",
    location: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const response = await fetch("/api/detained", {
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
          firstName: "",
          lastName: "",
          reason: "",
          location: "",
          notes: "",
        });
        // Refresh detained persons list
      }
    } catch (error) {
      console.error("Error creating detained person:", error);
    } finally {
      setLoading(false);
    }
  };

  const releasePerson = async (id: string) => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(`/api/detained/${id}/release`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      });

      if (response.ok) {
        // Refresh detained persons list
      }
    } catch (error) {
      console.error("Error releasing person:", error);
    }
  };

  // Mock data - will be replaced with real data from database
  const detainedPersons = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      reason: "Trouble à l'ordre public",
      location: "Place de l'Église",
      status: "IN_CUSTODY",
      detainedAt: new Date(Date.now() - 3600000),
      detainedBy: "Jean Dupont",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      reason: "Agression verbale",
      location: "Zone Commerciale",
      status: "IN_CUSTODY",
      detainedAt: new Date(Date.now() - 7200000),
      detainedBy: "Marie Martin",
    },
  ];

  const filteredPersons = detainedPersons.filter(person =>
    person.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateDetentionTime = (detainedAt: Date) => {
    const now = new Date();
    const diff = now.getTime() - detainedAt.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}min`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN_CUSTODY":
        return "destructive";
      case "RELEASED":
        return "success";
      case "TRANSFERRED":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-primary-700 to-accent-500">
            Personnes détenues
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les personnes en garde à vue
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)} size="lg" variant="destructive">
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle détention
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Rechercher une personne..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12"
        />
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Enregistrer une nouvelle détention</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prénom</label>
                  <Input
                    placeholder="Ex: John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom</label>
                  <Input
                    placeholder="Ex: Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Motif</label>
                  <Input
                    placeholder="Ex: Trouble à l'ordre public"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lieu</label>
                  <Input
                    placeholder="Ex: Place de l'Église"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  placeholder="Notes supplémentaires..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex gap-4">
                <Button type="submit" variant="destructive" disabled={loading}>
                  {loading ? "Enregistrement..." : "Enregistrer la détention"}
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

      {/* Detained Persons List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Personnes en garde à vue</h2>
        {filteredPersons.map((person) => (
          <Card key={person.id} className="border-destructive/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-[5px]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-destructive/10">
                      <Lock className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {person.firstName} {person.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Détenu par {person.detainedBy}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{person.reason}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{person.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Depuis {calculateDetentionTime(person.detainedAt)}</span>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(person.status) as any}>{person.status}</Badge>
                </div>
                {person.status === "IN_CUSTODY" && (
                  <Button onClick={() => releasePerson(person.id.toString())} variant="outline">
                    Libérer
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Released Persons */}
      <Card>
        <CardHeader>
          <CardTitle>Personnes libérées</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            L'historique des personnes libérées sera affiché ici une fois la base de données connectée.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
