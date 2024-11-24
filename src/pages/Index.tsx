import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { differenceInDays } from "date-fns";
import NavBar from "@/components/NavBar";
import { ItemStatus } from "@/types/item";

const Index = () => {
  const navigate = useNavigate();
  const { items, fetchItems, reserveItem } = useStore();
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [reservationData, setReservationData] = useState({ name: "", email: "" });
  const [statusFilter, setStatusFilter] = useState<"all" | ItemStatus>("all");

  useEffect(() => {
    fetchItems().catch(console.error);
  }, [fetchItems]);

  const fuse = new Fuse(items, {
    keys: ["description"],
    threshold: 0.3,
  });

  const filteredItems = search
    ? fuse.search(search).map((result) => result.item)
    : items;

  const displayedItems = filteredItems.filter(item => {
    if (item.status === "Récupéré") return false;
    if (statusFilter === "all") return true;
    return item.status === statusFilter;
  });

  const handleReserve = async (id: string) => {
    try {
      await reserveItem(id, reservationData.name, reservationData.email);
      setSelectedItem(null);
      setReservationData({ name: "", email: "" });
      toast.success("Objet réservé avec succès ! Vous avez 7 jours pour le récupérer avant qu'il ne soit donné à une association.");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la réservation");
    }
  };

  const handleAdminAccess = () => {
    const password = prompt("Veuillez entrer le mot de passe administrateur:");
    if (password === "510Team") {
      navigate("/admin");
    } else {
      toast.error("Mot de passe invalide");
    }
  };

  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Objets trouvés</h1>
          <Button onClick={handleAdminAccess} variant="outline">
            Admin
          </Button>
        </div>

        <div className="space-y-4 mb-8">
          <Input
            type="search"
            placeholder="Rechercher des objets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
          
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
            >
              Tous
            </Button>
            <Button
              variant={statusFilter === "À récupérer" ? "default" : "outline"}
              onClick={() => setStatusFilter("À récupérer")}
            >
              À récupérer
            </Button>
            <Button
              variant={statusFilter === "Réservé" ? "default" : "outline"}
              onClick={() => setStatusFilter("Réservé")}
            >
              Réservé
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((item) => {
            const daysLeft = 30 - differenceInDays(new Date(), new Date(item.created_at));
            const statusColors = {
              "À récupérer": "bg-green-500",
              "Réservé": "bg-yellow-500",
              "Récupéré": "bg-blue-500",
            };

            return (
              <div
                key={item.id}
                className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={item.image_url}
                  alt={item.description}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`${
                        statusColors[item.status]
                      } text-white px-2 py-1 rounded-full text-sm`}
                    >
                      {item.status}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {daysLeft > 0
                        ? `${daysLeft} jours restants`
                        : "Expiré"}
                    </span>
                  </div>
                  <p className="text-lg mb-4">{item.description}</p>
                  {item.status === "À récupérer" && daysLeft > 0 && (
                    <Button
                      onClick={() => setSelectedItem(item.id)}
                      className="w-full"
                    >
                      C'est à moi
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Réserver l'objet</DialogTitle>
              <DialogDescription>
                Veuillez fournir vos coordonnées pour réserver cet objet. Vous aurez ensuite 7 jours pour le récupérer à l'accueil.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={reservationData.name}
                  onChange={(e) =>
                    setReservationData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={reservationData.email}
                  onChange={(e) =>
                    setReservationData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => selectedItem && handleReserve(selectedItem)}
                disabled={!reservationData.name || !reservationData.email}
              >
                Confirmer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
