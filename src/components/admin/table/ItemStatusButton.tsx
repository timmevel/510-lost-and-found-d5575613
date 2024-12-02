import { Button } from "../../ui/button";
import type { ItemStatus } from "@/types/item";

interface ItemStatusButtonProps {
  status: ItemStatus;
  onStatusChange: () => void;
}

const ItemStatusButton = ({ status, onStatusChange }: ItemStatusButtonProps) => {
  const getStatusColor = (status: ItemStatus) => {
    switch (status) {
      case "À récupérer":
        return "bg-amber-400 hover:bg-amber-500";
      case "Réservé":
        return "bg-emerald-500 hover:bg-emerald-600";
      default:
        return "";
    }
  };

  return (
    <Button
      variant="outline"
      onClick={onStatusChange}
      className={`w-full text-white ${getStatusColor(status)}`}
    >
      {status}
    </Button>
  );
};

export default ItemStatusButton;