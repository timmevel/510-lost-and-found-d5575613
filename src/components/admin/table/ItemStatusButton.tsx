import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import type { ItemStatus } from "@/types/item";

interface ItemStatusButtonProps {
  status: ItemStatus;
  onStatusChange: (status: ItemStatus) => void;
}

const ItemStatusButton = ({ status, onStatusChange }: ItemStatusButtonProps) => {
  return (
    <Select
      value={status}
      onValueChange={(value: ItemStatus) => onStatusChange(value)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={status} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="À récupérer">À récupérer</SelectItem>
        <SelectItem value="Réservé">Réservé</SelectItem>
        <SelectItem value="Récupéré">Récupéré</SelectItem>
        <SelectItem value="Expiré">Expiré</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ItemStatusButton;