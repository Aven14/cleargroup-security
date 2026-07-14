"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Calendar, MapPin, User, Search } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function DebriefingsPage() {
  const { data: session } = useSession();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split('T')[0],
    location: "",
    agentsPresent: "",
    interventionType: "",
    summary: "",
    progression: "",
    result: "",
    observations: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const response = await fetch("/api/debriefings", {
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
          location: "",
          agentsPresent: "",
          interventionType: "",
          summary: "",
          progression: "",
          result: "",
          observations: "",
        });
        // Refresh debriefings list
      }
    } catch (error) {
      console.error("Error creating debriefing:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data - will be replaced with real data from database
  const debriefings = [
    {
      id: 1,
      title: "Intervention Centre-Ville",
      author: "Jean Dupont",
      date: new Date(Date.now() - 7200000),
      location: "Place de l'Église",
      interventionType: "INTERVENTION",
      summary: "Intervention pour trouble à l'ordre public",
      result: "Résolu",
    },
    {
      id: 2,
      title: "Patrouille Zone Nord",
      author: "Marie Martin",
      date: new Date(Date.now() - 86400000),
      location: "Zone Commerciale",
      interventionType: "PATROUILLE",
      summary: "Patrouille de routine",
      result: "RAS",
    },
    {
      id: 3,
      title: "Escorte VIP",
      author: "Pierre Bernard",
      date: new Date(Date.now() - 172800000),
      location: "Hôtel de Ville",
      interventionType: "ESCORTE",
      summary: "Escorte de personnalité",
      result: "Réussi",
    },
  ];

  const filteredDebriefings = debriefings.filter(debriefing =>
    debriefing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    debriefing.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    debriefing.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-primary-700 to-accent-500">
            Débriefings
          </h1>
          <p className="text-muted-foreground mt-2">
            Rédigez et consultez les rapports d'intervention
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Nouveau rapport
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Rechercher un débriefing..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12"
        />
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Rédiger un nouveau rapport</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Titre</label>
                  <Input
                    placeholder="Ex: Intervention Centre-Ville"
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
                  <label className="text-sm font-medium">Lieu</label>
                  <Input
                    placeholder="Ex: Place de l'Église"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Agents présents</label>
                  <Input
                    placeholder="Ex: Jean Dupont, Marie Martin"
                    value={formData.agentsPresent}
                    onChange={(e) => setFormData({ ...formData, agentsPresent: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type d'intervention</label>
                  <Input
                    placeholder="Ex: Intervention, Patrouille, Escorte"
                    value={formData.interventionType}
                    onChange={(e) => setFormData({ ...formData, interventionType: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Résumé</label>
                <Textarea
                  placeholder="Résumé de l'intervention..."
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={2}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Déroulement</label>
                <Textarea
                  placeholder="Description détaillée du déroulement..."
                  value={formData.progression}
                  onChange={(e) => setFormData({ ...formData, progression: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Résultat</label>
                <Textarea
                  placeholder="Résultat de l'intervention..."
                  value={formData.result}
                  onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                  rows={2}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Observations</label>
                <Textarea
                  placeholder="Observations supplémentaires..."
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Création..." : "Créer le rapport"}
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

      {/* Debriefings List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Rapports récents</h2>
        {filteredDebriefings.map((debriefing) => (
          <Card key={debriefing.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{debriefing.title}</h3>
                      <p className="text-sm text-muted-foreground">Par {debriefing.author}</p>
                    </div>
                  </div>
                  <p className="text-sm">{debriefing.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{debriefing.interventionType}</Badge>
                    <Badge variant="secondary">{debriefing.result}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(debriefing.date, "dd MMMM yyyy", { locale: fr })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{debriefing.location}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Voir détails
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
