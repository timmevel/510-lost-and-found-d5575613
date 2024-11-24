import { useState } from "react";
import { Item, ItemStatus } from "@/types/item";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import ImageModal from "../ImageModal";
import ItemCountdown from "../ItemCountdown";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface ItemsTableProps {
  items: Item[];
  onStatusChange: (id: string, status: ItemStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const ItemsTable = ({ items, onStatusChange, onDelete }: ItemsTableProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (itemToDelete) {
      await onDelete(itemToDelete);
      setItemToDelete(null);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Délai</TableHead>
              <TableHead>Réservé par</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow 
                key={item.id}
                className={item.status === "Expiré" ? "bg-red-50" : undefined}
              >
                <TableCell>
                  <img
                    src={item.image_url}
                    alt={item.description}
                    className="w-16 h-16 object-cover rounded cursor-pointer"
                    onClick={() => setSelectedImage(item.image_url)}
                  />
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <Select
                    value={item.status}
                    onValueChange={(value: ItemStatus) =>
                      onStatusChange(item.id, value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Changer le statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="À récupérer">À récupérer</SelectItem>
                      <SelectItem value="Réservé">Réservé</SelectItem>
                      <SelectItem value="Récupéré">Récupéré</SelectItem>
                      <SelectItem value="Expiré">Expiré</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <ItemCountdown createdAt={item.created_at} variant="admin" />
                </TableCell>
                <TableCell>
                  {item.reserved_by_name ? (
                    <div>
                      <div>{item.reserved_by_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.reserved_by_email}
                      </div>
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-x-2">
                    {item.status !== "Récupéré" && item.status !== "Expiré" && (
                      <Button
                        variant="outline"
                        onClick={() => onStatusChange(item.id, "Récupéré")}
                      >
                        Marquer comme récupéré
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setItemToDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage || ""}
      />

      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'objet sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ItemsTable;