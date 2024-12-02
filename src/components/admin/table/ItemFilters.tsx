import { Button } from "@/components/ui/button";
import { ItemStatus } from "@/types/item";

interface ItemFiltersProps {
  currentFilter: ItemStatus | "all";
  onFilterChange: (filter: ItemStatus | "all") => void;
}

const ItemFilters = ({ currentFilter, onFilterChange }: ItemFiltersProps) => {
  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant={currentFilter === "all" ? "default" : "outline"}
        onClick={() => onFilterChange("all")}
      >
        Tous
      </Button>
      <Button
        variant={currentFilter === "Réservé" ? "default" : "outline"}
        onClick={() => onFilterChange("Réservé")}
      >
        Réservés
      </Button>
    </div>
  );
};

export default ItemFilters;