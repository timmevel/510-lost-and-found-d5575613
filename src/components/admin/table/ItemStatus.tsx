import { Button } from "../../ui/button";
import { ItemStatus } from "@/types/item";

interface ItemStatusProps {
  status: ItemStatus;
  onStatusChange: () => void;
}

const ItemStatus = ({ status, onStatusChange }: ItemStatusProps) => {
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

export default ItemStatus;