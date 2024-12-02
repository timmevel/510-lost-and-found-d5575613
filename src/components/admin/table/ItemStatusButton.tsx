import { Button } from "../../ui/button";
import type { ItemStatus } from "@/types/item";

interface ItemStatusButtonProps {
  status: ItemStatus;
  onStatusChange: () => void;
}

const ItemStatusButton = ({ status, onStatusChange }: ItemStatusButtonProps) => {
  return (
    <Button
      variant="outline"
      onClick={onStatusChange}
      className="w-full"
    >
      {status}
    </Button>
  );
};

export default ItemStatusButton;