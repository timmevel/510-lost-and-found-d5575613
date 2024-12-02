import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import NavBar from "@/components/NavBar";
import ItemCard from "@/components/ItemCard";
import SearchBar from "@/components/admin/SearchBar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const { items, fetchItems, reserveItem } = useStore();
  const [isReserving, setIsReserving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "reserved">("all");

  useEffect(() => {
    fetchItems().catch(console.error);
  }, [fetchItems]);

  const handleReserveClick = async (id: string) => {
    if (isReserving) return;

    setIsReserving(true);
    try {
      await reserveItem(id);
      toast.success("Objet réservé avec succès");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la réservation de l'objet");
    } finally {
      setIsReserving(false);
    }
  };

  const filteredItems = items
    .filter((item) => !item.is_archived && item.status !== "Expiré")
    .filter((item) =>
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((item) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "available") return item.status === "À récupérer";
      if (statusFilter === "reserved") return item.status === "Réservé";
      return true;
    });

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
              >
                Tous
              </Button>
              <Button
                variant={statusFilter === "available" ? "default" : "outline"}
                onClick={() => setStatusFilter("available")}
              >
                À récupérer
              </Button>
              <Button
                variant={statusFilter === "reserved" ? "default" : "outline"}
                onClick={() => setStatusFilter("reserved")}
              >
                Réservé
              </Button>
            </div>
          </div>
          <Link to="/admin">
            <Button variant="outline">Admin</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onReserveClick={handleReserveClick}
            />
          ))}
        </div>
      </div>
      <footer className="py-4 text-center text-sm text-gray-600">
        Made with ❤️ by{" "}
        <a
          href="https://510.training"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          510 Training
        </a>
        .
      </footer>
    </div>
  );
};

export default Index;