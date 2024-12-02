import { Button } from "../../ui/button";
import { Trash2 } from "lucide-react";

interface ItemActionsProps {
  status: string;
  isArchived: boolean;
  onMarkAsRetrieved: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

const ItemActions = ({
  status,
  isArchived,
  onMarkAsRetrieved,
  onArchive,
  onDelete,
}: ItemActionsProps) => {
  return (
    <div className="space-x-2">
      {status !== "Récupéré" && status !== "Expiré" && (
        <Button
          variant="outline"
          onClick={onMarkAsRetrieved}
        >
          Marquer comme récupéré
        </Button>
      )}
      {(status === "Récupéré" || status === "Expiré") && !isArchived && (
        <Button
          variant="outline"
          onClick={onArchive}
          className="text-yellow-600 hover:text-yellow-700"
        >
          Archiver
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ItemActions;